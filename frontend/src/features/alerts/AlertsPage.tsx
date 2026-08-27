import React from 'react';
import { AlertTriangle, AlertCircle, Info, Clock, CheckCircle2 } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const alerts = [
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
      district: 'Pune, Maharashtra',
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
    },
    {
      id: 'alt-5',
      severity: 'INFO',
      title: 'Cadastral Drone Boundary Verification Approved',
      project: 'Western Dedicated Freight Corridor',
      district: 'Palghar, Maharashtra',
      date: '2026-08-18',
      action: 'View Survey Map'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Statutory Alerts & Exception Monitoring</h1>
        <p style={{ fontSize: '13px', color: '#64748B' }}>Real-time Legal Timelines, Overdue Approvals and Acquisition Impediments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#B91C1C', fontWeight: 700 }}>Critical Statutory Exceptions</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#7F1D1D', marginTop: '4px' }}>2 Cases</div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 700 }}>Warnings & Pending Actions</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#78350F', marginTop: '4px' }}>2 Cases</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 700 }}>Informational Updates</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>1 Log</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((a) => (
          <div
            key={a.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              border: `1px solid ${a.severity === 'CRITICAL' ? '#FCA5A5' : a.severity === 'WARNING' ? '#FDE68A' : '#E2E8F0'}`,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div>
                {a.severity === 'CRITICAL' ? (
                  <AlertCircle size={22} color="#DC2626" />
                ) : a.severity === 'WARNING' ? (
                  <AlertTriangle size={22} color="#D97706" />
                ) : (
                  <Info size={22} color="#2563EB" />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: a.severity === 'CRITICAL' ? '#FEE2E2' : a.severity === 'WARNING' ? '#FEF3C7' : '#EFF6FF',
                      color: a.severity === 'CRITICAL' ? '#B91C1C' : a.severity === 'WARNING' ? '#92400E' : '#1D4ED8'
                    }}
                  >
                    {a.severity}
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{a.title}</h4>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                  Project: <strong>{a.project}</strong> • Location: <strong>{a.district}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Initiating action: ${a.action}`)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: a.severity === 'CRITICAL' ? '#DC2626' : '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {a.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
