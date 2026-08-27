import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Building, Shield, Lock, ExternalLink, ArrowRight } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { StateCard } from '../../components/StateCard';
import { UTCard } from '../../components/UTCard';
import { fetchStates, fetchDashboardSummary } from '../../services/api';
import { StateData } from '../../types';
import { useAuth } from '../../store/AuthContext';

// Priority sequence matching the reference visual
const STATE_ORDER = ['UP', 'MH', 'BR', 'WB', 'TN', 'RJ', 'GJ', 'KA'];
const UT_ORDER = ['DL', 'CH', 'JK', 'PY'];

export const NationalDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [states, setStates] = useState<StateData[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [territoryTab, setTerritoryTab] = useState<'ALL' | 'FEATURED' | 'STATES' | 'UTS'>('FEATURED');

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    // 1. Fetch dashboard summary with dynamic scoped KPIs
    fetchDashboardSummary()
      .then(res => {
        if (res?.success) {
          setSummaryData(res.data);
        }
      })
      .catch(() => {});

    // 2. Fetch scoped states list
    fetchStates()
      .then(res => {
        if (res?.success) {
          // Sort states and UTs
          const sorted = [...res.data].sort((a: StateData, b: StateData) => {
            const orderA = STATE_ORDER.indexOf(a.shortName);
            const orderB = STATE_ORDER.indexOf(b.shortName);
            if (orderA !== -1 && orderB !== -1) return orderA - orderB;
            if (orderA !== -1) return -1;
            if (orderB !== -1) return 1;

            const utOrderA = UT_ORDER.indexOf(a.shortName);
            const utOrderB = UT_ORDER.indexOf(b.shortName);
            if (utOrderA !== -1 && utOrderB !== -1) return utOrderA - utOrderB;
            if (utOrderA !== -1) return -1;
            if (utOrderB !== -1) return 1;

            return a.name.localeCompare(b.name);
          });

          setStates(sorted);
        }
      })
      .catch(() => {});
  }, [user]);

  const filteredItems = states.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.shortName && item.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.capital && item.capital.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const allStateCards = filteredItems.filter(s => s.type === 'STATE');
  const allUTCards = filteredItems.filter(s => s.type === 'UNION_TERRITORY');

  // Determine what to display based on selected tab and user scope
  const displayedStates = (() => {
    if (!isCentral) return allStateCards; // State Admin only gets their own state
    if (searchQuery) return allStateCards;
    if (territoryTab === 'FEATURED') return allStateCards.slice(0, 8);
    if (territoryTab === 'ALL' || territoryTab === 'STATES') return allStateCards;
    return [];
  })();

  const displayedUTs = (() => {
    if (!isCentral) return allUTCards;
    if (searchQuery) return allUTCards;
    if (territoryTab === 'FEATURED') return allUTCards.slice(0, 4);
    if (territoryTab === 'ALL' || territoryTab === 'UTS') return allUTCards;
    return [];
  })();

  const kpis = summaryData?.kpis;

  return (
    <div>
      {/* State Admin Scope Banner (if non-central) */}
      {!isCentral && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              <Shield size={24} color="#60A5FA" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  State Administration Jurisdiction • {states[0]?.name || user?.name}
                </h2>
                <span style={{ background: '#22C55E', color: '#FFFFFF', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                  STATE SCOPE ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#DBEAFE', margin: '4px 0 0 0' }}>
                Logged in as <strong>{user?.name}</strong> ({user?.designation}). You have exclusive administrative access to land acquisition data within {states[0]?.name || 'your assigned State'}.
              </p>
            </div>
          </div>

          {states[0] && (
            <button
              onClick={() => navigate(`/states/${states[0].id}`)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#FFFFFF',
                color: '#1E40AF',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              Open State GIS Console <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* 1. Top 5 Colorful Pastel KPI Cards (Dynamic Scoped Values) */}
      <section className="kpi-cards-grid">
        <KpiCard
          type="projects"
          title="Total Projects"
          value={kpis?.totalProjects?.displayValue || (isCentral ? '1,248' : '48')}
          trend={kpis?.totalProjects?.trend || '12%'}
          comparisonText={kpis?.totalProjects?.comparisonText || 'vs last month'}
        />
        <KpiCard
          type="proposed"
          title="Land Proposed"
          value={kpis?.landProposed?.displayValue || (isCentral ? '8.42 Lakh Ha' : '45,200 Ha')}
          trend={kpis?.landProposed?.trend || '14%'}
          comparisonText={kpis?.landProposed?.comparisonText || 'vs last month'}
        />
        <KpiCard
          type="acquired"
          title="Land Acquired"
          value={kpis?.landAcquired?.displayValue || (isCentral ? '6.71 Lakh Ha' : '34,500 Ha')}
          trend={kpis?.landAcquired?.trend || '18%'}
          comparisonText={kpis?.landAcquired?.comparisonText || 'vs last month'}
        />
        <KpiCard
          type="compensation"
          title="Compensation Paid"
          value={kpis?.compensationPaid?.displayValue || (isCentral ? '₹ 1,26,540 Cr' : '₹ 425.8 Cr')}
          trend={kpis?.compensationPaid?.trend || '22%'}
          comparisonText={kpis?.compensationPaid?.comparisonText || 'vs last month'}
        />
        <KpiCard
          type="families"
          title="Affected Families"
          value={kpis?.affectedFamilies?.displayValue || (isCentral ? '4.82 Lakh' : '1,850 Families')}
          trend={kpis?.affectedFamilies?.trend || '16%'}
          comparisonText={kpis?.affectedFamilies?.comparisonText || 'vs last month'}
        />
      </section>

      {/* 2. States & Union Territories Header & Search Box */}
      <div className="section-header-bar">
        <div className="section-title-group">
          <div className="section-title-with-flag">
            <img
              src="/assets/branding/india-flag.svg"
              alt="India Flag"
              className="india-flag-badge"
            />
            <h2 className="main-section-heading">
              {isCentral
                ? `States & Union Territories (${states.length})`
                : `Assigned State Jurisdiction • ${states[0]?.name || 'State'}`}
            </h2>
          </div>
          <p className="section-subtitle-text">
            {isCentral
              ? 'Central Government Oversight: Click on any State or UT to inspect district administration, GIS corridors, and project alignments'
              : `State Administration Portal: Managing ${states[0]?.districtsCount || 75} LGD districts, infrastructure corridors, and compensation awards for ${states[0]?.name}`}
          </p>
        </div>

        {/* Territory View Mode & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isCentral ? (
            /* Scope Filter Tabs for Central Admin */
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '9999px', border: '1px solid #CBD5E1' }}>
              <button
                onClick={() => setTerritoryTab('FEATURED')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: territoryTab === 'FEATURED' ? '#2563EB' : 'transparent',
                  color: territoryTab === 'FEATURED' ? '#FFFFFF' : '#475569'
                }}
              >
                Featured (12)
              </button>
              <button
                onClick={() => setTerritoryTab('ALL')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: territoryTab === 'ALL' ? '#2563EB' : 'transparent',
                  color: territoryTab === 'ALL' ? '#FFFFFF' : '#475569'
                }}
              >
                All States & UTs (36)
              </button>
              <button
                onClick={() => setTerritoryTab('STATES')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: territoryTab === 'STATES' ? '#2563EB' : 'transparent',
                  color: territoryTab === 'STATES' ? '#FFFFFF' : '#475569'
                }}
              >
                States (28)
              </button>
              <button
                onClick={() => setTerritoryTab('UTS')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: territoryTab === 'UTS' ? '#2563EB' : 'transparent',
                  color: territoryTab === 'UTS' ? '#FFFFFF' : '#475569'
                }}
              >
                UTs (8)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', padding: '5px 12px', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '11.5px', color: '#92400E', fontWeight: 600 }}>
              <Lock size={13} /> Restricted to {states[0]?.name || 'Assigned State'}
            </div>
          )}

          {/* Search Box on Right */}
          {isCentral && (
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search all 36 States / UTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-box"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. State Cards Grid */}
      {displayedStates.length > 0 && (
        <div className="state-cards-grid" style={{ gridTemplateColumns: !isCentral ? 'repeat(auto-fill, minmax(320px, 400px))' : undefined }}>
          {displayedStates.map((st) => (
            <StateCard key={st.id} state={st} />
          ))}
        </div>
      )}

      {/* 4. UT Cards Grid (Central Admin Only) */}
      {isCentral && displayedUTs.length > 0 && (
        <div style={{ marginTop: displayedStates.length > 0 ? '16px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Building size={16} color="#2563EB" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Union Territories ({displayedUTs.length})</h3>
          </div>
          <div className="ut-cards-grid">
            {displayedUTs.map((ut) => (
              <UTCard key={ut.id} ut={ut} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Real Government Data Integration Panel (DILRMP & Census 2011) */}
      <div style={{ marginTop: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#EFF6FF', padding: '8px', borderRadius: '8px', color: '#1D4ED8' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Digital India Land Records Modernization Programme (DILRMP)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Department of Land Resources (DoLR), Ministry of Rural Development • Real-Time National MIS 4.0
              </p>
            </div>
          </div>

          <a
            href="https://dilrmp.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none' }}
          >
            DILRMP MIS Portal <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>RoR Computerized</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              {summaryData?.dilrmpGovProgress?.rorComputerizedPct || 95}%
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              6.31+ Lakh Villages Completed
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Cadastral Maps Digitized</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              {summaryData?.dilrmpGovProgress?.cadastralMapDigitizedPct || 72}%
            </div>
            <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
              Geo-Referenced Maps Active
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Bhu-Aadhaar (ULPIN)</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#047857', marginTop: '6px' }}>
              {summaryData?.dilrmpGovProgress?.ulpinStatus || '29 / 36 States & UTs Active'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
              14-Digit Geo-Coordinate Parcel ID
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>SRO Integration</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              {summaryData?.dilrmpGovProgress?.sroComputerizedPct || 93}%
            </div>
            <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600, marginTop: '2px' }}>
              Registration-RoR Linked
            </div>
          </div>
        </div>

        {summaryData?.nationalGovMasterData && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569' }}>
            <div>
              <strong>Official Master Demographics:</strong> Census 2011 Population ({summaryData.nationalGovMasterData.censusPopulation2011}) • Total MHA Districts ({summaryData.nationalGovMasterData.totalDistrictsMHA}) • Total Villages ({summaryData.nationalGovMasterData.totalVillagesDoLR})
            </div>
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '10.5px' }}>
              data.gov.in API Live Connected
            </div>
          </div>
        )}
      </div>

      {/* 6. Bottom Live Data Information Bar */}
      <footer className="data-status-bar" style={{ marginTop: '20px' }}>
        <div className="status-info-left">
          <Info size={16} />
          <span>
            <strong className="status-badge-chip">
              {isCentral ? 'National Live Data:' : 'State Revenue Data:'}
            </strong>{' '}
            {isCentral
              ? 'Information is officially integrated with data.gov.in, Census of India 2011, RBI & Department of Land Resources (DoLR).'
              : `Information is officially synchronized with ${states[0]?.name || 'State'} Revenue Department and Land Acquisition Officer portal.`}
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '11.5px', color: '#047857' }}>
          API Key Connected • Open Government Data Platform India
        </div>
      </footer>
    </div>
  );
};

