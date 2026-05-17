import api from './axios';
import type { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (
  data: RegisterData
): Promise<{ token: string; user: User }> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return { token: res.data.token, user: res.data.user };
};

export const login = async (
  data: LoginData
): Promise<{ token: string; user: User }> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return { token: res.data.token, user: res.data.user };
};
