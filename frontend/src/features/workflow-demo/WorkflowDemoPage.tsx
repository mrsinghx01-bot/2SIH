import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Scan,
  Cpu,
  MapPin,
  Camera,
  IndianRupee,
  ShieldCheck,
  Send,
  Building,
  Layers,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const WorkflowDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [ruralMultiplier, setRuralMultiplier] = useState<number>(1.5);
  const [circleRateLakh, setCircleRateLakh] = useState<number>(50); // 50 Lakh/Ha
  const [areaHa, setAreaHa] = useState<number>(2.85);
  const [dbtProcessing, setDbtProcessing] = useState(false);
  const [dbtSuccess, setDbtSuccess] = useState(false);
  const [pfmsTxnId, setPfmsTxnId] = useState<string>('');

  // Step 4 Calculations (RFCTLARR 2013 First Schedule)
  const baseValue = circleRateLakh * areaHa * 100000;
  const multipliedValue = baseValue * ruralMultiplier;
  const solatium100 = multipliedValue * 1.0; // 100% Solatium u/s 30(1)
  const additionalInterest12 = baseValue * 0.12; // 12% p.a. u/s 30(3)
  const totalAward = multipliedValue + solatium100 + additionalInterest12;

  const handleRunOCR = () => {
    setOcrScanning(true);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrComplete(true);
    }, 1800);
  };

  const handleDisburseDBT = () => {
    setDbtProcessing(true);
    setTimeout(() => {
      setDbtProcessing(false);
      setDbtSuccess(true);
      setPfmsTxnId(`PFMS-GOI-2026-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2200);
  };

  const steps = [
    { num: 1, title: 'Project & Corridor RoW', desc: 'Alignment definition & LGD boundary mapping' },
    { num: 2, title: 'AI Document OCR', desc: 'Gazette 3A & Khasra ledger extraction' },
    { num: 3, title: 'Field Ground Truth', desc: 'GPS tagging, boundary & photo evidence' },
    { num: 4, title: 'Solatium Award Engine', desc: 'RFCTLARR 2013 statutory formula' },
    { num: 5, title: 'Direct Benefit Transfer', desc: 'PFMS disbursement & possession release' }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 50%, #0F766E 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ Interactive Jury Walkthrough
            </span>
            <span style={{ fontSize: '11px', color: '#93C5FD' }}>RFCTLARR Act 2013 Compliant</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            End-to-End Land Acquisition Lifecycle Simulation Engine
          </h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0, maxWidth: '780px', lineHeight: '1.5' }}>
            Demonstrating the full lifecycle transition: from capital corridor definition and AI document extraction (OCR) to cadastral field ground truth verification, statutory solatium determination, and real-time PFMS Direct Benefit Transfer (DBT).
          </p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '24px',
        background: '#FFFFFF',
        padding: '12px',
        borderRadius: '14px',
        border: '1px solid #CBD5E1',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              style={{
                background: isActive ? '#EFF6FF' : isDone ? '#F0FDF4' : '#F8FAFC',
                border: `1.5px solid ${isActive ? '#2563EB' : isDone ? '#86EFAC' : '#E2E8F0'}`,
                borderRadius: '10px',
                padding: '10px 8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isActive ? '#1D4ED8' : isDone ? '#15803D' : '#64748B'
                }}>
                  STEP 0{s.num}
                </span>
                {isDone ? <CheckCircle2 size={13} color="#15803D" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#2563EB' : '#CBD5E1' }} />}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Container */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        minHeight: '480px',
        marginBottom: '24px'
      }}>

        {/* STAGE 1: Project Alignment & RoW Definition */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Building size={20} color="#2563EB" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Stage 1 — Capital Project Alignment & Statutory Corridor Definition
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Establish the infrastructure right-of-way corridor and bind Multi-Modal LGD jurisdiction districts (NHAI / MoRTH / PM GatiShakti framework).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Corridor Parameter Configuration</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>PROJECT NAME</label>
                    <input type="text" readOnly value="Delhi-Mumbai Expressway Greenfield Alignment (Package 14)" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', background: '#FFF' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>PRIMARY STATE</label>
                      <input type="text" readOnly value="Uttar Pradesh (UP)" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', background: '#FFF' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>LGD DISTRICT</label>
                      <input type="text" readOnly value="Lucknow (LGD: 157)" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', background: '#FFF' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>CORRIDOR WIDTH (RoW)</label>
                      <input type="text" readOnly value="60.0 Meters (Standard 8-Lane Expressway)" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', background: '#FFF' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>TOTAL LAND REQUIRED</label>
                      <input type="text" readOnly value="1,240.0 Hectares" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', background: '#FFF' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                    GIS PostGIS Topology Verification
                  </div>
                  <h4 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Corridor Vector Polyline & Boundary Buffer</h4>
                  <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.4' }}>
                    Corridor centerline coordinates generated across 18 Cadastral revenue villages. 240 Khasra boundary polygons automatically indexed into PostGIS spatial registry.
                  </p>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#A7F3D0', marginTop: '10px' }}>
                    EPSG:4326 • Polyline Buffer [60m]<br />
                    Intersecting Villages: Banthra Rural, Sarojini Nagar, Amausi Reach<br />
                    Calculated Overlap: 82% Private Ag, 18% Gram Sabha
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '12px', fontWeight: 700 }}>
                  <CheckCircle2 size={14} /> Corridor Topology Validated
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: AI Document Extraction (OCR Engine) */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Scan size={20} color="#2563EB" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Stage 2 — AI Statutory Document OCR & Cadastral Entity Extraction
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Automatic extraction of Gazette Section 3A / 19 notifications and valuation schedules directly into structured cadastral records.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Left: Gazette Scanner Simulator */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>OFFICIAL GAZETTE SCAN (FORM 3A)</span>
                  <button
                    onClick={handleRunOCR}
                    disabled={ocrScanning}
                    style={{
                      background: ocrScanning ? '#94A3B8' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: ocrScanning ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} /> {ocrScanning ? 'Running AI OCR...' : 'Extract Entities'}
                  </button>
                </div>

                <div style={{
                  background: '#FFF',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  fontFamily: 'serif',
                  color: '#1E293B',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {ocrScanning && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: '#3B82F6',
                      boxShadow: '0 0 12px #3B82F6',
                      animation: 'scan 1.5s infinite linear'
                    }} />
                  )}

                  <div style={{ textAlign: 'center', fontWeight: 800, marginBottom: '6px', fontSize: '12px' }}>
                    THE GAZETTE OF INDIA : EXTRAORDINARY<br />
                    <span style={{ fontSize: '10px', fontWeight: 400 }}>PUBLISHED BY AUTHORITY • MINISTRY OF ROAD TRANSPORT & HIGHWAYS</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #000', margin: '6px 0' }} />
                  <p style={{ margin: '4px 0' }}>
                    <strong>S.O. 2942(E).</strong>—In exercise of powers conferred by Section 3A of National Highways Act, 1956, Central Government hereby declares intention to acquire land specified in Schedule:
                  </p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '10.5px' }}>
                    <tbody>
                      <tr style={{ background: ocrComplete ? '#FEF08A' : 'transparent', transition: 'background 0.5s' }}>
                        <td style={{ border: '1px solid #94A3B8', padding: '3px 6px' }}><strong>Khasra No:</strong> 104/2-A</td>
                        <td style={{ border: '1px solid #94A3B8', padding: '3px 6px' }}><strong>Area:</strong> 2.85 Ha</td>
                      </tr>
                      <tr style={{ background: ocrComplete ? '#FEF08A' : 'transparent', transition: 'background 0.5s' }}>
                        <td style={{ border: '1px solid #94A3B8', padding: '3px 6px' }} colSpan={2}>
                          <strong>Recorded Owner:</strong> Shri Ramavatar & Sons
                        </td>
                      </tr>
                      <tr style={{ background: ocrComplete ? '#FEF08A' : 'transparent', transition: 'background 0.5s' }}>
                        <td style={{ border: '1px solid #94A3B8', padding: '3px 6px' }}><strong>Village:</strong> Banthra Rural</td>
                        <td style={{ border: '1px solid #94A3B8', padding: '3px 6px' }}><strong>Type:</strong> Agricultural</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Extracted Structured JSON / Model Output */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
                    <Cpu size={15} /> AI Model Parser (Donut / Vision LLM Output)
                  </div>

                  {ocrComplete ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ background: '#ECFDF5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                        <span style={{ color: '#047857', fontSize: '10px', fontWeight: 700 }}>KHASRA / PLOT NUMBER</span>
                        <div style={{ fontWeight: 800, color: '#064E3B' }}>Plot No. 104/2-A &bull; Confidence: 99.4%</div>
                      </div>
                      <div style={{ background: '#ECFDF5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                        <span style={{ color: '#047857', fontSize: '10px', fontWeight: 700 }}>PRIMARY BENEFICIARY / TITLEHOLDER</span>
                        <div style={{ fontWeight: 800, color: '#064E3B' }}>Shri Ramavatar & Sons &bull; Confidence: 98.9%</div>
                      </div>
                      <div style={{ background: '#ECFDF5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                        <span style={{ color: '#047857', fontSize: '10px', fontWeight: 700 }}>AREA & LAND CLASSIFICATION</span>
                        <div style={{ fontWeight: 800, color: '#064E3B' }}>2.85 Hectares (Agricultural) &bull; Confidence: 99.8%</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
                      <Scan size={32} color="#CBD5E1" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <p style={{ margin: 0, fontSize: '12px' }}>Click "Extract Entities" to trigger computer vision document extraction.</p>
                    </div>
                  )}
                </div>

                {ocrComplete && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px', fontWeight: 700, marginTop: '12px' }}>
                    <CheckCircle2 size={13} /> Parsed into Cadastral Ledger
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: Field Ground Truth Verification */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={20} color="#2563EB" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Stage 3 — Mobile Field Ground Truth & Geo-Tagged Verification
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Field Officer captures high-precision GPS boundary coordinates, photo evidence, tree counts, and pucca structures.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Mobile Field Survey Record</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ background: '#EFF6FF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                    <span style={{ fontSize: '10px', color: '#1D4ED8', fontWeight: 700 }}>FIELD OFFICER ID</span>
                    <strong style={{ display: 'block', color: '#1E3A8A' }}>Anand Prakash (FO-UP-501)</strong>
                  </div>
                  <div style={{ background: '#F0FDF4', padding: '8px 10px', borderRadius: '6px', border: '1px solid #86EFAC' }}>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 700 }}>GPS COORDINATES</span>
                    <strong style={{ display: 'block', color: '#14532D' }}>Lat: 26.7025° N, Lng: 80.8256° E (±2m Accuracy)</strong>
                  </div>
                  <div style={{ background: '#FFFBEB', padding: '8px 10px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: '10px', color: '#B45309', fontWeight: 700 }}>ATTACHED STRUCTURES & TREES</span>
                    <strong style={{ display: 'block', color: '#78350F' }}>1 Tubewell & Pump House (40 sq.m) + 14 Mango Trees</strong>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>FIELD OFFICER REMARKS</span>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#334155' }}>
                      "Boundary verified with Patwari khasra map. No boundary disputes. Titleholders in clear possession."
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Collectorate Review & Endorsement</h4>
                  <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '10px', border: '1.5px solid #86EFAC', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                      <ShieldCheck size={16} /> Survey Verified by Competent Authority (LAO)
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#14532D' }}>
                      <strong>Reviewing Officer:</strong> Rajesh Narayan (Competent Authority Land Acquisition, NHAI)<br />
                      <strong>Status:</strong> APPROVED u/s 3A RFCTLARR Statutory Verification
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                    Ground truth data automatically updates the parcel state in the Cadastral GIS ledger from <em>Under Survey</em> to <em>Valuation Ready</em>.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                  <CheckCircle2 size={13} /> Ground Truth Approved by Collectorate
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: Solatium & Award Calculation Engine */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <IndianRupee size={20} color="#2563EB" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Stage 4 — RFCTLARR Act 2013 Statutory Solatium & Award Calculation Engine
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Statutory compensation computation under First Schedule of RFCTLARR Act 2013 with 100% Solatium and 12% additional market value.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
              {/* Formula Inputs */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Statutory Valuation Parameters</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>SURVEYED AREA (HECTARES)</label>
                    <input type="number" step="0.01" value={areaHa} onChange={e => setAreaHa(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>CIRCLE RATE / BASE MARKET VALUE (₹ LAKH / HA)</label>
                    <input type="number" value={circleRateLakh} onChange={e => setCircleRateLakh(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>RURAL MULTIPLIER FACTOR (1.0x to 2.0x u/s 26)</label>
                    <select value={ruralMultiplier} onChange={e => setRuralMultiplier(parseFloat(e.target.value))} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}>
                      <option value={1.0}>1.0x (Urban / Municipal Limit)</option>
                      <option value={1.25}>1.25x (Semi-Urban Peripheral Belt)</option>
                      <option value={1.5}>1.5x (Rural Area 10-20 KM from Urban Center)</option>
                      <option value={2.0}>2.0x (Remote Rural Area &gt;20 KM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Formula Output Breakdown */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Compensation Breakdown (Section 26-30)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                    <span>1. Base Market Value (Area × Circle Rate):</span>
                    <strong>₹{(baseValue / 100000).toFixed(2)} Lakh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                    <span>2. Market Value with Rural Multiplier ({ruralMultiplier}x):</span>
                    <strong style={{ color: '#1D4ED8' }}>₹{(multipliedValue / 100000).toFixed(2)} Lakh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                    <span>3. 100% Solatium u/s 30(1):</span>
                    <strong style={{ color: '#059669' }}>+ ₹{(solatium100 / 100000).toFixed(2)} Lakh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                    <span>4. 12% p.a. Additional Market Value u/s 30(3):</span>
                    <strong style={{ color: '#7C3AED' }}>+ ₹{(additionalInterest12 / 100000).toFixed(2)} Lakh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#ECFDF5', borderRadius: '8px', border: '1.5px solid #86EFAC', marginTop: '6px', fontSize: '13.5px' }}>
                    <span style={{ fontWeight: 800, color: '#064E3B' }}>TOTAL STATUTORY AWARD (₹):</span>
                    <strong style={{ color: '#047857', fontSize: '15px' }}>₹{(totalAward / 10000000).toFixed(2)} Crore (₹{(totalAward / 100000).toFixed(2)} Lakh)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: Direct Benefit Transfer (DBT) & Possession */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#2563EB" />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Stage 5 — Real-Time PFMS Direct Benefit Transfer (DBT) & Possession Handover
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Automated PFMS electronic payment gateway settlement into Aadhaar-linked beneficiary bank account.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Beneficiary & Payment Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>BENEFICIARY NAME</span>
                    <strong style={{ display: 'block', color: '#0F172A' }}>Shri Ramavatar & Sons (Khasra 104/2-A)</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>BANK & NPCI AADHAAR SEEDING STATUS</span>
                    <strong style={{ display: 'block', color: '#059669' }}>State Bank of India • A/C: ******4892 (Active)</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>TOTAL SANCTIONED AMOUNT</span>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#166534' }}>₹{(totalAward / 10000000).toFixed(2)} Crore</strong>
                  </div>

                  {!dbtSuccess ? (
                    <button
                      onClick={handleDisburseDBT}
                      disabled={dbtProcessing}
                      style={{
                        marginTop: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: dbtProcessing ? '#94A3B8' : 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#FFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: dbtProcessing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                      }}
                    >
                      <Zap size={15} /> {dbtProcessing ? 'Processing PFMS Settlement...' : 'EXECUTE REAL-TIME DBT DISBURSEMENT'}
                    </button>
                  ) : (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#ECFDF5', border: '1.5px solid #86EFAC', borderRadius: '8px', color: '#064E3B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                        <CheckCircle2 size={16} color="#15803D" /> PFMS Payment Settled Successfully
                      </div>
                      <div style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'monospace' }}>
                        TXN REF: <strong>{pfmsTxnId}</strong><br />
                        Settled via RBI e-Kuber on {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Statutory Section 38 Milestone Handover
                  </div>
                  <h4 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>Clear Unencumbered Land Possession</h4>
                  <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
                    Upon confirmation of DBT disbursement, parcel state transitions immediately in the Cadastral GIS ledger from <em>Compensation Pending</em> to <strong>ACQUIRED / POSSESSION HANDED OVER</strong>.
                  </p>
                  {dbtSuccess && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '8px', fontSize: '11.5px', color: '#4ADE80', marginTop: '10px' }}>
                      ✓ Statutory Section 38 Certificate Generated<br />
                      ✓ Right-of-Way cleared for construction contractor
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/projects/proj-1')}
                  style={{
                    marginTop: '16px',
                    padding: '9px 14px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Inspect Updated Project in GIS Console <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          style={{
            padding: '8px 16px',
            background: currentStep === 1 ? '#F1F5F9' : '#FFFFFF',
            color: currentStep === 1 ? '#94A3B8' : '#334155',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={14} /> Previous Stage
        </button>

        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
          Simulation Stage {currentStep} of 5
        </span>

        <button
          onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
          disabled={currentStep === 5}
          style={{
            padding: '8px 18px',
            background: currentStep === 5 ? '#F1F5F9' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: currentStep === 5 ? '#94A3B8' : '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: currentStep === 5 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: currentStep === 5 ? 'none' : '0 4px 10px rgba(37,99,235,0.3)'
          }}
        >
          Next Lifecycle Stage <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};

export default WorkflowDemoPage;
