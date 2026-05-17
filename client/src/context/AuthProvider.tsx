import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { AuthContext, type AuthContextValue } from './AuthContext';

// Read initial auth state synchronously — avoids setState inside useEffect
function getInitialAuth(): { token: string | null; user: User | null } {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    try {
      const parsed = JSON.parse(storedUser) as User;
      return { token: storedToken, user: parsed };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => getInitialAuth(), []);
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);
  const navigate = useNavigate();

  // isLoading is false from the start since we read localStorage synchronously
  const isLoading = false;

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, isAdmin, login, logout }),
    [user, token, isLoading, isAdmin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
