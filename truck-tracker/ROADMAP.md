# 🚀 ROADMAP - Система учёта рейсов TruckTrack

## ✅ ЧТО УЖЕ СДЕЛАНО

### 1. Базовый функционал
- ✅ Аутентификация (вход/выход)
- ✅ Роли пользователей (Admin/Dispatcher/Driver)
- ✅ Dashboard с KPI и графиками
- ✅ CRUD для рейсов, водителей, транспорта, маршрутов
- ✅ Автоматический расчёт прибыли (30%/70%)
- ✅ Фильтр по датам и месяцам
- ✅ Адаптивный дизайн (Desktop/Tablet/Mobile)

### 2. Интерфейс
- ✅ **Складной sidebar** с кнопкой-гамбургером
- ✅ Мобильная версия с overlay
- ✅ Красивые графики (Recharts)
- ✅ Профессиональная цветовая схема
- ✅ Плавные анимации

### 3. Страница Настроек (только для Admin)
- ✅ **Процент выплаты водителю** (можно изменить с 30% на любой)
- ✅ **Выбор валюты**: Сом (KGS) / Доллар (USD) / Рубль (RUB)
- ✅ **Язык интерфейса**: Русский / Кыргызский (UI готов, переводы - в будущем)
- ✅ **Управление типами расходов** (добавление/удаление категорий)

### 4. Тестовые данные
- ✅ 100 рейсов за последние 6 месяцев
- ✅ Положительная прибыль (40-60% от выручки)
- ✅ Реалистичные данные

---

## 🎯 ЧТО НУЖНО СДЕЛАТЬ ДАЛЬШЕ

### Приоритет 1: Критичные функции

#### 1. Исправить кнопку уведомлений (колокольчик)
**Статус:** Планируется
**Описание:**
Сейчас кнопка колокольчика есть, но не работает. Нужно:
- Подключить к Supabase Realtime для уведомлений в реальном времени
- Показывать количество непрочитанных уведомлений
- Dropdown с списком уведомлений
- Типы уведомлений:
  * Новый рейс создан
  * Рейс завершён
  * Рейс отменён
  * Транспорт требует обслуживания

**Как будет выглядеть:**
```
🔔 (3)  ← красная точка с количеством
   ↓
┌─────────────────────────┐
│ Уведомления             │
├─────────────────────────┤
│ 🚚 Новый рейс #123     │
│   2 минуты назад        │
├─────────────────────────┤
│ ✅ Рейс #122 завершён  │
│   15 минут назад        │
└─────────────────────────┘
```

---

#### 2. Мобильная форма водителя с камерой
**Статус:** Форма есть, нужно улучшить
**Описание:**
Форма уже создана (`/driver-form`), но нужно добавить:

##### Функции камеры:
- Фото путевого листа
- Фото показаний одометра
- Фото накладной
- Сохранение фото в Supabase Storage

##### Геолокация:
- Автоматическое определение местоположения
- Запись координат начала рейса
- Запись координат конца рейса
- Показ на карте (Google Maps или OpenStreetMap)

##### Offline mode:
- Сохранение данных в LocalStorage
- Отправка когда появится интернет
- Индикатор offline/online статуса

**Как будет выглядеть:**
```
┌──────────────────────────┐
│  ФОРМА ВОДИТЕЛЯ          │
│  📍 Местоположение ОК    │
│  📶 Offline              │
├──────────────────────────┤
│  Маршрут: [выбрать ▼]   │
│  Транспорт: [выбрать ▼] │
│                          │
│  Выручка: ___________ с  │
│                          │
│  📷 Фото путевого листа  │
│  ┌────────────────────┐  │
│  │    [Сделать фото]  │  │
│  └────────────────────┘  │
│                          │
│  [Отправить данные]      │
└──────────────────────────┘
```

**Технологии:**
- HTML5 `<input type="file" capture="camera">`
- Geolocation API
- Supabase Storage для фото
- LocalStorage + Service Workers для offline

---

#### 3. График загруженности транспорта
**Статус:** Планируется
**Описание:**
Новый виджет на Dashboard показывающий:
- Сколько транспорта в рейсе
- Сколько свободно
- Сколько на обслуживании
- История использования

**Как будет выглядеть:**
```
┌─────────────────────────────────────┐
│  Загруженность транспорта          │
├─────────────────────────────────────┤
│  🚛 В рейсе:       5 из 10 (50%)   │
│  ✅ Свободно:      4 из 10 (40%)   │
│  🔧 На ремонте:    1 из 10 (10%)   │
├─────────────────────────────────────┤
│  [График по дням]                   │
│     ▁▂▃▅▇█▇▅▃▂▁                    │
└─────────────────────────────────────┘
```

**SQL запрос:**
```sql
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vehicles), 2) as percentage
FROM vehicles
GROUP BY status;
```

---

### Приоритет 2: Улучшения UX

#### 4. Расширенные фильтры на странице Рейсов
**Что добавить:**
- Фильтр по статусу (Завершён/В пути/Отменён)
- Фильтр по водителю
- Фильтр по транспорту
- Диапазон дат (от/до)
- Поиск по маршруту

**UI:**
```
Рейсы (100)
┌─────────────────────────────────────────────────────┐
│ Статус [Все ▼] | Водитель [Все ▼] | От [__/__] До [__/__] │ 🔍 Поиск
└─────────────────────────────────────────────────────┘
```

---

#### 5. Экспорт в Excel
**Описание:**
Кнопка "Экспорт" на каждой странице

**Библиотеки:**
- `xlsx` или `exceljs`

**Функции:**
- Экспорт текущей таблицы
- Применение фильтров
- Форматирование (суммы, даты)
- Автоширина колонок

**Пример использования:**
```typescript
import * as XLSX from 'xlsx';

const exportToExcel = (data: Trip[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Рейсы");
  XLSX.writeFile(workbook, `рейсы_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};
```

---

#### 6. Улучшенная аналитика
**Новые виджеты:**
- Топ-5 прибыльных маршрутов
- Топ-5 лучших водителей
- Прогноз выручки на следующий месяц (простой линейный тренд)
- Сравнение месяцев (текущий vs предыдущий)

---

### Приоритет 3: Административные функции

#### 7. Применение настроек процента к БД
**Проблема:**
Сейчас процент выплаты (30%/70%) жёстко прописан в схеме БД

**Решение:**
1. Создать таблицу `settings` в Supabase:
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_percentage INTEGER NOT NULL DEFAULT 30,
  currency TEXT NOT NULL DEFAULT 'KGS',
  language TEXT NOT NULL DEFAULT 'ru',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Изменить calculation в trips:
```sql
-- Вместо фиксированных 0.3 и 0.7:
driver_payment = net_profit * (settings.driver_percentage / 100.0)
owner_payment = net_profit * (1 - settings.driver_percentage / 100.0)
```

3. Функция для пересчёта старых рейсов:
```sql
CREATE OR REPLACE FUNCTION recalculate_trip_payments()
RETURNS void AS $$
DECLARE
  driver_pct NUMERIC;
BEGIN
  SELECT driver_percentage / 100.0 INTO driver_pct FROM settings LIMIT 1;

  UPDATE trips SET
    -- Триггер автоматически пересчитает
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

#### 8. Управление пользователями
**Страница:** `/users` (только Admin)

**Функции:**
- Список всех пользователей
- Создание нового пользователя
- Изменение роли
- Блокировка/разблокировка
- Сброс пароля

---

#### 9. Журнал действий (Audit Log)
**Зачем:**
Отслеживание всех изменений в системе

**Что логировать:**
- Кто и когда изменил рейс
- Кто удалил водителя
- Кто изменил настройки

**Таблица:**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### Приоритет 4: Дополнительные функции

#### 10. Печать документов
**Документы:**
- Путевой лист (PDF)
- Акт выполненных работ
- Сводный отчёт за период

**Библиотеки:**
- `jsPDF` или `pdfmake`
- Шаблоны в HTML + CSS

---

#### 11. Техобслуживание транспорта
**Новая страница:** `/maintenance`

**Функции:**
- График ТО (каждые 10,000 км или 3 месяца)
- Напоминания о приближающемся ТО
- История обслуживания
- Затраты на ремонт

---

#### 12. Интеграция с WhatsApp/Telegram
**Уведомления через мессенджеры:**
- Новый рейс назначен водителю
- Напоминание о рейсе завтра
- Отчёт за день/неделю/месяц

**API:**
- WhatsApp Business API
- Telegram Bot API

---

## 🛠️ ТЕХНИЧЕСКИЕ УЛУЧШЕНИЯ

### 1. Supabase Realtime
**Зачем:**
Обновление данных в реальном времени без перезагрузки

**Как:**
```typescript
const subscription = supabase
  .channel('trips')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' },
    (payload) => {
      // Обновить локальное состояние
      fetchTrips();
    }
  )
  .subscribe();
```

---

### 2. Оптимизация запросов
**Проблемы:**
- Загрузка всех рейсов может быть медленной

**Решения:**
- Пагинация (10/20/50 записей на страницу)
- Бесконечная прокрутка (infinite scroll)
- Кэширование в React Query

---

### 3. PWA (Progressive Web App)
**Функции:**
- Установка на домашний экран
- Работа offline
- Push-уведомления
- Кэш статических ресурсов

**Файлы:**
- `manifest.json`
- Service Worker
- Иконки разных размеров

---

### 4. Тесты
**Unit тесты:**
- Jest + React Testing Library
- Тестирование компонентов
- Тестирование утилит

**E2E тесты:**
- Playwright или Cypress
- Тестирование сценариев пользователя

---

## 📱 МОБИЛЬНАЯ ФОРМА ВОДИТЕЛЯ - ДЕТАЛЬНОЕ ОПИСАНИЕ

### Текущее состояние:
Форма доступна по адресу `/driver-form` (без авторизации)

### Что нужно добавить:

#### 1. Камера для фото
```tsx
<input
  type="file"
  accept="image/*"
  capture="environment" // Задняя камера
  onChange={handlePhotoUpload}
/>
```

**Функции:**
- Предпросмотр фото перед отправкой
- Сжатие изображения (до 1MB)
- Загрузка в Supabase Storage
- Привязка к рейсу

#### 2. Геолокация
```typescript
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Сохранить координаты
});
```

**Функции:**
- Определение местоположения при старте рейса
- Показ на карте (Leaflet.js или Google Maps)
- Расчёт пройденного расстояния

#### 3. Offline режим
```typescript
// Service Worker для кэширования
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Сохранение данных локально
localStorage.setItem('pending_trips', JSON.stringify(data));

// Синхронизация при появлении сети
window.addEventListener('online', () => {
  syncPendingData();
});
```

---

## 💰 НАСТРОЙКИ ПРОЦЕНТА - КАК ЭТО РАБОТАЕТ

### Текущая реализация:
```sql
-- В схеме БД (жёстко закодировано):
driver_payment NUMERIC(10, 2) GENERATED ALWAYS AS (
  (revenue - (fuel_cost + maintenance_cost + other_costs)) * 0.3
) STORED
```

### Новая реализация (после настроек):

#### 1. Таблица настроек:
```sql
CREATE TABLE settings (
  driver_percentage INTEGER DEFAULT 30,
  currency TEXT DEFAULT 'KGS'
);

INSERT INTO settings VALUES (30, 'KGS');
```

#### 2. Функция расчёта:
```sql
CREATE OR REPLACE FUNCTION calculate_payments(
  trip_id UUID
) RETURNS void AS $$
DECLARE
  pct NUMERIC;
  profit NUMERIC;
BEGIN
  SELECT driver_percentage / 100.0 INTO pct FROM settings LIMIT 1;
  SELECT net_profit INTO profit FROM trips WHERE id = trip_id;

  UPDATE trips SET
    driver_payment = profit * pct,
    owner_payment = profit * (1 - pct)
  WHERE id = trip_id;
END;
$$ LANGUAGE plpgsql;
```

#### 3. Триггер для автоматического пересчёта:
```sql
CREATE TRIGGER recalculate_on_insert
AFTER INSERT ON trips
FOR EACH ROW
EXECUTE FUNCTION calculate_payments(NEW.id);
```

---

## 🌐 ВАЛЮТА - КАК ЭТО РАБОТАЕТ

### Текущая реализация:
Все суммы в сомах (KGS), символ "с" жёстко закодирован

### Новая реализация:

#### 1. Утилита форматирования:
```typescript
const CURRENCY_SYMBOLS = {
  KGS: 'с',
  USD: '$',
  RUB: '₽'
};

export function formatCurrency(
  amount: number,
  currency: 'KGS' | 'USD' | 'RUB' = 'KGS'
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + symbol;
}
```

#### 2. Context для валюты:
```typescript
const CurrencyContext = createContext<{
  currency: 'KGS' | 'USD' | 'RUB';
  setCurrency: (c: 'KGS' | 'USD' | 'RUB') => void;
}>(null);

// В компонентах:
const { currency } = useCurrency();
formatCurrency(revenue, currency);
```

---

## ❓ ЧАСТЫЕ ВОПРОСЫ

### Q: Как изменить процент выплаты?
**A:** Перейдите в Настройки → Финансовые параметры → Процент выплаты водителю

### Q: Как добавить новый тип расхода?
**A:** Настройки → Типы расходов → введите название → Добавить

### Q: Как скрыть/показать sidebar?
**A:** Нажмите кнопку-гамбургер (☰) в левом верхнем углу

### Q: Почему колокольчик не работает?
**A:** Функция уведомлений ещё в разработке. Будет добавлена в следующей версии.

### Q: Как водитель отправляет данные?
**A:** Откройте `/driver-form` на телефоне, заполните форму, нажмите "Отправить"

### Q: Можно ли работать без интернета?
**A:** Пока нет, но offline режим планируется в будущих версиях

---

## 🎨 ДИЗАЙН-СИСТЕМА

### Цвета:
- **Primary:** #1E3A8A (синий) - кнопки, акценты
- **Success:** #059669 (зелёный) - прибыль, успех
- **Warning:** #F59E0B (оранжевый) - предупреждения
- **Error:** #DC2626 (красный) - ошибки, отмены
- **Secondary:** #64748B (серый) - текст, фоны

### Компоненты:
- Button (primary, secondary, ghost, outline)
- Input (text, number, date, select)
- Card (с тенями и скруглением)
- Table (с hover эффектами)
- Badge (статусы)
- Modal (модальные окна)
- LoadingSpinner

---

## 📦 ДЕПЛОЙ

### Vercel (рекомендуется):
```bash
npm install -g vercel
vercel login
vercel

# Добавить переменные окружения:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Netlify:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

---

## 🚀 БЫСТРЫЙ СТАРТ

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-repo/truck-tracker.git
cd truck-tracker

# 2. Установить зависимости
npm install

# 3. Создать .env файл
cp .env.example .env
# Добавить Supabase credentials

# 4. Запустить dev сервер
npm run dev

# 5. Открыть в браузере
http://localhost:5173
```

---

**Версия:** 2.0
**Дата обновления:** 2025-11-20
**Статус:** В разработке

