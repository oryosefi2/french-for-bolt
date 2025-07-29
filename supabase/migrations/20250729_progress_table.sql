/*
  # Create user_progress table for tracking learning progress

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `level` (text) - CEFR level when exercise was completed
      - `skill_type` (text) - type of skill (reading, listening, etc.)
      - `topic` (text) - topic of the exercise
      - `score` (integer) - percentage score (0-100)
      - `time_spent` (integer) - time in seconds
      - `exercise_data` (jsonb) - full exercise data for analysis
      - `completed_at` (timestamptz) - when exercise was completed

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for users to read/write their own progress
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  level text NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2')),
  skill_type text NOT NULL CHECK (skill_type IN ('reading', 'listening', 'writing', 'speaking', 'vocabulary', 'grammar')),
  topic text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent integer NOT NULL CHECK (time_spent > 0),
  exercise_data jsonb,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_user_progress_user_skill ON user_progress(user_id, skill_type);
CREATE INDEX idx_user_progress_completed_at ON user_progress(completed_at);
