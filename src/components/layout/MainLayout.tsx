import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen max-w-full bg-secondary-50 dark:bg-secondary-950 transition-colors duration-200">
      {/* Sidebar - всегда видимый */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-x-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
