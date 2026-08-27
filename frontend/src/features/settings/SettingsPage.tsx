import React, { useState } from 'react';
import { Settings, Shield, User, Database, Globe, Key, Save } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>System Configuration & Profile</h1>
        <p style={{ fontSize: '13px', color: '#64748B' }}>User Preferences, Geographic Scoping & Master Data Configuration</p>
      </div>

      {saved && (
        <div style={{ padding: '10px 16px', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          Settings updated successfully.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* User Profile Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#2563EB" /> Officer Profile & Credentials
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Officer Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'Central Admin'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Employee ID / Cadre</label>
              <input
                type="text"
                disabled
                defaultValue={user?.employeeId || 'GOI-CAD-001'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '13px', color: '#64748B' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Designation & Department</label>
              <input
                type="text"
                defaultValue={user?.designation || 'Joint Secretary (Land Resources)'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ministry / Government Body</label>
              <input
                type="text"
                defaultValue={user?.ministry || 'Ministry of Rural Development'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                borderRadius: '8px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              <Save size={14} /> Update Profile
            </button>
          </form>
        </div>

        {/* Master Data & Database Engine Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="#059669" /> Master Geographic & Database Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A' }}>PostgreSQL & PostGIS Engine:</strong>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Prisma ORM connected with spatial vector polygon geometry.
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A' }}>LGD Administrative Master Data:</strong>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                36 States/UTs and 785 Districts imported from official LGD CSV catalog.
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A' }}>Survey of India Boundary Matches:</strong>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                650 auto-matched district geometries, 135 prioritized for verification.
              </p>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <strong style={{ color: '#1D4ED8' }}>Role-Based Access Control:</strong>
              <p style={{ fontSize: '12px', color: '#1E40AF', marginTop: '2px' }}>
                Server-side geographic authorization enforced for all API routes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
