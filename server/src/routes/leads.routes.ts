import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadsController';

const router = Router();

// GET    /api/leads       → list with filters & pagination
router.get('/', authenticate, getLeads);

// POST   /api/leads       → create a new lead
router.post('/', authenticate, createLead);

// GET    /api/leads/:id   → get single lead
router.get('/:id', authenticate, getLeadById);

// PUT    /api/leads/:id   → update a lead
router.put('/:id', authenticate, updateLead);

// DELETE /api/leads/:id   → admin-only delete
router.delete('/:id', authenticate, authorize('admin'), deleteLead);

export default router;
