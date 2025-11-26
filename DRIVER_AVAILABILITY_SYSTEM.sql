-- =============================================================================
-- СИСТЕМА СТАТУСОВ ВОДИТЕЛЕЙ (ПРОСТАЯ И НАДЁЖНАЯ)
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

COMMENT ON COLUMN drivers.availability IS 'Статус занятости: available, on_trip, off_duty';

-- 2. Установить всем водителям статус "свободен" по умолчанию
UPDATE drivers
SET availability = 'available'
WHERE availability IS NULL;

-- 3. Триггер: при создании/обновлении рейса обновляем статус водителя
CREATE OR REPLACE FUNCTION update_driver_availability_on_trip()
RETURNS TRIGGER AS $$
BEGIN
    -- Рейс стал "в процессе" → водитель "в рейсе"
    IF NEW.status = 'in_progress' THEN
        UPDATE drivers
        SET availability = 'on_trip'
        WHERE id = NEW.driver_id
        AND availability != 'off_duty';  -- Не менять если "не на смене"
    END IF;

    -- Рейс завершён/отменён → проверяем, есть ли другие активные рейсы
    IF NEW.status IN ('completed', 'cancelled') THEN
        -- Если нет других активных рейсов у этого водителя
        IF NOT EXISTS (
            SELECT 1 FROM trips
            WHERE driver_id = NEW.driver_id
            AND status = 'in_progress'
            AND id != NEW.id
        ) THEN
            UPDATE drivers
            SET availability = 'available'
            WHERE id = NEW.driver_id
            AND availability = 'on_trip';  -- Только если был "в рейсе"
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удалить старый триггер если есть
DROP TRIGGER IF EXISTS trigger_update_driver_availability ON trips;

-- Создать новый триггер
CREATE TRIGGER trigger_update_driver_availability
    AFTER INSERT OR UPDATE OF status ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_availability_on_trip();

-- 4. Синхронизировать текущие данные:
-- Водители с активными рейсами → "в рейсе"
UPDATE drivers d
SET availability = 'on_trip'
WHERE EXISTS (
    SELECT 1 FROM trips t
    WHERE t.driver_id = d.id
    AND t.status = 'in_progress'
)
AND availability != 'off_duty';

-- 5. Создать представление для просмотра "долгих" рейсов (для диспетчера)
CREATE OR REPLACE VIEW long_running_trips AS
SELECT
    t.id,
    t.trip_date,
    t.status,
    d.full_name as driver_name,
    d.phone as driver_phone,
    r.name as route_name,
    CURRENT_DATE - t.trip_date as days_since_start,
    t.comment
FROM trips t
JOIN drivers d ON t.driver_id = d.id
LEFT JOIN routes r ON t.route_id = r.id
WHERE t.status = 'in_progress'
AND t.trip_date < CURRENT_DATE - INTERVAL '3 days'
ORDER BY t.trip_date ASC;

-- Комментарий к представлению
COMMENT ON VIEW long_running_trips IS 'Рейсы в статусе "в процессе" более 3 дней - для проверки диспетчером';

-- 6. Проверка результатов
SELECT
    full_name,
    phone,
    availability,
    status
FROM drivers
ORDER BY full_name;

-- Показать долгие рейсы (если есть)
SELECT * FROM long_running_trips;
