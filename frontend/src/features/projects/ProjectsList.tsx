import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Search, Plus, ExternalLink, Filter } from 'lucide-react';
import { fetchProjects } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressRing } from '../../components/ProgressRing';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(res => {
        if (res.success) setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.implementingAgency.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === 'ALL' || p.projectType === sector;
    return matchesSearch && matchesSector;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>National Infrastructure Projects</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Master Registry of Capital Projects & Land Requirements</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
    </div>
  );
};
