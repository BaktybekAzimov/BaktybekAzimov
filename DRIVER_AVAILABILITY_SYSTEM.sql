-- =============================================================================
-- АВТОМАТИЧЕСКАЯ СИСТЕМА СТАТУСОВ ВОДИТЕЛЕЙ И РЕЙСОВ
-- =============================================================================
-- Выполните этот скрипт в Supabase SQL Editor
-- =============================================================================

-- 1. Добавить колонку availability (занятость) к водителям
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS availability VARCHAR(20) DEFAULT 'available';

-- Возможные значения:
-- 'available' - свободен, готов к рейсу
-- 'on_trip' - в рейсе
-- 'off_duty' - не на смене (выходной, отпуск, болезнь)

COMMENT ON COLUMN drivers.availability IS 'Текущий статус занятости водителя: available, on_trip, off_duty';

-- 2. Исправить застрявшие рейсы (старше 48 часов в статусе in_progress)
UPDATE trips
SET status = 'completed',
    comment = COALESCE(comment, '') || ' [Автозавершён системой]'
WHERE status = 'in_progress'
  AND trip_date < CURRENT_DATE - INTERVAL '2 days';

-- 3. Обновить статус всех водителей на основе их рейсов
-- Водители с активными рейсами → on_trip
UPDATE drivers d
SET availability = 'on_trip'
WHERE EXISTS (
    SELECT 1 FROM trips t
    WHERE t.driver_id = d.id
    AND t.status = 'in_progress'
);

-- Водители без активных рейсов → available (если не off_duty)
UPDATE drivers d
SET availability = 'available'
WHERE NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.driver_id = d.id
    AND t.status = 'in_progress'
)
AND (availability IS NULL OR availability = 'on_trip');

-- 4. Создать функцию для автоматического обновления статуса водителя
CREATE OR REPLACE FUNCTION update_driver_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- При изменении статуса рейса на in_progress
    IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status != 'in_progress') THEN
        UPDATE drivers SET availability = 'on_trip' WHERE id = NEW.driver_id;
    END IF;

    -- При изменении статуса рейса на completed или cancelled
    IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'in_progress' THEN
        -- Проверяем, есть ли у водителя другие активные рейсы
        IF NOT EXISTS (
            SELECT 1 FROM trips
            WHERE driver_id = NEW.driver_id
            AND status = 'in_progress'
            AND id != NEW.id
        ) THEN
            -- Если водитель не off_duty, ставим available
            UPDATE drivers
            SET availability = 'available'
            WHERE id = NEW.driver_id
            AND availability != 'off_duty';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Создать триггер на таблицу trips
DROP TRIGGER IF EXISTS trigger_update_driver_availability ON trips;
CREATE TRIGGER trigger_update_driver_availability
    AFTER INSERT OR UPDATE OF status ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_availability();

-- 6. Создать функцию для автозавершения старых рейсов (можно вызывать по cron)
CREATE OR REPLACE FUNCTION auto_complete_old_trips()
RETURNS INTEGER AS $$
DECLARE
    completed_count INTEGER;
BEGIN
    WITH updated AS (
        UPDATE trips
        SET status = 'completed',
            comment = COALESCE(comment, '') || ' [Автозавершён системой ' || NOW()::DATE || ']'
        WHERE status = 'in_progress'
        AND trip_date < CURRENT_DATE - INTERVAL '2 days'
        RETURNING driver_id
    )
    SELECT COUNT(*) INTO completed_count FROM updated;

    -- Обновляем статусы водителей
    UPDATE drivers d
    SET availability = 'available'
    WHERE availability = 'on_trip'
    AND NOT EXISTS (
        SELECT 1 FROM trips t
        WHERE t.driver_id = d.id
        AND t.status = 'in_progress'
    );

    RETURN completed_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Проверка результатов
SELECT
    d.full_name,
    d.availability,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as active_trips,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_trips
FROM drivers d
LEFT JOIN trips t ON d.id = t.driver_id
GROUP BY d.id, d.full_name, d.availability
ORDER BY d.full_name;

-- Показать статистику рейсов по статусам
SELECT status, COUNT(*) as count
FROM trips
GROUP BY status
ORDER BY count DESC;
