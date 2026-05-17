import type { Lead } from '../types';

interface StatusBadgeProps {
  status: Lead['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-yellow-100 text-yellow-800',
    Qualified: 'bg-green-100 text-green-800',
    Lost: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
