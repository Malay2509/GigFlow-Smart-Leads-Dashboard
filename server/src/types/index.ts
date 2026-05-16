export interface JwtPayload {
  id: string;
  role: 'admin' | 'sales';
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}
