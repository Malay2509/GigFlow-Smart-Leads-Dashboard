import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    document.title = 'Lead Details - Smart Leads';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block font-medium">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-6">Lead Details</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <p className="text-gray-600 dark:text-gray-300">
            Details for lead ID: <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-gray-800 dark:text-gray-200">{id}</span>
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Fetching individual lead data is ready to be implemented using the getLeadById API.
          </p>
        </div>
      </div>
    </div>
  );
}
