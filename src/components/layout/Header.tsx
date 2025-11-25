import React from 'react';
import { Notifications } from '../ui/Notifications';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ComponentType<any>;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions, icon: Icon }) => {
  return (
    <header className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-10 transition-colors duration-200">
      <div className="px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title section */}
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-secondary-900 dark:text-secondary-100 truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-secondary-600 dark:text-secondary-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {actions}
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <ThemeToggle />
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
