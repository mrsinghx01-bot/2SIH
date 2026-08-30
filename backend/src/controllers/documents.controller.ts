import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import PDFDocument from 'pdfkit';

export async function getAllDocuments(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const projectId = req.query.projectId as string;
  const caseId = req.query.caseId as string;
  const type = req.query.type as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  let results = store.documents;

  if (projectId) {
    results = results.filter(d => d.projectId === projectId);
  }

  if (caseId) {
    results = results.filter(d => d.caseId === caseId);
  }

  if (type) {
    results = results.filter(d => d.documentType === type);
  }

  if (searchQuery) {
    results = results.filter(d =>
      d.title.toLowerCase().includes(searchQuery) ||
      d.fileName.toLowerCase().includes(searchQuery)
    );
  }

  res.json({
    success: true,
    data: results,
    total: results.length,
    message: 'Documents retrieved.'
  });
}

export async function uploadDocument(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const { projectId, caseId, documentType, title, fileName } = req.body;

  const doc = {
    id: `doc-${Date.now()}`,
    projectId: projectId || null,
    caseId: caseId || null,
    documentType: documentType || 'OTHER',
    title: title || 'Uploaded Document',
    fileName: fileName || `doc_${Date.now()}.pdf`,
    filePath: `/storage/documents/${fileName || 'doc.pdf'}`,
    fileSize: 1024 * 1024 * 2,
    mimeType: 'application/pdf',
    version: '1.0',
    uploadedBy: req.user?.name || 'Officer',
    dataSource: 'DEMO',
    createdAt: new Date()
  };

  store.documents.unshift(doc);

  res.status(201).json({
    success: true,
    data: doc,
    message: 'Document uploaded successfully.'
  });
}

export async function streamDocumentPdf(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const store = getDatabaseStore();

  const doc = store.documents.find(d => d.id === id || d.fileName.includes(id));
  const projId = doc ? doc.projectId : id;
  const project = store.projects.find(p => p.id === projId || p.projectCode === id) || store.projects[0];
  const acCase = doc && doc.caseId ? store.acquisitionCases.find(c => c.id === doc.caseId) : store.acquisitionCases.find(c => c.projectId === project.id);
  const pDists = store.projectDistricts.filter(pd => pd.projectId === project.id);
  const stateNames = Array.from(new Set(pDists.map(pd => store.states.find(s => s.id === pd.stateId)?.name).filter(Boolean))).join(', ') || 'India';
  const districtNames = Array.from(new Set(pDists.map(pd => store.districts.find(d => d.id === pd.districtId)?.name).filter(Boolean))).join(', ') || 'District Collectorate';
  const projectParcels = store.parcels.filter(p => p.projectId === project.id);

  const pdfDoc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: doc ? doc.title : `Official Gazette Notification - ${project.name}`,
      Author: 'Government of India - Land Acquisition Repository',
      Subject: 'Statutory Gazette Notification & Land Acquisition Schedule'
    }
  });

  const safeFilename = doc ? doc.fileName : `Official_Gazette_${project.projectCode}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

  pdfDoc.pipe(res);

  // 🏛️ Official Top Header
  pdfDoc.font('Helvetica-Bold').fontSize(14).text('भारत का राजपत्र : असाधारण', { align: 'center' });
  pdfDoc.fontSize(12).text('THE GAZETTE OF INDIA : EXTRAORDINARY', { align: 'center' });
  pdfDoc.font('Helvetica').fontSize(9).text('भाग II—खण्ड 3—उप-खण्ड (ii) | PART II—Section 3—Sub-section (ii)', { align: 'center' });
  pdfDoc.font('Helvetica-Bold').fontSize(9.5).text('प्राधिकार से प्रकाशित / PUBLISHED BY AUTHORITY', { align: 'center' });
  pdfDoc.moveDown(0.5);

  // Double horizontal rule
  pdfDoc.lineWidth(1.2).moveTo(40, pdfDoc.y).lineTo(555, pdfDoc.y).stroke();
  pdfDoc.moveDown(0.2);
  pdfDoc.lineWidth(0.5).moveTo(40, pdfDoc.y).lineTo(555, pdfDoc.y).stroke();
  pdfDoc.moveDown(1);

  // Ministry & Gazette Metadata
  pdfDoc.font('Helvetica-Bold').fontSize(11).text(project.ministry.toUpperCase(), { align: 'center' });
  pdfDoc.fontSize(12).text('STATUTORY GAZETTE NOTIFICATION', { align: 'center' });
  pdfDoc.moveDown(0.5);

  const notifRef = acCase ? `S.O. ${3000 + parseInt(project.id.replace(/[^0-9]/g, '') || '101', 10)}(E) / ${project.projectCode}` : `Ref: ${project.projectCode}/GAZETTE/2026`;
  const notifDateStr = new Date(project.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  pdfDoc.font('Helvetica-Bold').fontSize(9).text(`Gazette Notification Ref: ${notifRef}`, 40, pdfDoc.y, { continued: true });
  pdfDoc.font('Helvetica').text(`    |    New Delhi, Dated: ${notifDateStr}`, { align: 'right' });
  pdfDoc.moveDown(1.5);

  // Project Title Card Box
  const boxY = pdfDoc.y;
  pdfDoc.rect(40, boxY, 515, 52).fillAndStroke('#F8FAFC', '#CBD5E1');
  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text(`PROJECT: ${project.name} (${project.projectCode})`, 48, boxY + 8);
  pdfDoc.font('Helvetica').fontSize(8.5).text(`Implementing Agency: ${project.implementingAgency}  |  State/UT: ${stateNames}  |  District(s): ${districtNames}`, 48, boxY + 22);
  pdfDoc.text(`Total Land Requirement: ${project.totalLandRequired} Hectares  |  Statutory Act: RFCTLARR Act 2013 / Section 3A NH Act`, 48, boxY + 36);
  pdfDoc.moveDown(3);

  // Preamble Legal Text
  pdfDoc.fillColor('#000000').font('Helvetica').fontSize(9);
  pdfDoc.text(`WHEREAS, in exercise of the powers conferred by Section 3A of the National Highways Act, 1956 (48 of 1956) / Section 11 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (30 of 2013), the Central Government, after due consultation with the Competent Land Acquisition Authority of ${districtNames} (${stateNames}), hereby declares its statutory intention to acquire the land parcels specified in the Schedule below for public purpose, namely for building, maintenance, management and expansion of ${project.name}.`, { align: 'justify', lineGap: 3 });
  pdfDoc.moveDown(1);

  pdfDoc.text(`AND WHEREAS, any person interested in the said land may, within twenty-one days from the date of publication of this notification in the Official Gazette, submit objections in writing specifying the grounds thereof to the Competent Land Acquisition Collectorate at ${districtNames}.`, { align: 'justify', lineGap: 3 });
  pdfDoc.moveDown(1.5);

  // Schedule Table Header
  pdfDoc.font('Helvetica-Bold').fontSize(10).text('SCHEDULE OF LAND PARCELS TO BE ACQUIRED', { align: 'center' });
  pdfDoc.moveDown(0.8);

  // Table Drawing
  const startY = pdfDoc.y;
  pdfDoc.rect(40, startY, 515, 18).fillAndStroke('#0F172A', '#0F172A');
  pdfDoc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8);
  pdfDoc.text('S.No.', 45, startY + 5);
  pdfDoc.text('Village Name', 80, startY + 5);
  pdfDoc.text('Khasra / Survey No.', 180, startY + 5);
  pdfDoc.text('Land Classification', 310, startY + 5);
  pdfDoc.text('Area (Ha)', 420, startY + 5);
  pdfDoc.text('Status', 485, startY + 5);

  let currentY = startY + 18;
  pdfDoc.fillColor('#000000').font('Helvetica').fontSize(8);

  const displayParcels = projectParcels.length > 0 ? projectParcels.slice(0, 10) : [
    { parcelNumber: `KH-${project.projectCode}-101/1`, village: 'Ranhera', landUse: 'AGRICULTURAL', areaHectares: 2.45, acquisitionStatus: 'SURVEYED' },
    { parcelNumber: `KH-${project.projectCode}-102/2`, village: 'Rohi', landUse: 'RESIDENTIAL', areaHectares: 1.80, acquisitionStatus: 'AWARDED' },
    { parcelNumber: `KH-${project.projectCode}-103/1`, village: 'Shahpur', landUse: 'AGRICULTURAL', areaHectares: 3.10, acquisitionStatus: 'ACQUIRED' }
  ];

  displayParcels.forEach((p, idx) => {
    if (currentY > 740) {
      pdfDoc.addPage();
      currentY = 40;
    }
    const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    pdfDoc.rect(40, currentY, 515, 16).fillAndStroke(bg, '#E2E8F0');
    pdfDoc.fillColor('#0F172A');
    pdfDoc.text(`${idx + 1}`, 45, currentY + 4);
    pdfDoc.text(p.village || 'Survey Village', 80, currentY + 4);
    pdfDoc.text(p.parcelNumber || `KH-10${idx}/1`, 180, currentY + 4);
    pdfDoc.text(p.landUse || 'AGRICULTURAL', 310, currentY + 4);
    pdfDoc.text(`${p.areaHectares || 1.5} Ha`, 420, currentY + 4);
    pdfDoc.text(p.acquisitionStatus || 'SURVEYED', 485, currentY + 4);
    currentY += 16;
  });

  pdfDoc.y = currentY + 20;

  // Signature Block
  if (pdfDoc.y > 700) pdfDoc.addPage();

  pdfDoc.font('Helvetica-Bold').fontSize(8.5).text('BY ORDER AND IN THE NAME OF THE PRESIDENT OF INDIA', 40, pdfDoc.y, { align: 'right' });
  pdfDoc.moveDown(1.5);
  pdfDoc.font('Helvetica').fontSize(8).text('Digitally Authenticated & Digitally Sealed by:', 40, pdfDoc.y, { align: 'right' });
  pdfDoc.font('Helvetica-Bold').fontSize(8.5).text(`Competent Authority (Land Acquisition), ${districtNames}`, 40, pdfDoc.y, { align: 'right' });
  pdfDoc.font('Helvetica').fontSize(7.5).text(`Ministry Ref: ${project.ministry} / NLAMS Digital Repository`, 40, pdfDoc.y, { align: 'right' });

  // Footer stamp
  pdfDoc.rect(40, 780, 515, 20).fill('#F1F5F9');
  pdfDoc.fillColor('#475569').font('Helvetica').fontSize(7.5).text(`Central Land Acquisition Repository System (NLAMS)  •  Official Digital Copy  •  Document Ref ID: ${doc ? doc.id : project.id}`, 45, 786, { align: 'center' });

  pdfDoc.end();
}
