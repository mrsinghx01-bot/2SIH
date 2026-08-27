import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NotificationPanel } from './NotificationPanel';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  return (
    <div className="page-background-wrapper">
      <Header onToggleNotification={() => setShowNotificationPanel(!showNotificationPanel)} />
      
      <div className="app-shell-container">
        <Sidebar />
        <main className="main-content-viewport">
          {children}
        </main>
      </div>

      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
      />
    </div>
  );
};
