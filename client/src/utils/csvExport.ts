import type { Lead } from '../types';

export function exportLeadsToCSV(leads: Lead[]): void {
  if (!leads || leads.length === 0) return;

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  
  const csvRows = [
    headers.join(','), // Header row
    ...leads.map((lead) => {
      // Escape commas and quotes by wrapping in quotes
      const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;
      
      return [
        escape(lead.name),
        escape(lead.email),
        escape(lead.status),
        escape(lead.source),
        escape(new Date(lead.createdAt).toLocaleDateString()),
      ].join(',');
    }),
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'leads.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
