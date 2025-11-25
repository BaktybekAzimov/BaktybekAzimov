-- ========================================
-- MEDIUM PRIORITY УЛУЧШЕНИЯ (ФАЗА 3)
-- Выполнить ВСЕ команды в Supabase SQL Editor
-- ========================================

-- FIX #13: Система audit logging
-- ========================================

-- Создать таблицу для логов
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создать индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON audit_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit_log(changed_by);

-- Создать функцию логирования
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_data, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD)::jsonb, auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW)::jsonb, auth.uid());
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Добавить триггеры на все таблицы
CREATE TRIGGER audit_drivers_trigger
    AFTER INSERT OR UPDATE OR DELETE ON drivers
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_vehicles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_routes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON routes
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_trips_trigger
    AFTER INSERT OR UPDATE OR DELETE ON trips
    FOR EACH ROW EXECUTE FUNCTION log_audit();

-- RLS для audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs viewable by admins"
ON audit_log FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' = 'admin'
    )
);

SELECT '✅ FIX #13 APPLIED: Система audit logging' as status;

-- FIX #14: Soft delete
-- ========================================

-- Добавить deleted_at колонки
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Создать индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_drivers_deleted_at ON drivers(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_deleted_at ON vehicles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_routes_deleted_at ON routes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trips_deleted_at ON trips(deleted_at) WHERE deleted_at IS NULL;

-- Обновить views чтобы игнорировать удаленные записи
DROP VIEW IF EXISTS driver_stats;
CREATE VIEW driver_stats AS
SELECT
    d.id,
    d.full_name,
    COUNT(t.id) as total_trips,
    COALESCE(SUM(t.driver_payment), 0) as total_earnings,
    COALESCE(AVG(t.driver_payment), 0) as avg_earnings_per_trip
FROM drivers d
LEFT JOIN trips t ON d.id = t.driver_id AND t.deleted_at IS NULL
WHERE d.deleted_at IS NULL
GROUP BY d.id, d.full_name;

DROP VIEW IF EXISTS vehicle_stats;
CREATE VIEW vehicle_stats AS
SELECT
    v.id,
    v.brand,
    v.model,
    v.license_plate,
    COUNT(t.id) as total_trips,
    COALESCE(SUM(t.revenue), 0) as total_revenue,
    COALESCE(SUM(t.total_costs), 0) as total_costs,
    COALESCE(SUM(t.net_profit), 0) as total_profit
FROM vehicles v
LEFT JOIN trips t ON v.id = t.vehicle_id AND t.deleted_at IS NULL
WHERE v.deleted_at IS NULL
GROUP BY v.id, v.brand, v.model, v.license_plate;

DROP VIEW IF EXISTS route_stats;
CREATE VIEW route_stats AS
SELECT
    r.id,
    r.name,
    r.distance_km,
    COUNT(t.id) as total_trips,
    COALESCE(AVG(t.revenue), 0) as avg_revenue,
    COALESCE(AVG(t.total_costs), 0) as avg_costs,
    COALESCE(AVG(t.net_profit), 0) as avg_profit
FROM routes r
LEFT JOIN trips t ON r.id = t.route_id AND t.deleted_at IS NULL
WHERE r.deleted_at IS NULL
GROUP BY r.id, r.name, r.distance_km;

SELECT '✅ FIX #14 APPLIED: Soft delete' as status;

-- FIX #15: Конфигурируемые проценты выплат
-- ========================================

-- Создать таблицу настроек
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Создать триггер updated_at для system_settings
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS для system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by all authenticated users"
ON system_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Settings editable by admins only"
ON system_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Добавить настройки процентов
INSERT INTO system_settings (key, value, description)
VALUES
    ('payment_percentages', '{"driver": 0.30, "owner": 0.70}'::jsonb, 'Проценты выплат водителю и владельцу от чистой прибыли')
ON CONFLICT (key) DO NOTHING;

-- Создать функцию для получения процента
CREATE OR REPLACE FUNCTION get_payment_percentage(role TEXT)
RETURNS NUMERIC AS $$
DECLARE
    percentage NUMERIC;
BEGIN
    SELECT (value->role)::text::numeric
    INTO percentage
    FROM system_settings
    WHERE key = 'payment_percentages';

    RETURN COALESCE(percentage, 0.5);
END;
$$ LANGUAGE plpgsql;

SELECT '✅ FIX #15 APPLIED: Конфигурируемые проценты' as status;

-- ========================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ========================================
SELECT
    '🎉 ВСЕ MEDIUM PRIORITY УЛУЧШЕНИЯ ПРИМЕНЕНЫ!' as message,
    (
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('audit_log', 'system_settings')
    ) as new_tables_created,
    (
        SELECT COUNT(*)
        FROM information_schema.columns
        WHERE table_name IN ('drivers', 'vehicles', 'routes', 'trips')
        AND column_name = 'deleted_at'
    ) as deleted_at_columns_added,
    (
        SELECT COUNT(*)
        FROM pg_trigger
        WHERE tgname LIKE 'audit_%'
    ) as audit_triggers_created;

-- Показать текущие настройки
SELECT '📊 Текущие настройки системы:' as info;
SELECT * FROM system_settings;
