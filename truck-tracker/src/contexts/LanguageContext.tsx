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
    'dashboard.recent_trips': 'Последние 10 рейсов',
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
    'dashboard.recent_trips': 'Акыркы 10 рейс',
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
