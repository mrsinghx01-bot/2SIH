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
  Smartphone
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'National Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'States / UTs', path: '/states', icon: Map },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Land Parcels', path: '/parcels', icon: Grid },
    { name: 'Compensation', path: '/compensation', icon: IndianRupee },
    { name: 'R&R Monitoring', path: '/rr-monitoring', icon: Users },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Alerts', path: '/alerts', icon: BellRing },
    { name: 'Audit Log', path: '/audit-log', icon: History },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="gov-sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}

      {/* Field Officer Quick Mode Shortcut */}
      <NavLink
        to="/field-officer"
        className={({ isActive }) =>
          `sidebar-nav-item ${isActive ? 'active' : ''}`
        }
        style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}
      >
        <Smartphone className="nav-icon" color="#60A5FA" />
        <span>Field Survey App</span>
      </NavLink>

      {/* Role & Access Info at Bottom */}
      <div className="sidebar-bottom-badge">
        <span className="role-chip">
          {user?.role ? user.role.replace(/_/g, ' ') : 'CENTRAL ADMIN'}
        </span>
        <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.3' }}>
          Geographic Scope: <br />
          <strong style={{ color: '#E2E8F0' }}>
            {user?.role?.startsWith('CENTRAL') ? 'National Scope (All 36 States/UTs)' : user?.stateId ? 'State Jurisdiction' : 'Assigned Jurisdiction'}
          </strong>
        </div>
      </div>
    </aside>
  );
};
