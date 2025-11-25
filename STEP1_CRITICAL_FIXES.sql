-- ========================================
-- КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (ФАЗА 1)
-- Выполнить ВСЕ команды в Supabase SQL Editor
-- ========================================

-- FIX #1: UNIQUE constraint на phone
-- ========================================
DO $$
DECLARE
    dup_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO dup_count
    FROM (
        SELECT phone, COUNT(*) as cnt
        FROM drivers
        GROUP BY phone
        HAVING COUNT(*) > 1
    ) sub;

    IF dup_count > 0 THEN
        RAISE NOTICE 'Найдено % дубликатов телефонов, исправляю...', dup_count;

        WITH duplicates AS (
            SELECT phone, MIN(id) as keep_id
            FROM drivers
            GROUP BY phone
            HAVING COUNT(*) > 1
        )
        UPDATE drivers d
        SET phone = phone || '_' || SUBSTRING(d.id::text, 1, 8)
        WHERE EXISTS (
            SELECT 1 FROM duplicates dup
            WHERE dup.phone = d.phone AND d.id != dup.keep_id
        );

        RAISE NOTICE 'Дубликаты обработаны';
    ELSE
        RAISE NOTICE 'Дубликатов не найдено';
    END IF;
END $$;

ALTER TABLE drivers ADD CONSTRAINT unique_driver_phone UNIQUE (phone);

SELECT '✅ FIX #1 APPLIED: UNIQUE constraint на phone' as status;

-- FIX #2: Валидация формата телефона
-- ========================================
-- ВАЖНО: Если получите ошибку, сначала исправьте существующие телефоны
-- Посмотреть проблемные: SELECT * FROM drivers WHERE phone !~ '^\+996 \d{3} \d{3} \d{3}$';

ALTER TABLE drivers ADD CONSTRAINT check_phone_format
CHECK (phone ~ '^\+996 \d{3} \d{3} \d{3}$');

SELECT '✅ FIX #2 APPLIED: Валидация формата телефона' as status;

-- FIX #3: Проверка доступности транспорта
-- ========================================
CREATE OR REPLACE FUNCTION check_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('in_progress', 'completed') THEN
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

SELECT '✅ FIX #3 APPLIED: Проверка доступности транспорта' as status;

-- FIX #4: Проверка доступности водителя
-- ========================================
CREATE OR REPLACE FUNCTION check_driver_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('in_progress', 'completed') THEN
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

SELECT '✅ FIX #4 APPLIED: Проверка доступности водителя' as status;

-- ========================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ========================================
SELECT
    '🎉 ВСЕ КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ ПРИМЕНЕНЫ!' as message,
    (
        SELECT COUNT(*)
        FROM pg_constraint
        WHERE conname IN ('unique_driver_phone', 'check_phone_format')
    ) as constraints_created,
    (
        SELECT COUNT(*)
        FROM pg_trigger
        WHERE tgname IN ('check_vehicle_availability_trigger', 'check_driver_availability_trigger')
    ) as triggers_created;
