import { Request, Response } from 'express';
import { getDatabaseStore } from '../config/database';

export async function getAllRR(req: Request, res: Response): Promise<void> {
  const store = getDatabaseStore();
  const projectId = req.query.projectId as string;
  const status = req.query.status as string;
  const searchQuery = (req.query.search as string || '').toLowerCase().trim();

  let results = store.affectedFamilies;

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
