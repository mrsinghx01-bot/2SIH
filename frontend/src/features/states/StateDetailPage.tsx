import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FolderKanban,
  MapPin,
  Search,
  ExternalLink,
  Layers,
  Map as MapIcon,
  CheckCircle,
  Building,
  TrendingUp,
  Globe
} from 'lucide-react';
import { fetchStateById } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressRing } from '../../components/ProgressRing';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { getStateAsset } from '../../utils/stateAssets';
import { GisInteractiveMap } from '../../components/GisInteractiveMap';

export const StateDetailPage: React.FC = () => {
  const { stateId } = useParams<{ stateId: string }>();
  const navigate = useNavigate();
  const [stateData, setStateData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'districts' | 'projects'>('map');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [selectedMapProject, setSelectedMapProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stateId) {
      setLoading(true);
      setError(null);
      fetchStateById(stateId)
        .then((res) => {
          if (res?.success) {
            setStateData(res.data);
            if (res.data.projects && res.data.projects.length > 0) {
              setSelectedMapProject(res.data.projects[0]);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [stateId]);

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !stateData) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', marginTop: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Globe size={30} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Geographic Access Restricted
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '520px', margin: '0 auto 20px' }}>
          Your active security role does not have authorization to access data outside your assigned State jurisdiction. Under Government of India data governance standards, State Administration accounts are strictly isolated.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Return to Authorized Dashboard
        </button>
      </div>
    );
  }

  const asset = getStateAsset(stateData.shortName || stateData.name);
  const districts = stateData.districts || [];
  const projects = stateData.projects || [];

  // Filter districts
  const filteredDistricts = districts.filter((d: any) =>
    d.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    String(d.lgdCode).includes(searchDistrict) ||
    (d.localName && d.localName.toLowerCase().includes(searchDistrict.toLowerCase()))
  );

  // Filter projects
  const filteredProjects = projects.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchProject.toLowerCase()) ||
      p.implementingAgency.toLowerCase().includes(searchProject.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || p.projectType === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const stateCenter: [number, number] = stateData.coordinates ?
    [stateData.coordinates.lat, stateData.coordinates.lng] :
    [26.8467, 80.9462];

  return (
    <div>
      {/* Back to National Dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <ArrowLeft size={14} /> Back to National Dashboard
      </button>

      {/* State Detail Top Banner */}
      <div className="detail-banner-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Landmark Photo with Geographic State Map Outline */}
          <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-card)' }}>
            <img
              src={asset.imageUrl}
              alt={asset.landmarkTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Real Geographic State Map Outline */}
            <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
              <svg viewBox="0 0 100 100" style={{ width: '34px', height: '34px' }}>
                <path
                  d={asset.mapOutlineSvg}
                  fill={asset.mapFillColor}
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
                />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>{stateData.name}</h1>
              <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px' }}>
                {stateData.shortName}
              </span>
              <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', color: '#64748B' }}>
                LGD Code: {stateData.lgdCode}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              Capital: <strong>{stateData.capital || 'State Headquarters'}</strong> • Total LGD Districts: <strong>{districts.length}</strong> • State Land Acquisition Authority
            </p>
          </div>
        </div>

        {/* State Acquisition Progress Ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F8FAFC', padding: '12px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <ProgressRing
            percentage={stateData.kpis?.acquisitionPercentage || 0}
            size={56}
            strokeWidth={5}
            color="#10B981"
          />
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Land Acquisition Rate</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              {Number(stateData.kpis?.landAcquired).toLocaleString('en-IN')} / {Number(stateData.kpis?.landProposed).toLocaleString('en-IN')} Ha
            </div>
          </div>
        </div>
      </div>

      {/* State KPI Counters Grid */}
      <div className="responsive-grid grid-4" style={{ gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px 18px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>Active Projects</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E3A8A', marginTop: '2px' }}>{projects.length || stateData.kpis?.projectsCount}</div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', padding: '14px 18px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Total LGD Districts</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#064E3B', marginTop: '2px' }}>{districts.length}</div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '14px 18px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>Acquisition Cases</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#78350F', marginTop: '2px' }}>{stateData.kpis?.casesCount || 0}</div>
        </div>
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '14px 18px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6D28D9', fontWeight: 600 }}>Compensation Paid</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#4C1D95', marginTop: '2px' }}>₹ {stateData.kpis?.compensationPaidCr || '0'} Cr</div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="tab-navigation-bar">
        <button
          className={`tab-nav-button ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapIcon size={15} /> Interactive GIS State Map & Affected Areas
        </button>
        <button
          className={`tab-nav-button ${activeTab === 'districts' ? 'active' : ''}`}
          onClick={() => setActiveTab('districts')}
        >
          <MapPin size={15} /> District Administration Information ({districts.length})
        </button>
        <button
          className={`tab-nav-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderKanban size={15} /> Capital Infrastructure Projects ({projects.length})
        </button>
      </div>

      {/* TAB 1: INTERACTIVE GIS MAP & PROJECT CORRIDORS */}
      {activeTab === 'map' && (
        <div className="responsive-split-map" style={{ gap: '20px', marginBottom: '24px' }}>
          {/* Interactive GIS Map */}
          <div>
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                {selectedMapProject ? `Project Corridor: ${selectedMapProject.name}` : `State Map: ${stateData.name}`}
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Showing district nodes, survey boundaries & alignment Right of Way (RoW)
              </span>
            </div>
            <GisInteractiveMap
              center={
                selectedMapProject && selectedMapProject.centerCoord
                  ? [selectedMapProject.centerCoord[1], selectedMapProject.centerCoord[0]]
                  : stateCenter
              }
              zoom={selectedMapProject ? (selectedMapProject.gisMap?.zoom || 8) : (stateData.coordinates?.zoom || 7)}
              alignmentPolyline={selectedMapProject?.gisMap?.alignmentPolyline || selectedMapProject?.alignmentCoordinates}
              districts={districts}
              height="540px"
              onDistrictSelect={(d) => navigate(`/districts/${d.id}`)}
            />
          </div>

          {/* Project Selector & Details Sidebar */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Select Project to Inspect</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {projects.map((p: any) => {
                const isSelected = selectedMapProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedMapProject(p)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                      background: isSelected ? '#EFF6FF' : '#F8FAFC',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#64748B' }}>{p.projectCode}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      {p.totalLandAcquired?.toLocaleString('en-IN')} / {p.totalLandRequired?.toLocaleString('en-IN')} Ha
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedMapProject && (
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Selected Project Info</h4>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Agency: <strong>{selectedMapProject.implementingAgency}</strong></div>
                  <div>Ministry: <strong>{selectedMapProject.ministry}</strong></div>
                  <div>Estimated Cost: <strong>₹ {selectedMapProject.estimatedCost?.toLocaleString('en-IN')} Cr</strong></div>
                  <div>Affected Villages: <strong>{selectedMapProject.affectedVillagesCount || '—'}</strong></div>
                  <div>Progress: <strong>{selectedMapProject.progressPercentage || 0}%</strong></div>
                </div>

                <button
                  onClick={() => navigate(`/projects/${selectedMapProject.id}`)}
                  style={{
                    marginTop: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  View Full Project Details <ExternalLink size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISTRICT ADMINISTRATION BREAKDOWN */}
      {activeTab === 'districts' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                LGD Districts of {stateData.name} ({districts.length})
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748B' }}>
                Official Local Government Directory master districts with land acquisition progress and collectorate scoping
              </p>
            </div>

            <div className="search-input-wrapper" style={{ width: '280px' }}>
              <Search className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search district name or LGD code..."
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="search-input-box"
              />
            </div>
          </div>

          {/* District Cards Grid */}
          <div className="responsive-grid grid-3" style={{ gap: '14px' }}>
            {filteredDistricts.map((d: any) => (
              <div
                key={d.id}
                onClick={() => navigate(`/districts/${d.id}`)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{d.name}</h4>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>LGD Code: {d.lgdCode}</span>
                  </div>
                  <ProgressRing
                    percentage={d.acquisitionPercentage || 0}
                    size={38}
                    strokeWidth={4}
                    color="#10B981"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
                  <div>Land: <strong>{d.landAcquired} / {d.landProposed} Ha</strong></div>
                  <div>Cases: <strong>{d.casesCount}</strong></div>
                  <div>Projects: <strong>{d.projectsCount}</strong></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: d.geometryMatchStatus === 'REVIEW_REQUIRED' ? '#FEF3C7' : '#DCFCE7', color: d.geometryMatchStatus === 'REVIEW_REQUIRED' ? '#B45309' : '#15803D' }}>
                    {d.geometryMatchStatus === 'REVIEW_REQUIRED' ? 'Boundary Review' : 'Auto Matched'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Open Collectorate →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAPITAL PROJECTS CATALOG */}
      {activeTab === 'projects' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {['ALL', 'HIGHWAY', 'RAILWAY', 'IRRIGATION', 'INDUSTRIAL_CORRIDOR', 'AIRPORT', 'RENEWABLE_ENERGY'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: sectorFilter === sec ? '#2563EB' : '#F1F5F9',
                    color: sectorFilter === sec ? '#FFFFFF' : '#475569'
                  }}
                >
                  {sec.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="search-input-wrapper" style={{ width: '260px' }}>
              <Search className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchProject}
                onChange={(e) => setSearchProject(e.target.value)}
                className="search-input-box"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredProjects.map((p: any) => (
              <div
                key={p.id}
                className="responsive-flex-row-to-col"
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.projectCode}
                    </span>
                    <StatusBadge status={p.status} />
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{p.projectType}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                    {p.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Agency: <strong>{p.implementingAgency}</strong> • Ministry: <strong>{p.ministry}</strong> • Involving: <strong>{p.districts?.join(', ')}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Land Required / Acquired</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                      {p.totalLandAcquired?.toLocaleString('en-IN')} / {p.totalLandRequired?.toLocaleString('en-IN')} Ha
                    </div>
                  </div>
                  <ProgressRing
                    percentage={p.progressPercentage || 0}
                    size={46}
                    color="#2563EB"
                  />

                  {/* View Project Info & Map Inspection Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Project Info <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMapProject(p);
                        setActiveTab('map');
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MapIcon size={11} /> Show on GIS Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
