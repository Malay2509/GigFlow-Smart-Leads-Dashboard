import { createContext } from 'react';

export type ToastType = 'success' | 'error';
export interface ToastMessage { id: string; message: string; type: ToastType; }

export interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
