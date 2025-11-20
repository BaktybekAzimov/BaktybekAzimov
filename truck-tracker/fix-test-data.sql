-- ИСПРАВЛЕНИЕ ТЕСТОВЫХ ДАННЫХ
-- Удаление старых данных и создание правильных с положительной прибылью

-- ============================================
-- 1. Удаляем старые тестовые данные
-- ============================================

DELETE FROM trips;
DELETE FROM routes;
DELETE FROM vehicles;
DELETE FROM drivers;

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
('МАЗ', '6430', '01KG456BB', 2019, 'available'),
('КАМАЗ', '6520', '01KG345GG', 2018, 'available'),
('MAN', 'TGX', '01KG890FF', 2021, 'available'),
('Volvo', 'FH16', '01KG789CC', 2021, 'available'),
('КАМАЗ', '5490', '01KG123AA', 2020, 'available'),
('Mercedes-Benz', 'Actros', '01KG567EE', 2020, 'maintenance'),
('Iveco', 'Stralis', '01KG678HH', 2019, 'available'),
('Scania', 'R500', '01KG234DD', 2022, 'available'),
('МАЗ', '5440', '01KG901II', 2017, 'available'),
('DAF', 'XF', '01KG456JJ', 2020, 'available');

-- ============================================
-- 4. Создаем маршруты (15 штук - города Кыргызстана)
-- ============================================

INSERT INTO routes (name, distance_km, avg_cost) VALUES
('Ош - Баткен', 260, 22000),
('Бишкек - Каракол', 400, 32000),
('Каракол - Нарын', 180, 20000),
('Бишкек - Токмок', 60, 8000),
('Бишкек - Чуй', 25, 5000),
('Ош - Джалал-Абад', 80, 12000),
('Бишкек - Кара-Балта', 65, 9000),
('Бишкек - Ош', 670, 45000),
('Бишкек - Нарын', 340, 28000),
('Талас - Тараз (КЗ)', 180, 25000),
('Ош - Узген', 55, 7000),
('Бишкек - Иссык-Куль', 250, 20000),
('Каракол - Алматы (КЗ)', 420, 38000),
('Ош - Кашгар (КНР)', 280, 50000),
('Бишкек - Алматы (КЗ)', 240, 28000);

-- ============================================
-- 5. Создаем рейсы (100 штук за последние 6 месяцев)
-- ============================================

DO $$
DECLARE
  trip_date DATE;
  selected_driver_id UUID;
  selected_vehicle_id UUID;
  selected_route_id UUID;
  revenue NUMERIC;
  avg_cost NUMERIC;
  fuel_cost NUMERIC;
  maintenance_cost NUMERIC;
  other_costs NUMERIC;
  trip_status TEXT;
  i INT;
BEGIN
  FOR i IN 1..100 LOOP
    -- Случайная дата за последние 6 месяцев
    trip_date := CURRENT_DATE - (random() * 180)::INT;

    -- Выбираем случайных водителя, транспорт и маршрут
    SELECT id INTO selected_driver_id FROM drivers ORDER BY random() LIMIT 1;
    SELECT id INTO selected_vehicle_id FROM vehicles ORDER BY random() LIMIT 1;
    SELECT id, avg_cost INTO selected_route_id, avg_cost FROM routes ORDER BY random() LIMIT 1;

    -- Выручка = средняя стоимость маршрута * (0.8 - 1.5) - случайный множитель
    revenue := avg_cost * (0.8 + random() * 0.7);

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
      selected_driver_id,
      selected_vehicle_id,
      selected_route_id,
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
