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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Рейсы', href: '/trips', icon: Truck },
  { name: 'Водители', href: '/drivers', icon: Users },
  { name: 'Машины', href: '/vehicles', icon: Car },
  { name: 'Маршруты', href: '/routes', icon: MapPin },
];

export const Sidebar: React.FC = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-secondary-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">TruckTrack</h1>
            <p className="text-xs text-secondary-500">Учёт рейсов</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
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
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-4 border-t border-secondary-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-secondary-900">{user?.email}</p>
          <p className="text-xs text-secondary-500 capitalize">
            {user?.role === 'admin' && 'Администратор'}
            {user?.role === 'dispatcher' && 'Диспетчер'}
            {user?.role === 'driver' && 'Водитель'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Выйти
        </button>
      </div>
    </aside>
  );
};
