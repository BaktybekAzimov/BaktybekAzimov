import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Car,
  MapPin,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

const navigationKeys = [
  { key: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.trips', href: '/trips', icon: Truck },
  { key: 'nav.drivers', href: '/drivers', icon: Users },
  { key: 'nav.vehicles', href: '/vehicles', icon: Car },
  { key: 'nav.routes', href: '/routes', icon: MapPin },
  { key: 'nav.settings', href: '/settings', icon: SettingsIcon, adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { signOut, user, isAdmin } = useAuth();
  const { isOpen, toggle } = useSidebar();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 flex flex-col h-screen sticky top-0 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo - всегда видимая кнопка */}
      <div className="border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-center py-6">
        <button
          onClick={toggle}
          className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Truck className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Navigation - всегда показывается */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {navigationKeys
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => (
            <NavLink
              key={item.key}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg transition-all duration-200',
                  'text-sm font-medium',
                  isOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{t(item.key)}</span>}
            </NavLink>
          ))}
      </nav>

      {/* User Info & Logout */}
      <div className={cn("py-4 border-t border-secondary-200 dark:border-secondary-700", isOpen ? "px-4" : "px-2")}>
        {isOpen && (
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">{user?.email}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
              {user?.role === 'admin' && t('role.admin')}
              {user?.role === 'dispatcher' && t('role.dispatcher')}
              {user?.role === 'driver' && t('role.driver')}
            </p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center rounded-lg text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-200",
            isOpen ? "gap-3 px-4 py-3" : "px-2 py-3 justify-center"
          )}
          title={!isOpen ? t('nav.logout') : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
