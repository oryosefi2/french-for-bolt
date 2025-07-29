-- =====================================
-- SQL Commands to run in Supabase Dashboard
-- =====================================

-- 1. First, check if user_progress table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_progress';

-- 2. If not exists, create user_progress table
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

-- 3. Enable RLS on user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for user_progress
CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_skill ON user_progress(user_id, skill_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON user_progress(completed_at);

-- 6. Check if exercise_attempts table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'exercise_attempts';

-- 7. If exercise_attempts doesn't exist, create it
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  exercise_data JSONB,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create indexes for exercise_attempts
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user_id ON exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_skill ON exercise_attempts(skill);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_level ON exercise_attempts(level);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_created_at ON exercise_attempts(created_at);

-- 9. Enable RLS on exercise_attempts
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;

-- 10. Create policies for exercise_attempts
CREATE POLICY "Users can view own exercise attempts" ON exercise_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise attempts" ON exercise_attempts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise attempts" ON exercise_attempts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 11. Verify all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_progress', 'exercise_attempts')
ORDER BY table_name;
