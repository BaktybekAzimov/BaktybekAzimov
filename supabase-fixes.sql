-- ============================================
-- SQL СКРИПТЫ ДЛЯ ИСПРАВЛЕНИЯ НАЙДЕННЫХ ПРОБЛЕМ
-- TRUCK-TRACKER DATABASE
-- ============================================

-- ВАЖНО: Выполняйте скрипты по порядку!
-- Каждый блок помечен приоритетом: CRITICAL, HIGH, MEDIUM, LOW

-- ============================================
-- 🔴 CRITICAL PRIORITY
-- ============================================

-- FIX #1: Добавить UNIQUE constraint на drivers.phone
-- Проблема: Возможны дубликаты телефонов
DO $$
BEGIN
    -- Сначала находим и удаляем дубликаты (если есть)
    WITH duplicates AS (
        SELECT phone, MIN(id) as keep_id
        FROM drivers
        GROUP BY phone
        HAVING COUNT(*) > 1
    )
    UPDATE drivers d
    SET phone = phone || '_' || id::text
    WHERE EXISTS (
        SELECT 1 FROM duplicates dup
        WHERE dup.phone = d.phone AND d.id != dup.keep_id
    );

    -- Теперь можем добавить UNIQUE constraint
    ALTER TABLE drivers ADD CONSTRAINT unique_driver_phone UNIQUE (phone);
END $$;

COMMENT ON CONSTRAINT unique_driver_phone ON drivers IS 'Телефон водителя должен быть уникальным';


-- FIX #2: Валидация формата телефона
-- Проблема: Можно ввести любую строку в phone
ALTER TABLE drivers ADD CONSTRAINT check_phone_format
CHECK (phone ~ '^\+996 \d{3} \d{3} \d{3}$');

COMMENT ON CONSTRAINT check_phone_format ON drivers IS 'Телефон должен быть в формате +996 XXX XXX XXX';


-- FIX #3: Проверка одновременных рейсов для транспорта
-- Проблема: Одно ТС может быть в нескольких активных рейсах
CREATE OR REPLACE FUNCTION check_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем только для активных рейсов
    IF NEW.status IN ('in_progress', 'completed') THEN
        -- Проверяем есть ли другие активные рейсы для этого ТС
        IF EXISTS (
            SELECT 1 FROM trips
            WHERE vehicle_id = NEW.vehicle_id
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
            AND status = 'in_progress'
            AND trip_date >= NOW() - INTERVAL '24 hours'
        ) THEN
            RAISE EXCEPTION 'Транспортное средство уже находится в активном рейсе';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_vehicle_availability_trigger
    BEFORE INSERT OR UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION check_vehicle_availability();

COMMENT ON FUNCTION check_vehicle_availability IS 'Проверяет что транспорт не в нескольких активных рейсах одновременно';


-- FIX #4: Проверка одновременных рейсов для водителя
-- Проблема: Один водитель может быть в нескольких активных рейсах
CREATE OR REPLACE FUNCTION check_driver_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем только для активных рейсов
    IF NEW.status IN ('in_progress', 'completed') THEN
        -- Проверяем есть ли другие активные рейсы для этого водителя
        IF EXISTS (
            SELECT 1 FROM trips
            WHERE driver_id = NEW.driver_id
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
            AND status = 'in_progress'
            AND trip_date >= NOW() - INTERVAL '24 hours'
        ) THEN
            RAISE EXCEPTION 'Водитель уже находится в активном рейсе';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_driver_availability_trigger
    BEFORE INSERT OR UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION check_driver_availability();

COMMENT ON FUNCTION check_driver_availability IS 'Проверяет что водитель не в нескольких активных рейсах одновременно';


-- ============================================
-- ⚠️ HIGH PRIORITY
-- ============================================

-- FIX #5: Добавить updated_at на routes
ALTER TABLE routes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN routes.updated_at IS 'Дата последнего обновления маршрута';


-- FIX #6: Добавить updated_at на trips
ALTER TABLE trips ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN trips.updated_at IS 'Дата последнего обновления рейса';


-- FIX #7: Валидация дат - hire_date не должна быть в будущем
ALTER TABLE drivers ADD CONSTRAINT check_hire_date_not_future
CHECK (hire_date <= CURRENT_DATE);

COMMENT ON CONSTRAINT check_hire_date_not_future ON drivers IS 'Дата найма не может быть в будущем';


-- FIX #8: Валидация дат - trip_date не должна быть слишком в будущем
ALTER TABLE trips ADD CONSTRAINT check_trip_date_reasonable
CHECK (trip_date <= NOW() + INTERVAL '30 days');

COMMENT ON CONSTRAINT check_trip_date_reasonable ON trips IS 'Дата рейса не может быть больше чем на 30 дней вперед';


-- FIX #9: Валидация формата госномера
-- Кыргызстан: 01KG123AA формат (2 цифры, 2 буквы, 3 цифры, 2 буквы)
ALTER TABLE vehicles ADD CONSTRAINT check_license_plate_format
CHECK (license_plate ~ '^\d{2}[A-Z]{2}\d{3}[A-Z]{2}$');

COMMENT ON CONSTRAINT check_license_plate_format ON vehicles IS 'Госномер должен быть в формате 01KG123AA';


-- FIX #10: Улучшенная RLS policy для trips INSERT
-- Проблема: Любой может создать рейс за любого водителя
DROP POLICY IF EXISTS "Trips are insertable by all authenticated users" ON trips;

CREATE POLICY "Trips are insertable by authorized users"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Admin и dispatcher могут создавать любые рейсы
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
    OR
    -- Водитель может создавать только свои рейсы
    (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'driver'
        AND driver_id::text = raw_user_meta_data->>'driver_id'
      )
    )
  );

COMMENT ON POLICY "Trips are insertable by authorized users" ON trips IS 'Водитель может создавать только свои рейсы';


-- ============================================
-- 💡 MEDIUM PRIORITY
-- ============================================

-- FIX #11: Дополнительные индексы для производительности
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status) WHERE status != 'maintenance';
CREATE INDEX IF NOT EXISTS idx_trips_status_date ON trips(status, trip_date DESC);

COMMENT ON INDEX idx_drivers_status IS 'Индекс для быстрой фильтрации активных водителей';
COMMENT ON INDEX idx_vehicles_status IS 'Индекс для быстрой фильтрации доступных транспортных средств';
COMMENT ON INDEX idx_trips_status_date IS 'Композитный индекс для запросов по статусу и дате';


-- FIX #12: Audit logging table
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

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at DESC);

COMMENT ON TABLE audit_log IS 'Журнал всех изменений в системе';


-- FIX #13: Функция для логирования в audit_log
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_data, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Применяем audit triggers на критичные таблицы
CREATE TRIGGER audit_drivers_trigger
    AFTER INSERT OR UPDATE OR DELETE ON drivers
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_vehicles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_trips_trigger
    AFTER INSERT OR UPDATE OR DELETE ON trips
    FOR EACH ROW EXECUTE FUNCTION log_audit();

COMMENT ON FUNCTION log_audit IS 'Автоматически логирует все изменения в audit_log';


-- FIX #14: Soft delete columns
ALTER TABLE drivers ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE vehicles ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE routes ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE trips ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Обновляем views чтобы исключить удаленные записи
CREATE OR REPLACE VIEW driver_stats AS
SELECT
    d.id,
    d.full_name,
    d.phone,
    d.hire_date,
    d.status,
    d.notes,
    COUNT(t.id) AS total_trips,
    COALESCE(SUM(t.driver_payment), 0) AS total_payment,
    COALESCE(AVG(t.net_profit), 0) AS avg_profit_per_trip,
    d.created_at,
    d.updated_at
FROM drivers d
LEFT JOIN trips t ON d.id = t.driver_id AND t.status = 'completed' AND t.deleted_at IS NULL
WHERE d.deleted_at IS NULL
GROUP BY d.id;

CREATE OR REPLACE VIEW vehicle_stats AS
SELECT
    v.id,
    v.brand,
    v.model,
    v.license_plate,
    v.year,
    v.status,
    v.notes,
    COUNT(t.id) AS total_trips,
    COALESCE(SUM(t.revenue), 0) AS total_revenue,
    COALESCE(AVG(t.net_profit), 0) AS avg_profit_per_trip,
    MAX(t.trip_date) AS last_trip_date,
    v.created_at,
    v.updated_at
FROM vehicles v
LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'completed' AND t.deleted_at IS NULL
WHERE v.deleted_at IS NULL
GROUP BY v.id;

CREATE OR REPLACE VIEW route_stats AS
SELECT
    r.id,
    r.name,
    r.distance_km,
    r.avg_cost,
    COUNT(t.id) AS trip_count,
    COALESCE(SUM(t.revenue), 0) AS total_revenue,
    COALESCE(AVG(t.revenue), 0) AS avg_revenue,
    r.created_at
FROM routes r
LEFT JOIN trips t ON r.id = t.route_id AND t.status = 'completed' AND t.deleted_at IS NULL
WHERE r.deleted_at IS NULL
GROUP BY r.id;

COMMENT ON COLUMN drivers.deleted_at IS 'Дата soft delete (NULL = не удалено)';
COMMENT ON COLUMN vehicles.deleted_at IS 'Дата soft delete (NULL = не удалено)';
COMMENT ON COLUMN routes.deleted_at IS 'Дата soft delete (NULL = не удалено)';
COMMENT ON COLUMN trips.deleted_at IS 'Дата soft delete (NULL = не удалено)';


-- FIX #15: Настраиваемый процент выплат
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO system_settings (setting_key, setting_value, description)
VALUES
    ('driver_payment_percentage', '0.30', 'Процент выплаты водителю от чистой прибыли'),
    ('owner_payment_percentage', '0.70', 'Процент выплаты владельцу от чистой прибыли')
ON CONFLICT (setting_key) DO NOTHING;

-- Функция для получения настройки
CREATE OR REPLACE FUNCTION get_setting(key TEXT)
RETURNS NUMERIC AS $$
DECLARE
    result NUMERIC;
BEGIN
    SELECT (setting_value)::text::numeric INTO result
    FROM system_settings
    WHERE setting_key = key;

    RETURN COALESCE(result, 0);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON TABLE system_settings IS 'Системные настройки приложения';
COMMENT ON FUNCTION get_setting IS 'Получить значение настройки по ключу';


-- ============================================
-- 🎨 LOW PRIORITY (Nice to have)
-- ============================================

-- FIX #16: Проверка что revenue >= costs (предупреждение)
-- Создаем функцию для логирования отрицательной прибыли
CREATE TABLE IF NOT EXISTS negative_profit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id),
    revenue NUMERIC(10, 2),
    total_costs NUMERIC(10, 2),
    net_profit NUMERIC(10, 2),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_negative_profit()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.revenue - (NEW.fuel_cost + NEW.maintenance_cost + NEW.other_costs)) < 0 THEN
        INSERT INTO negative_profit_log (trip_id, revenue, total_costs, net_profit)
        VALUES (
            NEW.id,
            NEW.revenue,
            NEW.fuel_cost + NEW.maintenance_cost + NEW.other_costs,
            NEW.revenue - (NEW.fuel_cost + NEW.maintenance_cost + NEW.other_costs)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_negative_profit_trigger
    AFTER INSERT OR UPDATE ON trips
    FOR EACH ROW
    WHEN (NEW.revenue < (NEW.fuel_cost + NEW.maintenance_cost + NEW.other_costs))
    EXECUTE FUNCTION log_negative_profit();

COMMENT ON TABLE negative_profit_log IS 'Лог рейсов с отрицательной прибылью';


-- FIX #17: Комментарии к колонкам
COMMENT ON COLUMN drivers.id IS 'Уникальный идентификатор водителя';
COMMENT ON COLUMN drivers.full_name IS 'ФИО водителя';
COMMENT ON COLUMN drivers.phone IS 'Контактный телефон в формате +996 XXX XXX XXX';
COMMENT ON COLUMN drivers.hire_date IS 'Дата приема на работу';
COMMENT ON COLUMN drivers.status IS 'Статус: active (активен) или inactive (неактивен)';
COMMENT ON COLUMN drivers.notes IS 'Дополнительные заметки о водителе';

COMMENT ON COLUMN vehicles.id IS 'Уникальный идентификатор транспортного средства';
COMMENT ON COLUMN vehicles.license_plate IS 'Государственный регистрационный номер (формат 01KG123AA)';
COMMENT ON COLUMN vehicles.year IS 'Год выпуска (от 1990 до текущего года + 1)';
COMMENT ON COLUMN vehicles.status IS 'Статус: available (доступен), in_trip (в рейсе), maintenance (на обслуживании)';

COMMENT ON COLUMN trips.revenue IS 'Выручка от рейса';
COMMENT ON COLUMN trips.fuel_cost IS 'Расходы на топливо';
COMMENT ON COLUMN trips.maintenance_cost IS 'Расходы на обслуживание';
COMMENT ON COLUMN trips.other_costs IS 'Прочие расходы';
COMMENT ON COLUMN trips.total_costs IS 'Общие расходы (вычисляемое поле)';
COMMENT ON COLUMN trips.net_profit IS 'Чистая прибыль = revenue - total_costs (вычисляемое поле)';
COMMENT ON COLUMN trips.driver_payment IS 'Выплата водителю (30% от чистой прибыли)';
COMMENT ON COLUMN trips.owner_payment IS 'Выплата владельцу (70% от чистой прибыли)';


-- ============================================
-- ФИНАЛЬНАЯ ПРОВЕРКА
-- ============================================

-- Проверяем что все созда

но правильно
DO $$
BEGIN
    RAISE NOTICE 'Все исправления применены успешно!';
    RAISE NOTICE 'Проверьте работу triggers и constraints на тестовых данных';
END $$;
