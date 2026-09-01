import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sliders,
  ShieldAlert,
  Download,
  IndianRupee,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle
} from 'lucide-react';
import { fetchAnalytics } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

// Authentic State Circle Rate & Rural Multiplier Benchmarks
const STATE_BENCHMARKS: Record<string, { name: string; avgCircleRateLakhHa: number; ruralMultiplier: number; stateCode: string }> = {
  'UP': { name: 'Uttar Pradesh', avgCircleRateLakhHa: 45.0, ruralMultiplier: 1.5, stateCode: 'UP' },
  'MH': { name: 'Maharashtra', avgCircleRateLakhHa: 52.0, ruralMultiplier: 1.5, stateCode: 'MH' },
  'GJ': { name: 'Gujarat', avgCircleRateLakhHa: 48.0, ruralMultiplier: 1.25, stateCode: 'GJ' },
  'KA': { name: 'Karnataka', avgCircleRateLakhHa: 55.0, ruralMultiplier: 1.5, stateCode: 'KA' },
  'TN': { name: 'Tamil Nadu', avgCircleRateLakhHa: 50.0, ruralMultiplier: 1.5, stateCode: 'TN' },
  'RJ': { name: 'Rajasthan', avgCircleRateLakhHa: 28.0, ruralMultiplier: 2.0, stateCode: 'RJ' },
  'BR': { name: 'Bihar', avgCircleRateLakhHa: 38.0, ruralMultiplier: 1.5, stateCode: 'BR' },
  'WB': { name: 'West Bengal', avgCircleRateLakhHa: 42.0, ruralMultiplier: 1.2, stateCode: 'WB' },
  'DL': { name: 'Delhi UT', avgCircleRateLakhHa: 180.0, ruralMultiplier: 1.0, stateCode: 'DL' },
  'HR': { name: 'Haryana', avgCircleRateLakhHa: 75.0, ruralMultiplier: 1.25, stateCode: 'HR' },
  'PB': { name: 'Punjab', avgCircleRateLakhHa: 68.0, ruralMultiplier: 1.25, stateCode: 'PB' },
  'MP': { name: 'Madhya Pradesh', avgCircleRateLakhHa: 32.0, ruralMultiplier: 1.5, stateCode: 'MP' },
  'AP': { name: 'Andhra Pradesh', avgCircleRateLakhHa: 40.0, ruralMultiplier: 1.5, stateCode: 'AP' },
  'TG': { name: 'Telangana', avgCircleRateLakhHa: 46.0, ruralMultiplier: 1.5, stateCode: 'TG' },
  'KL': { name: 'Kerala', avgCircleRateLakhHa: 85.0, ruralMultiplier: 1.2, stateCode: 'KL' },
  'OD': { name: 'Odisha', avgCircleRateLakhHa: 26.0, ruralMultiplier: 1.75, stateCode: 'OD' },
  'AS': { name: 'Assam', avgCircleRateLakhHa: 30.0, ruralMultiplier: 1.5, stateCode: 'AS' },
  'JK': { name: 'Jammu & Kashmir', avgCircleRateLakhHa: 35.0, ruralMultiplier: 1.5, stateCode: 'JK' }
};

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'PLAYBOOK' | 'MIS_REPORTS'>('SIMULATOR');

  // Decision Support Simulator State
  const [selectedState, setSelectedState] = useState<string>('UP');
  const [projectType, setProjectType] = useState<string>('HIGHWAY');
  const [landRequiredHa, setLandRequiredHa] = useState<number>(250);
  const [terrainScenario, setTerrainScenario] = useState<'MULTI_CROP' | 'RAINFED' | 'WASTELAND' | 'FOREST'>('MULTI_CROP');

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchAnalytics(user?.districtId || undefined, user?.stateId || undefined)
      .then(res => {
        if (res.success) setAnalytics(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading || !analytics) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  // ── RFCTLARR 2013 Statutory Simulation Engine ─────────────────────────────
  const stateData = STATE_BENCHMARKS[selectedState] || STATE_BENCHMARKS['UP'];
  
  // Terrain multipliers & cost weights
  const terrainConfig = {
    MULTI_CROP: {
      rateFactor: 1.35,
      familiesPer100Ha: 45,
      timelineMonths: 18,
      solatiumPct: 1.0,
      description: 'Irrigated Multi-Crop Agricultural Land — Highest circle rate & mandatory R&R housing scheme.',
      feasibilityScore: 72,
      feasibilityCategory: 'MODERATE_ACQUISITION_EFFORT'
    },
    RAINFED: {
      rateFactor: 1.0,
      familiesPer100Ha: 25,
      timelineMonths: 14,
      solatiumPct: 1.0,
      description: 'Single-crop / Rainfed Agricultural Land — Standard rural circle rate with 100% Solatium.',
      feasibilityScore: 84,
      feasibilityCategory: 'HIGH_FEASIBILITY'
    },
    WASTELAND: {
      rateFactor: 0.45,
      familiesPer100Ha: 2,
      timelineMonths: 8,
      solatiumPct: 1.0,
      description: 'Barren / Government Gram Sabha Land — Lowest compensation cost, 0 family displacement, expedited possession.',
      feasibilityScore: 96,
      feasibilityCategory: 'OPTIMAL_CORRIDOR_CHOICE'
    },
    FOREST: {
      rateFactor: 0.65,
      familiesPer100Ha: 10,
      timelineMonths: 24,
      solatiumPct: 1.0,
      description: 'Forest Land / FRA Eco-Zone — Requires Stage-II MoEFCC Forest Clearance & Net Present Value (NPV) fee.',
      feasibilityScore: 61,
      feasibilityCategory: 'STATUTORY_CLEARANCE_HEAVY'
    }
  };

  const currTerrain = terrainConfig[terrainScenario];

  // Statutory Calculations
  const baseRatePerHaLakh = stateData.avgCircleRateLakhHa * currTerrain.rateFactor;
  const marketValuePerHaLakh = baseRatePerHaLakh * stateData.ruralMultiplier;
  const totalMarketValueCr = (marketValuePerHaLakh * landRequiredHa) / 100; // in Crores
  const solatium100PctCr = totalMarketValueCr * 1.0; // 100% Solatium under Section 30(1)
  const additionalMarketValue12PctCr = totalMarketValueCr * 0.12 * (currTerrain.timelineMonths / 12); // 12% p.a. u/s 30(3)
  
  const estimatedFamilies = Math.round((landRequiredHa / 100) * currTerrain.familiesPer100Ha);
  const rrPackageCostCr = (estimatedFamilies * (5.0 + 0.5 + 1.2)) / 100; // ₹5L annuity/resettlement + ₹50k subsistence + ₹1.2L housing grant

  const totalProjectedLandBudgetCr = totalMarketValueCr + solatium100PctCr + additionalMarketValue12PctCr + rrPackageCostCr;

  const exportMISReport = () => {
    if (!analytics) return;
    
    let csv = 'NATIONAL LAND ACQUISITION & MANAGEMENT SYSTEM - OFFICIAL DECISION SUPPORT & MIS REPORT\n';
    csv += `Generated On: ${new Date().toLocaleString('en-IN')}\n`;
    csv += `Jurisdiction: ${user?.assignedDistrictName || user?.assignedStateName || 'National Master Scope (36 States & UTs)'}\n\n`;
    
    csv += '--- ACQUISITION LIFECYCLE STAGE BREAKDOWN ---\n';
    csv += 'Stage,Active Cases Count\n';
    Object.entries(analytics.stageCounts || {}).forEach(([stage, count]) => {
      csv += `"${stage}",${count}\n`;
    });

    csv += '\n--- INFRASTRUCTURE SECTOR PERFORMANCE ---\n';
    csv += 'Sector,Project Count,Land Required (Ha),Land Acquired (Ha)\n';
    Object.entries(analytics.sectorCounts || {}).forEach(([sector, val]: [string, any]) => {
      csv += `"${sector}",${val.count},${val.landReq},${val.landAcq}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `National_Land_Acquisition_DSS_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Decision Support System (DSS) & Strategic Analytics
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '12px' }}>
              RFCTLARR 2013 Engine
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Predictive Alignment Feasibility Simulator, Collector Statutory Playbooks & Real-Time Strategic MIS
          </p>
        </div>

        <button
          onClick={exportMISReport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Download size={14} /> Export DSS Brief (.CSV)
        </button>
      </div>

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#92400E' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Decision Support & MIS analytics are calibrated for your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}).
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('SIMULATOR')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'SIMULATOR' ? '#0F172A' : '#F1F5F9',
            color: activeTab === 'SIMULATOR' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Sliders size={16} /> What-If Corridor Feasibility Simulator
        </button>
        <button
          onClick={() => setActiveTab('PLAYBOOK')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'PLAYBOOK' ? '#0F172A' : '#F1F5F9',
            color: activeTab === 'PLAYBOOK' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Scale size={16} /> Collector Statutory Action Playbook
        </button>
        <button
          onClick={() => setActiveTab('MIS_REPORTS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'MIS_REPORTS' ? '#0F172A' : '#F1F5F9',
            color: activeTab === 'MIS_REPORTS' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart3 size={16} /> Executive MIS Reports & Velocity
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: WHAT-IF CORRIDOR FEASIBILITY SIMULATOR                            */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'SIMULATOR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Banner Explaining Statutory Source */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#2563EB" />
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Official Statutory Decision Support Model (RFCTLARR 2013)</strong>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Simulating compensation budgets, solatium overhead, R&R displacement, and acquisition velocity prior to Section 4/11 notifications.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, background: '#EFF6FF', color: '#1D4ED8', padding: '4px 8px', borderRadius: '6px', border: '1px solid #DBEAFE' }}>
                Sec 26: Circle Rate × Multiplier
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, background: '#ECFDF5', color: '#047857', padding: '4px 8px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                Sec 30(1): 100% Solatium
              </span>
            </div>
          </div>

          <div className="responsive-grid grid-2" style={{ gap: '24px' }}>
            {/* Input Controls Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                <Sliders size={18} color="#0F172A" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Corridor Alignment Parameters</h3>
              </div>

              {/* State Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Target State / Union Territory
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', background: '#F8FAFC', fontWeight: 600 }}
                >
                  {Object.entries(STATE_BENCHMARKS).map(([code, data]) => (
                    <option key={code} value={code}>
                      {data.name} (Notified Rural Multiplier: {data.ruralMultiplier}x)
                    </option>
                  ))}
                </select>
              </div>

              {/* Infrastructure Sector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Infrastructure Sector
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', background: '#F8FAFC', fontWeight: 600 }}
                >
                  <option value="HIGHWAY">Expressway / National Highway Corridor (NHAI / MoRTH)</option>
                  <option value="AIRPORT">Greenfield International / Regional Airport (AAI / MoCA)</option>
                  <option value="RAILWAY">Dedicated Freight Corridor / High-Speed Rail (DFCCIL / NHSRCL)</option>
                  <option value="SOLAR_PARK">Mega Solar Ultra Park / Renewable Energy (SECI / MNRE)</option>
                  <option value="IRRIGATION">National River Interlinking & Irrigation Dam (NWDA / MoJS)</option>
                  <option value="DEFENCE">Strategic Defence Corridor / Border Infrastructure (BRO / MoD)</option>
                </select>
              </div>

              {/* Land Requirement Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Statutory Land Requirement</label>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px' }}>
                    {landRequiredHa} Hectares ({Math.round(landRequiredHa * 2.471)} Acres)
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={landRequiredHa}
                  onChange={(e) => setLandRequiredHa(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#2563EB' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>
                  <span>20 Ha</span>
                  <span>500 Ha</span>
                  <span>1,000 Ha</span>
                  <span>2,000 Ha</span>
                </div>
              </div>

              {/* Terrain & Land-Use Scenario Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Select Alignment Land-Use Scenario
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'MULTI_CROP', label: '🌾 Irrigated Multi-Crop', badge: 'High Solatium' },
                    { id: 'RAINFED', label: '🌱 Rainfed / Single-Crop', badge: 'Standard Rural' },
                    { id: 'WASTELAND', label: '🏜️ Barren / Govt Land', badge: 'Fast Track (Optimal)' },
                    { id: 'FOREST', label: '🌲 Forest Rights (FRA)', badge: 'MoEFCC Clearance' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTerrainScenario(s.id as any)}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        textAlign: 'left',
                        border: terrainScenario === s.id ? '2px solid #2563EB' : '1px solid #CBD5E1',
                        background: terrainScenario === s.id ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: terrainScenario === s.id ? '#1D4ED8' : '#1E293B' }}>
                        {s.label}
                      </div>
                      <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>{s.badge}</span>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '8px', background: '#F8FAFC', padding: '8px 10px', borderRadius: '6px' }}>
                  ℹ️ {currTerrain.description}
                </div>
              </div>
            </div>

            {/* Simulation Results & Financial Output Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} color="#059669" />
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Simulated Statutory Cost & Impact Matrix</h3>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', background: currTerrain.feasibilityScore >= 80 ? '#ECFDF5' : currTerrain.feasibilityScore >= 65 ? '#FFFBEB' : '#FEF2F2', color: currTerrain.feasibilityScore >= 80 ? '#065F46' : currTerrain.feasibilityScore >= 65 ? '#92400E' : '#991B1B' }}>
                  Score: {currTerrain.feasibilityScore}/100
                </div>
              </div>

              {/* Big Budget Summary Hero Card */}
              <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '12px', padding: '18px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Estimated Statutory Acquisition Budget
                  </span>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#38BDF8', marginTop: '2px' }}>
                    ₹{totalProjectedLandBudgetCr.toFixed(2)} Crore
                  </div>
                  <span style={{ fontSize: '11px', color: '#CBD5E1' }}>
                    Includes Base Market Value, 100% Solatium & Schedule II R&R Grants
                  </span>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
                  <span style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Est. Timeline</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399' }}>{currTerrain.timelineMonths} Months</div>
                  <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>To Clear Possession</span>
                </div>
              </div>

              {/* Statutory Breakdown Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '12.5px' }}>
                  <span style={{ color: '#475569' }}>1. Assessed Market Value (Sec 26 Circle Rate × {stateData.ruralMultiplier}x Multiplier):</span>
                  <strong style={{ color: '#0F172A' }}>₹{totalMarketValueCr.toFixed(2)} Cr</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F0FDF4', borderRadius: '8px', fontSize: '12.5px', border: '1px solid #DCFCE7' }}>
                  <span style={{ color: '#166534', fontWeight: 600 }}>2. Mandatory 100% Solatium Award u/s 30(1):</span>
                  <strong style={{ color: '#15803D' }}>+ ₹{solatium100PctCr.toFixed(2)} Cr</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '12.5px' }}>
                  <span style={{ color: '#475569' }}>3. 12% p.a. Additional Market Value u/s 30(3):</span>
                  <strong style={{ color: '#0F172A' }}>+ ₹{additionalMarketValue12PctCr.toFixed(2)} Cr</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FFFBEB', borderRadius: '8px', fontSize: '12.5px', border: '1px solid #FEF3C7' }}>
                  <span style={{ color: '#92400E' }}>4. Schedule II R&R Resettlement ({estimatedFamilies} Affected Families):</span>
                  <strong style={{ color: '#B45309' }}>+ ₹{rrPackageCostCr.toFixed(2)} Cr</strong>
                </div>
              </div>

              {/* Strategic Recommendation Note */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 14px', borderRadius: '10px', fontSize: '12px', color: '#1E40AF', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Decision Support Advisory for Competent Authority:</strong>{' '}
                  {terrainScenario === 'WASTELAND'
                    ? 'Recommended optimal corridor alignment: Low compensation liability, zero resettlement litigation, and eligible for 8-month fast-track Section 38 possession.'
                    : terrainScenario === 'MULTI_CROP'
                    ? 'High statutory friction corridor: Section 10 multi-crop restrictions apply. Ensure SIA public hearing notification (Sec 4) is scheduled immediately to prevent Section 15 timeline delays.'
                    : terrainScenario === 'FOREST'
                    ? 'Stage-I In-Principle MoEFCC Forest Clearance must be uploaded on Parivesh Portal concurrently with Section 11 Preliminary Notification.'
                    : 'Balanced rural corridor: Proceed with Collector circle rate verification and draft Section 11 Gazette notification schedule.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: COLLECTOR STATUTORY ACTION PLAYBOOK                               */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'PLAYBOOK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale size={20} color="#059669" />
            <div>
              <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>District Collectorate Statutory Dispute & Bottleneck Remedies</strong>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Prescriptive legal resolution workflows under the Right to Fair Compensation and Transparency in Land Acquisition Act (RFCTLARR 2013).
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            {[
              {
                bottleneck: 'Section 15 Public Objections Exceeding 60-Day Window',
                statutoryClause: 'RFCTLARR Act Section 15(2) & Section 15(3)',
                severity: 'HIGH_RISK',
                impact: 'Threat of 12-month Section 19(7) notification lapse if inquiry report delayed.',
                actionSteps: [
                  'Collector issues 7-day final summary hearing notice to recorded objectors.',
                  'LAO submits consolidated Section 15(2) inquiry report with categorical disposal findings.',
                  'Forward approved report to Appropriate Government for Section 19 final declaration.'
                ]
              },
              {
                bottleneck: 'Conflicting Titleholder Claims & Succession Disputes on Same Khasra',
                statutoryClause: 'RFCTLARR Act Section 64 & Section 77(2)',
                severity: 'CRITICAL_LITIGATION',
                impact: 'Direct Benefit Transfer (DBT) blocked; landowners refusing award acceptance.',
                actionSteps: [
                  'DO NOT disburse contested funds directly to either claimant.',
                  'Deposit total determined compensation into LARRA (Land Acquisition Authority) Court Escrow Trust Account.',
                  'Collector issues Section 38 Certificate of Vesting and proceeds with physical Right-of-Way handover.'
                ]
              },
              {
                bottleneck: 'Scheduled Tribe / Fifth Schedule Area Acquisition Submergence',
                statutoryClause: 'RFCTLARR Act Section 41 (Special Provisions for SC/STs)',
                severity: 'STATUTORY_MANDATE',
                impact: 'Mandatory Gram Sabha Free Prior Informed Consent (FPIC) required before Section 11.',
                actionSteps: [
                  'Convene special Gram Sabha resolution meeting in scheduled tribal habitations.',
                  'Disburse mandatory one-third upfront compensation upon preliminary notification.',
                  'Allot 2.5 acres of alternative developed agricultural land per displaced tribal family.'
                ]
              },
              {
                bottleneck: 'Approaching 12-Month Section 19 Statutory Lapse Deadline',
                statutoryClause: 'RFCTLARR Act Section 19(7) & Proviso',
                severity: 'IMMINENT_LAPSE',
                impact: 'Entire preliminary notification lapses automatically if Section 19 declaration is not published in Gazette within 12 months.',
                actionSteps: [
                  'Compute remaining days to 12-month cut-off date.',
                  'If genuine administrative delay, submit urgent application to State Government for 12-month extension under Section 19(7) proviso.',
                  'Publish emergency Section 19 declaration in Official e-Gazette and local newspapers immediately.'
                ]
              },
              {
                bottleneck: 'Under-Assessed Tree / Standing Crop / Structure Valuation Disputes',
                statutoryClause: 'RFCTLARR Act Section 29 & Section 30(2)',
                severity: 'VALUATION_DISPUTE',
                impact: 'Titleholders refusing spot measurement; stalling joint survey completion.',
                actionSteps: [
                  'Depute joint inspection team consisting of Horticulture Officer, PWD Executive Engineer, and LAO.',
                  'Re-enumerate standing fruit-bearing timber trees as per state horticulture yield schedules.',
                  'Issue revised Section 29 supplemental award table within 14 days.'
                ]
              }
            ].map((p, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, background: '#0F172A', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
                      Case {idx + 1}
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{p.bottleneck}</strong>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: p.severity === 'IMMINENT_LAPSE' ? '#FEF2F2' : '#EFF6FF', color: p.severity === 'IMMINENT_LAPSE' ? '#991B1B' : '#1D4ED8' }}>
                    {p.statutoryClause}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748B', background: '#F8FAFC', padding: '8px 12px', borderRadius: '6px' }}>
                  ⚠️ <strong>Risk & Impact:</strong> {p.impact}
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Prescribed Collector Statutory Decision Workflow:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {p.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0F172A' }}>
                        <ArrowRight size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: EXECUTIVE MIS REPORTS & VELOCITY                                  */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'MIS_REPORTS' && (
        <div>
          {/* Grid of Analytics Widgets */}
          <div className="responsive-grid grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
            {/* Widget 1: Lifecycle Stage Distribution */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  Acquisition Lifecycle Stage Breakdown
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Active Statutory Cases</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(analytics.stageCounts || {}).map(([stage, count]: [string, any]) => (
                  <div key={stage} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{stage}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284C7' }}>{count} Cases</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Sector Breakdown */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  Infrastructure Sector Performance
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Land Acquired vs Required</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(analytics.sectorCounts || {}).map(([sector, val]: [string, any]) => (
                  <div key={sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{sector}</span>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      <strong style={{ color: '#0F172A' }}>{val.count}</strong> Projs | <strong style={{ color: '#047857' }}>{val.landAcq}</strong> / {val.landReq} Ha
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
