import { Response } from 'express';
import { getDatabaseStore } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getAllRR(req: AuthRequest, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const user = req.user;
  let districtId = req.query.districtId as string;
  let stateId = req.query.stateId as string;
  const projectId = req.query.projectId as string;
  const status = req.query.status as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  // Enforce role-based geographic scope
  if (user && user.role !== 'CENTRAL_ADMIN' && user.role !== 'CENTRAL_OFFICER') {
    if (user.districtId) districtId = user.districtId;
    if (user.stateId) stateId = user.stateId;
  }

  let results = store.affectedFamilies;

  if (districtId) {
    results = results.filter(f => f.districtId === districtId);
  } else if (stateId) {
    const matchingDistIds = new Set(store.districts.filter(d => d.stateId === stateId).map(d => d.id));
    const matchingProjIds = new Set(store.projectDistricts.filter(pd => pd.stateId === stateId).map(pd => pd.projectId));
    results = results.filter(f => matchingDistIds.has(f.districtId) || matchingProjIds.has(f.projectId));
  }

  if (projectId) {
    results = results.filter(f => f.projectId === projectId);
  }

  if (status) {
    results = results.filter(f => f.rrStatus === status);
  }

  if (searchQuery) {
    results = results.filter(f =>
      f.headOfFamily.toLowerCase().includes(searchQuery) ||
      f.familyReference.toLowerCase().includes(searchQuery)
    );
  }

  const enriched = results.map(f => {
    const rr = store.rrRecords.find(r => r.affectedFamilyId === f.id);
    const proj = store.projects.find(p => p.id === f.projectId);
    const dist = store.districts.find(d => d.id === f.districtId);
    return {
      ...f,
      rrRecord: rr,
      projectName: proj ? proj.name : 'Unknown',
      districtName: dist ? dist.name : 'Unknown'
    };
  });

  res.json({
    success: true,
    data: enriched,
    total: enriched.length,
    message: 'Rehabilitation & Resettlement records retrieved.'
  });
}
