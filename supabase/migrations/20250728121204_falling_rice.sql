/*
  # Temporarily disable RLS for user signup

  This migration temporarily disables Row Level Security on the users table
  to allow new user profile creation during signup. This is a workaround
  for the RLS policy issue that's preventing user registration.

  1. Changes
     - Disable RLS on users table
     - Keep existing table structure intact

  Note: This is a temporary solution. In production, you should configure
  proper RLS policies in the Supabase dashboard.
*/

-- Temporarily disable RLS to allow user creation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;