import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = 'Ошибка',
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white dark:bg-secondary-800 rounded-xl shadow-strong dark:shadow-none dark:border dark:border-secondary-700 w-full max-w-md transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-error-200 dark:border-error-800 bg-error-50 dark:bg-error-900/30 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-100 dark:bg-error-900/50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <h2 className="text-lg font-semibold text-error-700 dark:text-error-300">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-error-400 hover:text-error-600 dark:text-error-500 dark:hover:text-error-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-secondary-700 dark:text-secondary-300 text-base leading-relaxed">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 flex justify-end">
            <Button onClick={onClose} variant="primary">
              Понятно
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
