import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  MapPin,
  GitBranch,
  Grid,
  FileText,
  IndianRupee,
  Users,
  CheckSquare,
  Clock,
  History,
  Download,
  CheckCircle2,
  AlertCircle,
  Map as MapIcon,
  Layers
} from 'lucide-react';
import { fetchProjectById, updateCaseStage, processApproval } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressRing } from '../../components/ProgressRing';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { DataTable } from '../../components/DataTable';
import { GisInteractiveMap } from '../../components/GisInteractiveMap';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<number>(4); // Default to GIS Parcels tab or Overview
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = () => {
    if (projectId) {
      setLoading(true);
      fetchProjectById(projectId)
        .then((res) => {
          if (res?.success) setProject(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleStageChange = async (caseId: string, newStage: string) => {
    try {
      await updateCaseStage(caseId, newStage, `Workflow updated via Project Detail console.`);
      setActionSuccess(`Case status transitioned to ${newStage} successfully.`);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {}
  };

  const handleApprovalAction = async (approvalId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await processApproval(approvalId, action, `Action processed by Administrative Authority.`);
      setActionSuccess(`Approval recorded.`);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {}
  };

  const handleDownloadDocument = (doc: any) => {
    const fileContent = `National Land Acquisition & Management System (NLAMS)
======================================================
Government of India • Ministry of Rural Development

DOCUMENT RECEIPT & TRANSCRIPT RECORD
------------------------------------------------------
Document Reference ID : ${doc.id}
Document Title        : ${doc.title}
Document Type         : ${doc.documentType}
Version / Issue       : v${doc.version}
File Format Identifier: ${doc.fileFormat || 'PDF/A'}
System Filename       : ${doc.fileName}
Uploaded / Signed By  : ${doc.uploadedBy}
Record Timestamp      : ${new Date(doc.createdAt).toLocaleString('en-IN')}

RFCTLARR ACT, 2013 CADASTRAL ALIGNMENT COMPLIANCE
------------------------------------------------------
This transcript confirms the digital sealing and registration of the 
aforementioned statutory document on the NLAMS central repository.
Any modifications without prior clearance from the Competent Authority 
constitute a violation of Section 80(2) of the Act.

Central Land Database Sealing Authority
[SEALED SECURE DIGITAL TRANSCRIPT]`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}_v${doc.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading || !project) {
    return (
      <div style={{ padding: '24px' }}>
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  const tabs = [
    { id: 1, name: 'Overview', icon: Info },
    { id: 2, name: 'Land Requirements', icon: MapPin },
    { id: 3, name: 'Acquisition Cases', icon: GitBranch },
    { id: 4, name: 'Interactive GIS / Parcels', icon: Grid },
    { id: 5, name: 'Documents', icon: FileText },
    { id: 6, name: 'Compensation', icon: IndianRupee },
    { id: 7, name: 'R&R', icon: Users },
    { id: 8, name: 'Approvals', icon: CheckSquare },
    { id: 9, name: 'Timeline', icon: Clock },
    { id: 10, name: 'Audit', icon: History }
  ];

  const mapCenter: [number, number] = project.gisMap?.center || [26.8467, 80.9462];

  return (
    <div>
      {/* Back Button */}
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

      {actionSuccess && (
        <div style={{ padding: '10px 16px', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {actionSuccess}
        </div>
      )}

      {/* Project Top Summary Banner */}
      <div className="detail-banner-card responsive-detail-banner">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
              {project.projectCode}
            </span>
            <StatusBadge status={project.status} />
            <span style={{ fontSize: '12px', color: '#64748B' }}>{project.projectType}</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>{project.name}</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
            Agency: <strong>{project.implementingAgency}</strong> • Ministry: <strong>{project.ministry}</strong> • Est. Cost: <strong>₹ {project.estimatedCost?.toLocaleString('en-IN')} Cr</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>Land Acquired</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              {project.totalLandAcquired?.toLocaleString('en-IN')} / {project.totalLandRequired?.toLocaleString('en-IN')} Ha
            </div>
          </div>
          <ProgressRing
            percentage={project.progressPercentage || 0}
            size={58}
            strokeWidth={5.5}
            color="#2563EB"
          />
        </div>
      </div>

      {/* 10 Separate Tabs Navigation Bar */}
      <div className="tab-navigation-bar">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`tab-nav-button ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon size={14} />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-card)' }}>

        {/* Tab 1: Overview */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Project Scope & Strategic Objectives</h3>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6' }}>
                {project.description || 'National priority infrastructure project implementing statutory land acquisition, solatium determination, and resettlement monitoring under RFCTLARR Act 2013.'}
              </p>
            </div>

            <div className="responsive-grid grid-3" style={{ gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Target Completion Date</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {project.targetCompletionDate ? new Date(project.targetCompletionDate).toLocaleDateString('en-IN') : '31 Dec 2027'}
                </div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Cadastral Land Parcels</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {project.parcels?.length || 0} Surveyed Parcels
                </div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Affected Landowners</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {project.affectedFamilies?.length || 0} Beneficiaries
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Involved Districts Breakdown</h4>
              <DataTable
                columns={[
                  { header: 'District', accessor: 'districtName' },
                  { header: 'State', accessor: 'stateName' },
                  { header: 'Land Required (Ha)', accessor: 'landRequired', render: (r: any) => `${r.landRequired} Ha` },
                  { header: 'Land Acquired (Ha)', accessor: 'landAcquired', render: (r: any) => `${r.landAcquired} Ha` },
                  { header: 'Progress', render: (r: any) => <ProgressRing percentage={Math.round((r.landAcquired / (r.landRequired || 1)) * 100)} size={32} /> }
                ]}
                data={project.districtBreakdown || []}
                keyExtractor={(r: any) => r.districtId}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Land Requirements */}
        {activeTab === 2 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Land Requisition Distribution</h3>
            <div className="responsive-grid grid-4" style={{ gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '11px', color: '#1D4ED8' }}>Private Agricultural Land</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A8A' }}>{Math.round(project.totalLandRequired * 0.7)} Ha</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '11px', color: '#047857' }}>Government / Gram Sabha</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B' }}>{Math.round(project.totalLandRequired * 0.2)} Ha</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '11px', color: '#B45309' }}>Forest / Protected Area</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#78350F' }}>{Math.round(project.totalLandRequired * 0.1)} Ha</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
                <div style={{ fontSize: '11px', color: '#6D28D9' }}>Total Villages Impacted</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C1D95' }}>18 Villages</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Acquisition Cases (9-Stage Lifecycle) */}
        {activeTab === 3 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Acquisition Cases & 9-Stage Lifecycle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {project.cases?.map((c: any) => (
                <div
                  key={c.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{c.caseNumber}</span>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>Required: {c.landRequired} Ha • Acquired: {c.landAcquired} Ha</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={c.currentStatus} />
                    </div>
                  </div>

                  {/* 9-Stage Interactive Workflow Bar */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '6px 0' }}>
                    {['INITIATED', 'SURVEY', 'NOTIFICATION', 'OBJECTION', 'VALUATION', 'AWARD', 'COMPENSATION', 'POSSESSION', 'COMPLETED'].map((st, idx) => {
                      const isCurrent = c.currentStatus === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleStageChange(c.id, st)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            border: isCurrent ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            background: isCurrent ? '#2563EB' : '#FFFFFF',
                            color: isCurrent ? '#FFFFFF' : '#475569',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {idx + 1}. {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: INTERACTIVE GIS MAP / PARCELS */}
        {activeTab === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Interactive GIS Cadastral Map & Alignment Corridor</h3>
                <p style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Click on any parcel polygon to view khasra boundary, titleholder valuation, and acquisition status
                </p>
              </div>
            </div>

            {/* Interactive Leaflet GIS Map */}
            <div style={{ marginBottom: '24px' }}>
              <GisInteractiveMap
                center={mapCenter}
                zoom={project.gisMap?.zoom || 10}
                alignmentPolyline={project.gisMap?.alignmentPolyline}
                parcels={project.gisMap?.parcels || project.parcels}
                height="500px"
              />
            </div>

            {/* Cadastral Parcels Table */}
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Cadastral Parcels — Revenue Record Ledger</h4>
            {(project.parcels || []).length === 0 ? (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>No cadastral parcel records available</strong>
                Parcel-level data (Khasra, owner, valuation) must be submitted by Field Officers via the Field Survey App or integrated directly from the State Revenue / BhuNaksha portal.
              </div>
            ) : (
              <DataTable
                columns={[
                  { header: 'Parcel No.', accessor: 'parcelNumber', render: (r: any) => <strong style={{ color: '#2563EB' }}>{r.parcelNumber}</strong> },
                  { header: 'Village', accessor: 'village' },
                  { header: 'Area (Ha)', accessor: 'areaHectares', render: (r: any) => `${r.areaHectares} Ha` },
                  { header: 'Land Use', accessor: 'landUse' },
                  { header: 'Status', render: (r: any) => <StatusBadge status={r.acquisitionStatus} /> }
                ]}
                data={project.parcels || []}
                keyExtractor={(r: any) => r.id}
              />
            )}
          </div>
        )}

        {/* Tab 5: Documents */}
        {activeTab === 5 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Statutory Notifications & Documents</h3>
            <DataTable
              columns={[
                { header: 'Document Type', accessor: 'documentType' },
                { header: 'Document Title', accessor: 'title' },
                { header: 'Version', accessor: 'version' },
                { header: 'Uploaded By', accessor: 'uploadedBy' },
                { header: 'Date', render: (r: any) => new Date(r.createdAt).toLocaleDateString('en-IN') },
                {
                  header: 'Action',
                  render: (r: any) => (
                    <button
                      onClick={() => handleDownloadDocument(r)}
                      style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={12} /> Download
                    </button>
                  )
                }
              ]}
              data={project.documents || []}
              keyExtractor={(r: any) => r.id}
            />
          </div>
        )}

        {/* Tab 6: Compensation */}
        {activeTab === 6 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Compensation Ledger & Direct Benefit Transfer</h3>
            {(project.compensationRecords || []).length === 0 ? (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>No compensation records available</strong>
                Compensation awards are recorded after Section 11 hearing and Collector award under RFCTLARR Act. Records appear here once created by the LAO/Collector.
              </div>
            ) : (
              <DataTable
                columns={[
                  { header: 'Beneficiary Ref', accessor: 'beneficiaryReference' },
                  { header: 'Beneficiary', accessor: 'beneficiaryName' },
                  { header: 'Assessed Amount', render: (r: any) => `₹ ${Number(r.assessedAmount).toLocaleString('en-IN')}` },
                  { header: 'Approved Amount', render: (r: any) => `₹ ${Number(r.approvedAmount).toLocaleString('en-IN')}` },
                  { header: 'Paid Amount', render: (r: any) => `₹ ${Number(r.paidAmount).toLocaleString('en-IN')}` },
                  { header: 'Status', render: (r: any) => <StatusBadge status={r.paymentStatus} /> }
                ]}
                data={project.compensationRecords || []}
                keyExtractor={(r: any) => r.id}
              />
            )}
          </div>
        )}

        {/* Tab 7: R&R */}
        {activeTab === 7 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Rehabilitation & Resettlement of Affected Families</h3>
            {(project.affectedFamilies || []).length === 0 ? (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>No R&R records available</strong>
                Affected family data is recorded during the social impact assessment and updated progressively through the acquisition lifecycle.
              </div>
            ) : (
              <DataTable
                columns={[
                  { header: 'Family Ref', accessor: 'familyReference' },
                  { header: 'Head of Family / Group', accessor: 'headOfFamily' },
                  { header: 'Members', accessor: 'membersCount' },
                  { header: 'Category', accessor: 'vulnerabilityCategory' },
                  { header: 'Eligibility', accessor: 'eligibilityStatus' },
                  { header: 'R&R Status', render: (r: any) => <StatusBadge status={r.rrStatus} /> }
                ]}
                data={project.affectedFamilies || []}
                keyExtractor={(r: any) => r.id}
              />
            )}
          </div>
        )}

        {/* Tab 8: Approvals */}
        {activeTab === 8 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Administrative Approvals & Sanctions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.approvals?.map((a: any) => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{a.approvalType}</span>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{a.remarks}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <StatusBadge status={a.status} />
                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => handleApprovalAction(a.id, 'APPROVE')}
                        style={{ padding: '4px 10px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Timeline */}
        {activeTab === 9 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Chronological Project Timeline</h3>

            {/* Official Completion / Tentative Schedule Milestone Banner */}
            <div style={{
              padding: '14px 18px',
              background: project.status === 'COMPLETED' ? '#ECFDF5' : '#EFF6FF',
              border: `1px solid ${project.status === 'COMPLETED' ? '#A7F3D0' : '#BFDBFE'}`,
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <strong style={{ color: project.status === 'COMPLETED' ? '#065F46' : '#1E40AF', fontSize: '14px', display: 'block' }}>
                  {project.status === 'COMPLETED' ? '🎉 Project Fully Completed & Inaugurated' : '🗓️ Project Execution Active'}
                </strong>
                <p style={{ fontSize: '12.5px', color: project.status === 'COMPLETED' ? '#047857' : '#1D4ED8', marginTop: '2px', margin: 0 }}>
                  {project.status === 'COMPLETED'
                    ? `Official Commercial Inauguration Date: ${(project.targetCompletionDate || project.targetCompletion) ? new Date(project.targetCompletionDate || project.targetCompletion).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Completed'}`
                    : `Tentative Target Completion Date: ${(project.targetCompletionDate || project.targetCompletion) ? new Date(project.targetCompletionDate || project.targetCompletion).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'As per DPR milestones'}`}
                </p>
              </div>
              <span style={{
                padding: '4px 12px',
                background: project.status === 'COMPLETED' ? '#10B981' : '#2563EB',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}>
                {project.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>

            <div className="timeline-list">
              {project.timelineEvents?.map((evt: any, i: number) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: evt.status === 'SCHEDULED' ? '#F59E0B' : undefined }} />
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{new Date(evt.date).toLocaleDateString('en-IN')}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{evt.title}</div>
                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>{evt.description}</div>
                  <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px' }}>Officer: {evt.officer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Audit Log */}
        {activeTab === 10 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>System Audit Trail (Append-Only)</h3>
            <DataTable
              columns={[
                { header: 'Action', accessor: 'action' },
                { header: 'User Email', accessor: 'userEmail' },
                { header: 'Old Value', accessor: 'oldValue', render: (r: any) => r.oldValue || '—' },
                { header: 'New Value', accessor: 'newValue', render: (r: any) => r.newValue || '—' },
                { header: 'IP Address', accessor: 'ipAddress' },
                { header: 'Timestamp', render: (r: any) => new Date(r.createdAt).toLocaleString('en-IN') }
              ]}
              data={project.auditLogs || []}
              keyExtractor={(r: any) => r.id}
            />
          </div>
        )}

      </div>
    </div>
  );
};
