import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, CheckCircle2, Maximize2, Eye } from 'lucide-react';

export interface MapParcel {
  id: string;
  parcelNumber: string;
  khasraNumber: string;
  village: string;
  areaHectares: number;
  landUse: string;
  acquisitionStatus: string;
  center?: [number, number];
  polygon?: [number, number][];
  ownerName?: string;
  valuationCr?: string;
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
  height = '480px',
  onParcelSelect,
  onDistrictSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'street' | 'satellite'>('street');
  const [selectedParcel, setSelectedParcel] = useState<MapParcel | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'POSSESSION':
        return '#10B981'; // Green
      case 'COMPENSATION':
      case 'AWARD':
        return '#F59E0B'; // Amber
      case 'VALUATION':
        return '#8B5CF6'; // Purple
      case 'NOTIFICATION':
      case 'SURVEY':
      case 'INITIATED':
        return '#3B82F6'; // Blue
      default:
        return '#0284C7';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map Instance
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      // Standard OpenStreetMap Tile Layer
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
      // Glow/Buffer underlay
      L.polyline(alignmentPolyline, {
        color: '#3B82F6',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(map);

      // Core Alignment Line
      const mainLine = L.polyline(alignmentPolyline, {
        color: '#1D4ED8',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.95
      }).addTo(map);

      mainLine.bindTooltip('<strong>Project Alignment Corridor</strong><br/>Statutory Right of Way (RoW)', { sticky: true });
    }

    // 2. Draw Cadastral Land Parcels (Khasra Polygons)
    parcels.forEach((p) => {
      const color = getStatusColor(p.acquisitionStatus);

      if (p.polygon && p.polygon.length > 0) {
        const poly = L.polygon(p.polygon, {
          color: '#FFFFFF',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.65
        }).addTo(map);

        poly.bindTooltip(
          `<strong>Khasra: ${p.khasraNumber}</strong><br/>Village: ${p.village}<br/>Area: ${p.areaHectares} Ha<br/>Status: <span style="color:${color};font-weight:bold">${p.acquisitionStatus}</span>`,
          { sticky: true }
        );

        poly.on('click', () => {
          setSelectedParcel(p);
          if (onParcelSelect) onParcelSelect(p);
        });
      } else if (p.center) {
        const marker = L.circleMarker(p.center, {
          radius: 8,
          fillColor: color,
          color: '#FFFFFF',
          weight: 2,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindTooltip(`Khasra ${p.khasraNumber} (${p.village})`);
        marker.on('click', () => {
          setSelectedParcel(p);
          if (onParcelSelect) onParcelSelect(p);
        });
      }
    });

    // 3. Draw District Markers & Bubbles (if on state view)
    districts.forEach((d) => {
      if (d.latitude && d.longitude) {
        const distMarker = L.circleMarker([d.latitude, d.longitude], {
          radius: 10,
          fillColor: d.acquisitionPercentage >= 75 ? '#10B981' : '#2563EB',
          color: '#FFFFFF',
          weight: 2.5,
          fillOpacity: 0.85
        }).addTo(map);

        distMarker.bindTooltip(
          `<strong>${d.name} District</strong><br/>LGD: ${d.lgdCode}<br/>Required: ${d.landProposed} Ha<br/>Acquired: ${d.landAcquired} Ha (${d.acquisitionPercentage}%)`,
          { sticky: true }
        );

        distMarker.on('click', () => {
          if (onDistrictSelect) onDistrictSelect(d);
        });
      }
    });

  }, [center, zoom, alignmentPolyline, parcels, districts]);

  // Switch Base Layer
  const toggleLayer = (layer: 'street' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    setActiveLayer(layer);
    const map = mapInstanceRef.current;

    // Remove existing tile layer
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

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', boxShadow: 'var(--shadow-card)' }}>
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Floating Layer Controls */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 500, display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(6px)', padding: '4px', borderRadius: '8px', border: '1px solid #CBD5E1', boxShadow: 'var(--shadow-sm)' }}>
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

      {/* Floating Map Legend */}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 500, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}>
        <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={13} color="#2563EB" /> GIS Cadastral Layers
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '2px', display: 'inline-block' }} />
            <span>Possession / Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#F59E0B', borderRadius: '2px', display: 'inline-block' }} />
            <span>Compensation / Award</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#8B5CF6', borderRadius: '2px', display: 'inline-block' }} />
            <span>Valuation Matrix (Sec 3G)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#3B82F6', borderRadius: '2px', display: 'inline-block' }} />
            <span>Survey / Gazette 3A</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ width: '14px', height: '3px', background: '#1D4ED8', display: 'inline-block' }} />
            <span>Alignment RoW Corridor</span>
          </div>
        </div>
      </div>

      {/* Selected Parcel Inspector Drawer */}
      {selectedParcel && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 500, width: '280px', background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 6px', borderRadius: '4px' }}>
                Khasra: {selectedParcel.khasraNumber}
              </span>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{selectedParcel.village}</h4>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#94A3B8' }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Area: <strong>{selectedParcel.areaHectares} Ha</strong></div>
            <div>Land Use: <strong>{selectedParcel.landUse}</strong></div>
            <div>Status: <strong style={{ color: getStatusColor(selectedParcel.acquisitionStatus) }}>{selectedParcel.acquisitionStatus}</strong></div>
            <div>Owner / Beneficiary: <strong>{selectedParcel.ownerName || 'Verified Titleholder'}</strong></div>
            <div>Solatium Valuation: <strong>₹ {selectedParcel.valuationCr || '4.5'} Cr</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};
