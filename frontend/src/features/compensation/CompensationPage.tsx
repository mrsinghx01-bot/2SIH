import React, { useState, useEffect } from 'react';
import { IndianRupee, Search, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { fetchCompensation } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const CompensationPage: React.FC = () => {
  const { user } = useAuth();
  const [compensationData, setCompensationData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchCompensation(undefined, undefined, undefined, user?.districtId || undefined, user?.stateId || undefined)
      .then(res => {
        if (res.success) {
          let list = res.data;
          if (!isCentral) {
            if (user?.districtId) {
              list = list.filter((c: any) => c.districtId === user.districtId);
            } else if (user?.stateId) {
              list = list.filter((c: any) => c.stateId === user.stateId || c.districtStateId === user.stateId);
            }
          }
          setCompensationData(list);
          setSummary(res.summary);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = compensationData.filter(c =>
    c.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
    c.beneficiaryReference.toLowerCase().includes(search.toLowerCase()) ||
    (c.projectName && c.projectName.toLowerCase().includes(search.toLowerCase())) ||
    (c.districtName && c.districtName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Compensation & Financial Disbursements</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Direct Benefit Transfer (DBT) & RFCTLARR Award Determinations</p>
        </div>

        <div className="search-input-wrapper" style={{ width: '260px' }}>
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search beneficiary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-box"
          />
        </div>
      </div>

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#5B21B6' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Showing compensation records restricted to your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}). Showing {filtered.length} matching beneficiary payout records.
          </div>
        </div>
      )}

      {/* Summary KPI Counters */}
      {(() => {
        const totalAssessedVal = summary?.totalAssessed ?? filtered.reduce((acc, c) => acc + (c.amountAssessed || c.assessedAmount || 0), 0);
        const totalDisbursedVal = summary?.totalDisbursed ?? summary?.totalPaid ?? filtered.reduce((acc, c) => acc + (c.amountPaid || c.paidAmount || 0), 0);
        const totalAssessedCr = (totalAssessedVal / 10000000).toFixed(1);
        const totalDisbursedCr = (totalDisbursedVal / 10000000).toFixed(1);
        const disbursementRate = summary?.disbursementPct ?? (totalAssessedVal > 0 ? Math.round((totalDisbursedVal / totalAssessedVal) * 100) : 0);
        const pendingClaims = summary?.pendingCount ?? filtered.filter(c => c.paymentStatus !== 'PAID').length;

        return (
          <div className="responsive-grid grid-4" style={{ gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6D28D9', fontWeight: 600 }}>Total Assessed Compensation</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#4C1D95', marginTop: '2px' }}>
                ₹ {totalAssessedCr} Cr
              </div>
            </div>
            <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Total Disbursed (DBT)</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>
                ₹ {totalDisbursedCr} Cr
              </div>
            </div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>Disbursement Rate</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E40AF', marginTop: '2px' }}>
                {disbursementRate}%
              </div>
            </div>
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>Pending Award Claims</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                {pendingClaims} Beneficiaries
              </div>
            </div>
          </div>
        );
      })()}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            { header: 'Beneficiary Ref', accessor: 'beneficiaryReference', render: (r: any) => <strong style={{ color: '#0284C7' }}>{r.beneficiaryReference}</strong> },
            { header: 'Beneficiary / Titleholders', accessor: 'beneficiaryName' },
            { header: 'District', accessor: 'districtName' },
            { header: 'Associated Project', accessor: 'projectName' },
            { header: 'Assessed Amount', render: (r: any) => `₹ ${(r.amountAssessed ?? r.assessedAmount ?? 0).toLocaleString('en-IN')}` },
            { header: 'Disbursed Amount', render: (r: any) => {
              const paid = r.amountPaid ?? r.paidAmount ?? 0;
              return (
                <span style={{ fontWeight: 700, color: paid > 0 ? '#047857' : '#B45309' }}>
                  ₹ {paid.toLocaleString('en-IN')}
                </span>
              );
            }},
            { header: 'Payment Mode', render: (r: any) => (
              <span style={{ fontSize: '12px', color: '#334155' }}>
                {r.paymentMode || (r.transactionRef ? 'PFMS_DBT (Direct Account Transfer)' : (r.paymentStatus === 'PAID' ? 'PFMS_ELECTRONIC' : 'PFMS_CLEARANCE_PENDING'))}
              </span>
            )},
            { header: 'DBT Status', render: (r: any) => <StatusBadge status={r.paymentStatus} /> }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};

