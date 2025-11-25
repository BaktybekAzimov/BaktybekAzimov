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
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{title}</h1>
              {subtitle && (
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {actions}
            <ThemeToggle />
            <Notifications />
          </div>
        </div>
      </div>
    </header>
  );
};
