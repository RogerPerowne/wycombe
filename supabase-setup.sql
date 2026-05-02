-- ═══════════════════════════════════════════════════════════════
--  Wycombe Abbey Economics Quiz · Supabase Schema
-- ═══════════════════════════════════════════════════════════════
--  Run this entire file in the Supabase SQL Editor (one go).
--  It creates tables, RPC functions, and locks down direct access.
--  All roles (student, teacher, admin) share the accounts table.
-- ═══════════════════════════════════════════════════════════════

-- 1. UNIFIED ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
  id           SERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  credential   TEXT NOT NULL,             -- PIN for students, password for teacher/admin
  display_name TEXT NOT NULL,
  class_set    TEXT,                       -- only relevant for students
  role         TEXT NOT NULL DEFAULT 'student'
               CHECK (role IN ('student', 'teacher', 'admin')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_login   TIMESTAMPTZ
);

-- 2. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           SERIAL PRIMARY KEY,
  profile_id   INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  quiz_id      TEXT NOT NULL,
  score        INTEGER NOT NULL,
  max_score    INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_profile ON quiz_attempts(profile_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz    ON quiz_attempts(quiz_id);

-- 3. ENABLE RLS (block all direct table access via anon key)
ALTER TABLE accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- No policies = no direct access. All access goes through SECURITY DEFINER functions below.

-- ═══════════════════════════════════════════════════════════════
--  RPC FUNCTIONS (all SECURITY DEFINER to bypass RLS)
-- ═══════════════════════════════════════════════════════════════

-- wa_login — works for all roles; returns profile JSON or NULL
CREATE OR REPLACE FUNCTION wa_login(p_username TEXT, p_credential TEXT)
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
  FROM accounts
  WHERE lower(username) = lower(p_username) AND credential = p_credential;

  IF result IS NOT NULL THEN
    UPDATE accounts SET last_login = NOW()
    WHERE lower(username) = lower(p_username);
  END IF;

  RETURN result; -- NULL if no match
END;
$$;

-- get_dashboard_data — teacher/admin only
CREATE OR REPLACE FUNCTION get_dashboard_data(p_username TEXT, p_credential TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  SELECT role INTO caller_role
  FROM accounts
  WHERE lower(username) = lower(p_username) AND credential = p_credential
    AND role IN ('teacher', 'admin');

  IF caller_role IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN json_build_object(
    'students', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', id, 'username', username,
          'display_name', display_name, 'class_set', class_set
        ) ORDER BY class_set, display_name
      ), '[]'::json)
      FROM accounts WHERE role = 'student'
    ),
    'attempts', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'profile_id', profile_id, 'quiz_id', quiz_id,
          'score', score, 'max_score', max_score, 'completed_at', completed_at
        )
      ), '[]'::json)
      FROM quiz_attempts
    )
  );
END;
$$;

-- create_student — teacher/admin only
CREATE OR REPLACE FUNCTION create_student(
  p_username     TEXT,
  p_credential   TEXT,
  p_new_username TEXT,
  p_new_pin      TEXT,
  p_display_name TEXT,
  p_class_set    TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM accounts
    WHERE lower(username) = lower(p_username) AND credential = p_credential
      AND role IN ('teacher', 'admin')
  ) THEN
    RETURN json_build_object('error', 'Unauthorised');
  END IF;

  IF EXISTS(SELECT 1 FROM accounts WHERE lower(username) = lower(p_new_username)) THEN
    RETURN json_build_object('error', 'Username already exists');
  END IF;

  INSERT INTO accounts (username, credential, display_name, class_set, role)
  VALUES (lower(p_new_username), p_new_pin, p_display_name, p_class_set, 'student')
  RETURNING json_build_object(
    'id', id, 'username', username, 'display_name', display_name, 'class_set', class_set
  ) INTO result;

  RETURN result;
END;
$$;

-- delete_student — teacher/admin only
CREATE OR REPLACE FUNCTION delete_student(
  p_username   TEXT,
  p_credential TEXT,
  p_student_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM accounts
    WHERE lower(username) = lower(p_username) AND credential = p_credential
      AND role IN ('teacher', 'admin')
  ) THEN
    RETURN FALSE;
  END IF;

  DELETE FROM accounts WHERE id = p_student_id AND role = 'student';
  RETURN TRUE;
END;
$$;

-- reset_student_pin — teacher/admin only
CREATE OR REPLACE FUNCTION reset_student_pin(
  p_username   TEXT,
  p_credential TEXT,
  p_student_id INTEGER,
  p_new_pin    TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM accounts
    WHERE lower(username) = lower(p_username) AND credential = p_credential
      AND role IN ('teacher', 'admin')
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE accounts SET credential = p_new_pin WHERE id = p_student_id AND role = 'student';
  RETURN TRUE;
END;
$$;

-- change_my_credential — any role can change their own credential
CREATE OR REPLACE FUNCTION change_my_credential(
  p_username TEXT,
  p_old_cred TEXT,
  p_new_cred TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM accounts
    WHERE lower(username) = lower(p_username) AND credential = p_old_cred
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE accounts SET credential = p_new_cred
  WHERE lower(username) = lower(p_username);
  RETURN TRUE;
END;
$$;

-- save_attempt — student must exist in accounts
CREATE OR REPLACE FUNCTION save_attempt(
  p_profile_id INTEGER,
  p_quiz_id    TEXT,
  p_score      INTEGER,
  p_max_score  INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT EXISTS(SELECT 1 FROM accounts WHERE id = p_profile_id AND role = 'student') THEN
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

-- get_my_attempts — retrieve a student's quiz history
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

-- ═══════════════════════════════════════════════════════════════
--  DONE. All access goes through RPC functions.
--  Direct table queries via anon key are blocked by RLS.
-- ═══════════════════════════════════════════════════════════════
