import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '../types';
import { loginUser, fetchDemoRoles } from '../services/api';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (employeeId: string, password?: string, roleOverride?: string, stateId?: string, districtId?: string) => Promise<void>;
  switchRole: (role: string, stateId?: string, districtId?: string) => Promise<void>;
  logout: () => void;
  availableRoles: any[];
}

const defaultUser: UserData = {
  id: 'user-central-admin',
  employeeId: 'GOI-CAD-001',
  name: 'Central Admin',
  email: 'central.admin@landrecords.gov.in',
  role: 'CENTRAL_ADMIN',
  designation: 'Joint Secretary (Land Resources)',
  ministry: 'Ministry of Rural Development'
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  isAuthenticated: true,
  token: null,
  login: async () => {},
  switchRole: async () => {},
  logout: () => {},
  availableRoles: []
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);

  useEffect(() => {
    fetchDemoRoles()
      .then(res => {
        if (res.success) setAvailableRoles(res.data);
      })
      .catch(() => {});
  }, []);

  const login = async (employeeId: string, password?: string, roleOverride?: string, stateId?: string, districtId?: string) => {
    const res = await loginUser(employeeId, password, roleOverride, stateId, districtId);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
    }
  };

  const switchRole = async (role: string, stateId?: string, districtId?: string) => {
    await login('GOI-DEMO', undefined, role, stateId, districtId);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        login,
        switchRole,
        logout,
        availableRoles
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
