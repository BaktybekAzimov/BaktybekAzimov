import React from 'react';
import { Notifications } from '../ui/Notifications';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ComponentType<any>;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions, icon: Icon }) => {
  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {actions}
            <Notifications />
          </div>
        </div>
      </div>
    </header>
  );
};
