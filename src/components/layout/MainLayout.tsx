import React from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { Menu, Truck } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile, open } = useSidebar();

  return (
    <div className="flex min-h-screen max-w-full bg-secondary-50 dark:bg-secondary-950 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        {isMobile && (
          <header className="sticky top-0 z-30 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={open}
                className="p-2 -ml-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-secondary-700 dark:text-secondary-300" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                  TruckTracker
                </span>
              </div>

              <div className="w-10" /> {/* Spacer for balance */}
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
