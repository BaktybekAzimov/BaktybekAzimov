import React from 'react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, ...props }, ref) => {
    const { t } = useLanguage();
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
            {label}
            {props.required && <span className="text-error-500 dark:text-error-400 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border transition-colors',
            'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent',
            'disabled:bg-secondary-50 dark:disabled:bg-secondary-900 disabled:cursor-not-allowed',
            error
              ? 'border-error-500 dark:border-error-400 focus:ring-error-500 dark:focus:ring-error-400'
              : 'border-secondary-300 dark:border-secondary-600',
            className
          )}
          {...props}
        >
          <option value="">{placeholder || t('common.select')}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
