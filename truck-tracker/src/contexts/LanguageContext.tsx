import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
    'nav.users': 'Пользователи',
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
    'dashboard.analytics': 'Аналитика',

    // Фильтры
    'filter.today': 'Сегодня',
    'filter.week': 'Неделя',
    'filter.month': 'Месяц',
    'filter.all': 'Всё время',
    'filter.from': 'От',
    'filter.to': 'До',
    'filter.search': 'Поиск',

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
    'trips.fuel_cost': 'Расход на топливо',
    'trips.maintenance_cost': 'Расход на ремонт',
    'trips.other_costs': 'Прочие расходы',
    'trips.search_placeholder': 'Поиск по водителю, автомобилю или маршруту...',

    // Водители
    'drivers.title': 'Водители',
    'drivers.add': 'Добавить водителя',
    'drivers.total': 'Всего водителей',
    'drivers.name': 'ИМЯ',
    'drivers.full_name': 'Полное имя',
    'drivers.phone': 'ТЕЛЕФОН',
    'drivers.hire_date': 'ДАТА НАЙМА',
    'drivers.total_trips': 'ВСЕГО РЕЙСОВ',
    'drivers.total_payment': 'ОБЩИЕ ВЫПЛАТЫ',
    'drivers.avg_profit': 'СРЕДНЯЯ ПРИБЫЛЬ',
    'drivers.status': 'СТАТУС',
    'drivers.actions': 'ДЕЙСТВИЯ',
    'drivers.notes': 'Заметки',
    'drivers.payments': 'Выплаты',

    // Транспорт
    'vehicles.title': 'Автомобили',
    'vehicles.add': 'Добавить автомобиль',
    'vehicles.total': 'Всего автомобилей',
    'vehicles.brand': 'Марка',
    'vehicles.model': 'Модель',
    'vehicles.plate': 'Номер',
    'vehicles.license_plate': 'Номер (госномер)',
    'vehicles.year': 'Год',
    'vehicles.year_label': 'Год выпуска',
    'vehicles.total_trips': 'Всего рейсов',
    'vehicles.revenue': 'Выручка',
    'vehicles.profit': 'Прибыль',
    'vehicles.status': 'Статус',
    'vehicles.notes': 'Заметки',
    'vehicles.brand_placeholder': 'Например: Volvo',
    'vehicles.model_placeholder': 'Например: FH16',
    'vehicles.plate_placeholder': 'Например: 01ABC123',

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
    'routes.standard_price': 'Стандартная цена рейса',
    'routes.name_placeholder': 'Например: Бишкек - Алматы',
    'routes.distance_placeholder': 'Например: 245.5',
    'routes.price_placeholder': 'Например: 15000',
    'routes.price_helper': 'Базовая цена за рейс по этому маршруту',

    // Пользователи
    'users.title': 'Пользователи',
    'users.subtitle': 'Управление пользователями и ролями',
    'users.add': 'Добавить пользователя',
    'users.search_placeholder': 'Поиск по email, имени или телефону...',
    'users.all_roles': 'Все роли',
    'users.admins': 'Администраторы',
    'users.dispatchers': 'Диспетчеры',
    'users.drivers_role': 'Водители',
    'users.total': 'Всего',
    'users.user': 'Пользователь',
    'users.contacts': 'Контакты',
    'users.created': 'Создан',
    'users.no_name': 'Без имени',
    'users.not_found': 'Пользователи не найдены',
    'users.try_search': 'Попробуйте изменить параметры поиска',
    'users.no_access': 'У вас нет прав для управления пользователями',
    'users.confirm_delete': 'Вы уверены, что хотите удалить этого пользователя?',
    'users.email_exists': 'Пользователь с таким email уже существует!',
    'users.profile_created': 'Профиль создан! Пользователь должен зарегистрироваться через страницу входа.',
    'users.delete_error': 'Ошибка при удалении пользователя',
    'users.save_error': 'Ошибка при сохранении пользователя',
    'users.full_name': 'Полное имя',

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
    'settings.appearance': 'Внешний вид',
    'settings.font_size': 'Размер шрифта',
    'settings.font_small': 'Маленький',
    'settings.font_medium': 'Средний',
    'settings.font_large': 'Большой',
    'settings.language_switch_active': 'Переключение языка активно! Нажмите "Сохранить изменения".',
    'settings.font_hint': 'Размер шрифта применяется мгновенно ко всему приложению',
    'settings.financial_desc': 'Настройки расчётов и валюты',
    'settings.regional_desc': 'Язык интерфейса и форматы',
    'settings.appearance_desc': 'Настройка отображения интерфейса',
    'settings.current_share': 'Текущий: {driver}% водителю, {owner}% владельцу',
    'settings.currency_desc': 'Используется для всех финансовых расчётов',
    'settings.saved': 'Настройки успешно сохранены!',
    'settings.info_title': 'Важная информация',
    'settings.info_1': 'Все настройки сохраняются в Supabase и применяются мгновенно',
    'settings.info_2': 'Telegram интеграция работает только при наличии токена и Chat ID',
    'settings.info_3': 'Выключенные виджеты не будут отображаться на Dashboard',
    'settings.info_4': 'Изменение языка применится после сохранения настроек',
    'settings.info_5': 'Для настройки Telegram смотрите TELEGRAM_SETUP.md',
    'settings.get_chat_id': 'Получите через @userinfobot или смотрите TELEGRAM_SETUP.md',

    // Telegram
    'telegram.title': 'Telegram Бот',
    'telegram.subtitle': 'Уведомления через Telegram (100% бесплатно)',
    'telegram.enable': 'Включить Telegram бот',
    'telegram.activate': 'Активировать интеграцию',
    'telegram.token': 'Bot Token (от @BotFather)',
    'telegram.chat_id': 'Admin Chat ID',
    'telegram.notifications': 'Типы уведомлений:',
    'telegram.new_trip': 'Новый рейс создан',
    'telegram.trip_completed': 'Рейс завершён',
    'telegram.daily_report': 'Ежедневный отчёт',
    'telegram.weekly_report': 'Еженедельный отчёт',

    // Виджеты
    'widgets.title': 'Виджеты Dashboard',
    'widgets.subtitle': 'Включить/выключить графики и аналитику',
    'widgets.revenue_chart': 'График выручки',
    'widgets.routes_chart': 'График маршрутов',
    'widgets.recent_trips': 'Последние рейсы',
    'widgets.vehicle_utilization': 'Загруженность транспорта',
    'widgets.top_drivers': 'Топ-5 водителей',
    'widgets.monthly_comparison': 'Сравнение месяцев',
    'widgets.revenue_desc': 'Выручка по дням',
    'widgets.routes_desc': 'Рейсы по маршрутам',
    'widgets.recent_trips_desc': 'Таблица последних 10',
    'widgets.vehicle_utilization_desc': 'Статус машин',
    'widgets.top_drivers_desc': 'Лучшие по прибыли',
    'widgets.monthly_comparison_desc': 'Текущий vs предыдущий',

    // Кнопки
    'button.edit': 'Изменить',
    'button.delete': 'Удалить',
    'button.add': 'Добавить',
    'button.save': 'Сохранить',
    'button.cancel': 'Отмена',
    'button.export': 'Экспорт',
    'button.create': 'Создать',

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

    // Авторизация
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.login': 'Войти',
    'auth.logout': 'Выйти',

    // Ошибки
    'error.loading': 'Ошибка загрузки данных',
    'error.no_data': 'Нет данных для отображения',
    'error.no_access': 'У вас нет прав для доступа',
    'error.save_failed': 'Не удалось сохранить',
    'error.delete_failed': 'Не удалось удалить',
    'error.load_failed': 'Не удалось загрузить данные',
    'error.has_active_trips': 'Невозможно удалить: есть активные рейсы',
    'error.has_linked_trips': 'Невозможно удалить: есть связанные рейсы',

    // Общие
    'common.loading': 'Загрузка...',
    'common.saving': 'Сохранение...',
    'common.total': 'Итого',
    'common.select': 'Выберите',
    'common.parking_food_etc': 'Парковка, питание, и т.д.',
    'common.confirm_delete': 'Вы уверены, что хотите удалить?',
    'common.no_data': 'Нет данных',
    'common.page': 'Страница',
    'common.of': 'из',
    'common.back': 'Назад',
    'common.forward': 'Вперед',
    'common.reset_filters': 'Сбросить фильтры',
    'common.all': 'Все',
    'common.auto_calc': 'Автоматический расчёт',
    'common.total_costs': 'Общие расходы',
    'common.net_profit': 'Чистая прибыль',
    'common.driver_share': 'Водителю',
    'common.owner_share': 'Владельцу',
    'common.last_trip': 'Последний рейс',

    // Подтверждения
    'confirm.delete_trip': 'Вы уверены, что хотите удалить этот рейс?',
    'confirm.delete_driver': 'Вы уверены, что хотите удалить этого водителя?',
    'confirm.delete_vehicle': 'Вы уверены, что хотите удалить этот автомобиль?',
    'confirm.delete_route': 'Вы уверены, что хотите удалить этот маршрут?',

    // Модальные окна
    'modal.add_trip': 'Добавить рейс',
    'modal.edit_trip': 'Редактировать рейс',
    'modal.add_driver': 'Добавить водителя',
    'modal.edit_driver': 'Редактировать водителя',
    'modal.add_vehicle': 'Добавить автомобиль',
    'modal.edit_vehicle': 'Редактировать автомобиль',
    'modal.add_route': 'Добавить маршрут',
    'modal.edit_route': 'Редактировать маршрут',

    // Sidebar
    'sidebar.system_title': 'Система учета',
    'sidebar.system_subtitle': 'рейсов',

    // Пустые состояния
    'empty.trips': 'Нет рейсов',
    'empty.trips_search': 'Рейсы не найдены',
    'empty.drivers': 'Нет водителей',
    'empty.vehicles': 'Нет автомобилей',
    'empty.vehicles_status': 'Нет автомобилей с таким статусом',
    'empty.routes': 'Нет маршрутов',

    // Фильтры (дополнительные)
    'filter.all_statuses': 'Все статусы',
    'filter.all_drivers': 'Все водители',
    'filter.all_vehicles': 'Весь транспорт',
    'filter.free': 'Свободны',
    'filter.in_trip': 'В рейсе',
    'filter.maintenance': 'На ремонте',

    // Экспорт
    'export.excel': 'Экспорт в Excel',
    'export.no_data': 'Нет данных для экспорта',

    // Водители (дополнительные)
    'drivers.top_by_payments': 'Топ 10 водителей по выплатам',
    'drivers.phone_placeholder': '+996 XXX XXX XXX',

    // Транспорт (дополнительные)
    'vehicles.last_trip': 'Последний рейс',
    'vehicles.avg_profit': 'Средняя прибыль',

    // Маршруты (дополнительные)
    'routes.trip_count': 'Кол-во рейсов',

    // Валидация
    'validation.required': 'Обязательное поле',
    'validation.name_required': 'Название обязательно',
    'validation.full_name_required': 'Имя обязательно',
    'validation.phone_required': 'Телефон обязателен',
    'validation.hire_date_required': 'Дата найма обязательна',
    'validation.status_required': 'Статус обязателен',
    'validation.brand_required': 'Марка обязательна',
    'validation.model_required': 'Модель обязательна',
    'validation.plate_required': 'Номер обязателен',
    'validation.year_required': 'Год обязателен',
    'validation.year_min': 'Год не может быть меньше 1900',
    'validation.year_max': 'Год не может быть больше текущего',
    'validation.distance_required': 'Расстояние обязательно',
    'validation.distance_positive': 'Расстояние должно быть положительным',
    'validation.price_required': 'Цена обязательна',
    'validation.price_positive': 'Цена должна быть положительной',
    'validation.date_required': 'Дата обязательна',
    'validation.driver_required': 'Водитель обязателен',
    'validation.vehicle_required': 'Автомобиль обязателен',
    'validation.route_required': 'Маршрут обязателен',
    'validation.revenue_required': 'Выручка обязательна',
    'validation.fuel_required': 'Расход на топливо обязателен',

    // Dashboard (дополнительные)
    'dashboard.filters_active': '✓ Фильтры активны',
    'dashboard.advanced_filters': 'Расширенные фильтры',
    'dashboard.analytics_filters': 'Фильтры аналитики',
    'dashboard.date_from': 'Дата от',
    'dashboard.date_to': 'Дата до',
    'dashboard.all_routes': 'Все маршруты',
    'dashboard.profit_period': 'Прибыль за период',
    'dashboard.trips_distribution': 'Распределение рейсов',
    'dashboard.vehicle_utilization': 'Загруженность транспорта',
    'dashboard.vehicle_in_trip': 'В рейсе',
    'dashboard.vehicle_maintenance': 'На ремонте',
    'dashboard.vehicle_free': 'Свободно',
    'dashboard.total_vehicles': 'Всего транспорта:',
    'dashboard.no_vehicles_data': 'Нет данных о транспорте',
    'dashboard.top_drivers': 'Топ 5 водителей',
    'dashboard.trips_count': 'рейсов',
    'dashboard.no_drivers_data': 'Нет данных о водителях',
    'dashboard.monthly_comparison': 'Сравнение последних месяцев',
    'dashboard.no_comparison_data': 'Нет данных для сравнения',
    'dashboard.recent_trips': 'Последние рейсы',
    'dashboard.all_trips': 'Все рейсы →',
    'dashboard.no_trips': 'Нет рейсов',
    'dashboard.unknown_route': 'Неизвестный маршрут',
    'dashboard.unknown_driver': 'Неизвестный',
    'dashboard.error_load': 'Не удалось загрузить данные дашборда',
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
    'nav.users': 'Колдонуучулар',
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
    'dashboard.analytics': 'Аналитика',

    // Фильтры
    'filter.today': 'Бүгүн',
    'filter.week': 'Апта',
    'filter.month': 'Ай',
    'filter.all': 'Баары',
    'filter.from': 'Баштап',
    'filter.to': 'Чейин',
    'filter.search': 'Издөө',

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
    'trips.fuel_cost': 'Күйүүчү майга чыгым',
    'trips.maintenance_cost': 'Оңдоого чыгым',
    'trips.other_costs': 'Башка чыгымдар',
    'trips.search_placeholder': 'Айдоочу, унаа же маршрут боюнча издөө...',

    // Водители
    'drivers.title': 'Айдоочулар',
    'drivers.add': 'Айдоочу кошуу',
    'drivers.total': 'Бардыгы айдоочулар',
    'drivers.name': 'АТЫ',
    'drivers.full_name': 'Толук аты',
    'drivers.phone': 'ТЕЛЕФОН',
    'drivers.hire_date': 'ЖАЛДАНГАН КҮНҮ',
    'drivers.total_trips': 'БАРДЫГЫ РЕЙСТЕР',
    'drivers.total_payment': 'ЖАЛПЫ ТӨЛӨМДӨР',
    'drivers.avg_profit': 'ОРТОЧО ПАЙДА',
    'drivers.status': 'АБАЛЫ',
    'drivers.actions': 'АРАКЕТТЕР',
    'drivers.notes': 'Эскертүүлөр',
    'drivers.payments': 'Төлөмдөр',

    // Транспорт
    'vehicles.title': 'Унаалар',
    'vehicles.add': 'Унаа кошуу',
    'vehicles.total': 'Бардыгы унаалар',
    'vehicles.brand': 'Маркасы',
    'vehicles.model': 'Модели',
    'vehicles.plate': 'Номери',
    'vehicles.license_plate': 'Номери (мамлекеттик)',
    'vehicles.year': 'Жылы',
    'vehicles.year_label': 'Чыгарылган жылы',
    'vehicles.total_trips': 'Бардыгы рейстер',
    'vehicles.revenue': 'Киреше',
    'vehicles.profit': 'Пайда',
    'vehicles.status': 'Абалы',
    'vehicles.notes': 'Эскертүүлөр',
    'vehicles.brand_placeholder': 'Мисалы: Volvo',
    'vehicles.model_placeholder': 'Мисалы: FH16',
    'vehicles.plate_placeholder': 'Мисалы: 01ABC123',

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
    'routes.standard_price': 'Стандарттык рейс баасы',
    'routes.name_placeholder': 'Мисалы: Бишкек - Алматы',
    'routes.distance_placeholder': 'Мисалы: 245.5',
    'routes.price_placeholder': 'Мисалы: 15000',
    'routes.price_helper': 'Бул маршрут боюнча рейс үчүн негизги баа',

    // Пользователи
    'users.title': 'Колдонуучулар',
    'users.subtitle': 'Колдонуучуларды жана ролдорду башкаруу',
    'users.add': 'Колдонуучу кошуу',
    'users.search_placeholder': 'Email, ысым же телефон боюнча издөө...',
    'users.all_roles': 'Бардык ролдор',
    'users.admins': 'Администраторлор',
    'users.dispatchers': 'Диспетчерлер',
    'users.drivers_role': 'Айдоочулар',
    'users.total': 'Бардыгы',
    'users.user': 'Колдонуучу',
    'users.contacts': 'Байланыштар',
    'users.created': 'Түзүлгөн',
    'users.no_name': 'Атсыз',
    'users.not_found': 'Колдонуучулар табылган жок',
    'users.try_search': 'Издөө параметрлерин өзгөртүп көрүңүз',
    'users.no_access': 'Сизде колдонуучуларды башкаруу укугу жок',
    'users.confirm_delete': 'Бул колдонуучуну өчүргүңүз келеби?',
    'users.email_exists': 'Мындай email менен колдонуучу бар!',
    'users.profile_created': 'Профиль түзүлдү! Колдонуучу кирүү барагы аркылуу катталышы керек.',
    'users.delete_error': 'Колдонуучуну өчүрүүдө ката',
    'users.save_error': 'Колдонуучуну сактоодо ката',
    'users.full_name': 'Толук аты',

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
    'settings.appearance': 'Сырткы көрүнүш',
    'settings.font_size': 'Шрифт өлчөмү',
    'settings.font_small': 'Кичине',
    'settings.font_medium': 'Орточо',
    'settings.font_large': 'Чоң',
    'settings.language_switch_active': 'Тил которуу иштеп жатат! "Өзгөртүүлөрдү сактоо" баскычын басыңыз.',
    'settings.font_hint': 'Шрифт өлчөмү дароо бүт колдонмого колдонулат',
    'settings.financial_desc': 'Эсептөө жана валюта жөндөөлөрү',
    'settings.regional_desc': 'Интерфейс тили жана форматтары',
    'settings.appearance_desc': 'Интерфейс көрүнүшүн жөндөө',
    'settings.current_share': 'Учурдагы: {driver}% айдоочуга, {owner}% ээсине',
    'settings.currency_desc': 'Бардык финансылык эсептөөлөрдө колдонулат',
    'settings.saved': 'Жөндөөлөр ийгиликтүү сакталды!',
    'settings.info_title': 'Маанилүү маалымат',
    'settings.info_1': 'Бардык жөндөөлөр Supabase\'де сакталат жана дароо колдонулат',
    'settings.info_2': 'Telegram интеграция токен жана Chat ID болгондо гана иштейт',
    'settings.info_3': 'Өчүрүлгөн виджеттер Dashboard\'до көрүнбөйт',
    'settings.info_4': 'Тил өзгөртүү жөндөөлөр сакталгандан кийин колдонулат',
    'settings.info_5': 'Telegram жөндөө үчүн TELEGRAM_SETUP.md караңыз',
    'settings.get_chat_id': '@userinfobot аркылуу алыңыз же TELEGRAM_SETUP.md караңыз',

    // Telegram
    'telegram.title': 'Telegram Бот',
    'telegram.subtitle': 'Telegram аркылуу билдирүүлөр (100% акысыз)',
    'telegram.enable': 'Telegram ботту иштетүү',
    'telegram.activate': 'Интеграцияны жандыруу',
    'telegram.token': 'Bot Token (@BotFather\'ден)',
    'telegram.chat_id': 'Admin Chat ID',
    'telegram.notifications': 'Билдирүү түрлөрү:',
    'telegram.new_trip': 'Жаңы рейс түзүлдү',
    'telegram.trip_completed': 'Рейс аяктады',
    'telegram.daily_report': 'Күндөлүк отчет',
    'telegram.weekly_report': 'Апталык отчет',

    // Виджеты
    'widgets.title': 'Dashboard виджеттери',
    'widgets.subtitle': 'Графиктерди жана аналитиканы иштетүү/өчүрүү',
    'widgets.revenue_chart': 'Киреше графиги',
    'widgets.routes_chart': 'Маршруттар графиги',
    'widgets.recent_trips': 'Акыркы рейстер',
    'widgets.vehicle_utilization': 'Транспорт жүктөлүшү',
    'widgets.top_drivers': 'Топ-5 айдоочу',
    'widgets.monthly_comparison': 'Айларды салыштыруу',
    'widgets.revenue_desc': 'Күндөр боюнча киреше',
    'widgets.routes_desc': 'Маршруттар боюнча рейстер',
    'widgets.recent_trips_desc': 'Акыркы 10 таблица',
    'widgets.vehicle_utilization_desc': 'Унаалар абалы',
    'widgets.top_drivers_desc': 'Пайда боюнча мыктылар',
    'widgets.monthly_comparison_desc': 'Учурдагы vs мурунку',

    // Кнопки
    'button.edit': 'Өзгөртүү',
    'button.delete': 'Өчүрүү',
    'button.add': 'Кошуу',
    'button.save': 'Сактоо',
    'button.cancel': 'Жокко чыгаруу',
    'button.export': 'Экспорт',
    'button.create': 'Түзүү',

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

    // Авторизация
    'auth.email': 'Email',
    'auth.password': 'Сыр сөз',
    'auth.login': 'Кирүү',
    'auth.logout': 'Чыгуу',

    // Ошибки
    'error.loading': 'Маалыматтарды жүктөөдө ката',
    'error.no_data': 'Көрсөтүү үчүн маалымат жок',
    'error.no_access': 'Сизде кирүү укугу жок',
    'error.save_failed': 'Сактоо мүмкүн болбоду',
    'error.delete_failed': 'Өчүрүү мүмкүн болбоду',
    'error.load_failed': 'Маалыматтарды жүктөө мүмкүн болбоду',
    'error.has_active_trips': 'Өчүрүү мүмкүн эмес: активдүү рейстер бар',
    'error.has_linked_trips': 'Өчүрүү мүмкүн эмес: байланышкан рейстер бар',

    // Общие
    'common.loading': 'Жүктөлүүдө...',
    'common.saving': 'Сакталууда...',
    'common.total': 'Жыйынтыгы',
    'common.select': 'Тандаңыз',
    'common.parking_food_etc': 'Токтоочу жай, тамак-аш ж.б.',
    'common.confirm_delete': 'Өчүрүүнү каалайсызбы?',
    'common.no_data': 'Маалымат жок',
    'common.page': 'Барак',
    'common.of': 'ичинен',
    'common.back': 'Артка',
    'common.forward': 'Алдыга',
    'common.reset_filters': 'Чыпкаларды тазалоо',
    'common.all': 'Баары',
    'common.auto_calc': 'Автоматтык эсептөө',
    'common.total_costs': 'Жалпы чыгымдар',
    'common.net_profit': 'Таза пайда',
    'common.driver_share': 'Айдоочуга',
    'common.owner_share': 'Ээсине',
    'common.last_trip': 'Акыркы рейс',

    // Подтверждения
    'confirm.delete_trip': 'Бул рейсти өчүргүңүз келеби?',
    'confirm.delete_driver': 'Бул айдоочуну өчүргүңүз келеби?',
    'confirm.delete_vehicle': 'Бул унааны өчүргүңүз келеби?',
    'confirm.delete_route': 'Бул маршрутту өчүргүңүз келеби?',

    // Модальные окна
    'modal.add_trip': 'Рейс кошуу',
    'modal.edit_trip': 'Рейсти өзгөртүү',
    'modal.add_driver': 'Айдоочу кошуу',
    'modal.edit_driver': 'Айдоочуну өзгөртүү',
    'modal.add_vehicle': 'Унаа кошуу',
    'modal.edit_vehicle': 'Унааны өзгөртүү',
    'modal.add_route': 'Маршрут кошуу',
    'modal.edit_route': 'Маршрутту өзгөртүү',

    // Sidebar
    'sidebar.system_title': 'Рейстерди эсепке',
    'sidebar.system_subtitle': 'алуу системасы',

    // Пустые состояния
    'empty.trips': 'Рейстер жок',
    'empty.trips_search': 'Рейстер табылган жок',
    'empty.drivers': 'Айдоочулар жок',
    'empty.vehicles': 'Унаалар жок',
    'empty.vehicles_status': 'Мындай абалдагы унаалар жок',
    'empty.routes': 'Маршруттар жок',

    // Фильтры (дополнительные)
    'filter.all_statuses': 'Бардык абалдар',
    'filter.all_drivers': 'Бардык айдоочулар',
    'filter.all_vehicles': 'Бардык унаалар',
    'filter.free': 'Бош',
    'filter.in_trip': 'Рейсте',
    'filter.maintenance': 'Оңдоодо',

    // Экспорт
    'export.excel': 'Excel\'ге экспорт',
    'export.no_data': 'Экспорт үчүн маалымат жок',

    // Водители (дополнительные)
    'drivers.top_by_payments': 'Төлөмдөр боюнча топ 10 айдоочу',
    'drivers.phone_placeholder': '+996 XXX XXX XXX',

    // Транспорт (дополнительные)
    'vehicles.last_trip': 'Акыркы рейс',
    'vehicles.avg_profit': 'Орточо пайда',

    // Маршруты (дополнительные)
    'routes.trip_count': 'Рейстер саны',

    // Валидация
    'validation.required': 'Милдеттүү талаа',
    'validation.name_required': 'Аталышы милдеттүү',
    'validation.full_name_required': 'Аты милдеттүү',
    'validation.phone_required': 'Телефон милдеттүү',
    'validation.hire_date_required': 'Жалданган күнү милдеттүү',
    'validation.status_required': 'Абалы милдеттүү',
    'validation.brand_required': 'Маркасы милдеттүү',
    'validation.model_required': 'Модели милдеттүү',
    'validation.plate_required': 'Номери милдеттүү',
    'validation.year_required': 'Жылы милдеттүү',
    'validation.year_min': 'Жылы 1900-дөн кем болбошу керек',
    'validation.year_max': 'Жылы учурдан көп болбошу керек',
    'validation.distance_required': 'Аралык милдеттүү',
    'validation.distance_positive': 'Аралык оң болушу керек',
    'validation.price_required': 'Баа милдеттүү',
    'validation.price_positive': 'Баа оң болушу керек',
    'validation.date_required': 'Күнү милдеттүү',
    'validation.driver_required': 'Айдоочу милдеттүү',
    'validation.vehicle_required': 'Унаа милдеттүү',
    'validation.route_required': 'Маршрут милдеттүү',
    'validation.revenue_required': 'Киреше милдеттүү',
    'validation.fuel_required': 'Күйүүчү майга чыгым милдеттүү',

    // Dashboard (кошумча)
    'dashboard.filters_active': '✓ Чыпкалар активдүү',
    'dashboard.advanced_filters': 'Кеңейтилген чыпкалар',
    'dashboard.analytics_filters': 'Аналитика чыпкалары',
    'dashboard.date_from': 'Күнү баштап',
    'dashboard.date_to': 'Күнү чейин',
    'dashboard.all_routes': 'Бардык маршруттар',
    'dashboard.profit_period': 'Мезгил боюнча пайда',
    'dashboard.trips_distribution': 'Рейстердин бөлүштүрүлүшү',
    'dashboard.vehicle_utilization': 'Транспорт жүктөлүшү',
    'dashboard.vehicle_in_trip': 'Рейсте',
    'dashboard.vehicle_maintenance': 'Оңдоодо',
    'dashboard.vehicle_free': 'Бош',
    'dashboard.total_vehicles': 'Бардык транспорт:',
    'dashboard.no_vehicles_data': 'Транспорт боюнча маалымат жок',
    'dashboard.top_drivers': 'Топ 5 айдоочу',
    'dashboard.trips_count': 'рейс',
    'dashboard.no_drivers_data': 'Айдоочулар боюнча маалымат жок',
    'dashboard.monthly_comparison': 'Акыркы айларды салыштыруу',
    'dashboard.no_comparison_data': 'Салыштыруу үчүн маалымат жок',
    'dashboard.recent_trips': 'Акыркы рейстер',
    'dashboard.all_trips': 'Бардык рейстер →',
    'dashboard.no_trips': 'Рейстер жок',
    'dashboard.unknown_route': 'Белгисиз маршрут',
    'dashboard.unknown_driver': 'Белгисиз',
    'dashboard.error_load': 'Башкы бет маалыматтарын жүктөө мүмкүн болбоду',
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
