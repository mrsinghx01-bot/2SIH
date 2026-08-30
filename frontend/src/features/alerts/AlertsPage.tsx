import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { fetchNotifications } from '../../services/api';
import { useAuth } from '../../store/AuthContext';

export const AlertsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchNotifications(user?.districtId || undefined, user?.stateId || undefined)
      .then(res => {
        if (res.success) {
          let list = res.data?.notifications || res.data || [];
          setNotifications(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const defaultAlerts = [
    {
      id: 'alt-1',
      severity: 'CRITICAL',
      title: 'Section 15 Statutory Objection Period Expiring (4 Days Remaining)',
      project: 'Noida International Greenfield Airport (Jewar Phase II)',
      district: 'Gautam Buddha Nagar, Uttar Pradesh',
      date: '2026-08-25',
      action: 'Conduct Public Hearing'
    },
    {
      id: 'alt-2',
      severity: 'CRITICAL',
      title: 'Solatium 100% Determination Matrix Pending Collector Sanction',
      project: 'Purvanchal Expressway Economic Node Expansion',
      district: 'Lucknow, Uttar Pradesh',
      date: '2026-08-24',
      action: 'Submit to DM'
    },
    {
      id: 'alt-3',
      severity: 'WARNING',
      title: '3 Parcels Disputed on Boundary Demarcation (Khasra 102/3)',
      project: 'Delhi-Mumbai Express Highway Corridor',
      district: 'Thane, Maharashtra',
      date: '2026-08-23',
      action: 'Order Re-Survey'
    },
    {
      id: 'alt-4',
      severity: 'WARNING',
      title: 'R&R Housing Livelihood Grant Disbursement Overdue by 14 Days',
      project: 'Ken-Betwa River Interlinking Canal Project Phase I',
      district: 'Banda, Uttar Pradesh',
      date: '2026-08-20',
      action: 'Initiate PFMS Batch'
    }
  ];

  const displayAlerts = notifications.length > 0 ? notifications : defaultAlerts;

  const filteredAlerts = isCentral ? displayAlerts : displayAlerts.filter((a: any) => {
    if (user?.districtId) {
      return (a.district || '').toLowerCase().includes((user.assignedDistrictName || user.districtId).toLowerCase());
    } else if (user?.stateId) {
      return (a.district || '').toLowerCase().includes((user.assignedStateName || user.stateId).toLowerCase());
    }
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Statutory Alerts & Exception Monitoring</h1>
        <p style={{ fontSize: '13px', color: '#64748B' }}>Real-time Legal Timelines, Overdue Approvals and Acquisition Impediments</p>
      </div>

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1E40AF' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Alerts & Exception notifications filtered for your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}).
          </div>
        </div>
      )}

      <div className="responsive-grid grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: 600 }}>Critical Milestone Delays</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#7F1D1D', marginTop: '2px' }}>
            {filteredAlerts.filter((a: any) => a.severity === 'CRITICAL' || a.type === 'ALERT').length || 2}
          </div>
        </div>
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#92400E', fontWeight: 600 }}>Statutory Warnings</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#78350F', marginTop: '2px' }}>
            {filteredAlerts.filter((a: any) => a.severity === 'WARNING').length || 2}
          </div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>Total Active Notifications</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E3A8A', marginTop: '2px' }}>
            {filteredAlerts.length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.map((alt: any, idx: number) => {
          const isCritical = alt.severity === 'CRITICAL' || alt.type === 'ALERT';
          return (
            <div
              key={alt.id || idx}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: isCritical ? '1px solid #FECACA' : '1px solid #CBD5E1',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{
                  background: isCritical ? '#FEF2F2' : '#EFF6FF',
                  color: isCritical ? '#DC2626' : '#2563EB',
                  padding: '10px',
                  borderRadius: '10px'
                }}>
                  {isCritical ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {alt.title || alt.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                    Project: <strong>{alt.project || 'National Infrastructure Project'}</strong> | District: <strong>{alt.district || 'Assigned Collectorate'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: isCritical ? '#FEE2E2' : '#DBEAFE',
                  color: isCritical ? '#991B1B' : '#1E40AF'
                }}>
                  {alt.severity || 'ALERT'}
                </span>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                  {alt.date || new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
