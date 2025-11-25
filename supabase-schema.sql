-- Truck Tracking System Database Schema
-- Created for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_trip', 'maintenance')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes Table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  distance_km INTEGER NOT NULL CHECK (distance_km > 0),
  avg_cost NUMERIC(10, 2) NOT NULL CHECK (avg_cost >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips Table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  revenue NUMERIC(10, 2) NOT NULL CHECK (revenue >= 0),
  fuel_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fuel_cost >= 0),
  maintenance_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (maintenance_cost >= 0),
  other_costs NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (other_costs >= 0),
  total_costs NUMERIC(10, 2) GENERATED ALWAYS AS (fuel_cost + maintenance_cost + other_costs) STORED,
  net_profit NUMERIC(10, 2) GENERATED ALWAYS AS (revenue - (fuel_cost + maintenance_cost + other_costs)) STORED,
  driver_payment NUMERIC(10, 2) GENERATED ALWAYS AS ((revenue - (fuel_cost + maintenance_cost + other_costs)) * 0.3) STORED,
  owner_payment NUMERIC(10, 2) GENERATED ALWAYS AS ((revenue - (fuel_cost + maintenance_cost + other_costs)) * 0.7) STORED,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'cancelled')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Optimize queries by date
CREATE INDEX idx_trips_trip_date ON trips(trip_date DESC);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_route_id ON trips(route_id);

-- Composite indexes for common queries
CREATE INDEX idx_trips_date_driver ON trips(trip_date DESC, driver_id);
CREATE INDEX idx_trips_date_vehicle ON trips(trip_date DESC, vehicle_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS
-- ============================================

-- Automatically update updated_at on drivers
CREATE TRIGGER update_drivers_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Automatically update updated_at on vehicles
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR STATISTICS
-- ============================================

-- Driver Statistics View
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
LEFT JOIN trips t ON d.id = t.driver_id AND t.status = 'completed'
GROUP BY d.id;

-- Vehicle Statistics View
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
LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'completed'
GROUP BY v.id;

-- Route Statistics View
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
LEFT JOIN trips t ON r.id = t.route_id AND t.status = 'completed'
GROUP BY r.id;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policies for drivers table
CREATE POLICY "Drivers are viewable by authenticated users"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers are insertable by admins and dispatchers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Drivers are updatable by admins and dispatchers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Drivers are deletable by admins only"
  ON drivers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for vehicles table
CREATE POLICY "Vehicles are viewable by authenticated users"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vehicles are insertable by admins and dispatchers"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Vehicles are updatable by admins and dispatchers"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Vehicles are deletable by admins only"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for routes table
CREATE POLICY "Routes are viewable by authenticated users"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Routes are insertable by admins and dispatchers"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Routes are updatable by admins and dispatchers"
  ON routes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Routes are deletable by admins only"
  ON routes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for trips table
-- Drivers can only see their own trips, admins/dispatchers see all
CREATE POLICY "Trips are viewable by authorized users"
  ON trips FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        u.raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
        OR (
          u.raw_user_meta_data->>'role' = 'driver'
          AND trips.driver_id::text = u.raw_user_meta_data->>'driver_id'
        )
      )
    )
  );

CREATE POLICY "Trips are insertable by all authenticated users"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Trips are updatable by admins and dispatchers"
  ON trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'dispatcher')
    )
  );

CREATE POLICY "Trips are deletable by admins only"
  ON trips FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- SEED DATA (Sample/Test Data)
-- ============================================

-- Insert sample drivers
INSERT INTO drivers (full_name, phone, hire_date, status) VALUES
('Алексей Петров', '+996 555 123 456', '2023-01-15', 'active'),
('Дмитрий Иванов', '+996 555 234 567', '2023-02-20', 'active'),
('Сергей Сидоров', '+996 555 345 678', '2023-03-10', 'active'),
('Андрей Козлов', '+996 555 456 789', '2023-04-05', 'active'),
('Михаил Новиков', '+996 555 567 890', '2023-05-12', 'active'),
('Владимир Морозов', '+996 555 678 901', '2023-06-18', 'active'),
('Игорь Волков', '+996 555 789 012', '2023-07-22', 'inactive'),
('Павел Смирнов', '+996 555 890 123', '2023-08-30', 'active'),
('Олег Попов', '+996 555 901 234', '2023-09-14', 'active'),
('Евгений Лебедев', '+996 555 012 345', '2023-10-25', 'active');

-- Insert sample vehicles
INSERT INTO vehicles (brand, model, license_plate, year, status) VALUES
('КАМАЗ', '5490', '01KG123AA', 2020, 'available'),
('МАЗ', '6430', '01KG456BB', 2019, 'in_trip'),
('Volvo', 'FH16', '01KG789CC', 2021, 'available'),
('Scania', 'R500', '01KG234DD', 2022, 'available'),
('Mercedes-Benz', 'Actros', '01KG567EE', 2020, 'maintenance'),
('MAN', 'TGX', '01KG890FF', 2021, 'available'),
('КАМАЗ', '6520', '01KG345GG', 2018, 'in_trip'),
('Iveco', 'Stralis', '01KG678HH', 2019, 'available'),
('DAF', 'XF', '01KG901II', 2022, 'available'),
('Renault', 'T-Series', '01KG123JJ', 2020, 'available');

-- Insert sample routes
INSERT INTO routes (name, distance_km, avg_cost) VALUES
('Бишкек - Ош', 670, 45000),
('Бишкек - Талас', 310, 25000),
('Бишкек - Нарын', 340, 28000),
('Бишкек - Каракол', 400, 32000),
('Ош - Джалал-Абад', 80, 12000),
('Бишкек - Токмок', 60, 8000),
('Бишкек - Кара-Балта', 65, 9000),
('Ош - Баткен', 260, 22000),
('Бишкек - Балыкчы', 165, 18000),
('Каракол - Нарын', 180, 20000),
('Бишкек - Чуй', 25, 5000),
('Ош - Узген', 55, 8500),
('Бишкек - Кант', 22, 4500),
('Талас - Тараз (КЗ)', 180, 25000),
('Бишкек - Алматы (КЗ)', 240, 35000);

-- Insert sample trips (last 30 days)
INSERT INTO trips (trip_date, driver_id, vehicle_id, route_id, revenue, fuel_cost, maintenance_cost, other_costs, status, comment)
SELECT
  NOW() - (random() * INTERVAL '30 days'),
  (SELECT id FROM drivers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM vehicles ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM routes ORDER BY RANDOM() LIMIT 1),
  (SELECT avg_cost FROM routes ORDER BY RANDOM() LIMIT 1) * (0.9 + random() * 0.2),
  10000 + random() * 15000,
  random() * 5000,
  random() * 3000,
  (ARRAY['completed', 'completed', 'completed', 'in_progress', 'cancelled'])[1 + floor(random() * 5)],
  CASE WHEN random() > 0.7 THEN 'Все прошло отлично' ELSE NULL END
FROM generate_series(1, 50);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated users
GRANT SELECT ON drivers TO authenticated;
GRANT SELECT ON vehicles TO authenticated;
GRANT SELECT ON routes TO authenticated;
GRANT SELECT ON trips TO authenticated;
GRANT SELECT ON driver_stats TO authenticated;
GRANT SELECT ON vehicle_stats TO authenticated;
GRANT SELECT ON route_stats TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE drivers IS 'Водители грузовиков';
COMMENT ON TABLE vehicles IS 'Транспортные средства';
COMMENT ON TABLE routes IS 'Маршруты перевозок';
COMMENT ON TABLE trips IS 'Рейсы (поездки)';
COMMENT ON VIEW driver_stats IS 'Статистика по водителям';
COMMENT ON VIEW vehicle_stats IS 'Статистика по машинам';
COMMENT ON VIEW route_stats IS 'Статистика по маршрутам';
