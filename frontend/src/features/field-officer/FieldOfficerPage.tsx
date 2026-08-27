import React, { useState } from 'react';
import { Smartphone, MapPin, Camera, CheckCircle2, Upload, Send } from 'lucide-react';

export const FieldOfficerPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState('LA-UP-LUC-2025-0105');
  const [khasraNo, setKhasraNo] = useState('105/2');
  const [areaSurveyed, setAreaSurveyed] = useState('2.45');
  const [soilType, setSoilType] = useState('Irrigated Multi-Crop');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRemarks('');
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={22} color="#2563EB" />
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Field Officer Mobile Survey Portal</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#64748B' }}>Cadastral Ground Truth Verification, GPS Boundary Tagging & Survey Upload</p>
      </div>

      {submitted && (
        <div style={{ padding: '12px 16px', background: '#DCFCE7', color: '#15803D', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> Survey record submitted to Competent Authority for Section 3A validation.
        </div>
      )}

      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Assigned Acquisition Case
            </label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            >
              <option value="LA-UP-LUC-2025-0105">LA-UP-LUC-2025-0105 • Purvanchal Industrial Corridor</option>
              <option value="LA-MH-PUN-2025-0106">LA-MH-PUN-2025-0106 • Delhi-Mumbai Highway Corridor</option>
              <option value="LA-UP-NOI-2025-0107">LA-UP-NOI-2025-0107 • Jewar Greenfield Airport Phase II</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Khasra / Plot Number
              </label>
              <input
                type="text"
                value={khasraNo}
                onChange={(e) => setKhasraNo(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Surveyed Area (Hectares)
              </label>
              <input
                type="text"
                value={areaSurveyed}
                onChange={(e) => setAreaSurveyed(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* GPS Coordinates Simulation */}
          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              <MapPin size={15} color="#2563EB" /> Real-time GPS Location Locked
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Latitude: <strong>26.8467° N</strong> • Longitude: <strong>80.9462° E</strong> (Accuracy: ±1.2m)
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Land Category / Soil Classification
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            >
              <option value="Irrigated Multi-Crop">Irrigated Multi-Crop (Category A)</option>
              <option value="Non-Irrigated Agricultural">Non-Irrigated Agricultural (Category B)</option>
              <option value="Residential Abadi">Residential Abadi (Category C)</option>
              <option value="Commercial / Industrial">Commercial / Industrial</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Field Inspection Photo Upload (Cadastral Boundary / Structure)
            </label>
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                background: '#F8FAFC',
                cursor: 'pointer'
              }}
              onClick={() => alert('Simulating Geo-Tagged Camera Capture... Photo attached with GPS metadata.')}
            >
              <Camera size={24} color="#64748B" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB' }}>
                Tap to Capture Field Geo-Tagged Photo
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Supports JPG, PNG (Max 15MB)</div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Field Officer Remarks & Encumbrance Notes
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Boundary verified with revenue patwari; no tube well or standing tree disputes observed."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <Send size={15} /> SUBMIT FIELD SURVEY REPORT
          </button>
        </form>
      </div>
    </div>
  );
};
