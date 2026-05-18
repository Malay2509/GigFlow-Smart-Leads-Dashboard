import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { createLead, updateLead } from '../api/leads';
import { Spinner } from './Spinner';
import type { Lead, ApiErrorResponse } from '../types';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

export function LeadModal({ isOpen, onClose, onSuccess, lead }: LeadModalProps) {
  const [apiError, setApiError] = useState('');
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
    },
  });

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiError('');
      if (lead) {
        reset({
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        });
      } else {
        reset({
          name: '',
          email: '',
          status: 'New',
          source: 'Website',
        });
      }
    }
  }, [isOpen, lead, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: LeadForm) => {
    try {
      setApiError('');
      if (isEditMode && lead) {
        await updateLead(lead._id, data);
      } else {
        await createLead(data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as ApiErrorResponse | undefined;
        setApiError(errorData?.message || 'Operation failed');
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-transparent dark:border-gray-700 transition-colors" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Lead' : 'Add Lead'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                disabled={isSubmitting}
                {...register('name')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled={isSubmitting}
                {...register('email')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                disabled={isSubmitting}
                {...register('status')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>}
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <select
                id="source"
                disabled={isSubmitting}
                {...register('source')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.source.message}</p>}
            </div>

            <div className="pt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] gap-2"
              >
                {isSubmitting && <Spinner />}
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Lead')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
