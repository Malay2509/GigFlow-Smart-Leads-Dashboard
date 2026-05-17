export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: 'latest' | 'oldest';
  page: number;
}
