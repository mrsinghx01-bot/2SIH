import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, CheckCircle2, XCircle, AlertCircle, RotateCcw,
  Search, Filter, MapPin, Eye, MessageSquare, ShieldAlert, FileText, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { fetchFieldSurveys, reviewFieldSurvey } from '../../services/api';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING_REVIEW: { bg: '#FEF3C7', color: '#B45309', label: 'Pending Review' },
  APPROVED: { bg: '#D1FAE5', color: '#065F46', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  RETURNED: { bg: '#E0E7FF', color: '#3730A3', label: 'Returned for Revision' },
};

export const SurveyReviewPage: React.FC = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Selected survey for review details modal
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadSurveys = async () => {
    setLoading(true);
    setError('');
    try {
      // API filters geographic scope automatically based on user token
      const res = await fetchFieldSurveys();
      if (res?.success) {
        setSurveys(res.data);
      } else {
        setError('Failed to fetch survey queue.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching survey records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleReviewAction = async (surveyId: string, action: 'APPROVE' | 'REJECT' | 'RETURN_FOR_REVISION') => {
    if (!reviewRemarks.trim() && action !== 'APPROVE') {
      alert('Remarks are required for Rejection or returning for revision.');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await reviewFieldSurvey(surveyId, action, reviewRemarks);
      if (res?.success) {
        setSuccessMessage(`Survey ${surveyId} status updated successfully.`);
        setReviewRemarks('');
        setSelectedSurvey(null);
        loadSurveys();
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert('Failed to update status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating survey status.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Filtered surveys list
  const filteredSurveys = surveys.filter(s => {
    const matchesSearch = 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.khasraNo && s.khasraNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.submittedByName && s.submittedByName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = surveys.filter(s => s.status === 'PENDING_REVIEW').length;
  const approvedCount = surveys.filter(s => s.status === 'APPROVED').length;
  const rejectedCount = surveys.filter(s => s.status === 'REJECTED' || s.status === 'RETURNED').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardCheck size={24} color="#059669" />
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Field Survey Review & Approvals
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Competent Authority / Collector Dashboard — Validate field officer submissions under RFCTLARR Act 2013
          </p>
        </div>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#166534' }}>
          Scope: {user?.districtId ? `District Collectorate, ${user.ministry || 'Assigned District'}` : user?.stateId ? `State Revenue Department` : 'National Scope'}
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '12px 16px', background: '#D1FAE5', border: '1px solid #34D399', color: '#065F46', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Total Submissions</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A' }}>{surveys.length}</span>
        </div>
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309' }}>Pending Validation</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#D97706' }}>{pendingCount}</span>
        </div>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Approved Parcels</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#15803D' }}>{approvedCount}</span>
        </div>
        <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>Rejected / Returned</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626' }}>{rejectedCount}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', background: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Survey ID, Project Name, Khasra or Officer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#64748B" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', cursor: 'pointer', background: '#FFF' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RETURNED">Returned for Revision</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading review queue...</div>
      ) : error ? (
        <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#DC2626', fontSize: '13px' }}>
          {error}
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#64748B' }}>
          <ClipboardCheck size={40} color="#CBD5E1" style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontWeight: 700, fontSize: '15px' }}>Review Queue is Empty</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>No field surveys matched your search filters.</div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>Survey ID / Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>Infrastructure Project</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>Land Details (Khasra/Area)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>Submitted By</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurveys.map(s => {
                  const ss = STATUS_STYLES[s.status] || STATUS_STYLES.PENDING_REVIEW;
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{s.id}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.projectName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {s.stateName} &gt; {s.districtName}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div>Khasra: <strong>{s.khasraNo}</strong></div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          Area: <strong>{s.areaSurveyed} Ha</strong> | {s.landCategory?.split(' (')[0]}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#475569' }}>{s.submittedByName}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{s.submittedByEmployeeId}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: ss.bg, color: ss.color, padding: '4px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {s.status === 'APPROVED' && <CheckCircle2 size={12} />}
                          {s.status === 'REJECTED' && <XCircle size={12} />}
                          {s.status === 'RETURNED' && <RotateCcw size={12} />}
                          {ss.label}
                        </span>
                        {s.reviewedByName && (
                          <div style={{ fontSize: '11px', color: '#334155', marginTop: '4px', lineHeight: '1.3' }}>
                            <span style={{ color: '#64748B' }}>By: </span>
                            <strong style={{ color: s.status === 'APPROVED' ? '#047857' : s.status === 'REJECTED' ? '#B91C1C' : '#3730A3' }}>
                              {s.reviewedByName}
                            </strong>
                            <div style={{ fontSize: '10px', color: '#64748B' }}>
                              {s.reviewedByDesignation || 'Competent Authority (LAO)'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => { setSelectedSurvey(s); setReviewRemarks(s.reviewRemarks || ''); }}
                          style={{ background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} /> {s.status === 'PENDING_REVIEW' ? 'Review & Decide' : 'View Decision'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSurvey && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Review Survey Submission: {selectedSurvey.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Submitted by {selectedSurvey.submittedByName} ({selectedSurvey.submittedByEmployeeId})</span>
              </div>
              <button 
                onClick={() => setSelectedSurvey(null)} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              
              {/* Official Review Endorsement Banner (if already reviewed) */}
              {selectedSurvey.status !== 'PENDING_REVIEW' && (
                <div style={{
                  background: selectedSurvey.status === 'APPROVED' ? '#F0FDF4' : selectedSurvey.status === 'REJECTED' ? '#FEF2F2' : '#EFF6FF',
                  border: `1.5px solid ${selectedSurvey.status === 'APPROVED' ? '#86EFAC' : selectedSurvey.status === 'REJECTED' ? '#FCA5A5' : '#93C5FD'}`,
                  borderRadius: '10px',
                  padding: '14px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: selectedSurvey.status === 'APPROVED' ? '#166534' : selectedSurvey.status === 'REJECTED' ? '#991B1B' : '#1E40AF' }}>
                      <ShieldAlert size={16} /> Official Statutory Decision & Endorsement
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: selectedSurvey.status === 'APPROVED' ? '#DCFCE7' : selectedSurvey.status === 'REJECTED' ? '#FEE2E2' : '#DBEAFE',
                      color: selectedSurvey.status === 'APPROVED' ? '#15803D' : selectedSurvey.status === 'REJECTED' ? '#991B1B' : '#1E40AF'
                    }}>
                      {selectedSurvey.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>REVIEWING OFFICER</span>
                      <strong style={{ color: '#0F172A', fontSize: '13px' }}>{selectedSurvey.reviewedByName || 'Competent Authority'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>DESIGNATION & AUTHORITY</span>
                      <strong style={{ color: '#0F172A' }}>{selectedSurvey.reviewedByDesignation || 'Land Acquisition Officer'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>ADMINISTRATIVE JURISDICTION</span>
                      <strong style={{ color: '#0F172A' }}>{selectedSurvey.reviewedByMinistry || `${selectedSurvey.districtName || 'District'} Collectorate`}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>DATE & TIME OF DECISION</span>
                      <strong style={{ color: '#0F172A' }}>
                        {selectedSurvey.reviewedAt ? new Date(selectedSurvey.reviewedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recorded in Audit Trail'}
                      </strong>
                    </div>
                  </div>

                  {selectedSurvey.reviewRemarks && (
                    <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '8px', marginTop: '6px' }}>
                      <span style={{ color: '#64748B', fontSize: '11px', display: 'block', fontWeight: 600 }}>OFFICIAL EVALUATION & REMARKS:</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#1E293B', fontStyle: 'italic' }}>
                        "{selectedSurvey.reviewRemarks}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>PROJECT</span>
                  <strong>{selectedSurvey.projectName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>KHASRA & VILLAGE</span>
                  <strong>Plot No. {selectedSurvey.khasraNo} ({selectedSurvey.villageNameMouza || 'N/A'})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>SURVEYED AREA</span>
                  <strong>{selectedSurvey.areaSurveyed} Hectares</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>LAND CATEGORY & SOIL</span>
                  <strong>{selectedSurvey.landCategory} {selectedSurvey.soilClassification ? `(${selectedSurvey.soilClassification})` : ''}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>ENCUMBRANCE STATUS</span>
                  <span style={{ color: selectedSurvey.encumbranceStatus === 'No Encumbrance' ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                    {selectedSurvey.encumbranceStatus}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>GPS COORDINATES</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#1D4ED8' }}>
                    <MapPin size={13} /> {selectedSurvey.gpsLatitude}°, {selectedSurvey.gpsLongitude}°
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>STRUCTURES PRESENT</span>
                  <strong>{selectedSurvey.structuresPresent ? 'Yes (Requires Valuation)' : 'No'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 700 }}>TREES / CROPS COUNT</span>
                  <strong>{selectedSurvey.treesCount || 0} Trees</strong>
                </div>
              </div>

              {selectedSurvey.remarks && (
                <div>
                  <span style={{ color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Field Officer Survey Remarks</span>
                  <div style={{ background: '#EFF6FF', padding: '10px 12px', borderRadius: '7px', color: '#1E40AF', borderLeft: '3px solid #3B82F6', fontStyle: 'italic' }}>
                    "{selectedSurvey.remarks}"
                  </div>
                </div>
              )}

              {/* Photo Evidence */}
              {selectedSurvey.photoUrl ? (
                <div>
                  <span style={{ color: '#475569', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Photo Evidence Attachment</span>
                  <img 
                    src={selectedSurvey.photoUrl} 
                    alt="Geo-tagged field evidence" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F1F5F9' }} 
                  />
                </div>
              ) : (
                <div style={{ padding: '10px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', color: '#64748B', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} /> No photo uploaded for this parcel.
                </div>
              )}

              {/* Review Section (for pending surveys) */}
              {selectedSurvey.status === 'PENDING_REVIEW' && (
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '4px' }}>
                  <label style={{ color: '#0F172A', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                    Competent Authority / Collector Decision Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter evaluation, award details, or reasons for rejection/returned requests..."
                    value={reviewRemarks}
                    onChange={e => setReviewRemarks(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#F8FAFC', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button 
                onClick={() => setSelectedSurvey(null)}
                style={{ padding: '8px 14px', background: '#FFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Window
              </button>
              
              {selectedSurvey.status === 'PENDING_REVIEW' && (
                <>
                  <button 
                    onClick={() => handleReviewAction(selectedSurvey.id, 'RETURN_FOR_REVISION')}
                    disabled={submittingReview}
                    style={{ padding: '8px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', color: '#1D4ED8', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RotateCcw size={14} /> Return to FO
                  </button>
                  <button 
                    onClick={() => handleReviewAction(selectedSurvey.id, 'REJECT')}
                    disabled={submittingReview}
                    style={{ padding: '8px 14px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '6px', color: '#DC2626', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <XCircle size={14} /> Reject Survey
                  </button>
                  <button 
                    onClick={() => handleReviewAction(selectedSurvey.id, 'APPROVE')}
                    disabled={submittingReview}
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}
                  >
                    <CheckCircle2 size={14} /> Approve & Validate
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

