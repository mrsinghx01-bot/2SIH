import React, { useState, useEffect } from 'react';
import { Grid, Search } from 'lucide-react';
import { fetchParcels } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const ParcelsPage: React.FC = () => {
  const [parcels, setParcels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParcels()
      .then(res => {
        if (res.success) setParcels(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = parcels.filter(p =>
    p.parcelNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase()) ||
    (p.projectName && p.projectName.toLowerCase().includes(search.toLowerCase()))
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
