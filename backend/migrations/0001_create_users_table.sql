-- Migration: Create users table
-- Description: Authentication system with users table for D1 database

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'researcher' CHECK(role IN ('clinician', 'researcher', 'admin')),
  created_at TEXT NOT NULL
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
