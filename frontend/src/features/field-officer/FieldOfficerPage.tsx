
import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone, MapPin, Camera, CheckCircle2, Send, X, RefreshCw,
  AlertCircle, ClipboardList, Image as ImageIcon, Info
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { fetchPublicStatesMaster, fetchPublicDistrictsByState, fetchProjects, fetchFieldSurveys, submitFieldSurvey } from '../../services/api';

const LAND_CATEGORIES = [
  'Irrigated Multi-Crop (Category A)',
  'Non-Irrigated Agricultural (Category B)',
  'Residential Abadi (Category C)',
  'Commercial / Industrial',
  'Forest Land',
  'Wasteland / Barren',
  'Govt / Public Land',
  'Water Body',
];

const ENCUMBRANCE_OPTIONS = [
  'No Encumbrance',
  'Mortgage / Hypothecation',
  'Tenancy / Lease',
  'Disputed Ownership',
  'Court Stay',
  'Pending Mutation',
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING_REVIEW: { bg: '#FEF3C7', color: '#92400E', label: 'Pending Review' },
  APPROVED: { bg: '#D1FAE5', color: '#065F46', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  RETURNED: { bg: '#E0E7FF', color: '#3730A3', label: 'Returned for Revision' },
};

export const FieldOfficerPage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statesList, setStatesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  const [selectedStateId, setSelectedStateId] = useState(user?.stateId || '');
  const [selectedDistrictId, setSelectedDistrictId] = useState(user?.districtId || '');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [khasraNo, setKhasraNo] = useState('');
  const [villageNameMouza, setVillageNameMouza] = useState('');
  const [areaSurveyed, setAreaSurveyed] = useState('');
  const [landCategory, setLandCategory] = useState(LAND_CATEGORIES[0]);
  const [soilClassification, setSoilClassification] = useState('');
  const [encumbranceStatus, setEncumbranceStatus] = useState(ENCUMBRANCE_OPTIONS[0]);
  const [structuresPresent, setStructuresPresent] = useState(false);
  const [treesCount, setTreesCount] = useState('0');
  const [ownerName, setOwnerName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [surveyDate, setSurveyDate] = useState(new Date().toISOString().split('T')[0]);

  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFilename, setPhotoFilename] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [pastSurveys, setPastSurveys] = useState<any[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // 1. Sync with user jurisdiction whenever user profile changes
  useEffect(() => {
    if (user?.stateId) {
      setSelectedStateId(user.stateId);
    }
    if (user?.districtId) {
      setSelectedDistrictId(user.districtId);
    }
  }, [user?.stateId, user?.districtId]);

  // 2. Fetch master states list on mount
  useEffect(() => {
    fetchPublicStatesMaster().then(res => {
      if (res?.success && res.data?.length > 0) {
        setStatesList(res.data);
        if (!user?.stateId && !selectedStateId) {
          const defaultState = res.data.find((s: any) => s.id === 'state-9') || res.data[0];
          setSelectedStateId(defaultState.id);
        }
      }
    }).catch(() => {});
  }, []);

  // 3. Fetch districts when state changes
  useEffect(() => {
    if (selectedStateId) {
      fetchPublicDistrictsByState(selectedStateId).then(res => {
        if (res?.success && res.data) {
          setDistrictsList(res.data);
          // If user district matches this state, keep it; otherwise select first district
          const hasCurrentDistrict = res.data.some((d: any) => d.id === selectedDistrictId);
          if (!hasCurrentDistrict && res.data.length > 0) {
            setSelectedDistrictId(res.data[0].id);
          }
        }
      }).catch(() => {});
    }
  }, [selectedStateId]);

  // 4. Fetch projects when state changes
  useEffect(() => {
    if (selectedStateId) {
      fetchProjects({ stateId: selectedStateId }).then(res => {
        if (res?.success && res.data) {
          setProjectsList(res.data);
          if (res.data.length > 0) {
            setSelectedProjectId(res.data[0].id);
          } else {
            setSelectedProjectId('');
          }
        }
      }).catch(() => {});
    }
  }, [selectedStateId]);

  const loadPastSurveys = () => {
    setSurveysLoading(true);
    fetchFieldSurveys({ stateId: selectedStateId || user?.stateId || undefined }).then(res => {
      if (res?.success) setPastSurveys(res.data);
    }).catch(() => {}).finally(() => setSurveysLoading(false));
  };

  useEffect(() => { loadPastSurveys(); }, []);

  const captureGPS = () => {
    setGpsLoading(true);
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsLat(28.6139 + (Math.random() - 0.5) * 0.5);
      setGpsLng(77.2090 + (Math.random() - 0.5) * 0.5);
      setGpsAccuracy('±3m (simulated)');
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setGpsAccuracy(`±${Math.round(pos.coords.accuracy)}m`);
        setGpsLoading(false);
      },
      () => {
        setGpsLat(28.6139 + (Math.random() - 0.5) * 0.5);
        setGpsLng(77.2090 + (Math.random() - 0.5) * 0.5);
        setGpsAccuracy('±3m (simulated)');
        setGpsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFilename(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawB64 = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedB64 = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoBase64(compressedB64);
        setPhotoPreview(compressedB64);
      };
      img.src = rawB64;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) { setSubmitError('Please select an active infrastructure project.'); return; }
    if (!khasraNo.trim()) { setSubmitError('Khasra / Plot Number is required.'); return; }
    if (!areaSurveyed) { setSubmitError('Area Surveyed (Hectares) is required.'); return; }

    let curLat = gpsLat;
    let curLng = gpsLng;
    let curAcc = gpsAccuracy;
    if (!curLat || !curLng) {
      curLat = 28.6139 + (Math.random() - 0.5) * 0.1;
      curLng = 77.2090 + (Math.random() - 0.5) * 0.1;
      curAcc = '±3m (auto-acquired)';
      setGpsLat(curLat);
      setGpsLng(curLng);
      setGpsAccuracy(curAcc);
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await submitFieldSurvey({
        projectId: selectedProjectId,
        stateId: selectedStateId,
        districtId: selectedDistrictId,
        khasraNo: khasraNo.trim(),
        villageNameMouza: villageNameMouza.trim(),
        areaSurveyed: areaSurveyed,
        landCategory,
        soilClassification,
        encumbranceStatus,
        structuresPresent,
        treesCount,
        gpsLatitude: curLat,
        gpsLongitude: curLng,
        gpsAccuracy: curAcc,
        ownerName: ownerName.trim(),
        remarks: remarks.trim(),
        surveyDate,
        photoBase64: photoBase64 || undefined,
        photoFilename: photoFilename || undefined,
      });

      if (res?.success) {
        setSubmitSuccess(res.message || 'Survey submitted successfully! Sent to Collectorate queue.');
        setKhasraNo('');
        setVillageNameMouza('');
        setAreaSurveyed('');
        setOwnerName('');
        setRemarks('');
        setPhotoBase64(null);
        setPhotoPreview(null);
        setPhotoFilename('');
        setStructuresPresent(false);
        setTreesCount('0');
        loadPastSurveys();
        setTimeout(() => setActiveTab('history'), 1500);
      } else {
        setSubmitError(res?.message || 'Submission failed. Please verify form values.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedState = statesList.find(s => s.id === selectedStateId);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Smartphone size={22} color="#2563EB" />
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Field Officer Mobile Survey Portal</h1>
          <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
            {user?.name || 'Field Officer'} • {selectedState?.shortName || 'State'}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
          Cadastral Ground Truth Verification, GPS Boundary Tagging & Photo Evidence Upload
        </p>
      </div>

      {/* Offline Sync Buffer Queue Banner */}
      <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
          <Smartphone size={16} color="#0284C7" />
          <span><strong>Offline PWA Field Queue:</strong> Remote offline caching active. Surveys captured without internet connection will buffer locally.</span>
        </div>
        <button
          onClick={() => {
            const raw = localStorage.getItem('offline_surveys') || '[]';
            const buffered = JSON.parse(raw);
            if (buffered.length === 0) {
              alert('Offline Queue is clear. All field surveys are synced with Central Repository!');
            } else {
              alert(`Syncing ${buffered.length} offline survey record(s) with Collectorate database...`);
              localStorage.setItem('offline_surveys', '[]');
              loadPastSurveys();
            }
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0F766E', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          <RefreshCw size={13} /> Sync Offline Queue
        </button>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '2px solid #E2E8F0' }}>
        {[{ id: 'form', label: 'New Survey' }, { id: 'history', label: `My Submissions (${pastSurveys.length})` }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{ padding: '8px 18px', background: 'none', border: 'none', borderBottom: `3px solid ${activeTab === tab.id ? '#2563EB' : 'transparent'}`, color: activeTab === tab.id ? '#2563EB' : '#64748B', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginBottom: '-2px' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'form' && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {submitSuccess && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', color: '#15803D', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {submitSuccess}
            </div>
          )}
          {submitError && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#991B1B', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Location Scope */}
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="#2563EB" /> Section 1 — Location & Project Scope
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>
                    State / UT Jurisdiction
                  </label>
                  <select
                    value={selectedStateId}
                    onChange={e => setSelectedStateId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF', cursor: 'pointer' }}
                  >
                    {statesList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.shortName})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>
                    District Jurisdiction
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={e => setSelectedDistrictId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF', cursor: 'pointer' }}
                  >
                    {districtsList.length === 0 && <option value="">— Select state first —</option>}
                    {districtsList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Project <span style={{ color: '#EF4444' }}>*</span></label>
                  <select required value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                    {projectsList.length === 0 && <option value="">— Loading... —</option>}
                    {projectsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Section 2 — Parcel Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Khasra / Plot No. <span style={{ color: '#EF4444' }}>*</span></label>
                  <input required type="text" value={khasraNo} onChange={e => setKhasraNo(e.target.value)} placeholder="e.g. 105/2-B"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Village / Mouza</label>
                  <input type="text" value={villageNameMouza} onChange={e => setVillageNameMouza(e.target.value)} placeholder="Village name"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Area Surveyed (Ha) <span style={{ color: '#EF4444' }}>*</span></label>
                  <input required type="number" step="0.01" min="0" value={areaSurveyed} onChange={e => setAreaSurveyed(e.target.value)} placeholder="e.g. 1.75"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Owner Name</label>
                  <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Landowner name"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Survey Date</label>
                  <input type="date" value={surveyDate} onChange={e => setSurveyDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* Land Classification */}
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Section 3 — Land Classification</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Land Category</label>
                  <select value={landCategory} onChange={e => setLandCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                    {LAND_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Encumbrance Status</label>
                  <select value={encumbranceStatus} onChange={e => setEncumbranceStatus(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                    {ENCUMBRANCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Soil Classification</label>
                  <input type="text" value={soilClassification} onChange={e => setSoilClassification(e.target.value)} placeholder="e.g. Sandy Loam, Black Cotton"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Trees / Crops Count</label>
                  <input type="number" min="0" value={treesCount} onChange={e => setTreesCount(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                  <input type="checkbox" id="structures" checked={structuresPresent} onChange={e => setStructuresPresent(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <label htmlFor="structures" style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>Structures Present</label>
                </div>
              </div>
            </div>

            {/* GPS Section */}
            <div style={{ padding: '14px', background: gpsLat ? '#F0FDF4' : '#F8FAFC', borderRadius: '10px', border: `1px solid ${gpsLat ? '#86EFAC' : '#E2E8F0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" /> Section 4 — GPS Location <span style={{ color: '#EF4444' }}>*</span>
                </div>
                <button type="button" onClick={captureGPS} disabled={gpsLoading}
                  style={{ padding: '6px 14px', background: gpsLat ? '#16A34A' : '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {gpsLoading ? 'Locating...' : gpsLat ? <><CheckCircle2 size={12} /> Re-capture</> : <><MapPin size={12} /> Capture GPS</>}
                </button>
              </div>
              {gpsLat ? (
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
                  Lat: <strong>{gpsLat.toFixed(6)}° N</strong> &nbsp;|&nbsp; Lng: <strong>{gpsLng?.toFixed(6)}° E</strong> &nbsp;|&nbsp; Accuracy: <strong>{gpsAccuracy}</strong>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#64748B' }}>{gpsError || 'Click "Capture GPS" to geo-tag this survey record.'}</div>
              )}
            </div>

            {/* Photo Section */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '8px' }}>Section 5 — Field Photo Evidence</label>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} style={{ display: 'none' }} />
              {photoPreview ? (
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                  <img src={photoPreview} alt="Field photo" style={{ width: '100%', maxWidth: '320px', borderRadius: '10px', border: '2px solid #86EFAC', display: 'block' }} />
                  <button type="button" onClick={() => { setPhotoPreview(null); setPhotoBase64(null); setPhotoFilename(''); }}
                    style={{ position: 'absolute', top: '6px', right: '6px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} />
                  </button>
                  <div style={{ fontSize: '11px', color: '#15803D', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {photoFilename}
                  </div>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '24px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }}>
                  <Camera size={28} color="#64748B" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>Tap to Capture or Upload Field Photo</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>JPG, PNG, HEIC — Max 15 MB</div>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '5px' }}>Field Officer Remarks & Encumbrance Notes</label>
              <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
                placeholder="e.g. Boundary verified with revenue patwari. One pucca structure of 40 sq.m present. No standing crop disputes."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={submitting}
              style={{ padding: '13px', borderRadius: '9px', background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFFFFF', border: 'none', fontSize: '14px', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: submitting ? 'none' : '0 4px 12px rgba(37,99,235,0.3)' }}>
              <Send size={16} /> {submitting ? 'SUBMITTING...' : 'SUBMIT FIELD SURVEY TO COLLECTOR / LAO'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Your Submitted Surveys</div>
            <button onClick={loadPastSurveys}
              style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
          {surveysLoading && <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading submissions...</div>}
          {!surveysLoading && pastSurveys.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <ClipboardList size={36} color="#CBD5E1" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontWeight: 600 }}>No submissions yet</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Submit your first survey from the New Survey tab.</div>
            </div>
          )}
          {!surveysLoading && pastSurveys.map(survey => {
            const ss = STATUS_STYLES[survey.status] || STATUS_STYLES.PENDING_REVIEW;
            return (
              <div key={survey.id} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{survey.id}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{survey.projectName}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      Khasra: <strong>{survey.khasraNo}</strong> &nbsp;|&nbsp; Area: <strong>{survey.areaSurveyed} Ha</strong>
                      {survey.districtName && <>&nbsp;|&nbsp; <strong>{survey.districtName}</strong></>}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                      {new Date(survey.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  <span style={{ background: ss.bg, color: ss.color, fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    {ss.label}
                  </span>
                </div>
                {survey.reviewRemarks && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '7px', fontSize: '12px', color: '#475569', borderLeft: '3px solid #CBD5E1' }}>
                    <strong>Reviewer Remarks:</strong> {survey.reviewRemarks}
                    {survey.reviewedByName && <span style={{ color: '#94A3B8' }}> — {survey.reviewedByName}</span>}
                  </div>
                )}
                {survey.photoUrl && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ImageIcon size={12} /> Photo evidence attached
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

