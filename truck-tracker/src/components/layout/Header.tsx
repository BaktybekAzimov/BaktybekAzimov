import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {actions}
            <button className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
