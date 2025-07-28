/*
  # Fix RLS policy for user creation

  1. Security Changes
    - Update INSERT policy to allow users to create their own profile during signup
    - Ensure users can only insert data with their own auth.uid()
    
  2. Policy Updates
    - Modified INSERT policy to work during the signup process
    - Maintained security by ensuring users can only create their own records
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create a new INSERT policy that allows users to create their own profile
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the SELECT policy exists for reading own data
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure the UPDATE policy exists for updating own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);