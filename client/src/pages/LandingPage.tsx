import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export default function LandingPage() {
  const { token } = useAuth();
  
  useEffect(() => {
    document.title = 'Smart Leads - CRM';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4 transition-colors">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Smart Leads Dashboard
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
        The ultimate CRM for B2B lead management. Track, convert, and manage your sales pipeline efficiently.
      </p>
      {token ? (
        <Link to="/dashboard" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
            Sign In
          </Link>
          <Link to="/register" className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition shadow-sm">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}
