import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FolderKanban,
  Grid,
  IndianRupee,
  Users,
  BarChart3,
  BellRing,
  History,
  Settings,
  Smartphone,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isFieldOfficer = user?.role === 'FIELD_OFFICER';
  const canReviewSurveys = ['LAND_ACQUISITION_OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'CENTRAL_ADMIN', 'CENTRAL_OFFICER'].includes(user?.role || '');

  const menuItems = [
    { name: 'National Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'States / UTs', path: '/states', icon: Map },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Land Parcels', path: '/parcels', icon: Grid },
    { name: 'Compensation', path: '/compensation', icon: IndianRupee },
    { name: 'R&R Monitoring', path: '/rr-monitoring', icon: Users },
    { name: 'Decision Support & Reports', path: '/reports', icon: BarChart3 },
    { name: 'Statutory Alerts', path: '/alerts', icon: BellRing },
    { name: 'Audit Log', path: '/audit-log', icon: History },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`gov-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <Icon className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}

      {(isFieldOfficer || canReviewSurveys) && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1E293B' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', padding: '0 12px 8px', textTransform: 'uppercase' }}>
            Field Operations
          </div>
          {isFieldOfficer && (
            <NavLink to="/field-officer" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Smartphone className="nav-icon" />
              <span>Field Survey App</span>
            </NavLink>
          )}
          {canReviewSurveys && (
            <NavLink to="/survey-review" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <ClipboardCheck className="nav-icon" />
              <span>Survey Review Queue</span>
            </NavLink>
          )}
        </div>
      )}
    </aside>
  );
};
