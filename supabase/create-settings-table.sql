-- ===================================================
-- СИСТЕМА НАСТРОЕК ЧЕРЕЗ SUPABASE АДМИН ПАНЕЛЬ
-- ===================================================
-- Полный контроль через Supabase Dashboard
-- Выполнить в Supabase SQL Editor

-- 1. Создать таблицу настроек
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Финансовые настройки
  driver_payment_percentage INTEGER NOT NULL DEFAULT 30 CHECK (driver_payment_percentage >= 0 AND driver_payment_percentage <= 100),
  currency TEXT NOT NULL DEFAULT 'KGS' CHECK (currency IN ('KGS', 'USD', 'RUB')),

  -- Региональные настройки
  language TEXT NOT NULL DEFAULT 'ru' CHECK (language IN ('ru', 'ky')),
  timezone TEXT NOT NULL DEFAULT 'Asia/Bishkek',

  -- Telegram интеграция
  telegram_bot_token TEXT,
  telegram_bot_enabled BOOLEAN DEFAULT FALSE,
  telegram_admin_chat_id TEXT,
  telegram_notifications_enabled BOOLEAN DEFAULT TRUE,

  -- Виджеты аналитики на Dashboard (включить/выключить)
  widget_revenue_chart_enabled BOOLEAN DEFAULT TRUE,
  widget_routes_chart_enabled BOOLEAN DEFAULT TRUE,
  widget_recent_trips_enabled BOOLEAN DEFAULT TRUE,
  widget_vehicle_utilization_enabled BOOLEAN DEFAULT TRUE,
  widget_top_drivers_enabled BOOLEAN DEFAULT FALSE,
  widget_monthly_comparison_enabled BOOLEAN DEFAULT FALSE,

  -- Уведомления
  notifications_new_trip_enabled BOOLEAN DEFAULT TRUE,
  notifications_trip_completed_enabled BOOLEAN DEFAULT TRUE,
  notifications_daily_report_enabled BOOLEAN DEFAULT FALSE,
  notifications_weekly_report_enabled BOOLEAN DEFAULT FALSE,

  -- Другие настройки
  max_photos_per_trip INTEGER DEFAULT 3,
  photo_max_size_mb INTEGER DEFAULT 5,

  -- Метаданные
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- 2. Вставить дефолтные настройки (если таблица пустая)
INSERT INTO settings (
  driver_payment_percentage,
  currency,
  language,
  telegram_bot_enabled,
  widget_revenue_chart_enabled,
  widget_routes_chart_enabled,
  widget_recent_trips_enabled
)
SELECT 30, 'KGS', 'ru', FALSE, TRUE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- 3. Комментарии к полям для понимания
COMMENT ON TABLE settings IS 'Глобальные настройки системы. Управление через Supabase Dashboard.';

COMMENT ON COLUMN settings.driver_payment_percentage IS 'Процент выплаты водителю (0-100). Остальное - владельцу.';
COMMENT ON COLUMN settings.currency IS 'Валюта по умолчанию: KGS (сом), USD (доллар), RUB (рубль)';
COMMENT ON COLUMN settings.language IS 'Язык интерфейса: ru (русский), ky (кыргызский)';

COMMENT ON COLUMN settings.telegram_bot_token IS 'Token от @BotFather для Telegram бота';
COMMENT ON COLUMN settings.telegram_bot_enabled IS 'Включить/выключить Telegram интеграцию';
COMMENT ON COLUMN settings.telegram_admin_chat_id IS 'Chat ID администратора для уведомлений';
COMMENT ON COLUMN settings.telegram_notifications_enabled IS 'Отправлять уведомления в Telegram';

COMMENT ON COLUMN settings.widget_revenue_chart_enabled IS 'Показывать график выручки на Dashboard';
COMMENT ON COLUMN settings.widget_routes_chart_enabled IS 'Показывать график рейсов по маршрутам';
COMMENT ON COLUMN settings.widget_recent_trips_enabled IS 'Показывать последние рейсы';
COMMENT ON COLUMN settings.widget_vehicle_utilization_enabled IS 'Показывать загруженность транспорта';
COMMENT ON COLUMN settings.widget_top_drivers_enabled IS 'Показывать топ-5 водителей';
COMMENT ON COLUMN settings.widget_monthly_comparison_enabled IS 'Показывать сравнение месяцев';

-- 4. Создать функцию для получения настроек
CREATE OR REPLACE FUNCTION get_settings()
RETURNS SETOF settings AS $$
BEGIN
  RETURN QUERY SELECT * FROM settings LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Создать триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_timestamp();

-- 6. Row Level Security (RLS) политики
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Все могут читать настройки
CREATE POLICY "Allow read settings to all"
ON settings FOR SELECT
TO public
USING (true);

-- Только аутентифицированные пользователи могут изменять (для безопасности настройте отдельно)
CREATE POLICY "Allow update settings to authenticated"
ON settings FOR UPDATE
TO authenticated
USING (true);
-- ВАЖНО: После создания таблицы users с полем role, замените политику на:
-- USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 7. Создать таблицу типов расходов (управляемая через админ панель)
CREATE TABLE IF NOT EXISTS expense_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставить дефолтные типы расходов
INSERT INTO expense_types (name, description, sort_order)
VALUES
  ('Топливо', 'Расходы на топливо', 1),
  ('Обслуживание', 'Техническое обслуживание', 2),
  ('Прочие расходы', 'Другие расходы', 3)
ON CONFLICT (name) DO NOTHING;

-- RLS для expense_types
ALTER TABLE expense_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read expense_types to all"
ON expense_types FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow manage expense_types to authenticated"
ON expense_types FOR ALL
TO authenticated
USING (true);
-- ВАЖНО: После создания таблицы users с полем role, замените политику на:
-- USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ===================================================
-- КАК ИСПОЛЬЗОВАТЬ:
-- ===================================================
-- 1. Открыть Supabase Dashboard → SQL Editor
-- 2. Скопировать и выполнить этот скрипт
-- 3. Перейти в Table Editor → settings
-- 4. Изменить любые настройки через UI
--    - Включить Telegram: telegram_bot_enabled = true
--    - Добавить bot token: telegram_bot_token = 'your_token'
--    - Включить/выключить виджеты: widget_*_enabled
--    - Изменить процент водителя: driver_payment_percentage
-- 5. Приложение автоматически подхватит изменения
-- ===================================================

-- Проверить настройки:
-- SELECT * FROM settings;

-- Изменить настройки через SQL (или через Dashboard UI):
-- UPDATE settings SET driver_payment_percentage = 35 WHERE id = (SELECT id FROM settings LIMIT 1);
-- UPDATE settings SET widget_top_drivers_enabled = TRUE WHERE id = (SELECT id FROM settings LIMIT 1);
