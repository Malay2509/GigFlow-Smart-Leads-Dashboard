import { Request, Response } from 'express';
import { Lead, LeadStatus, LeadSource } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { LeadFilters } from '../types';

// GET /api/leads
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const {
    status,
    source,
    search,
    sort = 'latest',
    page = '1',
    limit = '10',
  } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  if (source) {
    filter.source = source;
  }

  if (search) {
    const regex = { $regex: search, $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit || '10', 10)));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  res.json({
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/leads/:id
export const getLeadById = asyncHandler(
  async (req: Request, res: Response) => {
    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    res.json({ data: lead });
  }
);

// POST /api/leads
export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, status, source } = req.body as {
    name: string;
    email: string;
    status?: LeadStatus;
    source: LeadSource;
  };

  if (!name || !email || !source) {
    throw new ApiError(400, 'Name, email, and source are required');
  }

  const lead = await Lead.create({
    name,
    email,
    status,
    source,
    createdBy: req.user!.id,
  });

  res.status(201).json({
    message: 'Lead created successfully',
    data: lead,
  });
});

// PUT /api/leads/:id
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  const { name, email, status, source } = req.body as {
    name?: string;
    email?: string;
    status?: LeadStatus;
    source?: LeadSource;
  };

  if (name !== undefined) lead.name = name;
  if (email !== undefined) lead.email = email;
  if (status !== undefined) lead.status = status;
  if (source !== undefined) lead.source = source;

  await lead.save();

  res.json({
    message: 'Lead updated successfully',
    data: lead,
  });
});

// DELETE /api/leads/:id
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  res.json({
    message: 'Lead deleted successfully',
  });
});

// hello
