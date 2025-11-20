import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ru' | 'ky';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Переводы
const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Общие
    'app.title': 'TruckTrack',
    'app.subtitle': 'Учёт рейсов',
    'app.system': 'Система учёта рейсов',

    // Навигация
    'nav.dashboard': 'Dashboard',
    'nav.trips': 'Рейсы',
    'nav.drivers': 'Водители',
    'nav.vehicles': 'Машины',
    'nav.routes': 'Маршруты',
    'nav.settings': 'Настройки',
    'nav.logout': 'Выйти',

    // Dashboard
    'dashboard.title': 'Дашборд',
    'dashboard.subtitle': 'Обзор бизнес-показателей',
    'dashboard.total_revenue': 'Общая выручка',
    'dashboard.total_trips': 'Всего рейсов',
    'dashboard.net_profit': 'Чистая прибыль',
    'dashboard.avg_profit': 'Средняя прибыль',
    'dashboard.revenue_chart': 'Выручка по дням',
    'dashboard.routes_chart': 'Рейсы по маршрутам (Топ 10)',
    'dashboard.recent_trips': 'Последние 10 рейсов',

    // Фильтры
    'filter.today': 'Сегодня',
    'filter.week': 'Неделя',
    'filter.month': 'Месяц',
    'filter.all': 'Всё время',

    // Рейсы
    'trips.title': 'Рейсы',
    'trips.add': 'Добавить рейс',
    'trips.total': 'Всего рейсов',
    'trips.date': 'Дата',
    'trips.driver': 'Водитель',
    'trips.vehicle': 'Автомобиль',
    'trips.route': 'Маршрут',
    'trips.revenue': 'Выручка',
    'trips.expenses': 'Расходы',
    'trips.profit': 'Прибыль',
    'trips.status': 'Статус',
    'trips.actions': 'Действия',

    // Водители
    'drivers.title': 'Водители',
    'drivers.add': 'Добавить водителя',
    'drivers.total': 'Всего водителей',
    'drivers.name': 'ИМЯ',
    'drivers.phone': 'ТЕЛЕФОН',
    'drivers.hire_date': 'ДАТА НАЙМА',
    'drivers.total_trips': 'ВСЕГО РЕЙСОВ',
    'drivers.total_payment': 'ОБЩИЕ ВЫПЛАТЫ',
    'drivers.avg_profit': 'СРЕДНЯЯ ПРИБЫЛЬ',
    'drivers.status': 'СТАТУС',
    'drivers.actions': 'ДЕЙСТВИЯ',

    // Транспорт
    'vehicles.title': 'Автомобили',
    'vehicles.add': 'Добавить автомобиль',
    'vehicles.total': 'Всего автомобилей',
    'vehicles.brand': 'Марка',
    'vehicles.model': 'Модель',
    'vehicles.plate': 'Номер',
    'vehicles.year': 'Год',
    'vehicles.total_trips': 'Всего рейсов',
    'vehicles.revenue': 'Выручка',
    'vehicles.profit': 'Прибыль',
    'vehicles.status': 'Статус',

    // Маршруты
    'routes.title': 'Маршруты',
    'routes.add': 'Добавить маршрут',
    'routes.total': 'Всего маршрутов',
    'routes.name': 'Название маршрута',
    'routes.distance': 'Расстояние (км)',
    'routes.avg_cost': 'Средняя стоимость',
    'routes.total_trips': 'Всего рейсов',
    'routes.total_revenue': 'Общая выручка',
    'routes.avg_revenue': 'Средняя выручка',

    // Настройки
    'settings.title': 'Настройки системы',
    'settings.subtitle': 'Управление параметрами приложения',
    'settings.save': 'Сохранить изменения',
    'settings.financial': 'Финансовые параметры',
    'settings.regional': 'Региональные настройки',
    'settings.driver_percentage': 'Процент выплаты водителю',
    'settings.currency': 'Валюта по умолчанию',
    'settings.language': 'Язык интерфейса',
    'settings.expense_types': 'Типы расходов',

    // Кнопки
    'button.edit': 'Изменить',
    'button.delete': 'Удалить',
    'button.add': 'Добавить',
    'button.save': 'Сохранить',
    'button.cancel': 'Отмена',

    // Статусы
    'status.completed': 'Завершён',
    'status.in_progress': 'В пути',
    'status.cancelled': 'Отменён',
    'status.active': 'Активен',
    'status.inactive': 'Неактивен',
    'status.available': 'Свободна',
    'status.in_trip': 'В рейсе',
    'status.maintenance': 'На ремонте',

    // Уведомления
    'notifications.title': 'Уведомления',
    'notifications.mark_all': 'Отметить все',
    'notifications.no_notifications': 'Нет уведомлений',
    'notifications.view_all': 'Посмотреть все',

    // Роли
    'role.admin': 'Администратор',
    'role.dispatcher': 'Диспетчер',
    'role.driver': 'Водитель',
  },
  ky: {
    // Общие
    'app.title': 'TruckTrack',
    'app.subtitle': 'Рейстерди эсепке алуу',
    'app.system': 'Рейстерди эсепке алуу системасы',

    // Навигация
    'nav.dashboard': 'Башкы бет',
    'nav.trips': 'Рейстер',
    'nav.drivers': 'Айдоочулар',
    'nav.vehicles': 'Унаалар',
    'nav.routes': 'Маршруттар',
    'nav.settings': 'Жөндөөлөр',
    'nav.logout': 'Чыгуу',

    // Dashboard
    'dashboard.title': 'Башкы бет',
    'dashboard.subtitle': 'Бизнес көрсөткүчтөрү',
    'dashboard.total_revenue': 'Жалпы киреше',
    'dashboard.total_trips': 'Бардыгы рейстер',
    'dashboard.net_profit': 'Таза пайда',
    'dashboard.avg_profit': 'Орточо пайда',
    'dashboard.revenue_chart': 'Күндөр боюнча киреше',
    'dashboard.routes_chart': 'Маршруттар боюнча рейстер (Топ 10)',
    'dashboard.recent_trips': 'Акыркы 10 рейс',

    // Фильтры
    'filter.today': 'Бүгүн',
    'filter.week': 'Апта',
    'filter.month': 'Ай',
    'filter.all': 'Баары',

    // Рейсы
    'trips.title': 'Рейстер',
    'trips.add': 'Рейс кошуу',
    'trips.total': 'Бардыгы рейстер',
    'trips.date': 'Күнү',
    'trips.driver': 'Айдоочу',
    'trips.vehicle': 'Унаа',
    'trips.route': 'Маршрут',
    'trips.revenue': 'Киреше',
    'trips.expenses': 'Чыгымдар',
    'trips.profit': 'Пайда',
    'trips.status': 'Абалы',
    'trips.actions': 'Аракеттер',

    // Водители
    'drivers.title': 'Айдоочулар',
    'drivers.add': 'Айдоочу кошуу',
    'drivers.total': 'Бардыгы айдоочулар',
    'drivers.name': 'АТЫ',
    'drivers.phone': 'ТЕЛЕФОН',
    'drivers.hire_date': 'ЖАЛДАНГАН КҮНҮ',
    'drivers.total_trips': 'БАРДЫГЫ РЕЙСТЕР',
    'drivers.total_payment': 'ЖАЛПЫ ТӨЛӨМДӨР',
    'drivers.avg_profit': 'ОРТОЧО ПАЙДА',
    'drivers.status': 'АБАЛЫ',
    'drivers.actions': 'АРАКЕТТЕР',

    // Транспорт
    'vehicles.title': 'Унаалар',
    'vehicles.add': 'Унаа кошуу',
    'vehicles.total': 'Бардыгы унаалар',
    'vehicles.brand': 'Маркасы',
    'vehicles.model': 'Модели',
    'vehicles.plate': 'Номери',
    'vehicles.year': 'Жылы',
    'vehicles.total_trips': 'Бардыгы рейстер',
    'vehicles.revenue': 'Киреше',
    'vehicles.profit': 'Пайда',
    'vehicles.status': 'Абалы',

    // Маршруты
    'routes.title': 'Маршруттар',
    'routes.add': 'Маршрут кошуу',
    'routes.total': 'Бардыгы маршруттар',
    'routes.name': 'Маршруттун аталышы',
    'routes.distance': 'Аралык (км)',
    'routes.avg_cost': 'Орточо наркы',
    'routes.total_trips': 'Бардыгы рейстер',
    'routes.total_revenue': 'Жалпы киреше',
    'routes.avg_revenue': 'Орточо киреше',

    // Настройки
    'settings.title': 'Системанын жөндөөлөрү',
    'settings.subtitle': 'Колдонмонун параметрлерин башкаруу',
    'settings.save': 'Өзгөртүүлөрдү сактоо',
    'settings.financial': 'Финансылык параметрлер',
    'settings.regional': 'Аймактык жөндөөлөр',
    'settings.driver_percentage': 'Айдоочуга төлөө пайызы',
    'settings.currency': 'Демейки валюта',
    'settings.language': 'Интерфейс тили',
    'settings.expense_types': 'Чыгым түрлөрү',

    // Кнопки
    'button.edit': 'Өзгөртүү',
    'button.delete': 'Өчүрүү',
    'button.add': 'Кошуу',
    'button.save': 'Сактоо',
    'button.cancel': 'Жокко чыгаруу',

    // Статусы
    'status.completed': 'Аяктаган',
    'status.in_progress': 'Жолдо',
    'status.cancelled': 'Жокко чыгарылган',
    'status.active': 'Активдүү',
    'status.inactive': 'Активдүү эмес',
    'status.available': 'Бош',
    'status.in_trip': 'Рейсте',
    'status.maintenance': 'Оңдоодо',

    // Уведомления
    'notifications.title': 'Билдирүүлөр',
    'notifications.mark_all': 'Баарын белгилөө',
    'notifications.no_notifications': 'Билдирүүлөр жок',
    'notifications.view_all': 'Баарын көрүү',

    // Роли
    'role.admin': 'Администратор',
    'role.dispatcher': 'Диспетчер',
    'role.driver': 'Айдоочу',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Загрузка из localStorage
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
    // Сохранение в localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
