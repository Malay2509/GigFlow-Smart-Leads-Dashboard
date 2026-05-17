import api from './axios';
import type { Lead, LeadFilters, PaginatedResponse } from '../types';

interface LeadResponse {
  message: string;
  data: Lead;
}

export const getLeads = async (
  filters: LeadFilters
): Promise<PaginatedResponse<Lead>> => {
  const params: Record<string, string | number> = {};

  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;

  const res = await api.get<PaginatedResponse<Lead>>('/leads', { params });
  return res.data;
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const res = await api.get<{ data: Lead }>(`/leads/${id}`);
  return res.data.data;
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const res = await api.post<LeadResponse>('/leads', data);
  return res.data.data;
};

export const updateLead = async (
  id: string,
  data: Partial<Lead>
): Promise<Lead> => {
  const res = await api.put<LeadResponse>(`/leads/${id}`, data);
  return res.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};
