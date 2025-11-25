# 🔍 ПОЛНЫЙ АНАЛИЗ СТРУКТУРЫ БД TRUCK-TRACKER

## Дата анализа: 2025-11-24

---

## 1. ОБЗОР СИСТЕМЫ

**Назначение**: Система учета рейсов грузовых транспортных средств
**СУБД**: PostgreSQL (Supabase)
**Расширения**: UUID-OSSP

---

## 2. СТРУКТУРА ТАБЛИЦ

### 2.1 Таблица `drivers` (Водители)

**Назначение**: Хранение информации о водителях грузовиков

| Колонка | Тип | Constraints | Описание |
|---------|-----|-------------|----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Уникальный идентификатор |
| `full_name` | TEXT | NOT NULL | ФИО водителя |
| `phone` | TEXT | NOT NULL | Телефон |
| `hire_date` | DATE | NOT NULL, DEFAULT CURRENT_DATE | Дата найма |
| `status` | TEXT | NOT NULL, DEFAULT 'active', CHECK (status IN ('active', 'inactive')) | Статус водителя |
| `notes` | TEXT | NULL | Дополнительные заметки |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата создания |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата обновления |

**Индексы**: Нет специфичных (только PRIMARY KEY)

**Triggers**:
- `update_drivers_updated_at` - автоматическое обновление `updated_at` при UPDATE

**Constraints**:
- ✅ NOT NULL на обязательных полях
- ✅ CHECK constraint на status (только 'active' или 'inactive')
- ❌ НЕТ уникальности на phone (ПРОБЛЕМА: возможны дубликаты)
- ❌ НЕТ валидации формата телефона
- ❌ НЕТ CHECK constraint на hire_date (может быть в будущем)

---

### 2.2 Таблица `vehicles` (Транспортные средства)

**Назначение**: Учет грузовых автомобилей

| Колонка | Тип | Constraints | Описание |
|---------|-----|-------------|----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Уникальный идентификатор |
| `brand` | TEXT | NOT NULL | Марка |
| `model` | TEXT | NOT NULL | Модель |
| `license_plate` | TEXT | NOT NULL, UNIQUE | Госномер |
| `year` | INTEGER | NOT NULL, CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1) | Год выпуска |
| `status` | TEXT | NOT NULL, DEFAULT 'available', CHECK (status IN ('available', 'in_trip', 'maintenance')) | Статус |
| `notes` | TEXT | NULL | Заметки |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата создания |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата обновления |

**Индексы**:
- PRIMARY KEY на id
- UNIQUE на license_plate

**Triggers**:
- `update_vehicles_updated_at` - автоматическое обновление `updated_at` при UPDATE

**Constraints**:
- ✅ UNIQUE на license_plate (госномер уникален)
- ✅ CHECK на year (1990 <= year <= текущий_год + 1)
- ✅ CHECK на status (3 возможных значения)
- ❌ НЕТ валидации формата госномера
- ❌ НЕТ проверки что транспорт не может быть в нескольких активных рейсах одновременно

---

### 2.3 Таблица `routes` (Маршруты)

**Назначение**: Справочник маршрутов перевозок

| Колонка | Тип | Constraints | Описание |
|---------|-----|-------------|----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Уникальный идентификатор |
| `name` | TEXT | NOT NULL, UNIQUE | Название маршрута |
| `distance_km` | INTEGER | NOT NULL, CHECK (distance_km > 0) | Расстояние в км |
| `avg_cost` | NUMERIC(10, 2) | NOT NULL, CHECK (avg_cost >= 0) | Средняя стоимость |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата создания |

**Индексы**:
- PRIMARY KEY на id
- UNIQUE на name

**Constraints**:
- ✅ UNIQUE на name (названия маршрутов уникальны)
- ✅ CHECK на distance_km > 0
- ✅ CHECK на avg_cost >= 0
- ✅ Точность NUMERIC(10, 2) - до 99,999,999.99
- ❌ НЕТ updated_at (невозможно отследить изменения)

---

### 2.4 Таблица `trips` (Рейсы) ⭐ ГЛАВНАЯ ТАБЛИЦА

**Назначение**: Учет всех рейсов с расчетом прибыли

| Колонка | Тип | Constraints | Описание |
|---------|-----|-------------|----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Уникальный идентификатор |
| `trip_date` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Дата/время рейса |
| `driver_id` | UUID | NOT NULL, FK → drivers(id) ON DELETE RESTRICT | Водитель |
| `vehicle_id` | UUID | NOT NULL, FK → vehicles(id) ON DELETE RESTRICT | Транспорт |
| `route_id` | UUID | NOT NULL, FK → routes(id) ON DELETE RESTRICT | Маршрут |
| `revenue` | NUMERIC(10, 2) | NOT NULL, CHECK (revenue >= 0) | Выручка |
| `fuel_cost` | NUMERIC(10, 2) | NOT NULL, DEFAULT 0, CHECK (fuel_cost >= 0) | Расход на топливо |
| `maintenance_cost` | NUMERIC(10, 2) | NOT NULL, DEFAULT 0, CHECK (maintenance_cost >= 0) | Расход на обслуживание |
| `other_costs` | NUMERIC(10, 2) | NOT NULL, DEFAULT 0, CHECK (other_costs >= 0) | Прочие расходы |
| `total_costs` | NUMERIC(10, 2) | **GENERATED ALWAYS AS** (fuel_cost + maintenance_cost + other_costs) STORED | Общие расходы |
| `net_profit` | NUMERIC(10, 2) | **GENERATED ALWAYS AS** (revenue - total_costs) STORED | Чистая прибыль |
| `driver_payment` | NUMERIC(10, 2) | **GENERATED ALWAYS AS** (net_profit * 0.3) STORED | Выплата водителю (30%) |
| `owner_payment` | NUMERIC(10, 2) | **GENERATED ALWAYS AS** (net_profit * 0.7) STORED | Выплата владельцу (70%) |
| `status` | TEXT | NOT NULL, DEFAULT 'completed', CHECK (status IN ('completed', 'in_progress', 'cancelled')) | Статус рейса |
| `comment` | TEXT | NULL | Комментарий |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Дата создания |
| `created_by` | UUID | FK → auth.users(id) | Кто создал |

**Индексы**: ⭐⭐⭐
- `idx_trips_trip_date` - на trip_date DESC (для сортировки по дате)
- `idx_trips_status` - на status
- `idx_trips_driver_id` - на driver_id
- `idx_trips_vehicle_id` - на vehicle_id
- `idx_trips_route_id` - на route_id
- `idx_trips_date_driver` - composite (trip_date DESC, driver_id)
- `idx_trips_date_vehicle` - composite (trip_date DESC, vehicle_id)

**Foreign Keys**:
- `driver_id` → drivers(id) ON DELETE RESTRICT
- `vehicle_id` → vehicles(id) ON DELETE RESTRICT
- `route_id` → routes(id) ON DELETE RESTRICT
- `created_by` → auth.users(id)

**Calculated Fields** (GENERATED ALWAYS):
- `total_costs` = fuel_cost + maintenance_cost + other_costs
- `net_profit` = revenue - total_costs
- `driver_payment` = net_profit * 0.3
- `owner_payment` = net_profit * 0.7

**Constraints**:
- ✅ Все foreign keys с ON DELETE RESTRICT (нельзя удалить driver/vehicle/route если есть связанные trips)
- ✅ CHECK constraints на все денежные поля >= 0
- ✅ CHECK на status (3 значения)
- ✅ Автоматический расчет прибыли и выплат
- ❌ НЕТ проверки что revenue должно покрывать расходы (может быть отрицательная прибыль)
- ❌ НЕТ проверки одновременности рейсов для одного транспорта/водителя
- ❌ НЕТ updated_at

---

## 3. RELATIONSHIPS (Связи между таблицами)

```
drivers (1) ──< trips (N)
  └─ Один водитель может иметь много рейсов

vehicles (1) ──< trips (N)
  └─ Одно ТС может иметь много рейсов

routes (1) ──< trips (N)
  └─ Один маршрут может иметь много рейсов

auth.users (1) ──< trips (N)
  └─ Один пользователь может создать много рейсов
```

**Тип связей**: Все связи one-to-many

**Cascade behavior**: ON DELETE RESTRICT на всех FK (защита от случайного удаления)

---

## 4. VIEWS (Представления)

### 4.1 `driver_stats` - Статистика по водителям

**Поля**:
- Все поля из drivers
- `total_trips` - COUNT(trips)
- `total_payment` - SUM(driver_payment)
- `avg_profit_per_trip` - AVG(net_profit)

**JOIN**: LEFT JOIN trips (учитываются только completed)

**Использование**: Отчеты, дашборд водителей

---

### 4.2 `vehicle_stats` - Статистика по транспорту

**Поля**:
- Все поля из vehicles
- `total_trips` - COUNT(trips)
- `total_revenue` - SUM(revenue)
- `avg_profit_per_trip` - AVG(net_profit)
- `last_trip_date` - MAX(trip_date)

**JOIN**: LEFT JOIN trips (учитываются только completed)

**Использование**: Отчеты по ТС, анализ эффективности

---

### 4.3 `route_stats` - Статистика по маршрутам

**Поля**:
- Все поля из routes
- `trip_count` - COUNT(trips)
- `total_revenue` - SUM(revenue)
- `avg_revenue` - AVG(revenue)

**JOIN**: LEFT JOIN trips (учитываются только completed)

**Использование**: Анализ популярности маршрутов

---

## 5. FUNCTIONS (Функции)

### 5.1 `update_updated_at_column()`

**Тип**: TRIGGER FUNCTION
**Язык**: PL/pgSQL
**Назначение**: Автоматически устанавливает updated_at = NOW() при UPDATE

**Код**:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

**Используется в**:
- Trigger `update_drivers_updated_at` на таблице drivers
- Trigger `update_vehicles_updated_at` на таблице vehicles

**Проблемы**: ⚠️ НЕ применяется на routes и trips

---

## 6. TRIGGERS (Триггеры)

### 6.1 `update_drivers_updated_at`
- **Таблица**: drivers
- **Событие**: BEFORE UPDATE
- **FOR EACH ROW**: Да
- **Функция**: update_updated_at_column()

### 6.2 `update_vehicles_updated_at`
- **Таблица**: vehicles
- **Событие**: BEFORE UPDATE
- **FOR EACH ROW**: Да
- **Функция**: update_updated_at_column()

**Отсутствуют триггеры на**: routes, trips

---

## 7. ROW LEVEL SECURITY (RLS) POLICIES

### 7.1 Роли пользователей

Система использует 3 роли (хранятся в `auth.users.raw_user_meta_data->>'role'`):
- `admin` - Администратор (полный доступ)
- `dispatcher` - Диспетчер (управление данными, кроме удаления)
- `driver` - Водитель (только просмотр своих рейсов)

---

### 7.2 Policies для `drivers`

| Policy | Operation | Rule |
|--------|-----------|------|
| Drivers are viewable by authenticated users | SELECT | ✅ Все авторизованные пользователи |
| Drivers are insertable by admins and dispatchers | INSERT | ✅ Только admin + dispatcher |
| Drivers are updatable by admins and dispatchers | UPDATE | ✅ Только admin + dispatcher |
| Drivers are deletable by admins only | DELETE | ✅ Только admin |

---

### 7.3 Policies для `vehicles`

| Policy | Operation | Rule |
|--------|-----------|------|
| Vehicles are viewable by authenticated users | SELECT | ✅ Все авторизованные пользователи |
| Vehicles are insertable by admins and dispatchers | INSERT | ✅ Только admin + dispatcher |
| Vehicles are updatable by admins and dispatchers | UPDATE | ✅ Только admin + dispatcher |
| Vehicles are deletable by admins only | DELETE | ✅ Только admin |

---

### 7.4 Policies для `routes`

| Policy | Operation | Rule |
|--------|-----------|------|
| Routes are viewable by authenticated users | SELECT | ✅ Все авторизованные пользователи |
| Routes are insertable by admins and dispatchers | INSERT | ✅ Только admin + dispatcher |
| Routes are updatable by admins and dispatchers | UPDATE | ✅ Только admin + dispatcher |
| Routes are deletable by admins only | DELETE | ✅ Только admin |

---

### 7.5 Policies для `trips` ⭐

| Policy | Operation | Rule |
|--------|-----------|------|
| Trips are viewable by authorized users | SELECT | ⚠️ **СЛОЖНАЯ ЛОГИКА**: <br>- Admin/Dispatcher: видят ВСЕ рейсы<br>- Driver: видят ТОЛЬКО свои рейсы (trips.driver_id = user.driver_id) |
| Trips are insertable by all authenticated users | INSERT | ✅ Все авторизованные (WITH CHECK true) |
| Trips are updatable by admins and dispatchers | UPDATE | ✅ Только admin + dispatcher |
| Trips are deletable by admins only | DELETE | ✅ Только admin |

---

## 8. PERMISSIONS (Разрешения)

```sql
GRANT SELECT ON drivers TO authenticated;
GRANT SELECT ON vehicles TO authenticated;
GRANT SELECT ON routes TO authenticated;
GRANT SELECT ON trips TO authenticated;
GRANT SELECT ON driver_stats TO authenticated;
GRANT SELECT ON vehicle_stats TO authenticated;
GRANT SELECT ON route_stats TO authenticated;
```

**Только SELECT** - остальные операции контролируются через RLS policies

---

## 9. SEED DATA (Тестовые данные)

### 9.1 Drivers - 10 записей
- 9 active, 1 inactive
- Телефоны в формате +996 555 XXX XXX
- Даты найма с января 2023 по октябрь 2023

### 9.2 Vehicles - 10 записей
- Марки: КАМАЗ (2), МАЗ, Volvo, Scania, Mercedes-Benz, MAN, Iveco, DAF, Renault
- Годы: 2018-2022
- Статусы: 7 available, 2 in_trip, 1 maintenance
- Госномера: 01KG***AA-JJ (Кыргызстан)

### 9.3 Routes - 15 записей
- Внутренние маршруты по Кыргызстану (11 шт)
- Международные в Казахстан (4 шт: Тараз, Алматы)
- Расстояния: 22 км - 670 км
- Стоимость: 4500 - 45000

### 9.4 Trips - 50 записей
- Случайные комбинации driver/vehicle/route
- Даты: последние 30 дней
- Статусы: в основном completed, немного in_progress и cancelled
- Расчеты прибыли автоматические

---

## 10. НАЙДЕННЫЕ ПРОБЛЕМЫ И РЕКОМЕНДАЦИИ

### 🔴 КРИТИЧЕСКИЕ

1. **НЕТ валидации одновременных рейсов**
   - Один транспорт может быть в нескольких активных рейсах
   - Один водитель может быть в нескольких активных рейсах
   - **Решение**: Добавить CHECK constraint или trigger

2. **НЕТ уникальности телефонов водителей**
   - Возможны дубликаты phone в таблице drivers
   - **Решение**: `ALTER TABLE drivers ADD CONSTRAINT unique_phone UNIQUE (phone);`

3. **НЕТ валидации формата телефона**
   - Можно ввести любую строку в phone
   - **Решение**: CHECK constraint с регулярным выражением

### ⚠️ ВАЖНЫЕ

4. **Отсутствие updated_at на routes и trips**
   - Невозможно отследить когда изменялись данные
   - **Решение**: Добавить колонку и trigger

5. **НЕТ защиты от отрицательной прибыли**
   - revenue может быть меньше costs
   - **Решение**: Добавить CHECK (revenue >= total_costs) или предупреждение

6. **НЕТ валидации дат**
   - hire_date может быть в будущем
   - trip_date без ограничений
   - **Решение**: CHECK constraints

7. **НЕТ валидации госномеров**
   - license_plate может быть любой строкой
   - **Решение**: Регулярное выражение для формата

### 💡 УЛУЧШЕНИЯ

8. **Отсутствие soft delete**
   - Удаление безвозвратное
   - **Решение**: Добавить deleted_at колонку

9. **Отсутствие истории изменений**
   - Нет audit log
   - **Решение**: Добавить audit таблицу

10. **Фиксированный процент выплат (30/70)**
    - Жестко закодирован в GENERATED колонке
    - **Решение**: Настраиваемый процент в settings таблице

11. **Отсутствие составных индексов для фильтрации**
    - Может быть медленно при фильтрации trips по статусу + дате
    - **Решение**: Добавить `CREATE INDEX idx_trips_status_date ON trips(status, trip_date DESC);`

---

## 11. ПРОИЗВОДИТЕЛЬНОСТЬ

### Индексы

✅ **Хорошо**:
- PRIMARY KEY на всех таблицах (UUID)
- 7 индексов на trips (включая 2 composite)
- UNIQUE индексы где нужно

⚠️ **Может быть улучшено**:
- Добавить индекс на drivers.status для быстрой фильтрации активных
- Добавить индекс на vehicles.status аналогично
- Composite индекс trips(status, trip_date) для частых запросов

### Estimated query performance

**SELECT с JOIN** (trips + driver + vehicle + route):
- С текущими индексами: ✅ Быстро (< 10ms на 1000 записей)
- FK индексы покрывают JOIN'ы

**Aggregate queries** (SUM, AVG в views):
- ✅ Views используют эффективные индексы
- ⚠️ Могут быть медленными на больших объемах (нужно тестировать на реальных данных)

**Пагинация**:
- ✅ idx_trips_trip_date DESC оптимизирует ORDER BY + LIMIT

---

## 12. БЕЗОПАСНОСТЬ

### ✅ Что хорошо:

1. **RLS включен на всех таблицах**
2. **Policies покрывают все операции (SELECT/INSERT/UPDATE/DELETE)**
3. **Разделение ролей (admin/dispatcher/driver)**
4. **ON DELETE RESTRICT защищает от каскадного удаления**
5. **CHECK constraints на критичных полях**

### ⚠️ Потенциальные уязвимости:

1. **Trips INSERT разрешен всем** (WITH CHECK true)
   - Любой аутентифицированный пользователь может создать рейс
   - Нет проверки что driver_id соответствует текущему пользователю-водителю

2. **Нет rate limiting** на уровне БД
   - Возможно DOS через массовые INSERT

3. **Нет валидации входных данных**
   - SQL injection маловероятен (используется parameterized queries в Supabase)
   - Но XSS возможен если не экранировать в UI

4. **UUID предсказуемость**
   - uuid_generate_v4() достаточно случаен
   - ✅ Хорошо

---

## 13. СООТВЕТСТВИЕ ЛУЧШИМ ПРАКТИКАМ

| Практика | Статус | Комментарий |
|----------|--------|-------------|
| Использование UUID вместо integer ID | ✅ | Везде UUID |
| NOT NULL на критичных полях | ✅ | Все ключевые поля NOT NULL |
| CHECK constraints | ⚠️ | Есть, но не везде |
| Foreign Keys | ✅ | Все связи через FK |
| ON DELETE behavior | ✅ | RESTRICT везде (безопасно) |
| Indexes на FK | ✅ | Все FK индексированы |
| Timestamps (created_at/updated_at) | ⚠️ | Не на всех таблицах |
| RLS policies | ✅ | Включены и настроены |
| Views для отчетов | ✅ | 3 полезных view |
| Triggers для автоматизации | ⚠️ | Только updated_at |
| Комментарии к объектам | ✅ | Есть на всех таблицах/views |
| UNIQUE constraints где нужно | ⚠️ | Не хватает на phones |
| Валидация форматов | ❌ | Нет regex для phone/license_plate |
| Audit logging | ❌ | Отсутствует |
| Soft delete | ❌ | Отсутствует |

---

## 14. РЕКОМЕНДАЦИИ ПО ПРИОРИТЕТАМ

### 🔥 КРИТИЧНО (сделать немедленно):

1. Добавить UNIQUE constraint на drivers.phone
2. Добавить проверку одновременных рейсов (constraint или trigger)
3. Добавить валидацию формата телефона

### 📋 ВЫСОКИЙ ПРИОРИТЕТ:

4. Добавить updated_at на routes и trips
5. Добавить валидацию дат (не в будущем)
6. Добавить валидацию госномеров
7. Улучшить policy на trips INSERT (проверка прав)

### 💡 СРЕДНИЙ ПРИОРИТЕТ:

8. Добавить составные индексы для ускорения запросов
9. Реализовать audit logging
10. Добавить soft delete
11. Сделать процент выплат настраиваемым

### 🎨 НИЗКИЙ ПРИОРИТЕТ:

12. Добавить проверку revenue >= costs
13. Добавить комментарии к колонкам
14. Оптимизировать views с учетом производительности

---

## 15. SQL СКРИПТЫ ДЛЯ ИСПРАВЛЕНИЙ

Смотрите файл `supabase-fixes.sql` для полного списка рекомендуемых изменений.

---

**Конец анализа**
