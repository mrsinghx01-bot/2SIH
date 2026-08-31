import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Search, Plus, ExternalLink, Filter, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchProjects, createProject, fetchPublicStatesMaster, fetchPublicDistrictsByState } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressRing } from '../../components/ProgressRing';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { useAuth } from '../../store/AuthContext';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    projectCode: '',
    projectType: 'HIGHWAY',
    implementingAgency: 'NHAI',
    ministry: 'Ministry of Road Transport & Highways',
    description: '',
    totalLandRequired: 250,
    estimatedCost: 1200,
    stateId: '',
    districtId: ''
  });

  const [statesList, setStatesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);

  const loadProjects = () => {
    setLoading(true);
    fetchProjects()
      .then(res => {
        if (res.success) setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
    fetchPublicStatesMaster()
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setStatesList(res.data);
          setFormData(prev => ({ ...prev, stateId: res.data[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      fetchPublicDistrictsByState(formData.stateId)
        .then(res => {
          if (res.success && res.data) {
            setDistrictsList(res.data);
            if (res.data.length > 0) {
              setFormData(prev => ({ ...prev, districtId: res.data[0].id }));
            } else {
              setFormData(prev => ({ ...prev, districtId: '' }));
            }
          }
        })
        .catch(() => {});
    }
  }, [formData.stateId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.projectCode.trim() || !formData.implementingAgency.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Project Code, Agency).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createProject({
        ...formData,
        totalLandRequired: Number(formData.totalLandRequired) || 0,
        estimatedCost: Number(formData.estimatedCost) || 0
      });

      if (res.success) {
        setSuccessMessage('Project successfully registered in Master Registry.');
        setFormData({
          name: '',
          projectCode: `PRJ-${Date.now().toString().slice(-4)}`,
          projectType: 'HIGHWAY',
          implementingAgency: 'NHAI',
          ministry: 'Ministry of Road Transport & Highways',
          description: '',
          totalLandRequired: 250,
          estimatedCost: 1200,
          stateId: statesList[0]?.id || '',
          districtId: districtsList[0]?.id || ''
        });
        loadProjects();
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMessage('');
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Failed to create project.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.implementingAgency.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === 'ALL' || p.projectType === sector;
    return matchesSearch && matchesSector;
  });

  const canRegisterProject = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'PROJECT_AGENCY' || user.role === 'STATE_ADMIN';

  return (
    <div>
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>National Infrastructure Projects</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Master Registry of Capital Projects & Land Requirements</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ width: '260px' }}>
            <Search className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-box"
            />
          </div>

          {canRegisterProject && (
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  projectCode: `PRJ-${prev.implementingAgency}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
                }));
                setIsModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
              }}
            >
              <Plus size={16} /> Register New Project
            </button>
          )}
        </div>
      </div>

      {/* Sector filter tags */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'HIGHWAY', 'RAILWAY', 'IRRIGATION', 'INDUSTRIAL_CORRIDOR', 'AIRPORT', 'RENEWABLE_ENERGY', 'PORT', 'DEFENCE'].map((sec) => (
          <button
            key={sec}
            onClick={() => setSector(sec)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: sector === sec ? '#2563EB' : '#FFFFFF',
              color: sector === sec ? '#FFFFFF' : '#475569',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {sec.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            {
              header: 'Project Code',
              accessor: 'projectCode',
              render: (r: any) => (
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                  {r.projectCode}
                </span>
              )
            },
            {
              header: 'Project Name & Agency',
              render: (r: any) => (
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{r.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{r.implementingAgency} • {r.ministry}</div>
                </div>
              )
            },
            { header: 'Sector', accessor: 'projectType' },
            {
              header: 'Land (Req / Acq)',
              render: (r: any) => (
                <div>
                  <strong>{r.totalLandAcquired?.toLocaleString('en-IN')}</strong> / {r.totalLandRequired?.toLocaleString('en-IN')} Ha
                </div>
              )
            },
            {
              header: 'Progress',
              render: (r: any) => <ProgressRing percentage={r.progressPercentage || 0} size={34} />
            },
            {
              header: 'Status',
              render: (r: any) => <StatusBadge status={r.status} />
            },
            {
              header: 'Action',
              render: (r: any) => (
                <button
                  onClick={() => navigate(`/projects/${r.id}`)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Manage <ExternalLink size={12} />
                </button>
              )
            }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}

      {/* Register Project Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #E2E8F0',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Register New Infrastructure Project</h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>Statutory entry into Central Land Requisition Registry</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            {successMessage && (
              <div style={{ padding: '10px 14px', background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {successMessage}
              </div>
            )}

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Project Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectCode}
                    onChange={e => setFormData({ ...formData, projectCode: e.target.value })}
                    placeholder="e.g. PRJ-NHAI-2026-009"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Project Sector / Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', background: '#FFF' }}
                  >
                    <option value="HIGHWAY">Highway / Expressway</option>
                    <option value="RAILWAY">High-Speed Railway</option>
                    <option value="AIRPORT">Greenfield Airport</option>
                    <option value="IRRIGATION">Irrigation & River Interlinking</option>
                    <option value="INDUSTRIAL_CORRIDOR">Industrial Corridor / DFC</option>
                    <option value="RENEWABLE_ENERGY">Renewable Energy Park</option>
                    <option value="PORT">Major Port / Maritime</option>
                    <option value="DEFENCE">Strategic Defence</option>
                    <option value="URBAN_DEVELOPMENT">Urban Transit / Metro</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Western Dedicated Freight Corridor - Phase 3"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Implementing Agency *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.implementingAgency}
                    onChange={e => setFormData({ ...formData, implementingAgency: e.target.value })}
                    placeholder="e.g. NHAI / DFCCIL / MoRTH"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Nodal Ministry
                  </label>
                  <input
                    type="text"
                    value={formData.ministry}
                    onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                    placeholder="e.g. Ministry of Road Transport & Highways"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Primary State
                  </label>
                  <select
                    value={formData.stateId}
                    onChange={e => setFormData({ ...formData, stateId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', background: '#FFF' }}
                  >
                    {statesList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type === 'UNION_TERRITORY' ? 'UT' : 'State'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Primary District
                  </label>
                  <select
                    value={formData.districtId}
                    onChange={e => setFormData({ ...formData, districtId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', background: '#FFF' }}
                  >
                    {districtsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Land Requisition (Hectares)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalLandRequired}
                    onChange={e => setFormData({ ...formData, totalLandRequired: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Estimated Project Cost (₹ Crore)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimatedCost}
                    onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Project Description & Alignment Scope
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail alignment corridors, villages covered, and strategic socio-economic objectives..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Registering...' : 'Register Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
