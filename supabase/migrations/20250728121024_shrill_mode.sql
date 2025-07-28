/*
  # Fix RLS policies for users table

  1. Security Changes
    - Drop existing policies that may be conflicting
    - Create proper INSERT policy for authenticated users during signup
    - Ensure users can only insert their own profile data
    - Maintain existing SELECT and UPDATE policies

  2. Policy Details
    - INSERT: Allow authenticated users to create their own profile (auth.uid() = id)
    - SELECT: Allow users to read their own data
    - UPDATE: Allow users to update their own data
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for new user registration
CREATE POLICY "Enable insert for authenticated users during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create SELECT policy for users to read their own data
CREATE POLICY "Enable read access for users to own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create UPDATE policy for users to update their own data
CREATE POLICY "Enable update for users to own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);