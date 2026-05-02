-- ═══════════════════════════════════════════════════════════════
--  Wycombe Abbey Economics Quiz · Supabase Schema
-- ═══════════════════════════════════════════════════════════════
--  Run this entire file in the Supabase SQL Editor (one go).
--  It creates tables, RPC functions, and locks down direct access.
-- ═══════════════════════════════════════════════════════════════

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id          SERIAL PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  pin         TEXT NOT NULL,
  display_name TEXT NOT NULL,
  class_set   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          SERIAL PRIMARY KEY,
  profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id     TEXT NOT NULL,
  score       INTEGER NOT NULL,
  max_score   INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_profile ON quiz_attempts(profile_id);
CREATE INDEX idx_attempts_quiz    ON quiz_attempts(quiz_id);

-- 3. SETTINGS (teacher password etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO app_settings (key, value)
VALUES ('teacher_password', 'AdamSmith1776!')
ON CONFLICT (key) DO NOTHING;

-- 4. ENABLE RLS (block all direct table access via anon key)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- No policies = no direct access. All access goes through SECURITY DEFINER functions below.

-- ═══════════════════════════════════════════════════════════════
--  RPC FUNCTIONS (all SECURITY DEFINER to bypass RLS)
-- ═══════════════════════════════════════════════════════════════

-- 5a. Student login
CREATE OR REPLACE FUNCTION student_login(p_username TEXT, p_pin TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', id, 'username', username, 'display_name', display_name,
    'class_set', class_set, 'role', role
  ) INTO result
  FROM profiles
  WHERE lower(username) = lower(p_username) AND pin = p_pin;

  RETURN result; -- NULL if no match
END;
$$;

-- 5b. Teacher login (returns boolean)
CREATE OR REPLACE FUNCTION teacher_login(p_password TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM app_settings
    WHERE key = 'teacher_password' AND value = p_password
  );
$$;

-- 5c. Save a quiz attempt (student must exist)
CREATE OR REPLACE FUNCTION save_attempt(
  p_profile_id INTEGER,
  p_quiz_id TEXT,
  p_score INTEGER,
  p_max_score INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Verify profile exists
  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_profile_id) THEN
    RETURN NULL;
  END IF;

  INSERT INTO quiz_attempts (profile_id, quiz_id, score, max_score)
  VALUES (p_profile_id, p_quiz_id, p_score, p_max_score)
  RETURNING json_build_object(
    'id', id, 'quiz_id', quiz_id, 'score', score,
    'max_score', max_score, 'completed_at', completed_at
  ) INTO result;

  RETURN result;
END;
$$;

-- 5d. Get a student's own attempts
CREATE OR REPLACE FUNCTION get_my_attempts(p_profile_id INTEGER)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(json_agg(
    json_build_object(
      'quiz_id', quiz_id, 'score', score,
      'max_score', max_score, 'completed_at', completed_at
    ) ORDER BY completed_at DESC
  ), '[]'::json)
  FROM quiz_attempts
  WHERE profile_id = p_profile_id;
$$;

-- 5e. Get all teacher data (requires password)
CREATE OR REPLACE FUNCTION get_teacher_data(p_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM app_settings WHERE key = 'teacher_password' AND value = p_password) THEN
    RETURN NULL;
  END IF;

  RETURN json_build_object(
    'students', (
      SELECT COALESCE(json_agg(
        json_build_object('id', id, 'username', username, 'display_name', display_name, 'class_set', class_set)
        ORDER BY class_set, display_name
      ), '[]'::json)
      FROM profiles WHERE role = 'student'
    ),
    'attempts', (
      SELECT COALESCE(json_agg(
        json_build_object('profile_id', profile_id, 'quiz_id', quiz_id, 'score', score, 'max_score', max_score, 'completed_at', completed_at)
      ), '[]'::json)
      FROM quiz_attempts
    )
  );
END;
$$;

-- 5f. Create a student (teacher password required)
CREATE OR REPLACE FUNCTION create_student(
  p_password TEXT,
  p_username TEXT,
  p_pin TEXT,
  p_display_name TEXT,
  p_class_set TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT EXISTS(SELECT 1 FROM app_settings WHERE key = 'teacher_password' AND value = p_password) THEN
    RETURN json_build_object('error', 'Invalid teacher password');
  END IF;

  IF EXISTS(SELECT 1 FROM profiles WHERE lower(username) = lower(p_username)) THEN
    RETURN json_build_object('error', 'Username already exists');
  END IF;

  INSERT INTO profiles (username, pin, display_name, class_set)
  VALUES (lower(p_username), p_pin, p_display_name, p_class_set)
  RETURNING json_build_object(
    'id', id, 'username', username, 'pin', pin,
    'display_name', display_name, 'class_set', class_set
  ) INTO result;

  RETURN result;
END;
$$;

-- 5g. Delete a student (teacher password required)
CREATE OR REPLACE FUNCTION delete_student(p_password TEXT, p_profile_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM app_settings WHERE key = 'teacher_password' AND value = p_password) THEN
    RETURN FALSE;
  END IF;

  DELETE FROM profiles WHERE id = p_profile_id AND role = 'student';
  RETURN TRUE;
END;
$$;

-- 5h. Reset a student's PIN (teacher password required)
CREATE OR REPLACE FUNCTION reset_pin(p_password TEXT, p_profile_id INTEGER, p_new_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM app_settings WHERE key = 'teacher_password' AND value = p_password) THEN
    RETURN FALSE;
  END IF;

  UPDATE profiles SET pin = p_new_pin WHERE id = p_profile_id;
  RETURN TRUE;
END;
$$;

-- 5i. Change teacher password
CREATE OR REPLACE FUNCTION change_teacher_password(p_old_password TEXT, p_new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM app_settings WHERE key = 'teacher_password' AND value = p_old_password) THEN
    RETURN FALSE;
  END IF;

  UPDATE app_settings SET value = p_new_password WHERE key = 'teacher_password';
  RETURN TRUE;
END;
$$;

-- ═══════════════════════════════════════════════════════════════
--  DONE. All access goes through RPC functions.
--  Direct table queries via anon key are blocked by RLS.
-- ═══════════════════════════════════════════════════════════════
