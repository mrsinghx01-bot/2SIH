import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { AppShell } from './components/AppShell';
import { Login } from './features/auth/Login';
import { NationalDashboard } from './features/dashboard/NationalDashboard';
import { StateDetailPage } from './features/states/StateDetailPage';
import { DistrictDetailPage } from './features/districts/DistrictDetailPage';
import { ProjectsList } from './features/projects/ProjectsList';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { AcquisitionCasesPage } from './features/cases/AcquisitionCasesPage';
import { ParcelsPage } from './features/parcels/ParcelsPage';
import { CompensationPage } from './features/compensation/CompensationPage';
import { RRMonitoringPage } from './features/rr/RRMonitoringPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AlertsPage } from './features/alerts/AlertsPage';
import { AuditLogPage } from './features/audit/AuditLogPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { FieldOfficerPage } from './features/field-officer/FieldOfficerPage';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<NationalDashboard />} />
        <Route path="/states" element={<NationalDashboard />} />
        <Route path="/states/:stateId" element={<StateDetailPage />} />
        <Route path="/districts/:districtId" element={<DistrictDetailPage />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/acquisition-cases" element={<AcquisitionCasesPage />} />
        <Route path="/parcels" element={<ParcelsPage />} />
        <Route path="/compensation" element={<CompensationPage />} />
        <Route path="/rr-monitoring" element={<RRMonitoringPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/field-officer" element={<FieldOfficerPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
