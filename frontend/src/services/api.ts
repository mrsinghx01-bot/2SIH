const rawUrl = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : (rawUrl.startsWith('http') ? `${rawUrl}/api` : rawUrl);

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchStates(search?: string, type?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  const res = await fetch(`${API_BASE_URL}/states?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch states');
  return res.json();
}

export async function fetchPublicStatesMaster() {
  const res = await fetch(`${API_BASE_URL}/states/public-master`);
  if (!res.ok) throw new Error('Failed to fetch public states master');
  return res.json();
}

export async function fetchStateById(id: string) {
  const res = await fetch(`${API_BASE_URL}/states/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('ACCESS_DENIED_STATE_RESTRICTED');
    throw new Error(`Failed to fetch state ${id}`);
  }
  return res.json();
}

export async function fetchDistricts(stateId?: string, search?: string) {
  const params = new URLSearchParams();
  if (stateId) params.append('stateId', stateId);
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE_URL}/districts?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch districts');
  return res.json();
}

export async function fetchDistrictById(id: string) {
  const res = await fetch(`${API_BASE_URL}/districts/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('ACCESS_DENIED_DISTRICT_RESTRICTED');
    throw new Error(`Failed to fetch district ${id}`);
  }
  return res.json();
}

export async function fetchProjects(filters?: { stateId?: string; districtId?: string; projectType?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.stateId) params.append('stateId', filters.stateId);
  if (filters?.districtId) params.append('districtId', filters.districtId);
  if (filters?.projectType) params.append('projectType', filters.projectType);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE_URL}/projects?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProjectById(id: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('ACCESS_DENIED_PROJECT_RESTRICTED');
    throw new Error(`Failed to fetch project ${id}`);
  }
  return res.json();
}

export async function fetchAcquisitionCases(filters?: { projectId?: string; stateId?: string; districtId?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.stateId) params.append('stateId', filters.stateId);
  if (filters?.districtId) params.append('districtId', filters.districtId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE_URL}/acquisition-cases?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch acquisition cases');
  return res.json();
}

export async function fetchCaseById(id: string) {
  const res = await fetch(`${API_BASE_URL}/acquisition-cases/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('ACCESS_DENIED_CASE_RESTRICTED');
    throw new Error(`Failed to fetch case ${id}`);
  }
  return res.json();
}

export async function updateCaseStage(id: string, newStage: string, remarks?: string) {
  const res = await fetch(`${API_BASE_URL}/acquisition-cases/${id}/stage`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ newStage, remarks })
  });
  if (!res.ok) throw new Error('Failed to update stage');
  return res.json();
}

export async function fetchParcels(filters?: { districtId?: string; projectId?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.districtId) params.append('districtId', filters.districtId);
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE_URL}/parcels?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch parcels');
  return res.json();
}

export async function fetchCompensation(caseId?: string, status?: string, search?: string) {
  const params = new URLSearchParams();
  if (caseId) params.append('caseId', caseId);
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/compensation?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch compensation');
  return res.json();
}

export async function fetchRR(projectId?: string, status?: string, search?: string) {
  const params = new URLSearchParams();
  if (projectId) params.append('projectId', projectId);
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/rr?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch R&R');
  return res.json();
}

export async function fetchDocuments(projectId?: string, caseId?: string, type?: string, search?: string) {
  const params = new URLSearchParams();
  if (projectId) params.append('projectId', projectId);
  if (caseId) params.append('caseId', caseId);
  if (type) params.append('type', type);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/documents?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchApprovals(status?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const res = await fetch(`${API_BASE_URL}/approvals?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch approvals');
  return res.json();
}

export async function processApproval(id: string, action: 'APPROVE' | 'REJECT' | 'RETURN', remarks?: string) {
  const res = await fetch(`${API_BASE_URL}/approvals/${id}/process`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action, remarks })
  });
  if (!res.ok) throw new Error('Failed to process approval');
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function fetchAuditLogs(search?: string, entityType?: string, action?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (entityType) params.append('entityType', entityType);
  if (action) params.append('action', action);

  const res = await fetch(`${API_BASE_URL}/audit-logs?${params.toString()}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/reports/analytics`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function loginUser(employeeId: string, password?: string, roleOverride?: string, stateId?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, password, roleOverride, stateId })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchDemoRoles() {
  const res = await fetch(`${API_BASE_URL}/auth/demo-roles`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch demo roles');
  return res.json();
}
