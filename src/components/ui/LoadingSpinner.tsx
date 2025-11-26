import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <Loader2 className={cn('animate-spin text-primary-600 dark:text-primary-400', sizes[size], className)} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-secondary-950 bg-opacity-75 dark:bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
