import { useState, useEffect, useCallback } from 'react';
import { getLeads } from '../api/leads';
import type { Lead, LeadFilters, PaginatedResponse } from '../types';
import { useDebounce } from './useDebounce';

const initialPagination = { total: 0, page: 1, limit: 10, totalPages: 0 };

export function useLeads(initialFilters: Partial<LeadFilters> = {}) {
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
    ...initialFilters,
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Lead>['pagination']>(initialPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const activeFilters = { ...filters, search: debouncedSearch };
      const response = await getLeads(activeFilters);
      setLeads(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setIsError(true);
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();
  }, [fetchLeads]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => {
      // If any filter other than 'page' changes, reset to page 1
      const isOnlyPageChange = Object.keys(newFilters).length === 1 && 'page' in newFilters;
      return {
        ...prev,
        ...newFilters,
        page: isOnlyPageChange ? (newFilters.page as number) : 1,
      };
    });
  };

  return {
    leads,
    pagination,
    isLoading,
    isError,
    filters,
    setFilters: updateFilters,
    refetch: fetchLeads,
  };
}
