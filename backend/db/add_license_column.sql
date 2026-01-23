-- Add license_url column to drivers table
ALTER TABLE drivers ADD COLUMN license_url VARCHAR(500) AFTER photo_url;

-- Verify the column was added
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'car_rental_booking' 
  AND TABLE_NAME = 'drivers' 
  AND COLUMN_NAME IN ('photo_url', 'license_url');
