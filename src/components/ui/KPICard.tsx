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
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2 font-mono">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400">vs прошлый период</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl transition-all duration-300 group-hover:scale-110', iconBgColor)}>
          <Icon className={cn('h-6 w-6 transition-transform duration-300 group-hover:rotate-12', iconColor)} />
        </div>
      </div>
    </Card>
  );
};
