import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle, ShieldAlert } from 'lucide-react';
import { fetchRR } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const RRMonitoringPage: React.FC = () => {
  const { user } = useAuth();
  const [families, setFamilies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchRR(undefined, undefined, undefined, user?.districtId || undefined, user?.stateId || undefined)
      .then(res => {
        if (res.success) {
          let list = res.data;
          if (!isCentral) {
            if (user?.districtId) {
              list = list.filter((f: any) => f.districtId === user.districtId);
            } else if (user?.stateId) {
              list = list.filter((f: any) => f.stateId === user.stateId || f.districtStateId === user.stateId);
            }
          }
          setFamilies(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = families.filter(f =>
    f.headOfFamily.toLowerCase().includes(search.toLowerCase()) ||
    f.familyReference.toLowerCase().includes(search.toLowerCase()) ||
    (f.projectName && f.projectName.toLowerCase().includes(search.toLowerCase())) ||
    (f.districtName && f.districtName.toLowerCase().includes(search.toLowerCase()))
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

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#065F46' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Showing R&R entitlements restricted to your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}). Showing {filtered.length} matching affected family records.
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <div style={{ padding: '36px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
          <strong style={{ display: 'block', fontSize: '15px', color: '#0F172A', marginBottom: '8px' }}>No R&R Records Found</strong>
          Rehabilitation & Resettlement (R&R) entitlements for affected families are recorded during the Social Impact Assessment (SIA) phase under RFCTLARR Section 4-9. Records will populate as field surveys and SIA reports are finalized.
        </div>
      ) : (
        <DataTable
          columns={[
            { header: 'Family Ref', accessor: 'familyReference', render: (r: any) => <strong style={{ color: '#2563EB' }}>{r.familyReference}</strong> },
            { header: 'Head of Family', render: (r: any) => <div><strong>{r.headOfFamily}</strong><div style={{ fontSize: '11px', color: '#64748B' }}>{r.projectName}</div></div> },
            { header: 'District', accessor: 'districtName' },
            { header: 'Members', accessor: 'membersCount' },
            { header: 'Displacement', render: (r: any) => r.isDisplaced ? <span style={{ color: '#DC2626', fontWeight: 700 }}>Displaced (PDF)</span> : <span style={{ color: '#047857' }}>Affected (PAF)</span> },
            { header: 'Housing Entitlement', render: (r: any) => r.rrRecord?.housingOption || 'Constructed House Unit (PM Awas)' },
            { header: 'R&R Progress', render: (r: any) => <StatusBadge status={r.rrStatus || 'IN_PROGRESS'} /> }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};
