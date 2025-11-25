-- FIX RLS POLICIES - Упрощенные политики без проверки auth.users
-- Выполните этот скрипт в Supabase SQL Editor

-- ============================================
-- Удаляем старые политики
-- ============================================

DROP POLICY IF EXISTS "Trips are viewable by authorized users" ON trips;
DROP POLICY IF EXISTS "Drivers are viewable by authenticated users" ON drivers;
DROP POLICY IF EXISTS "Vehicles are viewable by authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Routes are viewable by authenticated users" ON routes;

-- ============================================
-- Создаем упрощенные политики
-- ============================================

-- Все authenticated пользователи могут просматривать все данные
CREATE POLICY "Anyone authenticated can view drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can view routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can view trips"
  ON trips FOR SELECT
  TO authenticated
  USING (true);

-- Политики для INSERT (все authenticated могут создавать)
CREATE POLICY "Anyone authenticated can insert drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone authenticated can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone authenticated can insert routes"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone authenticated can insert trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Политики для UPDATE (все authenticated могут обновлять)
CREATE POLICY "Anyone authenticated can update drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can update routes"
  ON routes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can update trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (true);

-- Политики для DELETE (все authenticated могут удалять)
CREATE POLICY "Anyone authenticated can delete drivers"
  ON drivers FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can delete routes"
  ON routes FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can delete trips"
  ON trips FOR DELETE
  TO authenticated
  USING (true);
