import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, UserCheck, ArrowRight, Building, MapPin, CheckCircle2, ChevronDown, Briefcase } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { fetchPublicStatesMaster, fetchPublicDistrictsByState } from '../../services/api';

// Complete Master List of All 28 States and 8 Union Territories of India
const MASTER_INDIAN_STATES_UTS = [
  // 28 States
  { id: 'state-28', lgdCode: 28, name: 'Andhra Pradesh', shortName: 'AP', type: 'STATE' },
  { id: 'state-12', lgdCode: 12, name: 'Arunachal Pradesh', shortName: 'AR', type: 'STATE' },
  { id: 'state-18', lgdCode: 18, name: 'Assam', shortName: 'AS', type: 'STATE' },
  { id: 'state-10', lgdCode: 10, name: 'Bihar', shortName: 'BR', type: 'STATE' },
  { id: 'state-22', lgdCode: 22, name: 'Chhattisgarh', shortName: 'CG', type: 'STATE' },
  { id: 'state-30', lgdCode: 30, name: 'Goa', shortName: 'GA', type: 'STATE' },
  { id: 'state-24', lgdCode: 24, name: 'Gujarat', shortName: 'GJ', type: 'STATE' },
  { id: 'state-6', lgdCode: 6, name: 'Haryana', shortName: 'HR', type: 'STATE' },
  { id: 'state-2', lgdCode: 2, name: 'Himachal Pradesh', shortName: 'HP', type: 'STATE' },
  { id: 'state-20', lgdCode: 20, name: 'Jharkhand', shortName: 'JH', type: 'STATE' },
  { id: 'state-29', lgdCode: 29, name: 'Karnataka', shortName: 'KA', type: 'STATE' },
  { id: 'state-32', lgdCode: 32, name: 'Kerala', shortName: 'KL', type: 'STATE' },
  { id: 'state-23', lgdCode: 23, name: 'Madhya Pradesh', shortName: 'MP', type: 'STATE' },
  { id: 'state-27', lgdCode: 27, name: 'Maharashtra', shortName: 'MH', type: 'STATE' },
  { id: 'state-14', lgdCode: 14, name: 'Manipur', shortName: 'MN', type: 'STATE' },
  { id: 'state-17', lgdCode: 17, name: 'Meghalaya', shortName: 'ML', type: 'STATE' },
  { id: 'state-15', lgdCode: 15, name: 'Mizoram', shortName: 'MZ', type: 'STATE' },
  { id: 'state-13', lgdCode: 13, name: 'Nagaland', shortName: 'NL', type: 'STATE' },
  { id: 'state-21', lgdCode: 21, name: 'Odisha', shortName: 'OD', type: 'STATE' },
  { id: 'state-3', lgdCode: 3, name: 'Punjab', shortName: 'PB', type: 'STATE' },
  { id: 'state-8', lgdCode: 8, name: 'Rajasthan', shortName: 'RJ', type: 'STATE' },
  { id: 'state-11', lgdCode: 11, name: 'Sikkim', shortName: 'SK', type: 'STATE' },
  { id: 'state-33', lgdCode: 33, name: 'Tamil Nadu', shortName: 'TN', type: 'STATE' },
  { id: 'state-36', lgdCode: 36, name: 'Telangana', shortName: 'TS', type: 'STATE' },
  { id: 'state-16', lgdCode: 16, name: 'Tripura', shortName: 'TR', type: 'STATE' },
  { id: 'state-9', lgdCode: 9, name: 'Uttar Pradesh', shortName: 'UP', type: 'STATE' },
  { id: 'state-5', lgdCode: 5, name: 'Uttarakhand', shortName: 'UK', type: 'STATE' },
  { id: 'state-19', lgdCode: 19, name: 'West Bengal', shortName: 'WB', type: 'STATE' },

  // 8 Union Territories
  { id: 'state-35', lgdCode: 35, name: 'Andaman And Nicobar Islands', shortName: 'AN', type: 'UNION_TERRITORY' },
  { id: 'state-4', lgdCode: 4, name: 'Chandigarh', shortName: 'CH', type: 'UNION_TERRITORY' },
  { id: 'state-38', lgdCode: 38, name: 'The Dadra And Nagar Haveli And Daman And Diu', shortName: 'DH', type: 'UNION_TERRITORY' },
  { id: 'state-7', lgdCode: 7, name: 'Delhi', shortName: 'DL', type: 'UNION_TERRITORY' },
  { id: 'state-1', lgdCode: 1, name: 'Jammu And Kashmir', shortName: 'JK', type: 'UNION_TERRITORY' },
  { id: 'state-37', lgdCode: 37, name: 'Ladakh', shortName: 'LA', type: 'UNION_TERRITORY' },
  { id: 'state-31', lgdCode: 31, name: 'Lakshadweep', shortName: 'LD', type: 'UNION_TERRITORY' },
  { id: 'state-34', lgdCode: 34, name: 'Puducherry', shortName: 'PY', type: 'UNION_TERRITORY' }
];

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('GOI-CAD-001');
  const [password, setPassword] = useState('Admin@123');
  const [selectedRole, setSelectedRole] = useState('CENTRAL_ADMIN');
  const [selectedStateId, setSelectedStateId] = useState('state-9'); // Default UP
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [statesList, setStatesList] = useState<any[]>(MASTER_INDIAN_STATES_UTS);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicStatesMaster()
      .then(res => {
        if (res?.success && res.data?.length > 0) {
          const sorted = [...res.data].sort((a: any, b: any) => a.name.localeCompare(b.name));
          setStatesList(sorted);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch districts when state changes for LAO role
  useEffect(() => {
    if ((selectedRole === 'LAND_ACQUISITION_OFFICER' || selectedRole === 'FIELD_OFFICER') && selectedStateId) {
      setDistrictsLoading(true);
      setSelectedDistrictId('');
      fetchPublicDistrictsByState(selectedStateId)
        .then(res => {
          if (res?.success && res.data?.length > 0) {
            setDistrictsList(res.data);
            setSelectedDistrictId(res.data[0]?.id || '');
          } else {
            setDistrictsList([]);
          }
        })
        .catch(() => setDistrictsList([]))
        .finally(() => setDistrictsLoading(false));
    }
  }, [selectedRole, selectedStateId]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSelectedDistrictId('');
    if (role === 'CENTRAL_ADMIN') {
      setEmployeeId('GOI-CAD-001');
    } else if (role === 'STATE_ADMIN') {
      const st = statesList.find(s => s.id === selectedStateId) || statesList[0];
      setEmployeeId(`${st?.shortName || 'UP'}-SAD-101`);
    } else if (role === 'LAND_ACQUISITION_OFFICER') {
      const st = statesList.find(s => s.id === selectedStateId) || statesList[0];
      setEmployeeId(`LAO-${st?.shortName || 'GOI'}-301`);
    } else if (role === 'FIELD_OFFICER') {
      const st = statesList.find(s => s.id === selectedStateId) || statesList[0];
      setEmployeeId(`FO-${st?.shortName || 'UP'}-501`);
    }
  };

  const handleStateSelect = (stId: string) => {
    setSelectedStateId(stId);
    const st = statesList.find(s => s.id === stId);
    if (st && selectedRole === 'STATE_ADMIN') {
      setEmployeeId(`${st.shortName}-SAD-101`);
    } else if (st && selectedRole === 'LAND_ACQUISITION_OFFICER') {
      setEmployeeId(`LAO-${st.shortName}-301`);
    } else if (st && selectedRole === 'FIELD_OFFICER') {
      setEmployeeId(`FO-${st.shortName}-501`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const needsState = ['STATE_ADMIN', 'LAND_ACQUISITION_OFFICER', 'FIELD_OFFICER'].includes(selectedRole);
      const needsDistrict = selectedRole === 'LAND_ACQUISITION_OFFICER' || selectedRole === 'FIELD_OFFICER';

      await login(
        employeeId,
        password,
        selectedRole,
        needsState ? selectedStateId : undefined,
        needsDistrict && selectedDistrictId ? selectedDistrictId : undefined
      );

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStateObj = statesList.find(s => s.id === selectedStateId);
  const statesGroup = statesList.filter(s => s.type === 'STATE');
  const utsGroup = statesList.filter(s => s.type === 'UNION_TERRITORY');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #071224 0%, #0A192F 50%, #0E2246 100%)',
        backgroundImage: 'url("/assets/branding/mountain-bg.svg")',
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            background: 'linear-gradient(90deg, #0A192F 0%, #16284E 100%)',
            padding: '26px 24px',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >
          <img
            src="/assets/branding/state-emblem-official.png"
            alt="Government of India State Emblem"
            style={{ width: '50px', height: '60px', margin: '0 auto 10px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.3px', lineHeight: '1.2' }}>
            National Land Acquisition &<br />Management System
          </h2>
          <span style={{ fontSize: '11.5px', color: '#E2C974', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px', display: 'block' }}>
            Government of India
          </span>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 28px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                fontSize: '12px',
                marginBottom: '16px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Administrative Scope & Role Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                Select Administrative Role & Scope
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleRoleChange('CENTRAL_ADMIN')}
                  style={{
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    borderRadius: '8px',
                    background: selectedRole === 'CENTRAL_ADMIN' ? '#EFF6FF' : '#F8FAFC',
                    border: `1.5px solid ${selectedRole === 'CENTRAL_ADMIN' ? '#2563EB' : '#E2E8F0'}`,
                    color: selectedRole === 'CENTRAL_ADMIN' ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} color={selectedRole === 'CENTRAL_ADMIN' ? '#2563EB' : '#64748B'} />
                    <span>Central Admin</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                    National Scope (36 States & UTs)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('STATE_ADMIN')}
                  style={{
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    borderRadius: '8px',
                    background: selectedRole === 'STATE_ADMIN' ? '#EFF6FF' : '#F8FAFC',
                    border: `1.5px solid ${selectedRole === 'STATE_ADMIN' ? '#2563EB' : '#E2E8F0'}`,
                    color: selectedRole === 'STATE_ADMIN' ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color={selectedRole === 'STATE_ADMIN' ? '#2563EB' : '#64748B'} />
                    <span>State Admin</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                    Select Any State / UT (36)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('LAND_ACQUISITION_OFFICER')}
                  style={{
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    borderRadius: '8px',
                    background: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#EFF6FF' : '#F8FAFC',
                    border: `1.5px solid ${selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#2563EB' : '#E2E8F0'}`,
                    color: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={14} color={selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#2563EB' : '#64748B'} />
                    <span>LAO / Competent Auth</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                    Awards & Valuations
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('FIELD_OFFICER')}
                  style={{
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    borderRadius: '8px',
                    background: selectedRole === 'FIELD_OFFICER' ? '#EFF6FF' : '#F8FAFC',
                    border: `1.5px solid ${selectedRole === 'FIELD_OFFICER' ? '#2563EB' : '#E2E8F0'}`,
                    color: selectedRole === 'FIELD_OFFICER' ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color={selectedRole === 'FIELD_OFFICER' ? '#2563EB' : '#64748B'} />
                    <span>Field Survey Officer</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                    Tehsildar Survey & GPS
                  </div>
                </button>
              </div>
            </div>

            {/* 2a. State selector — for State Admin, LAO, and Field Officer */}
            {(selectedRole === 'STATE_ADMIN' || selectedRole === 'LAND_ACQUISITION_OFFICER' || selectedRole === 'FIELD_OFFICER') && (
              <div
                style={{
                  background: selectedRole === 'STATE_ADMIN' ? '#F0FDF4' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FFFBEB' : '#EFF6FF',
                  border: `1.5px solid ${selectedRole === 'STATE_ADMIN' ? '#86EFAC' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FCD34D' : '#93C5FD'}`,
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: selectedRole === 'STATE_ADMIN' ? '#166534' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#92400E' : '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} />
                    {selectedRole === 'STATE_ADMIN' ? 'Select State / Union Territory Jurisdiction' :
                     selectedRole === 'LAND_ACQUISITION_OFFICER' ? 'Select State (Step 1 of 2)' :
                     'Select Your Assigned State'}
                  </label>
                  <span style={{ fontSize: '10.5px', background: selectedRole === 'STATE_ADMIN' ? '#DCFCE7' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FEF3C7' : '#DBEAFE', color: selectedRole === 'STATE_ADMIN' ? '#15803D' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#B45309' : '#1D4ED8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {statesList.length} Available
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedStateId}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${selectedRole === 'STATE_ADMIN' ? '#86EFAC' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FCD34D' : '#93C5FD'}`,
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0F172A',
                      background: '#FFFFFF',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    <optgroup label={`States (${statesGroup.length})`}>
                      {statesGroup.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.shortName})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={`Union Territories (${utsGroup.length})`}>
                      {utsGroup.map(ut => (
                        <option key={ut.id} value={ut.id}>
                          {ut.name} (UT - {ut.shortName})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown
                    size={16}
                    color={selectedRole === 'STATE_ADMIN' ? '#166534' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#92400E' : '#1D4ED8'}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>

                {selectedStateObj && (
                  <div style={{ fontSize: '11px', color: selectedRole === 'STATE_ADMIN' ? '#15803D' : selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#92400E' : '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <CheckCircle2 size={12} />
                    <span>
                      {selectedRole === 'STATE_ADMIN'
                        ? <>Jurisdiction: <strong>Department of Revenue, Government of {selectedStateObj.name}</strong></>
                        : selectedRole === 'LAND_ACQUISITION_OFFICER'
                        ? <>State: <strong>{selectedStateObj.name}</strong> — Now select your district below</>
                        : <>Assigned State: <strong>{selectedStateObj.name}</strong></>}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2b. District selector — for LAO & Field Officer */}
            {(selectedRole === 'LAND_ACQUISITION_OFFICER' || selectedRole === 'FIELD_OFFICER') && (
              <div
                style={{
                  background: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FFFBEB' : '#EFF6FF',
                  border: `1.5px solid ${selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#F59E0B' : '#60A5FA'}`,
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#92400E' : '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {selectedRole === 'LAND_ACQUISITION_OFFICER' ? 'Select District Jurisdiction (Step 2 of 2)' : 'Select Assigned District'}
                  </label>
                  {districtsLoading && <span style={{ fontSize: '10px', color: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#B45309' : '#1D4ED8' }}>Loading...</span>}
                  {!districtsLoading && districtsList.length > 0 && (
                    <span style={{ fontSize: '10.5px', background: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#FEF3C7' : '#DBEAFE', color: selectedRole === 'LAND_ACQUISITION_OFFICER' ? '#B45309' : '#1D4ED8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {districtsList.length} Districts
                    </span>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    disabled={districtsLoading || districtsList.length === 0}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #F59E0B',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0F172A',
                      background: '#FFFFFF',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      opacity: districtsList.length === 0 ? 0.5 : 1
                    }}
                  >
                    {districtsList.length === 0 && <option value="">— Select a state first —</option>}
                    {districtsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    color="#92400E"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>

                {selectedDistrictId && districtsList.find(d => d.id === selectedDistrictId) && (
                  <div style={{ fontSize: '11px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <CheckCircle2 size={12} />
                    <span>District Jurisdiction: <strong>Collectorate, {districtsList.find(d => d.id === selectedDistrictId)?.name}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* 3. Credentials Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Employee / User ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              {loading ? 'Authenticating...' : (
                selectedRole === 'STATE_ADMIN'
                  ? `LOGIN AS STATE ADMIN (${selectedStateObj?.shortName?.toUpperCase() || 'STATE'})`
                  : selectedRole === 'LAND_ACQUISITION_OFFICER'
                  ? `LOGIN AS LAO — ${districtsList.find(d => d.id === selectedDistrictId)?.name?.toUpperCase() || 'DISTRICT'}`
                  : selectedRole === 'FIELD_OFFICER'
                  ? `LOGIN AS FIELD OFFICER (${selectedStateObj?.shortName?.toUpperCase() || 'STATE'})`
                  : 'LOGIN TO NATIONAL PORTAL'
              )} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'inline-block' }}>
              Government-grade security architecture — RBAC enforced, session-scoped by jurisdiction.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
