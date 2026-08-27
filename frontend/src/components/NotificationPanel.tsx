import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, Clock, FileText } from 'lucide-react';
import { fetchNotifications } from '../services/api';
import { NotificationData } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
        .then(res => {
          if (res.success) {
            setNotifications(res.data.notifications || []);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPROVAL_REQUIRED': return <Clock size={16} color="#2563EB" />;
      case 'STAGE_COMPLETED': return <CheckCircle2 size={16} color="#059669" />;
      case 'STATUTORY_ALERT': return <AlertTriangle size={16} color="#EA580C" />;
      default: return <FileText size={16} color="#64748B" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '70px',
        right: '24px',
        width: '380px',
        maxHeight: '480px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-dropdown)',
        border: '1px solid var(--surface-border)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '16px',
          background: 'linear-gradient(90deg, #0A192F 0%, #16284E 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Official Notifications</h3>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Statutory Notices & Workflow Updates</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '8px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                onClose();
                if (n.referenceType === 'PROJECT' && n.referenceId) {
                  navigate(`/projects/${n.referenceId}`);
                } else if (n.referenceType === 'CASE' && n.referenceId) {
                  navigate(`/acquisition-cases/${n.referenceId}`);
                }
              }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: n.isRead ? '#F8FAFC' : '#EFF6FF',
                border: `1px solid ${n.isRead ? '#E2E8F0' : '#BFDBFE'}`,
                cursor: 'pointer',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.3' }}>
                  {n.message}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
            No new notifications.
          </div>
        )}
      </div>
    </div>
  );
};
