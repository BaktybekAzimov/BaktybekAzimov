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
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'trip',
      title: 'Новый рейс создан',
      message: 'Рейс #123 на маршрут Бишкек - Ош',
      timestamp: new Date(Date.now() - 5 * 60000), // 5 минут назад
      read: false,
    },
    {
      id: '2',
      type: 'trip',
      title: 'Рейс завершён',
      message: 'Рейс #122 успешно завершён. Прибыль: 15,000 с',
      timestamp: new Date(Date.now() - 30 * 60000), // 30 минут назад
      read: false,
    },
    {
      id: '3',
      type: 'vehicle',
      title: 'ТО транспорта',
      message: 'МАЗ 6430 (01KG456BB) требует техобслуживания',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 часа назад
      read: true,
    },
  ]);

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

    if (minutes < 1) return language === 'ru' ? 'только что' : 'эми эле';
    if (minutes < 60) return language === 'ru' ? `${minutes} мин назад` : `${minutes} мүн. мурун`;
    if (hours < 24) return language === 'ru' ? `${hours} ч назад` : `${hours} с. мурун`;
    return language === 'ru' ? `${days} д назад` : `${days} к. мурун`;
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
        className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors"
        aria-label={t('notifications.title')}
      >
        <Bell className="w-5 h-5 text-secondary-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-secondary-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-secondary-900">
              {t('notifications.title')} {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('notifications.mark_all')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-secondary-500 text-sm">
                {t('notifications.no_notifications')}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-secondary-100 hover:bg-secondary-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getIcon(notification.type)}</span>
                        <h4 className="text-sm font-semibold text-secondary-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-secondary-600 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-secondary-400">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="p-1 hover:bg-secondary-200 rounded transition-colors"
                    >
                      <X className="w-3 h-3 text-secondary-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-secondary-200">
              <button
                onClick={() => {
                  markAllAsRead();
                  setIsOpen(false);
                }}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('notifications.view_all')} →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
