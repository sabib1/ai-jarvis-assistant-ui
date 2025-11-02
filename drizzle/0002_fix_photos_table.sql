-- Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_url TEXT NOT NULL,
  is_main INTEGER DEFAULT 0 NOT NULL,
  created_at TEXT NOT NULL
);

-- Create index on is_main for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_is_main ON photos(is_main);