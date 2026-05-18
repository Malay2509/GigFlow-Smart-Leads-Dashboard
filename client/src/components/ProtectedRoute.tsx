import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './Spinner';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Spinner className="w-8 h-8 text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
