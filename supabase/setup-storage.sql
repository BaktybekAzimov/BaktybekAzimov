-- ===================================================
-- SUPABASE STORAGE SETUP FOR TRIP PHOTOS
-- ===================================================
-- Создание bucket для хранения фото путевых листов
-- Выполнить в Supabase SQL Editor

-- 1. Создать bucket (выполнить в Dashboard → Storage или через SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('trip-photos', 'trip-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Политики доступа к bucket
-- Разрешить всем загружать фото (можно ограничить по auth позже)
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'trip-photos');

-- Разрешить всем читать фото
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'trip-photos');

-- Разрешить удаление только владельцу (опционально)
CREATE POLICY "Allow authenticated delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trip-photos' AND auth.uid() = owner);

-- 3. Добавить поля для хранения фото и геолокации в таблицу trips
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS waybill_photo_url TEXT,
ADD COLUMN IF NOT EXISTS odometer_photo_url TEXT,
ADD COLUMN IF NOT EXISTS start_location_lat NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS start_location_lng NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS end_location_lat NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS end_location_lng NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS start_location_address TEXT,
ADD COLUMN IF NOT EXISTS end_location_address TEXT;

-- 4. Комментарии к полям
COMMENT ON COLUMN trips.waybill_photo_url IS 'URL фото путевого листа в Supabase Storage';
COMMENT ON COLUMN trips.odometer_photo_url IS 'URL фото одометра в Supabase Storage';
COMMENT ON COLUMN trips.start_location_lat IS 'Широта начальной точки рейса';
COMMENT ON COLUMN trips.start_location_lng IS 'Долгота начальной точки рейса';
COMMENT ON COLUMN trips.end_location_lat IS 'Широта конечной точки рейса';
COMMENT ON COLUMN trips.end_location_lng IS 'Долгота конечной точки рейса';
COMMENT ON COLUMN trips.start_location_address IS 'Адрес начальной точки (reverse geocoding)';
COMMENT ON COLUMN trips.end_location_address IS 'Адрес конечной точки (reverse geocoding)';

-- ===================================================
-- ИНСТРУКЦИЯ ПО ПРИМЕНЕНИЮ:
-- ===================================================
-- 1. Открыть Supabase Dashboard → SQL Editor
-- 2. Скопировать и выполнить этот скрипт
-- 3. Проверить что bucket создан: Storage → trip-photos
-- 4. Готово! Теперь можно загружать фото
-- ===================================================
