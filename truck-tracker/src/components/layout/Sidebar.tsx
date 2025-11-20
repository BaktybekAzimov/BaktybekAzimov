import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Car,
  MapPin,
  FileText,
  LogOut,
  Settings as SettingsIcon,
  Menu,
  X,
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
    <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col h-screen sticky top-0">
      {/* Logo with Toggle Button */}
      <div className="px-6 py-6 border-b border-secondary-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900">{t('app.title')}</h1>
              <p className="text-xs text-secondary-500">{t('app.subtitle')}</p>
            </div>
          </div>
          {/* Toggle button inside sidebar */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationKeys
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => (
            <NavLink
              key={item.key}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {t(item.key)}
            </NavLink>
          ))}
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-4 border-t border-secondary-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-secondary-900">{user?.email}</p>
          <p className="text-xs text-secondary-500 capitalize">
            {user?.role === 'admin' && t('role.admin')}
            {user?.role === 'dispatcher' && t('role.dispatcher')}
            {user?.role === 'driver' && t('role.driver')}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
};
