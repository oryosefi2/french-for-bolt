-- Test queries to verify database is updated correctly

-- 1. Check that all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_progress', 'exercise_attempts')
ORDER BY table_name;

-- 2. Check user_progress table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- 3. Check exercise_attempts table structure  
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exercise_attempts'
ORDER BY ordinal_position;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('users', 'user_progress', 'exercise_attempts')
ORDER BY tablename, policyname;
