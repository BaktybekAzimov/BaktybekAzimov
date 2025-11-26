-- ============================================
-- COMPREHENSIVE TEST PLAN
-- TRUCK-TRACKER DATABASE TESTING
-- ============================================

/*
ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ:
1. Выполняйте тесты последовательно
2. После каждого теста проверяйте результат
3. Если тест FAILED - записывайте детали ошибки
4. В конце подсчитайте PASSED/FAILED/WARNINGS

ФОРМАТ РЕЗУЛЬТАТОВ:
✅ PASSED: [описание теста]
❌ FAILED: [описание теста] - [ошибка]
⚠️ WARNING: [описание проблемы]
*/

-- ============================================
-- РАЗДЕЛ 1: CRUD ОПЕРАЦИИ - DRIVERS
-- ============================================

-- TEST 1.1: CREATE - Создание водителя со всеми обязательными полями
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Тестовый Водитель', '+996 555 999 999', CURRENT_DATE)
RETURNING *;
-- Ожидается: Успешное создание с UUID, created_at, updated_at
-- ✅ PASSED если запись создана


-- TEST 1.2: CREATE - Создание водителя со всеми полями (включая опциональные)
INSERT INTO drivers (full_name, phone, hire_date, status, notes)
VALUES ('Полный Водитель', '+996 555 888 888', '2024-01-15', 'inactive', 'Тестовая заметка')
RETURNING *;
-- ✅ PASSED если все поля сохранены корректно


-- TEST 1.3: CREATE - Попытка создания без обязательного поля (должно FAIL)
INSERT INTO drivers (phone, hire_date)
VALUES ('+996 555 777 777', CURRENT_DATE);
-- Ожидается: ERROR - NOT NULL constraint
-- ✅ PASSED если получили ошибку


-- TEST 1.4: CREATE - Попытка создания с дублирующим телефоном (после FIX #1)
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Другой Водитель', '+996 555 999 999', CURRENT_DATE);
-- Ожидается: ERROR - UNIQUE constraint на phone
-- ✅ PASSED если получили ошибку unique constraint


-- TEST 1.5: CREATE - Попытка создания с невалидным статусом
INSERT INTO drivers (full_name, phone, hire_date, status)
VALUES ('Невалидный Водитель', '+996 555 666 666', CURRENT_DATE, 'suspended');
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если получили ошибку


-- TEST 1.6: CREATE - Попытка создания с невалидным форматом телефона (после FIX #2)
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Плохой Телефон', '123456789', CURRENT_DATE);
-- Ожидается: ERROR - CHECK constraint на формат телефона
-- ✅ PASSED если получили ошибку


-- TEST 1.7: CREATE - Попытка создания с датой найма в будущем (после FIX #7)
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Будущий Водитель', '+996 555 555 555', CURRENT_DATE + INTERVAL '10 days');
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если получили ошибку


-- TEST 1.8: READ - Чтение всех водителей
SELECT * FROM drivers ORDER BY created_at DESC;
-- ✅ PASSED если возвращены все записи


-- TEST 1.9: READ - Чтение одного водителя по ID
SELECT * FROM drivers WHERE id = (SELECT id FROM drivers LIMIT 1);
-- ✅ PASSED если возвращена одна запись


-- TEST 1.10: READ - Чтение с фильтрацией по статусу
SELECT * FROM drivers WHERE status = 'active';
-- ✅ PASSED если возвращены только active


-- TEST 1.11: READ - Чтение с множественными фильтрами
SELECT * FROM drivers
WHERE status = 'active' AND hire_date >= '2023-01-01'
ORDER BY hire_date DESC;
-- ✅ PASSED если фильтры работают корректно


-- TEST 1.12: READ - Чтение с сортировкой
SELECT * FROM drivers ORDER BY full_name ASC;
SELECT * FROM drivers ORDER BY hire_date DESC;
-- ✅ PASSED если сортировка корректная


-- TEST 1.13: READ - Чтение с pagination
SELECT * FROM drivers ORDER BY created_at DESC LIMIT 5 OFFSET 0;
SELECT * FROM drivers ORDER BY created_at DESC LIMIT 5 OFFSET 5;
-- ✅ PASSED если pagination работает


-- TEST 1.14: READ - Чтение с JOIN (через trips)
SELECT d.*, COUNT(t.id) as trips_count
FROM drivers d
LEFT JOIN trips t ON d.id = t.driver_id
GROUP BY d.id;
-- ✅ PASSED если JOIN работает


-- TEST 1.15: READ - Поиск несуществующей записи
SELECT * FROM drivers WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
-- ✅ PASSED если возвращается пустой результат


-- TEST 1.16: UPDATE - Обновление одного поля
UPDATE drivers
SET phone = '+996 555 111 111'
WHERE full_name = 'Тестовый Водитель'
RETURNING *;
-- ✅ PASSED если обновлено, updated_at изменился


-- TEST 1.17: UPDATE - Обновление нескольких полей
UPDATE drivers
SET status = 'inactive', notes = 'Обновленная заметка'
WHERE full_name = 'Тестовый Водитель'
RETURNING *;
-- ✅ PASSED если все поля обновлены


-- TEST 1.18: UPDATE - Попытка обновить на невалидный статус
UPDATE drivers
SET status = 'deleted'
WHERE full_name = 'Тестовый Водитель';
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если получили ошибку


-- TEST 1.19: UPDATE - Попытка обновить на дублирующий телефон
UPDATE drivers
SET phone = (SELECT phone FROM drivers WHERE full_name != 'Тестовый Водитель' LIMIT 1)
WHERE full_name = 'Тестовый Водитель';
-- Ожидается: ERROR - UNIQUE constraint
-- ✅ PASSED если получили ошибку


-- TEST 1.20: UPDATE - Попытка обновить несуществующую запись
UPDATE drivers
SET phone = '+996 555 000 000'
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
-- ✅ PASSED если 0 rows affected


-- TEST 1.21: DELETE - Удаление записи без зависимостей
DELETE FROM drivers
WHERE full_name = 'Тестовый Водитель'
RETURNING *;
-- ✅ PASSED если удалено (если нет связанных trips)


-- TEST 1.22: DELETE - Попытка удаления записи с зависимостями
DELETE FROM drivers
WHERE id IN (SELECT DISTINCT driver_id FROM trips LIMIT 1);
-- Ожидается: ERROR - FK constraint (ON DELETE RESTRICT)
-- ✅ PASSED если получили ошибку


-- TEST 1.23: DELETE - Удаление несуществующей записи
DELETE FROM drivers WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
-- ✅ PASSED если 0 rows affected


-- ============================================
-- РАЗДЕЛ 2: CRUD ОПЕРАЦИИ - VEHICLES
-- ============================================

-- TEST 2.1: CREATE - Создание транспорта со всеми обязательными полями
INSERT INTO vehicles (brand, model, license_plate, year)
VALUES ('TEST', 'Model-X', '01KG999ZZ', 2023)
RETURNING *;
-- ✅ PASSED если создано


-- TEST 2.2: CREATE - Попытка создания с дублирующим госномером
INSERT INTO vehicles (brand, model, license_plate, year)
VALUES ('TEST2', 'Model-Y', '01KG999ZZ', 2023);
-- Ожидается: ERROR - UNIQUE constraint
-- ✅ PASSED если ошибка


-- TEST 2.3: CREATE - Попытка создания с невалидным годом (слишком старый)
INSERT INTO vehicles (brand, model, license_plate, year)
VALUES ('OLD', 'Model', '01KG888ZZ', 1989);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 2.4: CREATE - Попытка создания с невалидным годом (будущий)
INSERT INTO vehicles (brand, model, license_plate, year)
VALUES ('FUTURE', 'Model', '01KG777ZZ', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 2);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 2.5: CREATE - Попытка создания с невалидным статусом
INSERT INTO vehicles (brand, model, license_plate, year, status)
VALUES ('TEST', 'Model', '01KG666ZZ', 2023, 'broken');
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 2.6: CREATE - Попытка создания с невалидным форматом госномера (после FIX #9)
INSERT INTO vehicles (brand, model, license_plate, year)
VALUES ('TEST', 'Model', 'ABC-123', 2023);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 2.7: READ - Все транспортные средства с фильтром по статусу
SELECT * FROM vehicles WHERE status = 'available';
-- ✅ PASSED если только available


-- TEST 2.8: UPDATE - Смена статуса
UPDATE vehicles
SET status = 'maintenance'
WHERE license_plate = '01KG999ZZ'
RETURNING *;
-- ✅ PASSED если обновлено, updated_at изменился


-- TEST 2.9: DELETE - Попытка удаления ТС с активными рейсами
DELETE FROM vehicles
WHERE id IN (SELECT DISTINCT vehicle_id FROM trips LIMIT 1);
-- Ожидается: ERROR - FK constraint
-- ✅ PASSED если ошибка


-- ============================================
-- РАЗДЕЛ 3: CRUD ОПЕРАЦИИ - ROUTES
-- ============================================

-- TEST 3.1: CREATE - Создание маршрута
INSERT INTO routes (name, distance_km, avg_cost)
VALUES ('Тестовый Маршрут', 100, 15000)
RETURNING *;
-- ✅ PASSED если создано


-- TEST 3.2: CREATE - Попытка создания с дублирующим названием
INSERT INTO routes (name, distance_km, avg_cost)
VALUES ('Тестовый Маршрут', 200, 20000);
-- Ожидается: ERROR - UNIQUE constraint
-- ✅ PASSED если ошибка


-- TEST 3.3: CREATE - Попытка создания с нулевым расстоянием
INSERT INTO routes (name, distance_km, avg_cost)
VALUES ('Нулевой Маршрут', 0, 10000);
-- Ожидается: ERROR - CHECK constraint (distance_km > 0)
-- ✅ PASSED если ошибка


-- TEST 3.4: CREATE - Попытка создания с отрицательной стоимостью
INSERT INTO routes (name, distance_km, avg_cost)
VALUES ('Отрицательный Маршрут', 100, -5000);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 3.5: READ - Поиск маршрута по названию
SELECT * FROM routes WHERE name LIKE '%Бишкек%';
-- ✅ PASSED если найдены маршруты с Бишкеком


-- TEST 3.6: UPDATE - Обновление стоимости маршрута
UPDATE routes
SET avg_cost = 16000
WHERE name = 'Тестовый Маршрут'
RETURNING *;
-- ⚠️ WARNING если нет updated_at (до применения FIX #5)
-- ✅ PASSED если обновлено и updated_at изменился (после FIX #5)


-- ============================================
-- РАЗДЕЛ 4: CRUD ОПЕРАЦИИ - TRIPS
-- ============================================

-- TEST 4.1: CREATE - Создание рейса со всеми полями
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost, maintenance_cost, other_costs)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE status = 'active' LIMIT 1),
    (SELECT id FROM vehicles WHERE status = 'available' LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000,
    15000,
    3000,
    2000
)
RETURNING *;
-- ✅ PASSED если создано
-- Проверяем что вычисляемые поля корректны:
-- total_costs должно быть 20000 (15000+3000+2000)
-- net_profit должно быть 30000 (50000-20000)
-- driver_payment должно быть 9000 (30000*0.3)
-- owner_payment должно быть 21000 (30000*0.7)


-- TEST 4.2: CREATE - Создание рейса с отрицательной прибылью
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost, maintenance_cost, other_costs)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE status = 'active' LIMIT 1),
    (SELECT id FROM vehicles WHERE status = 'available' LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    10000,
    15000,
    5000,
    2000
)
RETURNING *;
-- ✅ PASSED если создано
-- ⚠️ WARNING - net_profit будет отрицательным (-12000)
-- После FIX #16 должна быть запись в negative_profit_log


-- TEST 4.3: CREATE - Попытка создания с несуществующим driver_id
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000
);
-- Ожидается: ERROR - FK constraint
-- ✅ PASSED если ошибка


-- TEST 4.4: CREATE - Попытка создания с несуществующим vehicle_id
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid,
    (SELECT id FROM routes LIMIT 1),
    50000
);
-- Ожидается: ERROR - FK constraint
-- ✅ PASSED если ошибка


-- TEST 4.5: CREATE - Попытка создания с несуществующим route_id
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid,
    50000
);
-- Ожидается: ERROR - FK constraint
-- ✅ PASSED если ошибка


-- TEST 4.6: CREATE - Попытка создания с отрицательной выручкой
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    -50000
);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 4.7: CREATE - Попытка создания с отрицательными расходами
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000,
    -10000
);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 4.8: CREATE - Попытка создания с невалидным статусом
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, status)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000,
    'pending'
);
-- Ожидается: ERROR - CHECK constraint
-- ✅ PASSED если ошибка


-- TEST 4.9: CREATE - Попытка создания второго активного рейса для одного ТС (после FIX #3)
-- Сначала создаем активный рейс
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, status)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE status = 'active' LIMIT 1),
    (SELECT id FROM vehicles WHERE status = 'available' LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000,
    'in_progress'
)
RETURNING id;

-- Пытаемся создать второй активный рейс для того же ТС
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, status)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE status = 'active' OFFSET 1 LIMIT 1),
    (SELECT vehicle_id FROM trips WHERE status = 'in_progress' LIMIT 1),
    (SELECT id FROM routes OFFSET 1 LIMIT 1),
    50000,
    'in_progress'
);
-- Ожидается: ERROR - check_vehicle_availability trigger
-- ✅ PASSED если ошибка


-- TEST 4.10: CREATE - Попытка создания второго активного рейса для одного водителя (после FIX #4)
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, status)
VALUES (
    NOW(),
    (SELECT driver_id FROM trips WHERE status = 'in_progress' LIMIT 1),
    (SELECT id FROM vehicles WHERE status = 'available' OFFSET 1 LIMIT 1),
    (SELECT id FROM routes OFFSET 1 LIMIT 1),
    50000,
    'in_progress'
);
-- Ожидается: ERROR - check_driver_availability trigger
-- ✅ PASSED если ошибка


-- TEST 4.11: READ - Все рейсы с JOIN всех связанных таблиц
SELECT
    t.id,
    t.trip_date,
    d.full_name as driver_name,
    v.license_plate,
    r.name as route_name,
    t.revenue,
    t.total_costs,
    t.net_profit,
    t.status
FROM trips t
JOIN drivers d ON t.driver_id = d.id
JOIN vehicles v ON t.vehicle_id = v.id
JOIN routes r ON t.route_id = r.id
ORDER BY t.trip_date DESC
LIMIT 10;
-- ✅ PASSED если все JOIN'ы работают


-- TEST 4.12: READ - Рейсы с фильтрацией по дате
SELECT * FROM trips
WHERE trip_date >= NOW() - INTERVAL '7 days'
ORDER BY trip_date DESC;
-- ✅ PASSED если возвращены только за последние 7 дней


-- TEST 4.13: READ - Рейсы с множественными фильтрами
SELECT * FROM trips
WHERE status = 'completed'
AND trip_date >= '2024-01-01'
AND revenue > 30000
ORDER BY revenue DESC;
-- ✅ PASSED если все фильтры применены


-- TEST 4.14: READ - Pagination на больших данных
SELECT * FROM trips
ORDER BY trip_date DESC
LIMIT 20 OFFSET 0;
-- ✅ PASSED если pagination работает


-- TEST 4.15: UPDATE - Изменение статуса рейса
UPDATE trips
SET status = 'completed'
WHERE status = 'in_progress'
AND trip_date < NOW() - INTERVAL '1 day'
RETURNING *;
-- ✅ PASSED если обновлено


-- TEST 4.16: UPDATE - Изменение расходов (пересчет вычисляемых полей)
UPDATE trips
SET fuel_cost = fuel_cost + 5000
WHERE id = (SELECT id FROM trips LIMIT 1)
RETURNING *, total_costs, net_profit, driver_payment, owner_payment;
-- ✅ PASSED если вычисляемые поля автоматически пересчитались


-- TEST 4.17: DELETE - Удаление рейса
DELETE FROM trips
WHERE id = (SELECT id FROM trips WHERE comment IS NOT NULL LIMIT 1)
RETURNING *;
-- ✅ PASSED если удалено


-- ============================================
-- РАЗДЕЛ 5: ТЕСТИРОВАНИЕ VIEWS
-- ============================================

-- TEST 5.1: driver_stats - Проверка корректности статистики
SELECT * FROM driver_stats ORDER BY total_trips DESC;
-- ✅ PASSED если:
-- - total_trips соответствует COUNT в trips
-- - total_payment корректно
-- - avg_profit_per_trip корректно


-- TEST 5.2: driver_stats - Водитель без рейсов
SELECT * FROM driver_stats
WHERE id = (SELECT id FROM drivers WHERE id NOT IN (SELECT DISTINCT driver_id FROM trips) LIMIT 1);
-- ✅ PASSED если total_trips = 0, total_payment = 0


-- TEST 5.3: vehicle_stats - Проверка корректности статистики
SELECT * FROM vehicle_stats ORDER BY total_trips DESC;
-- ✅ PASSED если статистика корректна


-- TEST 5.4: route_stats - Проверка корректности статистики
SELECT * FROM route_stats ORDER BY trip_count DESC;
-- ✅ PASSED если статистика корректна


-- TEST 5.5: route_stats - Маршрут без рейсов
SELECT * FROM route_stats
WHERE id = (SELECT id FROM routes WHERE id NOT IN (SELECT DISTINCT route_id FROM trips) LIMIT 1);
-- ✅ PASSED если trip_count = 0


-- ============================================
-- РАЗДЕЛ 6: ТЕСТИРОВАНИЕ TRIGGERS
-- ============================================

-- TEST 6.1: Trigger updated_at на drivers
-- Запоминаем текущий updated_at
SELECT id, updated_at FROM drivers LIMIT 1;

-- Ждем 1 секунду и обновляем
SELECT pg_sleep(1);
UPDATE drivers SET notes = 'Обновленная заметка' WHERE id = (SELECT id FROM drivers LIMIT 1);

-- Проверяем что updated_at изменился
SELECT id, updated_at FROM drivers LIMIT 1;
-- ✅ PASSED если updated_at больше чем был


-- TEST 6.2: Trigger updated_at на vehicles
SELECT id, updated_at FROM vehicles LIMIT 1;
SELECT pg_sleep(1);
UPDATE vehicles SET notes = 'Новая заметка' WHERE id = (SELECT id FROM vehicles LIMIT 1);
SELECT id, updated_at FROM vehicles LIMIT 1;
-- ✅ PASSED если updated_at изменился


-- TEST 6.3: Trigger audit_log (после FIX #13)
-- Создаем запись
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Audit Test', '+996 555 444 444', CURRENT_DATE)
RETURNING id;

-- Проверяем audit_log
SELECT * FROM audit_log
WHERE table_name = 'drivers'
AND operation = 'INSERT'
ORDER BY changed_at DESC
LIMIT 1;
-- ✅ PASSED если запись в audit_log есть


-- Обновляем запись
UPDATE drivers SET status = 'inactive' WHERE full_name = 'Audit Test';

-- Проверяем audit_log для UPDATE
SELECT * FROM audit_log
WHERE table_name = 'drivers'
AND operation = 'UPDATE'
ORDER BY changed_at DESC
LIMIT 1;
-- ✅ PASSED если запись в audit_log есть с old_data и new_data


-- Удаляем запись
DELETE FROM drivers WHERE full_name = 'Audit Test';

-- Проверяем audit_log для DELETE
SELECT * FROM audit_log
WHERE table_name = 'drivers'
AND operation = 'DELETE'
ORDER BY changed_at DESC
LIMIT 1;
-- ✅ PASSED если запись в audit_log есть


-- TEST 6.4: Trigger negative_profit_log (после FIX #16)
-- Создаем рейс с отрицательной прибылью
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost, maintenance_cost, other_costs)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE status = 'active' LIMIT 1),
    (SELECT id FROM vehicles WHERE status = 'available' LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    10000,  -- revenue
    20000,  -- fuel_cost (больше чем revenue)
    5000,   -- maintenance_cost
    0       -- other_costs
)
RETURNING id;

-- Проверяем negative_profit_log
SELECT * FROM negative_profit_log
ORDER BY logged_at DESC
LIMIT 1;
-- ✅ PASSED если запись есть с net_profit < 0


-- ============================================
-- РАЗДЕЛ 7: ТЕСТИРОВАНИЕ RLS POLICIES
-- ============================================

/*
ВАЖНО: Эти тесты требуют подключения с разными ролями пользователей
Выполнять через Supabase Auth

Тесты для admin роли:
*/

-- TEST 7.1: Admin может читать всех водителей
SET ROLE authenticated;
SET request.jwt.claims TO '{"role": "admin"}';
SELECT * FROM drivers;
-- ✅ PASSED если видны все записи


-- TEST 7.2: Admin может создавать водителей
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Admin Test', '+996 555 333 333', CURRENT_DATE);
-- ✅ PASSED если создано


-- TEST 7.3: Admin может обновлять водителей
UPDATE drivers SET status = 'inactive' WHERE full_name = 'Admin Test';
-- ✅ PASSED если обновлено


-- TEST 7.4: Admin может удалять водителей (без зависимостей)
DELETE FROM drivers WHERE full_name = 'Admin Test';
-- ✅ PASSED если удалено


/*
Тесты для dispatcher роли:
*/

-- TEST 7.5: Dispatcher может читать всех водителей
SET request.jwt.claims TO '{"role": "dispatcher"}';
SELECT * FROM drivers;
-- ✅ PASSED если видны все записи


-- TEST 7.6: Dispatcher может создавать водителей
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Dispatcher Test', '+996 555 222 222', CURRENT_DATE);
-- ✅ PASSED если создано


-- TEST 7.7: Dispatcher может обновлять водителей
UPDATE drivers SET status = 'inactive' WHERE full_name = 'Dispatcher Test';
-- ✅ PASSED если обновлено


-- TEST 7.8: Dispatcher НЕ может удалять водителей
DELETE FROM drivers WHERE full_name = 'Dispatcher Test';
-- Ожидается: ERROR - RLS policy violation
-- ✅ PASSED если ошибка


/*
Тесты для driver роли:
*/

-- TEST 7.9: Driver может читать всех водителей
SET request.jwt.claims TO '{"role": "driver", "driver_id": "..."}';
SELECT * FROM drivers;
-- ✅ PASSED если видны все записи


-- TEST 7.10: Driver НЕ может создавать водителей
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Driver Test', '+996 555 111 111', CURRENT_DATE);
-- Ожидается: ERROR - RLS policy violation
-- ✅ PASSED если ошибка


-- TEST 7.11: Driver НЕ может обновлять водителей
UPDATE drivers SET status = 'inactive' WHERE id = (SELECT id FROM drivers LIMIT 1);
-- Ожидается: ERROR - RLS policy violation
-- ✅ PASSED если ошибка


-- TEST 7.12: Driver может видеть только свои рейсы
SET request.jwt.claims TO '{"role": "driver", "driver_id": "actual-driver-uuid"}';
SELECT * FROM trips;
-- ✅ PASSED если видны только рейсы этого водителя


-- TEST 7.13: Driver НЕ может видеть чужие рейсы
SELECT * FROM trips WHERE driver_id != 'actual-driver-uuid'::uuid;
-- ✅ PASSED если результат пустой


-- TEST 7.14: Driver может создать рейс только для себя (после FIX #10)
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    'actual-driver-uuid'::uuid,  -- свой ID
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000
);
-- ✅ PASSED если создано


-- TEST 7.15: Driver НЕ может создать рейс за другого водителя (после FIX #10)
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    (SELECT id FROM drivers WHERE id != 'actual-driver-uuid'::uuid LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    50000
);
-- Ожидается: ERROR - RLS policy violation
-- ✅ PASSED если ошибка


-- ============================================
-- РАЗДЕЛ 8: EDGE CASES
-- ============================================

-- TEST 8.1: Пустые строки vs NULL
INSERT INTO drivers (full_name, phone, hire_date, notes)
VALUES ('Empty Notes', '+996 555 000 001', CURRENT_DATE, '');

SELECT full_name, notes, notes IS NULL, notes = '' FROM drivers WHERE full_name = 'Empty Notes';
-- ✅ PASSED если можно различить NULL и пустую строку


-- TEST 8.2: Очень длинные строки
INSERT INTO drivers (full_name, phone, hire_date, notes)
VALUES (
    'Long Name',
    '+996 555 000 002',
    CURRENT_DATE,
    REPEAT('A', 10000)  -- 10000 символов
);
-- ✅ PASSED если создано (TEXT не имеет лимита)
-- ⚠️ WARNING если медленно


-- TEST 8.3: Специальные символы в текстовых полях
INSERT INTO drivers (full_name, phone, hire_date, notes)
VALUES (
    'Special Chars',
    '+996 555 000 003',
    CURRENT_DATE,
    'Тест с символами: <script>alert("XSS")</script> '' " \n \t'
);
SELECT notes FROM drivers WHERE full_name = 'Special Chars';
-- ✅ PASSED если все символы сохранены корректно


-- TEST 8.4: SQL injection попытка
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Robert''; DROP TABLE drivers; --', '+996 555 000 004', CURRENT_DATE);

SELECT * FROM drivers WHERE full_name LIKE '%Robert%';
-- ✅ PASSED если запись создана и таблица не удалена


-- TEST 8.5: Максимальные числовые значения
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    99999999.99,  -- максимум для NUMERIC(10,2)
    99999999.99
);
-- ✅ PASSED если создано


-- TEST 8.6: Попытка превысить NUMERIC precision
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue)
VALUES (
    NOW(),
    (SELECT id FROM drivers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    (SELECT id FROM routes LIMIT 1),
    999999999.99  -- больше NUMERIC(10,2)
);
-- Ожидается: ERROR - numeric field overflow
-- ✅ PASSED если ошибка


-- TEST 8.7: Даты в далеком прошлом
INSERT INTO drivers (full_name, phone, hire_date)
VALUES ('Ancient Driver', '+996 555 000 005', '1900-01-01');
-- ⚠️ WARNING если разрешено (но допустимо)


-- TEST 8.8: Одновременные UPDATE (race condition simulation)
BEGIN;
    SELECT * FROM vehicles WHERE id = (SELECT id FROM vehicles LIMIT 1) FOR UPDATE;
    -- В другой сессии попытаться обновить ту же запись
    -- Ожидается: блокировка до COMMIT
END;
-- ✅ PASSED если transaction isolation работает


-- TEST 8.9: Очень быстрые последовательные INSERT
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO drivers (full_name, phone, hire_date)
        VALUES ('Speed Test ' || i, '+996 555 ' || LPAD(i::TEXT, 6, '0'), CURRENT_DATE);
    END LOOP;
END $$;
-- ✅ PASSED если все 100 записей созданы
-- ⏱️ Измерить время выполнения


-- ============================================
-- РАЗДЕЛ 9: PERFORMANCE TESTS
-- ============================================

-- TEST 9.1: EXPLAIN ANALYZE на сложном запросе с JOIN
EXPLAIN ANALYZE
SELECT
    t.*,
    d.full_name,
    v.license_plate,
    r.name
FROM trips t
JOIN drivers d ON t.driver_id = d.id
JOIN vehicles v ON t.vehicle_id = v.id
JOIN routes r ON t.route_id = r.id
WHERE t.trip_date >= NOW() - INTERVAL '30 days'
AND t.status = 'completed'
ORDER BY t.trip_date DESC
LIMIT 100;
-- ✅ PASSED если execution time < 100ms (на 1000 записей)
-- Проверить что используются индексы


-- TEST 9.2: Performance на агрегатных запросах (views)
EXPLAIN ANALYZE SELECT * FROM driver_stats;
-- ✅ PASSED если execution time разумное


-- TEST 9.3: Count на больших таблицах
EXPLAIN ANALYZE SELECT COUNT(*) FROM trips;
-- ⚠️ WARNING если медленно на больших объемах


-- TEST 9.4: Pagination performance
EXPLAIN ANALYZE
SELECT * FROM trips
ORDER BY trip_date DESC
LIMIT 20 OFFSET 1000;
-- ✅ PASSED если используется idx_trips_trip_date


-- ============================================
-- РАЗДЕЛ 10: DATA INTEGRITY
-- ============================================

-- TEST 10.1: Orphaned records check - trips без driver
SELECT t.* FROM trips t
LEFT JOIN drivers d ON t.driver_id = d.id
WHERE d.id IS NULL;
-- ✅ PASSED если результат пустой


-- TEST 10.2: Orphaned records check - trips без vehicle
SELECT t.* FROM trips t
LEFT JOIN vehicles v ON t.vehicle_id = v.id
WHERE v.id IS NULL;
-- ✅ PASSED если результат пустой


-- TEST 10.3: Orphaned records check - trips без route
SELECT t.* FROM trips t
LEFT JOIN routes r ON t.route_id = r.id
WHERE r.id IS NULL;
-- ✅ PASSED если результат пустой


-- TEST 10.4: Duplicate check - госномера
SELECT license_plate, COUNT(*)
FROM vehicles
GROUP BY license_plate
HAVING COUNT(*) > 1;
-- ✅ PASSED если результат пустой


-- TEST 10.5: Duplicate check - названия маршрутов
SELECT name, COUNT(*)
FROM routes
GROUP BY name
HAVING COUNT(*) > 1;
-- ✅ PASSED если результат пустой


-- TEST 10.6: Duplicate check - телефоны водителей (после FIX #1)
SELECT phone, COUNT(*)
FROM drivers
GROUP BY phone
HAVING COUNT(*) > 1;
-- ✅ PASSED если результат пустой


-- TEST 10.7: Проверка вычисляемых полей в trips
SELECT
    id,
    revenue,
    fuel_cost,
    maintenance_cost,
    other_costs,
    total_costs,
    (fuel_cost + maintenance_cost + other_costs) AS calculated_total_costs,
    total_costs = (fuel_cost + maintenance_cost + other_costs) AS is_correct
FROM trips
WHERE total_costs != (fuel_cost + maintenance_cost + other_costs);
-- ✅ PASSED если результат пустой


-- TEST 10.8: Проверка driver_payment = net_profit * 0.3
SELECT
    id,
    net_profit,
    driver_payment,
    (net_profit * 0.3) AS calculated_driver_payment,
    ABS(driver_payment - (net_profit * 0.3)) < 0.01 AS is_correct
FROM trips
WHERE ABS(driver_payment - (net_profit * 0.3)) >= 0.01;
-- ✅ PASSED если результат пустой (или минимальные округления)


-- ============================================
-- РАЗДЕЛ 11: INTEGRATION SCENARIOS
-- ============================================

-- SCENARIO 1: Полный цикл рейса
BEGIN;
    -- 1. Создаем водителя
    INSERT INTO drivers (full_name, phone, hire_date)
    VALUES ('Интеграция Тест', '+996 555 100 100', CURRENT_DATE)
    RETURNING id;  -- запоминаем ID

    -- 2. Создаем транспорт
    INSERT INTO vehicles (brand, model, license_plate, year)
    VALUES ('INT', 'Test', '01KG100AA', 2024)
    RETURNING id;  -- запоминаем ID

    -- 3. Создаем рейс
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
        NOW(),
        (SELECT id FROM drivers WHERE phone = '+996 555 100 100'),
        (SELECT id FROM vehicles WHERE license_plate = '01KG100AA'),
        (SELECT id FROM routes LIMIT 1),
        50000,
        15000,
        3000,
        2000,
        'in_progress'
    )
    RETURNING *;

    -- 4. Обновляем статус ТС
    UPDATE vehicles
    SET status = 'in_trip'
    WHERE license_plate = '01KG100AA';

    -- 5. Завершаем рейс
    UPDATE trips
    SET status = 'completed'
    WHERE vehicle_id = (SELECT id FROM vehicles WHERE license_plate = '01KG100AA')
    AND status = 'in_progress';

    -- 6. Возвращаем ТС в available
    UPDATE vehicles
    SET status = 'available'
    WHERE license_plate = '01KG100AA';

    -- Проверяем все
    SELECT
        t.*,
        d.full_name,
        v.license_plate,
        v.status as vehicle_status
    FROM trips t
    JOIN drivers d ON t.driver_id = d.id
    JOIN vehicles v ON t.vehicle_id = v.id
    WHERE d.phone = '+996 555 100 100';

COMMIT;
-- ✅ PASSED если весь цикл прошел без ошибок


-- SCENARIO 2: Попытка удаления водителя с рейсами
BEGIN;
    -- Пытаемся удалить водителя с рейсами
    DELETE FROM drivers
    WHERE id = (SELECT DISTINCT driver_id FROM trips LIMIT 1);
    -- Ожидается: ERROR - FK constraint
ROLLBACK;
-- ✅ PASSED если получили ошибку и rollback прошел


-- SCENARIO 3: Массовые операции
BEGIN;
    -- Массовое создание рейсов
    INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost)
    SELECT
        NOW() - (random() * INTERVAL '30 days'),
        (SELECT id FROM drivers ORDER BY RANDOM() LIMIT 1),
        (SELECT id FROM vehicles ORDER BY RANDOM() LIMIT 1),
        (SELECT id FROM routes ORDER BY RANDOM() LIMIT 1),
        30000 + random() * 50000,
        10000 + random() * 20000
    FROM generate_series(1, 100);

    -- Массовое обновление
    UPDATE trips
    SET status = 'completed'
    WHERE status = 'in_progress'
    AND trip_date < NOW() - INTERVAL '1 day';

    SELECT COUNT(*) FROM trips;

ROLLBACK;  -- откатываем тестовые данные
-- ✅ PASSED если операции быстрые


-- ============================================
-- ФИНАЛЬНЫЙ ОТЧЕТ
-- ============================================

-- Подсчет всех рейсов и статистики
SELECT
    'TRIPS' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
    SUM(revenue) as total_revenue,
    SUM(net_profit) as total_profit,
    AVG(net_profit) as avg_profit
FROM trips

UNION ALL

SELECT
    'DRIVERS' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
    NULL, NULL, NULL, NULL
FROM drivers

UNION ALL

SELECT
    'VEHICLES' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
    COUNT(CASE WHEN status = 'in_trip' THEN 1 END) as in_trip,
    COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
    NULL, NULL, NULL
FROM vehicles

UNION ALL

SELECT
    'ROUTES' as table_name,
    COUNT(*) as total_records,
    NULL, NULL, NULL,
    SUM(avg_cost) as sum_avg_costs,
    NULL, NULL
FROM routes;

/*
После выполнения всех тестов заполните:

SUMMARY:
========
Total Tests: [число]
✅ PASSED: [число]
❌ FAILED: [число]
⚠️ WARNINGS: [число]

CRITICAL ISSUES:
1. [описание]
2. [описание]

RECOMMENDATIONS:
1. Применить supabase-fixes.sql
2. [другие рекомендации]

PERFORMANCE BOTTLENECKS:
1. [описание]
2. [описание]

SECURITY ISSUES:
1. [описание]
2. [описание]
*/
