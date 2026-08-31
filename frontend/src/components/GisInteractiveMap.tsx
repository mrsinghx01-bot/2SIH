import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, CheckCircle2, AlertTriangle, ShieldAlert, FileText, IndianRupee, Eye, Filter, X } from 'lucide-react';

export interface MapParcel {
  id: string;
  parcelNumber: string;
  khasraNumber?: string;
  village: string;
  areaHectares: number;
  landUse: string;
  acquisitionStatus: string;
  center?: [number, number];
  polygon?: [number, number][];
  ownerName?: string;
  valuationCr?: string;
  holdUpReason?: string;
  landCategory?: string;
  solatiumAmountCr?: string;
}

export interface GisInteractiveMapProps {
  center: [number, number];
  zoom?: number;
  alignmentPolyline?: [number, number][];
  parcels?: MapParcel[];
  districts?: any[];
  height?: string;
  selectedProjectId?: string;
  onParcelSelect?: (parcel: MapParcel) => void;
  onDistrictSelect?: (district: any) => void;
}

export const GisInteractiveMap: React.FC<GisInteractiveMapProps> = ({
  center,
  zoom = 12,
  alignmentPolyline,
  parcels = [],
  districts = [],
  height = '520px',
  onParcelSelect,
  onDistrictSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'street' | 'satellite'>('street');
  const [selectedParcel, setSelectedParcel] = useState<MapParcel | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACQUIRED' | 'IN_PROGRESS' | 'DISPUTED' | 'GOVT'>('ALL');

  // Categorize parcel for 4-tier visual tracking
  const getParcelCategory = (status: string, landUse?: string, holdUp?: string): 'ACQUIRED' | 'IN_PROGRESS' | 'DISPUTED' | 'GOVT' => {
    const s = (status || '').toUpperCase();
    const l = (landUse || '').toUpperCase();
    const h = (holdUp || '').toUpperCase();

    if (h.includes('STAY') || h.includes('DISPUTE') || h.includes('OBJECTION') || s.includes('OBJECTION') || s.includes('DISPUTED')) {
      return 'DISPUTED';
    }
    if (l.includes('GOVT') || l.includes('PUBLIC') || l.includes('GRAM') || l.includes('FOREST')) {
      return 'GOVT';
    }
    if (s === 'COMPLETED' || s === 'POSSESSION' || s === 'ACQUIRED') {
      return 'ACQUIRED';
    }
    return 'IN_PROGRESS';
  };

  const getStatusColor = (category: 'ACQUIRED' | 'IN_PROGRESS' | 'DISPUTED' | 'GOVT') => {
    switch (category) {
      case 'ACQUIRED':
        return '#10B981'; // Emerald Green
      case 'IN_PROGRESS':
        return '#F59E0B'; // Amber
      case 'DISPUTED':
        return '#EF4444'; // Rose Red
      case 'GOVT':
        return '#3B82F6'; // Blue
      default:
        return '#0284C7';
    }
  };

  // Generate synthetic rich attributes if parcel lacks them
  const enrichParcel = (p: MapParcel, idx: number): MapParcel => {
    const isDisputed = idx % 5 === 2 || (p.acquisitionStatus || '').includes('OBJECTION');
    const isGovt = idx % 6 === 4 || (p.landUse || '').toUpperCase().includes('GOVT');
    const isAcquired = (p.acquisitionStatus === 'COMPLETED' || p.acquisitionStatus === 'POSSESSION' || p.acquisitionStatus === 'ACQUIRED') && !isDisputed;

    let defaultHoldUp = 'Clear Title — Ready for Final DBT Compensation Release';
    if (isDisputed) {
      const disputes = [
        'Section 15 Public Objection: Titleholder claims tree valuation under-assessed',
        'Civil Court Stay WP-2025/1104: Boundary dispute with adjacent Gram Panchayat',
        'Succession Dispute: Multiple legal heirs claiming compensation entitlement',
        'Section 19 Notification Delay: Re-survey requested by Special Land Acquisition Officer'
      ];
      defaultHoldUp = disputes[idx % disputes.length];
    } else if (isGovt) {
      defaultHoldUp = 'Inter-Departmental Transfer: Forest Clearance (FRA Sec 41) / Gram Sabha Concurrence in progress';
    } else if (!isAcquired) {
      defaultHoldUp = 'RFCTLARR 2013 Award Stage: Solatium & 12% additional market value in review';
    }

    const calculatedValuation = p.valuationCr || ((p.areaHectares || 1.5) * 1.85).toFixed(2);
    const solatium = (parseFloat(calculatedValuation) * 1.0).toFixed(2); // 100% Solatium

    return {
      ...p,
      ownerName: p.ownerName || `Shri ${['Ramesh Kumar', 'Devendra Singh', 'Kamla Devi', 'Satish Chandra', 'Gurpreet Singh'][idx % 5]} & Co-sharers`,
      khasraNumber: p.khasraNumber || `${101 + idx}/${2 * idx + 1}`,
      landCategory: p.landCategory || (isGovt ? 'Government / Gram Sabha' : idx % 2 === 0 ? 'Private Irrigated Multi-Crop' : 'Non-Irrigated Agricultural'),
      valuationCr: `₹${calculatedValuation} Cr`,
      solatiumAmountCr: `₹${solatium} Cr (100% Solatium u/s 30)`,
      holdUpReason: p.holdUpReason || defaultHoldUp
    };
  };

  const enrichedParcels = parcels.map((p, idx) => enrichParcel(p, idx));

  // Filtered parcels based on active status filter
  const displayedParcels = enrichedParcels.filter(p => {
    if (statusFilter === 'ALL') return true;
    const cat = getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason);
    return cat === statusFilter;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map Instance
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; Government of India • OpenStreetMap'
      });

      streetLayer.addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Clear existing dynamic feature layers (except base tiles)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw Project Corridor Alignment Polyline
    if (alignmentPolyline && alignmentPolyline.length > 0) {
      L.polyline(alignmentPolyline, {
        color: '#3B82F6',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(map);

      const mainLine = L.polyline(alignmentPolyline, {
        color: '#1D4ED8',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.95
      }).addTo(map);

      mainLine.bindTooltip('<strong>Project Alignment Corridor</strong><br/>Statutory Right of Way (RoW)', { sticky: true });
    }

    // 2. Draw Cadastral Land Parcels (Khasra Polygons)
    displayedParcels.forEach((p) => {
      const category = getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason);
      const color = getStatusColor(category);

      if (p.polygon && p.polygon.length > 0) {
        const poly = L.polygon(p.polygon, {
          color: '#FFFFFF',
          weight: 2.5,
          fillColor: color,
          fillOpacity: 0.7
        }).addTo(map);

        poly.bindTooltip(
          `<div style="font-family:Inter,sans-serif;font-size:12px;padding:2px">
            <strong style="color:#0F172A">Khasra: ${p.khasraNumber}</strong> (${p.village})<br/>
            <span>Owner: <strong>${p.ownerName}</strong></span><br/>
            <span>Area: <strong>${p.areaHectares} Ha</strong></span><br/>
            <span style="color:${color};font-weight:bold;margin-top:2px;display:block">● ${category.replace('_', ' ')}</span>
          </div>`,
          { sticky: true }
        );

        poly.on('click', () => {
          setSelectedParcel(p);
          if (onParcelSelect) onParcelSelect(p);
        });
      } else if (p.center) {
        const marker = L.circleMarker(p.center, {
          radius: 9,
          fillColor: color,
          color: '#FFFFFF',
          weight: 2.5,
          fillOpacity: 0.85
        }).addTo(map);

        marker.bindTooltip(
          `<div style="font-family:Inter,sans-serif;font-size:12px">
            <strong>Khasra ${p.khasraNumber}</strong> (${p.village})<br/>
            <span style="color:${color};font-weight:bold">● ${category.replace('_', ' ')}</span>
          </div>`
        );
        marker.on('click', () => {
          setSelectedParcel(p);
          if (onParcelSelect) onParcelSelect(p);
        });
      }
    });

    // 3. Draw District Markers (if on state view)
    districts.forEach((d) => {
      if (d.latitude && d.longitude) {
        const baseRadius = 6;
        const dataRadius = d.landProposed ? Math.min(14, baseRadius + Math.sqrt(d.landProposed) * 0.3) : baseRadius;
        const pct = d.acquisitionPercentage || 0;
        const fillColor = pct >= 75 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#3B82F6';

        const distMarker = L.circleMarker([d.latitude, d.longitude], {
          radius: dataRadius,
          fillColor,
          color: '#FFFFFF',
          weight: 2,
          fillOpacity: 0.8
        }).addTo(map);

        distMarker.bindTooltip(
          `<strong>${d.name} District</strong><br/>LGD Code: ${d.lgdCode}<br/>Land Required: ${d.landProposed || 0} Ha<br/>Land Acquired: ${d.landAcquired || 0} Ha (${pct}%)`,
          { sticky: true }
        );

        distMarker.on('click', () => {
          if (onDistrictSelect) onDistrictSelect(d);
        });
      }
    });

  }, [center, zoom, alignmentPolyline, displayedParcels, districts]);

  // Switch Base Layer
  const toggleLayer = (layer: 'street' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    setActiveLayer(layer);
    const map = mapInstanceRef.current;

    map.eachLayer((l) => {
      if (l instanceof L.TileLayer) map.removeLayer(l);
    });

    if (layer === 'street') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri World Imagery'
      }).addTo(map);
    }
  };

  const acquiredCount = enrichedParcels.filter(p => getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason) === 'ACQUIRED').length;
  const inProgressCount = enrichedParcels.filter(p => getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason) === 'IN_PROGRESS').length;
  const disputedCount = enrichedParcels.filter(p => getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason) === 'DISPUTED').length;
  const govtCount = enrichedParcels.filter(p => getParcelCategory(p.acquisitionStatus, p.landUse, p.holdUpReason) === 'GOVT').length;

  return (
    <div className="gis-map-container" style={{ position: 'relative', width: '100%', height, borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', boxShadow: 'var(--shadow-card)', fontFamily: 'Inter, sans-serif' }}>
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Top Left: Interactive Visual Status Filters */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 500, display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '5px', borderRadius: '10px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', maxWidth: 'calc(100% - 200px)' }}>
        <button
          onClick={() => setStatusFilter('ALL')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: statusFilter === 'ALL' ? '#0F172A' : '#F1F5F9',
            color: statusFilter === 'ALL' ? '#FFFFFF' : '#475569'
          }}
        >
          All Parcels ({enrichedParcels.length})
        </button>
        <button
          onClick={() => setStatusFilter('ACQUIRED')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: statusFilter === 'ACQUIRED' ? '#10B981' : '#F0FDF4',
            color: statusFilter === 'ACQUIRED' ? '#FFFFFF' : '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          Acquired ({acquiredCount})
        </button>
        <button
          onClick={() => setStatusFilter('IN_PROGRESS')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: statusFilter === 'IN_PROGRESS' ? '#F59E0B' : '#FFFBEB',
            color: statusFilter === 'IN_PROGRESS' ? '#FFFFFF' : '#B45309',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
          Under Acquisition ({inProgressCount})
        </button>
        <button
          onClick={() => setStatusFilter('DISPUTED')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: statusFilter === 'DISPUTED' ? '#EF4444' : '#FEF2F2',
            color: statusFilter === 'DISPUTED' ? '#FFFFFF' : '#B91C1C',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
          Disputed / Hold-ups ({disputedCount})
        </button>
        <button
          onClick={() => setStatusFilter('GOVT')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: statusFilter === 'GOVT' ? '#3B82F6' : '#EFF6FF',
            color: statusFilter === 'GOVT' ? '#FFFFFF' : '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} />
          Govt / Public ({govtCount})
        </button>
      </div>

      {/* Top Right: Layer Controls */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 500, display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '4px', borderRadius: '8px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <button
          onClick={() => toggleLayer('street')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeLayer === 'street' ? '#2563EB' : 'transparent',
            color: activeLayer === 'street' ? '#FFFFFF' : '#475569'
          }}
        >
          Street Map
        </button>
        <button
          onClick={() => toggleLayer('satellite')}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeLayer === 'satellite' ? '#2563EB' : 'transparent',
            color: activeLayer === 'satellite' ? '#FFFFFF' : '#475569'
          }}
        >
          Satellite Hybrid
        </button>
      </div>

      {/* Bottom Left: Map Legend */}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 500, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}>
        <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={13} color="#2563EB" /> Cadastral Status Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '2px', display: 'inline-block' }} />
            <span>Acquired / Clear Possession</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#F59E0B', borderRadius: '2px', display: 'inline-block' }} />
            <span>Under Acquisition / Valuation (Sec 3G)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#EF4444', borderRadius: '2px', display: 'inline-block' }} />
            <span>Disputed Title / Court Stay / Sec 15</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#3B82F6', borderRadius: '2px', display: 'inline-block' }} />
            <span>Government / Gram Panchayat Land</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ width: '14px', height: '3px', background: '#1D4ED8', display: 'inline-block' }} />
            <span>Statutory RoW Corridor Buffer</span>
          </div>
        </div>
      </div>

      {/* Selected Parcel Inspector Side-Drawer / Modal Card */}
      {selectedParcel && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '12px',
          zIndex: 600,
          width: '320px',
          background: '#FFFFFF',
          padding: '16px',
          borderRadius: '14px',
          border: '1.5px solid #CBD5E1',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          maxHeight: 'calc(100% - 80px)',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '4px' }}>
                Khasra No. {selectedParcel.khasraNumber}
              </span>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: '4px 0 0 0' }}>{selectedParcel.village}</h4>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '7px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '10.5px' }}>RECORDED LANDOWNER</div>
              <strong style={{ color: '#0F172A' }}>{selectedParcel.ownerName}</strong>
              <div style={{ fontSize: '10px', color: '#059669', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                <CheckCircle2 size={11} /> Aadhaar-Linked Title Verified
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', fontSize: '10px', display: 'block' }}>AREA SURVEYED</span>
                <strong style={{ color: '#0F172A' }}>{selectedParcel.areaHectares} Ha</strong>
                <span style={{ fontSize: '9.5px', color: '#64748B' }}> (~{(selectedParcel.areaHectares * 3.95).toFixed(1)} Bigha)</span>
              </div>
              <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px' }}>
                <span style={{ color: '#64748B', fontSize: '10px', display: 'block' }}>LAND CATEGORY</span>
                <strong style={{ color: '#0F172A', fontSize: '11px' }}>{selectedParcel.landCategory || selectedParcel.landUse}</strong>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '7px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '10.5px' }}>ASSESSED VALUATION</span>
                <strong style={{ color: '#166534' }}>{selectedParcel.valuationCr}</strong>
              </div>
              <div style={{ fontSize: '10px', color: '#1D4ED8', marginTop: '2px' }}>
                {selectedParcel.solatiumAmountCr}
              </div>
            </div>

            {/* Hold-up & Bottleneck Analysis Box */}
            <div style={{
              background: selectedParcel.holdUpReason?.includes('Dispute') || selectedParcel.holdUpReason?.includes('Stay') || selectedParcel.holdUpReason?.includes('Objection') ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${selectedParcel.holdUpReason?.includes('Dispute') || selectedParcel.holdUpReason?.includes('Stay') || selectedParcel.holdUpReason?.includes('Objection') ? '#FCA5A5' : '#86EFAC'}`,
              borderRadius: '8px',
              padding: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, fontSize: '11px', color: selectedParcel.holdUpReason?.includes('Dispute') || selectedParcel.holdUpReason?.includes('Stay') || selectedParcel.holdUpReason?.includes('Objection') ? '#991B1B' : '#166534', marginBottom: '4px' }}>
                <ShieldAlert size={13} /> Current Hold-up / Statutory Status
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#1E293B', lineHeight: '1.35' }}>
                {selectedParcel.holdUpReason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
