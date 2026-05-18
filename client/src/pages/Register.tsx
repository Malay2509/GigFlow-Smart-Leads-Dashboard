import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { register as registerApi } from '../api/auth';
import { Spinner } from '../components/Spinner';
import axios from 'axios';
import type { ApiErrorResponse } from '../types';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['sales', 'admin']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    document.title = 'Register - Smart Leads';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'sales',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setApiError('');
      const res = await registerApi(data);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      let msg = 'An unexpected error occurred';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg = (err.response.data as ApiErrorResponse).message || msg;
      }
      setApiError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-transparent dark:border-gray-700 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Get started with Smart Leads
        </p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              disabled={isSubmitting}
              autoComplete="name"
              {...register('name')}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={isSubmitting}
              autoComplete="email"
              {...register('email')}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              disabled={isSubmitting}
              autoComplete="new-password"
              {...register('password')}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              disabled={isSubmitting}
              {...register('role')}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            >
              <option value="sales">Sales</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
