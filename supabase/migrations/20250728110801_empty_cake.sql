/*
  # Create users table for French learning system

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users.id
      - `email` (text, unique) - user's email address
      - `name` (text) - user's full name
      - `current_level` (text) - CEFR level (A1, A2, B1, B2)
      - `total_points` (integer) - accumulated points
      - `streak_days` (integer) - consecutive days of activity
      - `last_activity` (timestamptz) - last time user was active
      - `created_at` (timestamptz) - account creation time

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  current_level text NOT NULL DEFAULT 'A1' CHECK (current_level IN ('A1', 'A2', 'B1', 'B2')),
  total_points integer NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for users to insert their own data (during signup)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);