import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, CheckCircle } from 'lucide-react';
import { fetchAnalytics } from '../../services/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const ReportsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(res => {
        if (res.success) setAnalytics(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Reports & Strategic Analytics</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>National Acquisition Velocity, Lifecycle Breakdown & Sector Performance</p>
        </div>

        <button
          onClick={() => alert('Exporting Official National Land Acquisition Report (PDF/Excel)...')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Download size={14} /> Export National Report
        </button>
      </div>

      {/* Grid of Analytics Widgets */}
      <div className="responsive-grid grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
        {/* Widget 1: Lifecycle Stage Distribution */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            Acquisition Lifecycle Stage Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(analytics.stageDistribution || {}).map(([stage, count]: any) => (
              <div key={stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{stage}</span>
                  <strong style={{ color: '#0F172A' }}>{count} Cases</strong>
                </div>
                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (count / 6) * 100)}%`,
                      background: stage === 'COMPLETED' ? '#10B981' : stage === 'VALUATION' ? '#8B5CF6' : '#3B82F6',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Sector Wise Distribution */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            Sectoral Land Requisitions (Ha)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(analytics.sectorBreakdown || {}).map(([sec, data]: any) => (
              <div key={sec} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{sec.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{data.count} Active Projects</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>{Math.round(data.landAcq)} / {Math.round(data.landReq)} Ha</div>
                  <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 600 }}>{Math.round((data.landAcq / (data.landReq || 1)) * 100)}% Acquired</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top States Acquisition Velocity Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
          State-Wise Acquisition Velocity
        </h3>
        <table className="gov-data-table">
          <thead>
            <tr>
              <th>State / UT</th>
              <th>Land Required (Ha)</th>
              <th>Land Acquired (Ha)</th>
              <th>Completion Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topStates?.map((st: any) => (
              <tr key={st.stateName}>
                <td><strong>{st.stateName}</strong></td>
                <td>{st.landRequired.toLocaleString('en-IN')} Ha</td>
                <td>{st.landAcquired.toLocaleString('en-IN')} Ha</td>
                <td><strong>{st.completionPercentage}%</strong></td>
                <td>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: st.completionPercentage >= 75 ? '#15803D' : '#1D4ED8', background: st.completionPercentage >= 75 ? '#DCFCE7' : '#DBEAFE', padding: '2px 8px', borderRadius: '9999px' }}>
                    {st.completionPercentage >= 75 ? 'HIGH VELOCITY' : 'ON TRACK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
