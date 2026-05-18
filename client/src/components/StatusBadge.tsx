import type { Lead } from '../types';

interface StatusBadgeProps {
  status: Lead['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    New: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5',
    Contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5',
    Qualified: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5',
    Lost: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/5',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${colors[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {status}
    </span>
  );
}
