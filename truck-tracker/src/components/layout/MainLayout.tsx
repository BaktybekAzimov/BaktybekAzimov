import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen max-w-full bg-secondary-50 overflow-hidden">
      {/* Sidebar - фиксированная ширина, липкая позиция */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      {/* Main content - занимает оставшееся пространство */}
      <main className="flex-1 overflow-x-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
