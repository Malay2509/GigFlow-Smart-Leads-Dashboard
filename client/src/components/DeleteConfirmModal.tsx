import { useState } from 'react';
import { Spinner } from './Spinner';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  leadName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, leadName }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-transparent dark:border-gray-700 transition-colors" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-2">Delete Lead</h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">{leadName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3 justify-end rounded-b-xl border-t border-gray-200 dark:border-gray-700 transition-colors">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] gap-2 transition"
          >
            {isDeleting && <Spinner />}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
