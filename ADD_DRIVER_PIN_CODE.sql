-- =============================================================================
-- ADD PIN CODE COLUMN TO DRIVERS TABLE
-- =============================================================================
-- Run this in your Supabase SQL Editor
-- This adds individual PIN codes for driver authentication
-- =============================================================================

-- Add pin_code column to drivers table
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS pin_code VARCHAR(4);

-- Generate PIN codes for existing drivers who don't have one
UPDATE drivers
SET pin_code = LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0')
WHERE pin_code IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN drivers.pin_code IS 'Individual 4-digit PIN code for driver authentication in trip form';

-- Verify the changes
SELECT id, full_name, phone, pin_code, status
FROM drivers
ORDER BY full_name;
