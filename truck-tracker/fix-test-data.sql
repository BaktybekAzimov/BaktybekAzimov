-- ИСПРАВЛЕНИЕ ТЕСТОВЫХ ДАННЫХ
-- Удаление старых данных и создание правильных с положительной прибылью

-- ============================================
-- 1. Удаляем старые тестовые данные
-- ============================================

DELETE FROM trips;
DELETE FROM routes WHERE id NOT IN (SELECT DISTINCT route_id FROM trips WHERE route_id IS NOT NULL);
DELETE FROM vehicles WHERE id NOT IN (SELECT DISTINCT vehicle_id FROM trips WHERE vehicle_id IS NOT NULL);
DELETE FROM drivers WHERE id NOT IN (SELECT DISTINCT driver_id FROM trips WHERE driver_id IS NOT NULL);

-- Сбрасываем счетчики
ALTER SEQUENCE trips_id_seq RESTART WITH 1;
ALTER SEQUENCE routes_id_seq RESTART WITH 1;
ALTER SEQUENCE vehicles_id_seq RESTART WITH 1;
ALTER SEQUENCE drivers_id_seq RESTART WITH 1;

-- ============================================
-- 2. Создаем водителей (10 штук)
-- ============================================

INSERT INTO drivers (full_name, phone, hire_date, status) VALUES
('Сергей Сидоров', '+996 555 123 456', '2023-01-15', 'active'),
('Андрей Козлов', '+996 555 456 789', '2023-04-05', 'active'),
('Евгений Лебедев', '+996 555 012 345', '2023-10-25', 'active'),
('Дмитрий Иванов', '+996 555 234 567', '2023-02-20', 'active'),
('Владимир Морозов', '+996 555 678 901', '2023-06-18', 'active'),
('Алексей Петров', '+996 555 345 678', '2023-03-10', 'active'),
('Николай Смирнов', '+996 555 789 012', '2023-07-22', 'active'),
('Михаил Волков', '+996 555 901 234', '2023-05-08', 'active'),
('Игорь Соколов', '+996 555 567 890', '2023-08-14', 'active'),
('Павел Новиков', '+996 555 890 123', '2023-09-30', 'active');

-- ============================================
-- 3. Создаем автомобили (10 штук)
-- ============================================

INSERT INTO vehicles (brand, model, license_plate, year, status) VALUES
('МАЗ', '6430', '01KG456BB', 2019, 'active'),
('КАМАЗ', '6520', '01KG345GG', 2018, 'active'),
('MAN', 'TGX', '01KG890FF', 2021, 'active'),
('Volvo', 'FH16', '01KG789CC', 2021, 'active'),
('КАМАЗ', '5490', '01KG123AA', 2020, 'active'),
('Mercedes-Benz', 'Actros', '01KG567EE', 2020, 'maintenance'),
('Iveco', 'Stralis', '01KG678HH', 2019, 'active'),
('Scania', 'R500', '01KG234DD', 2022, 'active'),
('МАЗ', '5440', '01KG901II', 2017, 'active'),
('DAF', 'XF', '01KG456JJ', 2020, 'active');

-- ============================================
-- 4. Создаем маршруты (15 штук - города Кыргызстана)
-- ============================================

INSERT INTO routes (name, start_point, end_point, distance_km, base_cost) VALUES
('Ош - Баткен', 'Ош', 'Баткен', 260, 22000),
('Бишкек - Каракол', 'Бишкек', 'Каракол', 400, 32000),
('Каракол - Нарын', 'Каракол', 'Нарын', 180, 20000),
('Бишкек - Токмок', 'Бишкек', 'Токмок', 60, 8000),
('Бишкек - Чуй', 'Бишкек', 'Чуй', 25, 5000),
('Ош - Джалал-Абад', 'Ош', 'Джалал-Абад', 80, 12000),
('Бишкек - Кара-Балта', 'Бишкек', 'Кара-Балта', 65, 9000),
('Бишкек - Ош', 'Бишкек', 'Ош', 670, 45000),
('Бишкек - Нарын', 'Бишкек', 'Нарын', 340, 28000),
('Талас - Тараз (КЗ)', 'Талас', 'Тараз', 180, 25000),
('Ош - Узген', 'Ош', 'Узген', 55, 7000),
('Бишкек - Иссык-Куль', 'Бишкек', 'Иссык-Куль', 250, 20000),
('Каракол - Алматы (КЗ)', 'Каракол', 'Алматы', 420, 38000),
('Ош - Кашгар (КНР)', 'Ош', 'Кашгар', 280, 50000),
('Бишкек - Алматы (КЗ)', 'Бишкек', 'Алматы', 240, 28000);

-- ============================================
-- 5. Создаем рейсы (100 штук за последние 6 месяцев)
-- ============================================

DO $$
DECLARE
  trip_date DATE;
  driver_idx INT;
  vehicle_idx INT;
  route_idx INT;
  revenue NUMERIC;
  base_cost NUMERIC;
  fuel_cost NUMERIC;
  maintenance_cost NUMERIC;
  other_costs NUMERIC;
  trip_status TEXT;
  i INT;
BEGIN
  FOR i IN 1..100 LOOP
    -- Случайная дата за последние 6 месяцев
    trip_date := CURRENT_DATE - (random() * 180)::INT;

    -- Случайные индексы (1-10 для водителей и машин, 1-15 для маршрутов)
    driver_idx := 1 + (random() * 9)::INT;
    vehicle_idx := 1 + (random() * 9)::INT;
    route_idx := 1 + (random() * 14)::INT;

    -- Получаем базовую стоимость маршрута
    SELECT r.base_cost INTO base_cost FROM routes r WHERE r.id = route_idx;

    -- Выручка = базовая стоимость * (0.8 - 1.5) - случайный множитель
    revenue := base_cost * (0.8 + random() * 0.7);

    -- ВАЖНО: Расходы должны быть МЕНЬШЕ выручки чтобы была прибыль!
    -- Топливо: 30-40% от выручки
    fuel_cost := revenue * (0.30 + random() * 0.10);

    -- Обслуживание: 5-10% от выручки
    maintenance_cost := revenue * (0.05 + random() * 0.05);

    -- Другие расходы: 5-10% от выручки
    other_costs := revenue * (0.05 + random() * 0.05);

    -- Общие расходы = 40-60% от выручки (значит прибыль будет 40-60%)

    -- Статус: 70% завершенных, 20% в пути, 10% отменен
    IF random() < 0.7 THEN
      trip_status := 'completed';
    ELSIF random() < 0.9 THEN
      trip_status := 'in_progress';
    ELSE
      trip_status := 'cancelled';
    END IF;

    -- Вставляем рейс
    INSERT INTO trips (
      trip_date,
      driver_id,
      vehicle_id,
      route_id,
      revenue,
      fuel_cost,
      maintenance_cost,
      other_costs,
      status
    ) VALUES (
      trip_date,
      driver_idx,
      vehicle_idx,
      route_idx,
      revenue,
      fuel_cost,
      maintenance_cost,
      other_costs,
      trip_status
    );
  END LOOP;
END $$;

-- ============================================
-- Проверка результатов
-- ============================================

-- Общая статистика
SELECT
  COUNT(*) as total_trips,
  SUM(revenue) as total_revenue,
  SUM(total_costs) as total_costs,
  SUM(net_profit) as total_profit,
  AVG(net_profit) as avg_profit
FROM trips
WHERE status = 'completed';

-- Статистика по месяцам
SELECT
  TO_CHAR(trip_date, 'YYYY-MM') as month,
  COUNT(*) as trips,
  SUM(revenue) as revenue,
  SUM(net_profit) as profit
FROM trips
WHERE status = 'completed'
GROUP BY TO_CHAR(trip_date, 'YYYY-MM')
ORDER BY month DESC;
