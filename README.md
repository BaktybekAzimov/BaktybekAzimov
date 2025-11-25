# 🚚 TruckTrack - Система учёта рейсов грузовиков

Профессиональное веб-приложение для транспортной компании в Кыргызстане для учёта и управления рейсами грузовиков.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## ✨ Особенности

### 🎯 Основной функционал

- **Dashboard** - Визуализация ключевых метрик с KPI карточками и интерактивными графиками
- **Управление рейсами** - Полный CRUD для рейсов с автоматическими расчётами прибыли
- **Управление водителями** - Учёт водителей со статистикой и рейтингом
- **Управление машинами** - Отслеживание статуса транспорта и истории рейсов
- **Маршруты** - База маршрутов с расстояниями и средней стоимостью
- **Мобильная форма** - Упрощённая форма для водителей (без аутентификации)

### 🔐 Система ролей

- **Администратор** - Полный доступ ко всем функциям
- **Диспетчер** - Просмотр и редактирование всех данных
- **Водитель** - Просмотр только своих рейсов

### 💎 Дизайн и UX

- Профессиональный дизайн уровня премиум Etsy шаблонов
- Адаптивная вёрстка (Desktop, Tablet, Mobile)
- Плавные анимации и переходы
- Интуитивная навигация
- Цветовые индикаторы статусов
- Skeleton loaders при загрузке

### 📊 Аналитика

- Общий доход за период
- Количество рейсов
- Чистая прибыль
- Средняя прибыль на рейс
- График динамики доходов
- Распределение рейсов по маршрутам
- ТОП-10 водителей по прибыльности

### 🧮 Автоматические расчёты

- Общие расходы = Топливо + ТО + Прочие
- Чистая прибыль = Доход - Общие расходы
- Выплата водителю (30% от прибыли)
- Выплата владельцу (70% от прибыли)

## 🛠 Технологический стек

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **React Router** - Навигация
- **React Hook Form** - Управление формами
- **Zod** - Валидация данных
- **Recharts** - Графики и визуализация
- **Lucide React** - Иконки
- **date-fns** - Работа с датами

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL база данных
  - Row Level Security (RLS)
  - Аутентификация
  - Realtime подписки

### Инструменты разработки
- **Vite** - Сборщик и dev сервер
- **ESLint** - Линтер
- **PostCSS** - CSS процессор

## 📋 Требования

- Node.js >= 18.0.0
- npm >= 9.0.0
- Аккаунт Supabase (бесплатный план подходит)

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd truck-tracker
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

#### 3.1 Создание проекта Supabase

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь инициализации базы данных

#### 3.2 Создание схемы БД

1. Откройте SQL Editor в Supabase Dashboard
2. Скопируйте содержимое файла `supabase-schema.sql`
3. Выполните SQL скрипт
4. Проверьте, что созданы таблицы: `drivers`, `vehicles`, `routes`, `trips`

#### 3.3 Создание тестовых пользователей

В Supabase Dashboard перейдите в Authentication > Users и создайте пользователей:

**Администратор:**
```
Email: admin@demo.com
Password: password123
User Metadata:
{
  "role": "admin"
}
```

**Диспетчер:**
```
Email: dispatcher@demo.com
Password: password123
User Metadata:
{
  "role": "dispatcher"
}
```

**Водитель:**
```
Email: driver@demo.com
Password: password123
User Metadata:
{
  "role": "driver",
  "driver_id": "<UUID_одного_из_водителей>"
}
```

### 4. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cp .env.example .env
```

Откройте `.env` и заполните данными из Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Найти эти данные можно в Supabase Dashboard:
Settings > API > Project URL и anon/public key

### 5. Запуск проекта

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

## 📱 Использование

### Веб-приложение

1. Откройте `http://localhost:5173`
2. Войдите используя один из тестовых аккаунтов
3. Изучите Dashboard с метриками
4. Добавьте новый рейс через страницу "Рейсы"

### Мобильная форма для водителей

1. Откройте `http://localhost:5173/driver-form` на смартфоне
2. Заполните форму (аутентификация не требуется)
3. Система автоматически рассчитает выплату водителю

## 📁 Структура проекта

```
truck-tracker/
├── src/
│   ├── components/
│   │   ├── ui/              # Переиспользуемые UI компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/          # Layout компоненты
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Контекст аутентификации
│   ├── lib/
│   │   ├── supabase.ts      # Supabase клиент
│   │   └── utils.ts         # Утилиты
│   ├── pages/
│   │   ├── Login.tsx        # Страница входа
│   │   ├── Dashboard.tsx    # Главная страница
│   │   ├── Trips.tsx        # Управление рейсами
│   │   ├── Drivers.tsx      # Управление водителями
│   │   ├── Vehicles.tsx     # Управление машинами
│   │   ├── Routes.tsx       # Управление маршрутами
│   │   └── DriverForm.tsx   # Мобильная форма
│   ├── types/
│   │   └── index.ts         # TypeScript типы
│   ├── App.tsx              # Главный компонент
│   ├── main.tsx             # Точка входа
│   └── index.css            # Глобальные стили
├── supabase-schema.sql      # SQL схема БД
├── .env.example             # Пример переменных окружения
├── tailwind.config.js       # Конфигурация Tailwind
├── tsconfig.json            # Конфигурация TypeScript
├── vite.config.ts           # Конфигурация Vite
└── package.json             # Зависимости проекта
```

## 🗄 Схема базы данных

### Таблицы

- **drivers** - Водители
- **vehicles** - Транспортные средства
- **routes** - Маршруты
- **trips** - Рейсы

### Views (представления)

- **driver_stats** - Статистика по водителям
- **vehicle_stats** - Статистика по машинам
- **route_stats** - Статистика по маршрутам

### Автоматические вычисления

В таблице `trips` есть computed columns:
- `total_costs` - Сумма всех расходов
- `net_profit` - Чистая прибыль
- `driver_payment` - 30% от прибыли
- `owner_payment` - 70% от прибыли

## 🔒 Безопасность

### Row Level Security (RLS)

- Водители видят только свои рейсы
- Диспетчеры и администраторы видят все данные
- Только администраторы могут удалять записи
- Все операции проходят проверку на уровне БД

### Аутентификация

- Email/Password через Supabase Auth
- Защищённые роуты с ProtectedRoute
- Автоматический редирект при отсутствии авторизации

## 🎨 Цветовая палитра

```js
Primary: #1E3A8A (глубокий синий)
Secondary: #64748B (серый сланец)
Success: #059669 (зелёный)
Warning: #F59E0B (янтарный)
Error: #DC2626 (малиновый)
Background: #F8FAFC (светло-серый)
```

## 🔧 Скрипты

```bash
# Разработка
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Линтинг
npm run lint
```

## 📊 Тестовые данные

После выполнения `supabase-schema.sql` автоматически создаются:

- 10 водителей
- 10 машин
- 15 маршрутов
- 50 тестовых рейсов за последние 30 дней

## 🚀 Деплой

### Vercel (рекомендуется)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Загрузите папку dist в Netlify
```

### Docker

```bash
# TODO: Добавить Dockerfile
```

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Roadmap

- [ ] Экспорт в Excel
- [ ] Тёмная тема
- [ ] Push уведомления
- [ ] Расширенная аналитика
- [ ] Мобильное приложение (React Native)
- [ ] Интеграция с GPS трекерами
- [ ] Автоматическое построение маршрутов

## 📄 Лицензия

MIT License - свободно используйте для коммерческих и личных проектов

## 👨‍💻 Автор

Создано для транспортной компании в Кыргызстане

## 🙏 Благодарности

- Supabase за отличный BaaS
- Tailwind CSS за удобную стилизацию
- Recharts за красивые графики
- Lucide за иконки

---

**Создано с ❤️ для транспортной индустрии Кыргызстана**
