import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Notification {
  id: string;
  type: 'trip' | 'vehicle' | 'driver';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Demo notifications using translations
  const getDemoNotifications = (): Notification[] => [
    {
      id: '1',
      type: 'trip',
      title: t('notifications.demo_new_trip'),
      message: t('notifications.demo_new_trip_msg'),
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'trip',
      title: t('notifications.demo_trip_completed'),
      message: t('notifications.demo_trip_completed_msg'),
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'vehicle',
      title: t('notifications.demo_maintenance'),
      message: t('notifications.demo_maintenance_msg'),
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
  ];

  const [notifications, setNotifications] = useState<Notification[]>(getDemoNotifications());

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.just_now');
    if (minutes < 60) return `${minutes} ${t('notifications.min_ago')}`;
    if (hours < 24) return `${hours} ${t('notifications.hours_ago')}`;
    return `${days} ${t('notifications.days_ago')}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return '🚚';
      case 'vehicle':
        return '🔧';
      case 'driver':
        return '👤';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all duration-200 group"
        aria-label={t('notifications.title')}
      >
        <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg dark:shadow-none border border-secondary-200 dark:border-secondary-700 z-50 animate-scale-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              {t('notifications.title')} {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                {t('notifications.mark_all')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-secondary-500 dark:text-secondary-400 text-sm">
                {t('notifications.no_notifications')}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-all duration-200 cursor-pointer ${
                    !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getIcon(notification.type)}</span>
                        <h4 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-secondary-400 dark:text-secondary-500">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="p-1 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded transition-all duration-200 group"
                    >
                      <X className="w-3 h-3 text-secondary-500 dark:text-secondary-400 group-hover:text-error-500 dark:group-hover:text-error-400 transition-colors duration-200" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
              {unreadCount === 0 ? (
                <span className="text-xs text-success-600 dark:text-success-400">
                  ✓ {t('notifications.all_read')}
                </span>
              ) : (
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {unreadCount} {t('notifications.title').toLowerCase()}
                </span>
              )}
              <button
                onClick={() => {
                  setNotifications([]);
                  setIsOpen(false);
                }}
                className="text-xs text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 font-medium transition-colors duration-200"
              >
                {t('notifications.clear_all')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
