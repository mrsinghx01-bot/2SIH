import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Shield, Building, User, Settings, CheckCircle2, Menu } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

interface HeaderProps {
  onToggleNotification?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotification, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [currentDateString, setCurrentDateString] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamic system date formatting
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setCurrentDateString(formatted);
  }, []);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  return (
    <header className="gov-top-header">
      {/* Left: Hamburger menu toggle & Government Emblem & System Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className="header-sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="header-branding">
          <img
            src="/assets/branding/state-emblem-official.png"
            alt="Government of India State Emblem"
            className="gov-emblem-icon"
            style={{ height: '42px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
          />
          <div className="branding-text">
            <span className="branding-title">
              National Land Acquisition &<br />Management System
            </span>
            <span className="branding-sub">Government of India</span>
          </div>
        </Link>
      </div>

      {/* Center: System Motto */}
      <div className="header-motto">
        <span>Transparent Land Acquisition</span>
        <span className="motto-dot">•</span>
        <span>Faster Development</span>
        <span className="motto-dot">•</span>
        <span>Better Tomorrow</span>
      </div>

      {/* Right: Language Selector, Notifications, User Profile & Dynamic Date */}
      <div className="header-actions">
        
        {/* Multi-Lingual Regional Language Switcher (Full-Site Translation) */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', color: '#FFF' }}>
          <span style={{ marginRight: '6px', fontSize: '14px' }}>🇮🇳</span>
          <select
            defaultValue={localStorage.getItem('selected_lang') || 'en'}
            onChange={(e) => {
              const lang = e.target.value;
              localStorage.setItem('selected_lang', lang);
              document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
              document.cookie = `googtrans=/en/${lang}; path=/;`;
              window.location.reload();
            }}
            style={{ background: 'transparent', color: '#FFF', border: 'none', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
          >
            <option value="en" style={{ background: '#0F172A', color: '#FFF' }}>English (EN)</option>
            <option value="hi" style={{ background: '#0F172A', color: '#FFF' }}>हिन्दी (Hindi)</option>
            <option value="mr" style={{ background: '#0F172A', color: '#FFF' }}>मराठी (Marathi)</option>
            <option value="pa" style={{ background: '#0F172A', color: '#FFF' }}>ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="bn" style={{ background: '#0F172A', color: '#FFF' }}>বাংলা (Bengali)</option>
            <option value="ta" style={{ background: '#0F172A', color: '#FFF' }}>தமிழ் (Tamil)</option>
            <option value="te" style={{ background: '#0F172A', color: '#FFF' }}>తెలుగు (Telugu)</option>
            <option value="gu" style={{ background: '#0F172A', color: '#FFF' }}>ગુજરાતી (Gujarati)</option>
            <option value="kn" style={{ background: '#0F172A', color: '#FFF' }}>ಕನ್ನಡ (Kannada)</option>
            <option value="ml" style={{ background: '#0F172A', color: '#FFF' }}>മലയാളം (Malayalam)</option>
            <option value="or" style={{ background: '#0F172A', color: '#FFF' }}>ଓଡ଼ିଆ (Odia)</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button
          className="header-notification-btn"
          onClick={onToggleNotification}
          title="System Notifications"
        >
          <Bell size={18} />
          <span className="notification-badge-red">3</span>
        </button>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <div
            className="header-user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar-circle" style={{ background: isCentral ? '#2563EB' : '#059669' }}>
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="user-meta">
              <span className="user-name-title">{user?.name || 'Central Admin'}</span>
              <span className="user-ministry-title">{user?.ministry || 'Ministry of Rural Development'}</span>
            </div>
            <ChevronDown size={14} color="#94A3B8" />
          </div>

          {/* User Session & Account Profile Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '280px',
                background: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E2E8F0',
                padding: '12px',
                zIndex: 100,
                color: '#0F172A'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isCentral ? '#EFF6FF' : '#ECFDF5', color: isCentral ? '#1D4ED8' : '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{user?.name || 'Authenticated User'}</h4>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{user?.email || 'officer@gov.in'}</span>
                </div>
              </div>

              {/* Official Credentials & Scope */}
              <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', margin: '10px 0', border: '1px solid #E2E8F0', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B' }}>Role:</span>
                  <span style={{ fontWeight: 800, color: isCentral ? '#1D4ED8' : '#047857', background: isCentral ? '#DBEAFE' : '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px' }}>
                    {user?.role}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Employee ID:</span>
                  <strong style={{ color: '#0F172A' }}>{user?.employeeId || 'GOI-CAD-001'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Designation:</span>
                  <strong style={{ color: '#0F172A', textAlign: 'right', maxWidth: '150px' }}>{user?.designation || 'Administrative Officer'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ color: '#64748B' }}>Jurisdiction:</span>
                  <strong style={{ color: isCentral ? '#2563EB' : '#059669' }}>
                    {isCentral ? 'National (All 36 States & UTs)' : `${user?.ministry || 'State Jurisdiction'}`}
                  </strong>
                </div>
              </div>

              {/* Menu Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#334155',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={14} color="#64748B" /> Profile & Account Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#DC2626',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  <LogOut size={14} /> Sign Out / Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic System Date */}
        <div className="header-date-badge">
          {currentDateString || 'Mon, 26 Aug 2026'}
        </div>
      </div>
    </header>
  );
};
