import React, { useState, useEffect } from 'react';
import { IndianRupee, Search, CheckCircle, Clock } from 'lucide-react';
import { fetchCompensation } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const CompensationPage: React.FC = () => {
  const [compensationData, setCompensationData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompensation()
      .then(res => {
        if (res.success) {
          setCompensationData(res.data);
          setSummary(res.summary);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = compensationData.filter(c =>
    c.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
    c.beneficiaryReference.toLowerCase().includes(search.toLowerCase()) ||
    (c.projectName && c.projectName.toLowerCase().includes(search.toLowerCase()))
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

      {/* Summary KPI Counters */}
      <div className="responsive-grid grid-4" style={{ gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6D28D9', fontWeight: 600 }}>Total Assessed Compensation</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#4C1D95', marginTop: '2px' }}>
            ₹ {summary ? (summary.totalAssessed / 10000000).toFixed(1) : '148.5'} Cr
          </div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Disbursed (Paid via PFMS)</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#064E3B', marginTop: '2px' }}>
            ₹ {summary ? (summary.totalPaid / 10000000).toFixed(1) : '112.4'} Cr
          </div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>Pending Disbursement</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#78350F', marginTop: '2px' }}>
            ₹ {summary ? (summary.totalPending / 10000000).toFixed(1) : '36.1'} Cr
          </div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>Beneficiaries Onboarded</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E3A8A', marginTop: '2px' }}>
            {compensationData.length} Records
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            { header: 'Beneficiary Ref', accessor: 'beneficiaryReference', render: (r: any) => <strong style={{ color: '#2563EB' }}>{r.beneficiaryReference}</strong> },
            { header: 'Beneficiary Name & Project', render: (r: any) => <div><strong>{r.beneficiaryName}</strong><div style={{ fontSize: '11px', color: '#64748B' }}>{r.projectName}</div></div> },
            { header: 'District', accessor: 'districtName' },
            { header: 'Assessed (₹)', render: (r: any) => `₹ ${r.assessedAmount.toLocaleString('en-IN')}` },
            { header: 'Paid (₹)', render: (r: any) => `₹ ${r.paidAmount.toLocaleString('en-IN')}` },
            { header: 'Status', render: (r: any) => <StatusBadge status={r.paymentStatus} /> },
            { header: 'Transaction Ref', render: (r: any) => r.transactionRef || 'Pending DBT' }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};
