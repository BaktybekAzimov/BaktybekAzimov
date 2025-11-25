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
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

type AllowedRole = 'admin' | 'dispatcher' | 'driver';

const navigationKeys: Array<{
  key: string;
  href: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
  allowedRoles?: AllowedRole[];
}> = [
  { key: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'dispatcher'] },
  { key: 'nav.trips', href: '/trips', icon: Truck },
  { key: 'nav.drivers', href: '/drivers', icon: Users, allowedRoles: ['admin', 'dispatcher'] },
  { key: 'nav.vehicles', href: '/vehicles', icon: Car, allowedRoles: ['admin', 'dispatcher'] },
  { key: 'nav.routes', href: '/routes', icon: MapPin, allowedRoles: ['admin', 'dispatcher'] },
  { key: 'nav.users', href: '/users', icon: Users, adminOnly: true },
  { key: 'nav.settings', href: '/settings', icon: SettingsIcon, adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { signOut, user, isAdmin } = useAuth();
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavClick = () => {
    // Закрываем сайдбар на мобильных при клике на ссылку
    if (isMobile) {
      close();
    }
  };

  // Мобильная версия - overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={close}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-72 bg-white dark:bg-secondary-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 leading-tight">
                  {t('sidebar.system_title')}
                </h1>
                <p className="text-xs text-secondary-500">{t('sidebar.system_subtitle')}</p>
              </div>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800"
            >
              <X className="h-5 w-5 text-secondary-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationKeys
              .filter((item) => {
                if (item.adminOnly && !isAdmin) return false;
                if (item.allowedRoles && user?.role) {
                  return item.allowedRoles.includes(user.role as AllowedRole);
                }
                return true;
              })
              .map((item) => (
                <NavLink
                  key={item.key}
                  to={item.href}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                      'text-base font-medium',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{t(item.key)}</span>
                </NavLink>
              ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">{user?.email}</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                {user?.role === 'admin' && t('role.admin')}
                {user?.role === 'dispatcher' && t('role.dispatcher')}
                {user?.role === 'driver' && t('role.driver')}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop версия
  return (
    <aside
      className={cn(
        "bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 flex flex-col h-screen sticky top-0 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo & Title */}
      <div className="border-b border-secondary-200 dark:border-secondary-700 py-6 px-4">
        <div className={cn("flex items-center gap-3", isOpen ? "justify-start" : "justify-center")}>
          <button
            onClick={toggle}
            className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Truck className="h-6 w-6 text-white" />
          </button>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-base font-bold text-secondary-900 dark:text-secondary-100 leading-tight">
                {t('sidebar.system_title')}<br />{t('sidebar.system_subtitle')}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {navigationKeys
          .filter((item) => {
            if (item.adminOnly && !isAdmin) return false;
            if (item.allowedRoles && user?.role) {
              return item.allowedRoles.includes(user.role as AllowedRole);
            }
            return true;
          })
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
