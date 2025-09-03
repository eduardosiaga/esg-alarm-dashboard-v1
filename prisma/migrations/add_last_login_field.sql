-- Add last_login field to device_status table
ALTER TABLE device_status 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Add comment to the column
COMMENT ON COLUMN device_status.last_login IS 'Timestamp of the last device login event (initial connection)';