import React from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="flex min-h-screen max-w-full bg-secondary-50 overflow-hidden">
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${!isOpen && 'lg:w-0 lg:overflow-hidden'}
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with menu button */}
        <div className="bg-white border-b border-secondary-200 px-4 py-3 lg:px-6 flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-secondary-600" />
            ) : (
              <Menu className="w-6 h-6 text-secondary-600" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-secondary-900">
            Система учёта рейсов
          </h2>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
