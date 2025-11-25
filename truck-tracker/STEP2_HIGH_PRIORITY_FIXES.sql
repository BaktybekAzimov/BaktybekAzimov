-- ========================================
-- HIGH PRIORITY ИСПРАВЛЕНИЯ (ФАЗА 2)
-- Выполнить ВСЕ команды в Supabase SQL Editor
-- ========================================

-- FIX #5: Добавить updated_at на routes
-- ========================================
ALTER TABLE routes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE routes SET updated_at = created_at WHERE updated_at IS NULL;

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT '✅ FIX #5 APPLIED: updated_at на routes' as status;

-- FIX #6: Добавить updated_at на trips
-- ========================================
ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE trips SET updated_at = created_at WHERE updated_at IS NULL;

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT '✅ FIX #6 APPLIED: updated_at на trips' as status;

-- FIX #7: Валидация hire_date
-- ========================================
ALTER TABLE drivers ADD CONSTRAINT check_hire_date_not_future
CHECK (hire_date <= CURRENT_DATE);

SELECT '✅ FIX #7 APPLIED: Валидация hire_date' as status;

-- FIX #8: Валидация trip_date
-- ========================================
ALTER TABLE trips ADD CONSTRAINT check_trip_date_range
CHECK (
    trip_date <= NOW() + INTERVAL '1 day' AND
    trip_date >= NOW() - INTERVAL '10 years'
);

SELECT '✅ FIX #8 APPLIED: Валидация trip_date' as status;

-- FIX #9: Валидация license_plate
-- ========================================
-- ВАЖНО: Если получите ошибку, проверьте существующие номера
-- SELECT * FROM vehicles WHERE license_plate !~ '^[0-9]{2} [A-Z]{2,3} [0-9]{3,4} [A-Z]{2,3}$';

ALTER TABLE vehicles ADD CONSTRAINT check_license_plate_format
CHECK (license_plate ~ '^[0-9]{2} [A-Z]{2,3} [0-9]{3,4} [A-Z]{2,3}$');

SELECT '✅ FIX #9 APPLIED: Валидация license_plate' as status;

-- FIX #10: Улучшенная RLS политика для trips
-- ========================================
DROP POLICY IF EXISTS "Trips are insertable by authorized users" ON trips;

CREATE POLICY "Trips are insertable by authorized users"
ON trips FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
    -- Проверить что водитель активен
    AND EXISTS (
        SELECT 1 FROM drivers d
        WHERE d.id = trips.driver_id
        AND d.status = 'active'
    )
    -- Проверить что транспорт доступен
    AND EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = trips.vehicle_id
        AND v.status = 'available'
    )
);

SELECT '✅ FIX #10 APPLIED: Улучшенная RLS политика' as status;

-- FIX #11: Дополнительные индексы
-- ========================================
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_trips_status_date ON trips(status, trip_date DESC);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);

SELECT '✅ FIX #11 APPLIED: Дополнительные индексы' as status;

-- ========================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ========================================
SELECT
    '🎉 ВСЕ HIGH PRIORITY ИСПРАВЛЕНИЯ ПРИМЕНЕНЫ!' as message,
    (
        SELECT COUNT(*)
        FROM information_schema.columns
        WHERE table_name IN ('routes', 'trips')
        AND column_name = 'updated_at'
    ) as updated_at_columns_added,
    (
        SELECT COUNT(*)
        FROM pg_constraint
        WHERE conname IN ('check_hire_date_not_future', 'check_trip_date_range', 'check_license_plate_format')
    ) as constraints_created,
    (
        SELECT COUNT(*)
        FROM pg_indexes
        WHERE indexname IN ('idx_drivers_status', 'idx_vehicles_status', 'idx_trips_status_date', 'idx_trips_created_by')
    ) as indexes_created;
