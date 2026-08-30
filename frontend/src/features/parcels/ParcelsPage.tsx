import React, { useState, useEffect } from 'react';
import { Grid, Search, ShieldAlert, MapPin, Building } from 'lucide-react';
import { fetchParcels } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const ParcelsPage: React.FC = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isCentral = !user || user.role === 'CENTRAL_ADMIN' || user.role === 'CENTRAL_OFFICER';

  useEffect(() => {
    fetchParcels({
      stateId: user?.stateId || undefined,
      districtId: user?.districtId || undefined
    })
      .then(res => {
        if (res.success) {
          let list = res.data;
          if (!isCentral) {
            if (user?.districtId) {
              list = list.filter((p: any) => p.districtId === user.districtId);
            } else if (user?.stateId) {
              list = list.filter((p: any) => p.stateId === user.stateId || p.districtStateId === user.stateId);
            }
          }
          setParcels(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = parcels.filter(p =>
    p.parcelNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase()) ||
    (p.projectName && p.projectName.toLowerCase().includes(search.toLowerCase())) ||
    (p.districtName && p.districtName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Cadastral Land Parcels & GIS</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Khasra Numbers, Village Boundaries and Survey Statuses</p>
        </div>

        <div className="search-input-wrapper" style={{ width: '260px' }}>
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search parcels / village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-box"
          />
        </div>
      </div>

      {/* Role-Based Geographic Scope Banner */}
      {!isCentral && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1E40AF' }}>
          <ShieldAlert size={18} />
          <div>
            <strong>Jurisdiction Scope Enforced ({user?.role}):</strong> Data is strictly filtered for your assigned {user?.districtId ? 'District' : 'State'} jurisdiction ({user?.assignedDistrictName || user?.assignedStateName || user?.districtId || user?.stateId}). Showing {filtered.length} matching land parcels.
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          columns={[
            { header: 'Parcel ID', accessor: 'parcelNumber', render: (r: any) => <strong style={{ color: '#2563EB' }}>{r.parcelNumber}</strong> },
            { header: 'Village', accessor: 'village' },
            { header: 'District', accessor: 'districtName' },
            { header: 'Associated Project', accessor: 'projectName' },
            { header: 'Area (Ha)', accessor: 'areaHectares', render: (r: any) => `${r.areaHectares} Ha` },
            { header: 'Land Use', accessor: 'landUse' },
            { header: 'Acquisition Status', render: (r: any) => <StatusBadge status={r.acquisitionStatus} /> }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};
