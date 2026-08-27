import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Layers, MapPin, Grid } from 'lucide-react';
import { fetchDistrictById } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressRing } from '../../components/ProgressRing';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const DistrictDetailPage: React.FC = () => {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();
  const [district, setDistrict] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtId) {
      setLoading(true);
      fetchDistrictById(districtId)
        .then(res => {
          if (res.success) setDistrict(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [districtId]);

  if (loading || !district) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="detail-banner-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>{district.name} District</h1>
            <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              LGD: {district.lgdCode}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            State: <strong>{district.state?.name}</strong> • Local Name: <strong>{district.localName || district.name}</strong> • Collectorate & Land Acquisition Office
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F8FAFC', padding: '12px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <ProgressRing
            percentage={district.kpis?.acquisitionPercentage || 72}
            size={50}
            color="#2563EB"
          />
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>District Progress</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              {district.kpis?.landAcquired} / {district.kpis?.landRequired} Ha
            </div>
          </div>
        </div>
      </div>

      {/* District KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>Active Projects</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E3A8A' }}>{district.kpis?.projectsCount || 2}</div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', padding: '14px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Acquisition Cases</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#064E3B' }}>{district.kpis?.casesCount || 4}</div>
        </div>
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '14px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6D28D9', fontWeight: 600 }}>Parcels / Khasras</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#4C1D95' }}>{district.kpis?.parcelsCount || 12}</div>
        </div>
      </div>

      {/* District Projects */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>District Infrastructure Projects</h3>
        <DataTable
          columns={[
            { header: 'Project Code', accessor: 'projectCode' },
            { header: 'Project Name', accessor: 'name' },
            { header: 'Type', accessor: 'projectType' },
            { header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
            { header: 'Action', render: (r: any) => <button onClick={() => navigate(`/projects/${r.id}`)} style={{ padding: '4px 10px', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Open Project</button> }
          ]}
          data={district.projects || []}
          keyExtractor={(r: any) => r.id}
        />
      </div>

      {/* District Cases */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Active Acquisition Cases</h3>
        <DataTable
          columns={[
            { header: 'Case Number', accessor: 'caseNumber' },
            { header: 'Required (Ha)', accessor: 'landRequired', render: (r: any) => `${r.landRequired} Ha` },
            { header: 'Acquired (Ha)', accessor: 'landAcquired', render: (r: any) => `${r.landAcquired} Ha` },
            { header: 'Current Stage', render: (r: any) => <StatusBadge status={r.currentStatus} /> }
          ]}
          data={district.cases || []}
          keyExtractor={(r: any) => r.id}
        />
      </div>
    </div>
  );
};
