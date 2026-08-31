import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, CheckCircle, ShieldAlert } from 'lucide-react';
import { fetchAnalytics } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchAnalytics(user?.districtId || undefined, user?.stateId || undefined)
      .then(res => {
        if (res.success) setAnalytics(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading || !analytics) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  const exportMISReport = () => {
    if (!analytics) return;
    
    let csv = 'NATIONAL LAND ACQUISITION & MANAGEMENT SYSTEM - OFFICIAL MIS REPORT\n';
    csv += `Generated On: ${new Date().toLocaleString('en-IN')}\n`;
    csv += `Jurisdiction: ${user?.assignedDistrictName || user?.assignedStateName || 'National Master Scope (36 States & UTs)'}\n\n`;
    
    csv += '--- ACQUISITION LIFECYCLE STAGE BREAKDOWN ---\n';
    csv += 'Stage,Active Cases Count\n';
    Object.entries(analytics.stageCounts || {}).forEach(([stage, count]) => {
      csv += `"${stage}",${count}\n`;
    });

    csv += '\n--- INFRASTRUCTURE SECTOR PERFORMANCE ---\n';
    csv += 'Sector,Project Count,Land Required (Ha),Land Acquired (Ha)\n';
    Object.entries(analytics.sectorCounts || {}).forEach(([sector, val]: [string, any]) => {
      csv += `"${sector}",${val.count},${val.landReq},${val.landAcq}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `National_Land_Acquisition_MIS_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Reports & Strategic Analytics</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Acquisition Velocity, Lifecycle Breakdown & Sector Performance</p>
        </div>

        <button
          onClick={exportMISReport}
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
          <Download size={14} /> Export MIS Report (.CSV)
        </button>
      </div>

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#92400E' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Analytics & MIS Reports are generated specifically for your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}).
          </div>
        </div>
      )}

      {/* Grid of Analytics Widgets */}
      <div className="responsive-grid grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
        {/* Widget 1: Lifecycle Stage Distribution */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            Acquisition Lifecycle Stage Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(analytics.stageCounts || {}).map(([stage, count]: [string, any]) => (
              <div key={stage} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{stage}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284C7' }}>{count} Cases</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Sector Breakdown */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            Infrastructure Sector Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(analytics.sectorCounts || {}).map(([sector, val]: [string, any]) => (
              <div key={sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{sector}</span>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  <strong style={{ color: '#0F172A' }}>{val.count}</strong> Projs | <strong style={{ color: '#047857' }}>{val.landAcq}</strong> / {val.landReq} Ha
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
