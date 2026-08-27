import React, { useState, useEffect } from 'react';
import { History, Search, ShieldCheck } from 'lucide-react';
import { fetchAuditLogs } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs()
      .then(res => {
        if (res.success) setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.userEmail && l.userEmail.toLowerCase().includes(search.toLowerCase())) ||
    (l.entityType && l.entityType.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>National System Audit Trail</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Append-Only Security Ledger for Administrative Traceability</p>
        </div>

        <div className="search-input-wrapper" style={{ width: '260px' }}>
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search audit trail..."
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
            {
              header: 'Action Taken',
              accessor: 'action',
              render: (r: any) => (
                <span style={{ fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px', fontSize: '11.5px' }}>
                  {r.action}
                </span>
              )
            },
            { header: 'Entity Category', accessor: 'entityType' },
            { header: 'Authorized User', accessor: 'userEmail' },
            { header: 'Old Value', accessor: 'oldValue', render: (r: any) => r.oldValue || '—' },
            { header: 'New Value', accessor: 'newValue', render: (r: any) => r.newValue || '—' },
            { header: 'IP Address', accessor: 'ipAddress' },
            { header: 'Timestamp', render: (r: any) => new Date(r.createdAt).toLocaleString('en-IN') }
          ]}
          data={filtered}
          keyExtractor={(r: any) => r.id}
        />
      )}
    </div>
  );
};
