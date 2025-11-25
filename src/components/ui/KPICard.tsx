import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBgColor = 'bg-primary-100',
  trend,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between transition-all duration-300">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-1 sm:mb-2 font-mono truncate">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium',
                  trend.isPositive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400">vs прошлый период</span>
            </div>
          )}
        </div>
        <div className={cn('p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0', iconBgColor)}>
          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:rotate-12', iconColor)} />
        </div>
      </div>
    </Card>
  );
};
