import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './Spinner';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Spinner className="w-8 h-8 text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  // If already logged in, redirect away from public auth pages (like Login/Register)
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
