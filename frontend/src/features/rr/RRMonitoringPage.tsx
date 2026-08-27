import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle } from 'lucide-react';
import { fetchRR } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const RRMonitoringPage: React.FC = () => {
  const [families, setFamilies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRR()
      .then(res => {
        if (res.success) setFamilies(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = families.filter(f =>
    f.headOfFamily.toLowerCase().includes(search.toLowerCase()) ||
    f.familyReference.toLowerCase().includes(search.toLowerCase()) ||
    (f.projectName && f.projectName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Rehabilitation & Resettlement (R&R) Monitoring</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Statutory Welfare Entitlements for Project-Affected Families</p>
        </div>

        <div className="search-input-wrapper" style={{ width: '260px' }}>
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-box"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            { header: 'Family Ref', accessor: 'familyReference', render: (r: any) => <strong style={{ color: '#2563EB' }}>{r.familyReference}</strong> },
            { header: 'Head of Family', render: (r: any) => <div><strong>{r.headOfFamily}</strong><div style={{ fontSize: '11px', color: '#64748B' }}>{r.projectName}</div></div> },
            { header: 'Members', accessor: 'membersCount' },
            { header: 'Vulnerability', accessor: 'vulnerabilityCategory' },
            { header: 'Status', render: (r: any) => <StatusBadge status={r.rrStatus} /> },
            {
              header: 'Entitlement Package',
              render: (r: any) => r.rrRecord?.entitlementPackage || 'Housing grant + Livelihood assistance'
            }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};
