import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
            {label}
            {props.required && <span className="text-error-500 dark:text-error-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 rounded-lg border transition-colors',
              'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100',
              'placeholder:text-secondary-400 dark:placeholder:text-secondary-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent',
              'disabled:bg-secondary-50 dark:disabled:bg-secondary-900 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error
                ? 'border-error-500 dark:border-error-400 focus:ring-error-500 dark:focus:ring-error-400'
                : 'border-secondary-300 dark:border-secondary-600',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
