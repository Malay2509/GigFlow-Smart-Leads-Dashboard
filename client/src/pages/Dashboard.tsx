import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { useToast } from '../hooks/useToast';
import { StatusBadge } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';
import { SkeletonRow } from '../components/SkeletonRow';
import { LeadModal } from '../components/LeadModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { exportLeadsToCSV } from '../utils/csvExport';
import { deleteLead } from '../api/leads';
import type { Lead } from '../types';

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const { leads, pagination, isLoading, isError, filters, setFilters, refetch } = useLeads();
  const { showToast } = useToast();

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  useEffect(() => {
    document.title = 'Dashboard - Smart Leads';
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const openAddLead = () => { setLeadToEdit(null); setIsLeadModalOpen(true); };
  const openEditLead = (lead: Lead) => { setLeadToEdit(lead); setIsLeadModalOpen(true); };
  const openDeleteModal = (lead: Lead) => { setLeadToDelete(lead); setIsDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (leadToDelete) {
      try {
        await deleteLead(leadToDelete._id);
        showToast('Lead deleted successfully', 'success');
        refetch();
      } catch {
        showToast('Failed to delete lead', 'error');
      }
    }
  };

  const handleExport = () => {
    if (leads.length === 0) {
      showToast('No leads to export', 'error');
      return;
    }
    exportLeadsToCSV(leads);
    showToast('Leads exported successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center transition-colors">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Smart Leads</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Toggle Dark Mode">
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">{user?.role}</span>
          </div>
          <button onClick={logout} className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <input type="text" placeholder="Search leads..." className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] outline-none focus:ring-2 focus:ring-blue-500" value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />
          <select className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">All Statuses</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Lost">Lost</option>
          </select>
          <select className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={filters.source} onChange={(e) => setFilters({ source: e.target.value })}>
            <option value="">All Sources</option><option value="Website">Website</option><option value="Instagram">Instagram</option><option value="Referral">Referral</option>
          </select>
          <select className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as 'latest' | 'oldest' })}>
            <option value="latest">Latest</option><option value="oldest">Oldest</option>
          </select>
          <div className="flex gap-2 ml-auto">
            <button onClick={handleExport} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">Export CSV</button>
            <button onClick={openAddLead} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Add Lead</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />) : isError ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500 dark:text-red-400">Failed to load leads. <button onClick={refetch} className="underline hover:text-red-700 dark:hover:text-red-300">Retry</button></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No leads found matching your criteria.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lead.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => openEditLead(lead)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition">Edit</button>
                        {isAdmin && <button onClick={() => openDeleteModal(lead)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition">Delete</button>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoading && !isError && leads.length > 0 && <Pagination pagination={pagination} onPageChange={(page) => setFilters({ page })} />}
        </div>
      </main>

      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSuccess={() => { showToast(leadToEdit ? 'Lead updated' : 'Lead created', 'success'); refetch(); }} lead={leadToEdit} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} leadName={leadToDelete?.name || ''} />
    </div>
  );
}
