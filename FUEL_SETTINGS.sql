-- =============================================================================
-- СПРАВОЧНИК ТОПЛИВА И АВТО-РАСЧЁТЫ
-- =============================================================================
-- Выполните этот скрипт в Supabase SQL Editor
-- =============================================================================

-- 1. Добавить поля топлива в таблицу настроек
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS fuel_price_per_liter DECIMAL(10, 2) DEFAULT 58.00;

ALTER TABLE settings
ADD COLUMN IF NOT EXISTS default_fuel_consumption DECIMAL(5, 2) DEFAULT 30.00;

COMMENT ON COLUMN settings.fuel_price_per_liter IS 'Цена топлива за литр (по талонам ГСМ)';
COMMENT ON COLUMN settings.default_fuel_consumption IS 'Расход топлива по умолчанию (л/100км)';

-- 2. Добавить расход топлива к транспорту
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS fuel_consumption DECIMAL(5, 2) DEFAULT 30.00;

COMMENT ON COLUMN vehicles.fuel_consumption IS 'Расход топлива (л/100км) для конкретного транспорта';

-- 3. Обновить существующий транспорт значением по умолчанию
UPDATE vehicles
SET fuel_consumption = 30.00
WHERE fuel_consumption IS NULL;

-- 4. Добавить стоимость топлива к маршрутам (рассчитывается автоматически)
ALTER TABLE routes
ADD COLUMN IF NOT EXISTS estimated_fuel_cost DECIMAL(10, 2) DEFAULT 0;

COMMENT ON COLUMN routes.estimated_fuel_cost IS 'Расчётная стоимость топлива для маршрута';

-- 5. Функция для расчёта стоимости топлива
CREATE OR REPLACE FUNCTION calculate_fuel_cost(
    p_distance_km DECIMAL,
    p_fuel_consumption DECIMAL,
    p_fuel_price DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    -- Формула: (расстояние * расход на 100км / 100) * цена за литр
    RETURN ROUND((p_distance_km * p_fuel_consumption / 100) * p_fuel_price, 2);
END;
$$ LANGUAGE plpgsql;

-- 6. Обновить расчётную стоимость топлива для маршрутов
-- (используя значения по умолчанию из настроек)
UPDATE routes r
SET estimated_fuel_cost = calculate_fuel_cost(
    r.distance_km,
    (SELECT COALESCE(fuel_price_per_liter, 58.00) FROM settings LIMIT 1),
    (SELECT COALESCE(default_fuel_consumption, 30.00) FROM settings LIMIT 1)
);

-- 7. Триггер для автообновления estimated_fuel_cost при изменении distance_km
CREATE OR REPLACE FUNCTION update_route_fuel_cost()
RETURNS TRIGGER AS $$
DECLARE
    v_fuel_price DECIMAL;
    v_fuel_consumption DECIMAL;
BEGIN
    SELECT COALESCE(fuel_price_per_liter, 58.00), COALESCE(default_fuel_consumption, 30.00)
    INTO v_fuel_price, v_fuel_consumption
    FROM settings
    LIMIT 1;

    NEW.estimated_fuel_cost := calculate_fuel_cost(
        NEW.distance_km,
        v_fuel_consumption,
        v_fuel_price
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_route_fuel_cost ON routes;

CREATE TRIGGER trigger_update_route_fuel_cost
    BEFORE INSERT OR UPDATE OF distance_km ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_route_fuel_cost();

-- 8. Представление для просмотра расчётов топлива по маршрутам
CREATE OR REPLACE VIEW route_fuel_estimates AS
SELECT
    r.id,
    r.name,
    r.distance_km,
    r.avg_cost as standard_price,
    r.estimated_fuel_cost,
    s.fuel_price_per_liter,
    s.default_fuel_consumption,
    ROUND((r.distance_km * s.default_fuel_consumption / 100), 2) as liters_needed
FROM routes r
CROSS JOIN settings s;

COMMENT ON VIEW route_fuel_estimates IS 'Расчёты топлива по маршрутам';

-- 9. Проверка результатов
SELECT 'Настройки топлива:' as info;
SELECT fuel_price_per_liter, default_fuel_consumption FROM settings;

SELECT 'Расчёты по маршрутам:' as info;
SELECT * FROM route_fuel_estimates;

SELECT 'Транспорт с расходом топлива:' as info;
SELECT brand, model, license_plate, fuel_consumption FROM vehicles;
