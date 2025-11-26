import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className={cn(
            'relative bg-white dark:bg-secondary-800 shadow-strong dark:shadow-none dark:border dark:border-secondary-700 w-full',
            'transform transition-all duration-300 ease-out',
            'animate-in zoom-in-95 slide-in-from-bottom-4',
            'rounded-t-2xl sm:rounded-xl',
            'max-h-[90vh] sm:max-h-none',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary-200 dark:border-secondary-700">
            {title && (
              <h2 className="text-base sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 pr-2">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="ml-auto text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300 transition-colors p-1"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 max-h-[calc(90vh-8rem)] sm:max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-secondary-200 dark:border-secondary-700">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
