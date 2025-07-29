-- Add exercise_attempts table for tracking exercise attempts
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user_id ON exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_skill ON exercise_attempts(skill);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_level ON exercise_attempts(level);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_created_at ON exercise_attempts(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own attempts
CREATE POLICY "Users can view own exercise attempts" ON exercise_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own attempts
CREATE POLICY "Users can insert own exercise attempts" ON exercise_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own attempts
CREATE POLICY "Users can update own exercise attempts" ON exercise_attempts
  FOR UPDATE USING (auth.uid() = user_id);
