import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Search, Filter } from 'lucide-react';
import { fetchAcquisitionCases, updateCaseStage } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AcquisitionCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadCases = () => {
    setLoading(true);
    fetchAcquisitionCases()
      .then(res => {
        if (res.success) setCases(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCases();
  }, []);

  const filtered = cases.filter(c => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      (c.projectName && c.projectName.toLowerCase().includes(search.toLowerCase())) ||
      (c.districtName && c.districtName.toLowerCase().includes(search.toLowerCase()));
    const matchesStage = stageFilter === 'ALL' || c.currentStatus === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Land Acquisition Cases</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Statutory 9-Stage Requisitions and Possession Status</p>
        </div>

        <div className="search-input-wrapper" style={{ width: '260px' }}>
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-box"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'INITIATED', 'SURVEY', 'NOTIFICATION', 'OBJECTION', 'VALUATION', 'AWARD', 'COMPENSATION', 'POSSESSION', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setStageFilter(st)}
            style={{
              padding: '5px 10px',
              borderRadius: '9999px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: stageFilter === st ? '#2563EB' : '#FFFFFF',
              color: stageFilter === st ? '#FFFFFF' : '#475569',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            {
              header: 'Case Number',
              accessor: 'caseNumber',
              render: (r: any) => (
                <span style={{ fontWeight: 700, color: '#2563EB' }}>{r.caseNumber}</span>
              )
            },
            {
              header: 'Project Name',
              accessor: 'projectName',
              render: (r: any) => <div><strong>{r.projectName}</strong><div style={{ fontSize: '11px', color: '#64748B' }}>{r.districtName}, {r.stateName}</div></div>
            },
            { header: 'Land Req (Ha)', accessor: 'landRequired', render: (r: any) => `${r.landRequired} Ha` },
            { header: 'Land Acq (Ha)', accessor: 'landAcquired', render: (r: any) => `${r.landAcquired} Ha` },
            { header: 'Current Stage', render: (r: any) => <StatusBadge status={r.currentStatus} /> },
            {
              header: 'Action',
              render: (r: any) => (
                <button
                  onClick={() => navigate(`/projects/${r.projectId}`)}
                  style={{ padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  View Case
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
