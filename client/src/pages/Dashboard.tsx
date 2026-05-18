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

  // Calculate statistics from the current leads list
  const totalLeadsCount = pagination.total || leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const qualifiedCount = leads.filter(l => l.status === 'Qualified').length;
  const conversionRate = leads.length > 0
    ? Math.round((qualifiedCount / leads.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <nav className="glass px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <h1 className="text-2xl font-display font-extrabold text-gradient">Smart Leads</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:scale-110 transition-all duration-200" aria-label="Toggle Dark Mode">
            {isDark ? (
              <svg className="w-5 h-5 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{user?.name}</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm capitalize transition-all duration-200 ${
              isAdmin 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-amber-500/5' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-blue-500/5'
            }`}>{user?.role}</span>
          </div>
          <button onClick={logout} className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold transition hover:scale-105 duration-200">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Executive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          {/* Card 1: Total Leads */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Leads</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 group-hover:text-blue-500 dark:group-hover:text-brand-400 transition-colors">
                {totalLeadsCount}
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-brand-500 transition-all duration-300 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Card 2: New Leads */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">New Leads</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {newLeadsCount}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Conversion Rate */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 group-hover:text-indigo-500 transition-colors">
                {conversionRate}%
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
          </div>

          {/* Card 4: Qualified Leads */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Qualified Leads</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 group-hover:text-purple-500 transition-colors">
                {qualifiedCount}
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search & Filters Panel */}
        <div className="flex flex-wrap items-center gap-4 mb-8 glass p-5 rounded-2xl animate-fade-in-up">
          <div className="flex-1 min-w-[240px] relative">
            <input type="text" placeholder="Search leads..." className="w-full bg-white/50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm" value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <select className="bg-white/50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">All Statuses</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Lost">Lost</option>
          </select>
          <select className="bg-white/50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer" value={filters.source} onChange={(e) => setFilters({ source: e.target.value })}>
            <option value="">All Sources</option><option value="Website">Website</option><option value="Instagram">Instagram</option><option value="Referral">Referral</option>
          </select>
          <select className="bg-white/50 dark:bg-dark-card/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer" value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as 'latest' | 'oldest' })}>
            <option value="latest">Latest</option><option value="oldest">Oldest</option>
          </select>
          <div className="flex gap-3 ml-auto w-full sm:w-auto">
            <button onClick={handleExport} className="w-full sm:w-auto bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-dark-border hover:scale-[1.03] active:scale-95 transition-all shadow-sm">Export CSV</button>
            <button onClick={openAddLead} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.03] active:scale-95 transition-all shadow-md shadow-indigo-500/20">Add Lead</button>
          </div>
        </div>

        {/* Dynamic Glass Table Container */}
        <div className="glass rounded-2xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10 animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/40 dark:divide-gray-700/40">
              <thead className="bg-gray-50/50 dark:bg-gray-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                {isLoading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />) : isError ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-rose-500 dark:text-rose-400 font-medium">Failed to load leads. <button onClick={refetch} className="underline font-semibold hover:text-rose-700 dark:hover:text-rose-300 ml-1">Retry</button></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-medium">No leads found matching your criteria.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-blue-500/5 dark:hover:bg-brand-500/5 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900 dark:text-white">{lead.name}</div><div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lead.email}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lead.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => openEditLead(lead)} className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-4 hover:underline transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                        {isAdmin && (
                          <button onClick={() => openDeleteModal(lead)} className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                          </button>
                        )}
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
