-- econOS A-Level Economics Platform — Full Database Schema
-- Run this in the Supabase SQL editor for your project
-- Dashboard → SQL Editor → paste and run

-- ─── EXTENSIONS ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES ──────────────────────────────────────────────────────────────────
-- Extends auth.users — auto-populated via trigger on signup
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  email           text,
  full_name       text not null default 'New User',
  role            text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  school_name     text,
  year_group      text,
  avatar_initials text,
  created_at      timestamptz default now()
);

-- Trigger: create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, school_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'school_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── SCHOOLS ───────────────────────────────────────────────────────────────────
create table if not exists public.schools (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  created_at  timestamptz default now()
);

-- ─── CLASSES ───────────────────────────────────────────────────────────────────
create table if not exists public.classes (
  id          uuid default gen_random_uuid() primary key,
  teacher_id  uuid references public.profiles(id) on delete cascade not null,
  school_id   uuid references public.schools(id) on delete set null,
  name        text not null,
  year_group  text,
  invite_code text unique default substr(md5(random()::text || clock_timestamp()::text), 1, 8),
  created_at  timestamptz default now()
);

-- ─── CLASS MEMBERSHIPS ─────────────────────────────────────────────────────────
create table if not exists public.class_memberships (
  id          uuid default gen_random_uuid() primary key,
  class_id    uuid references public.classes(id) on delete cascade not null,
  student_id  uuid references public.profiles(id) on delete cascade not null,
  joined_at   timestamptz default now(),
  unique(class_id, student_id)
);

-- ─── TOPICS ────────────────────────────────────────────────────────────────────
-- Top-level groupings: e.g. "Monetary Policy", "Market Failure"
create table if not exists public.topics (
  id              uuid default gen_random_uuid() primary key,
  theme_number    int not null,
  theme_name      text not null,
  title           text not null,
  slug            text not null unique,
  description     text,
  order_in_theme  int default 0,
  paper           text default 'both',
  icon            text default '📊',
  created_at      timestamptz default now()
);

-- ─── SUBTOPICS ─────────────────────────────────────────────────────────────────
-- Individual learning units within a topic
create table if not exists public.subtopics (
  id                  uuid default gen_random_uuid() primary key,
  topic_id            uuid references public.topics(id) on delete cascade not null,
  title               text not null,
  slug                text not null,
  order_in_topic      int default 0,
  content_html        text,
  key_terms           jsonb default '[]',
  learning_objectives jsonb default '[]',
  estimated_minutes   int default 10,
  created_at          timestamptz default now(),
  unique(topic_id, slug)
);

-- ─── QUESTIONS ─────────────────────────────────────────────────────────────────
-- MCQ, chain (link-it), flaw (spot-the-flaw), short_answer
create table if not exists public.questions (
  id              uuid default gen_random_uuid() primary key,
  subtopic_id     uuid references public.subtopics(id) on delete set null,
  topic_id        uuid references public.topics(id) on delete set null,
  type            text not null check (type in ('mcq', 'chain', 'flaw', 'short_answer')),
  question_text   text not null,
  -- MCQ: [{text, correct, explanation}]
  options         jsonb,
  -- Chain: [{step, hint, position}]
  chain_steps     jsonb,
  -- Flaw: [{text, is_flawed, explanation}]
  flaw_answers    jsonb,
  correct_answer  text,
  explanation     text,
  difficulty      text check (difficulty in ('foundation', 'core', 'stretch')) default 'core',
  marks           int default 1,
  created_at      timestamptz default now()
);

-- ─── TOPIC MASTERY ─────────────────────────────────────────────────────────────
-- Per student per subtopic progress tracking
create table if not exists public.topic_mastery (
  id              uuid default gen_random_uuid() primary key,
  student_id      uuid references public.profiles(id) on delete cascade not null,
  subtopic_id     uuid references public.subtopics(id) on delete cascade not null,
  learn_score     int default 0 check (learn_score between 0 and 100),
  link_score      int default 0 check (link_score between 0 and 100),
  land_score      int default 0 check (land_score between 0 and 100),
  attempts        int default 0,
  last_practiced  timestamptz,
  created_at      timestamptz default now(),
  unique(student_id, subtopic_id)
);

-- ─── PRACTICE ATTEMPTS ─────────────────────────────────────────────────────────
create table if not exists public.practice_attempts (
  id                  uuid default gen_random_uuid() primary key,
  student_id          uuid references public.profiles(id) on delete cascade not null,
  question_id         uuid references public.questions(id) on delete set null,
  subtopic_id         uuid references public.subtopics(id) on delete set null,
  type                text not null,
  answer              text,
  correct             boolean,
  score               int,
  max_score           int,
  time_spent_seconds  int,
  created_at          timestamptz default now()
);

-- ─── ASSIGNMENTS ───────────────────────────────────────────────────────────────
create table if not exists public.assignments (
  id              uuid default gen_random_uuid() primary key,
  teacher_id      uuid references public.profiles(id) on delete cascade not null,
  class_id        uuid references public.classes(id) on delete cascade not null,
  title           text not null,
  description     text,
  due_date        date,
  type            text check (type in ('learn', 'link', 'land', 'exam', 'mixed')),
  subtopic_ids    uuid[] default '{}',
  question_ids    uuid[] default '{}',
  created_at      timestamptz default now()
);

-- ─── ESSAYS ────────────────────────────────────────────────────────────────────
create table if not exists public.essays (
  id               uuid default gen_random_uuid() primary key,
  student_id       uuid references public.profiles(id) on delete cascade not null,
  assignment_id    uuid references public.assignments(id) on delete set null,
  subtopic_id      uuid references public.subtopics(id) on delete set null,
  question         text not null,
  content          text,
  word_count       int,
  ai_feedback      jsonb,
  teacher_feedback text,
  teacher_score    int,
  ai_score         int,
  submitted_at     timestamptz,
  created_at       timestamptz default now()
);

-- ─── ASSIGNMENT SUBMISSIONS ────────────────────────────────────────────────────
create table if not exists public.assignment_submissions (
  id              uuid default gen_random_uuid() primary key,
  assignment_id   uuid references public.assignments(id) on delete cascade not null,
  student_id      uuid references public.profiles(id) on delete cascade not null,
  submitted_at    timestamptz,
  score           int,
  max_score       int,
  feedback        text,
  created_at      timestamptz default now(),
  unique(assignment_id, student_id)
);

-- ─── STREAK EVENTS ─────────────────────────────────────────────────────────────
-- One row per student per active day — upserted whenever student completes any activity
create table if not exists public.streak_events (
  id          uuid default gen_random_uuid() primary key,
  student_id  uuid references public.profiles(id) on delete cascade not null,
  date        date not null,
  created_at  timestamptz default now(),
  unique(student_id, date)
);

-- ─── ACTIVITY EVENTS ───────────────────────────────────────────────────────────
-- Feed shown on dashboard; written on every meaningful student action
create table if not exists public.activity_events (
  id              uuid default gen_random_uuid() primary key,
  student_id      uuid references public.profiles(id) on delete cascade not null,
  type            text not null,  -- 'essay', 'link_it', 'mcq', 'flaw', 'learn'
  topic_name      text,
  subtopic_name   text,
  score           int,
  max_score       int,
  reference_id    uuid,           -- e.g. essay.id or practice_attempt.id
  created_at      timestamptz default now()
);

-- ─── INDEXES ───────────────────────────────────────────────────────────────────
create index if not exists idx_subtopics_topic_id on public.subtopics(topic_id);
create index if not exists idx_questions_subtopic_id on public.questions(subtopic_id);
create index if not exists idx_questions_topic_id on public.questions(topic_id);
create index if not exists idx_questions_type on public.questions(type);
create index if not exists idx_topic_mastery_student on public.topic_mastery(student_id);
create index if not exists idx_topic_mastery_subtopic on public.topic_mastery(subtopic_id);
create index if not exists idx_practice_student on public.practice_attempts(student_id);
create index if not exists idx_practice_created on public.practice_attempts(created_at);
create index if not exists idx_essays_student on public.essays(student_id);
create index if not exists idx_assignments_class on public.assignments(class_id);
create index if not exists idx_assignments_teacher on public.assignments(teacher_id);
create index if not exists idx_streak_student_date on public.streak_events(student_id, date);
create index if not exists idx_activity_student_created on public.activity_events(student_id, created_at);
create index if not exists idx_class_memberships_student on public.class_memberships(student_id);
create index if not exists idx_class_memberships_class on public.class_memberships(class_id);

-- ─── HELPER VIEW: STUDENT MASTERY SUMMARY ──────────────────────────────────────
create or replace view public.student_mastery_summary as
select
  tm.student_id,
  t.id as topic_id,
  t.theme_number,
  t.theme_name,
  t.title as topic_title,
  t.slug as topic_slug,
  round(avg(tm.learn_score))::int as avg_learn,
  round(avg(tm.link_score))::int  as avg_link,
  round(avg(tm.land_score))::int  as avg_land,
  round(avg((tm.learn_score + tm.link_score + tm.land_score) / 3.0))::int as overall_mastery,
  count(tm.id)::int as subtopics_practiced
from public.topic_mastery tm
join public.subtopics st on st.id = tm.subtopic_id
join public.topics t on t.id = st.topic_id
group by tm.student_id, t.id, t.theme_number, t.theme_name, t.title, t.slug;

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.topics enable row level security;
alter table public.subtopics enable row level security;
alter table public.questions enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.essays enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.streak_events enable row level security;
alter table public.activity_events enable row level security;

-- ── PROFILES ──
create policy "own_profile_select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "teacher_can_view_student_profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.classes c
      join public.class_memberships cm on cm.class_id = c.id
      where c.teacher_id = auth.uid() and cm.student_id = profiles.id
    )
  );

create policy "own_profile_update"
  on public.profiles for update
  using (auth.uid() = id);

create policy "own_profile_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── SCHOOLS ──
create policy "authenticated_read_schools"
  on public.schools for select
  to authenticated using (true);

-- ── CLASSES ──
create policy "teacher_manage_own_classes"
  on public.classes for all
  using (teacher_id = auth.uid());

create policy "student_view_enrolled_classes"
  on public.classes for select
  using (
    exists (
      select 1 from public.class_memberships
      where class_id = classes.id and student_id = auth.uid()
    )
  );

-- ── CLASS MEMBERSHIPS ──
create policy "teacher_manage_class_memberships"
  on public.class_memberships for all
  using (
    exists (
      select 1 from public.classes
      where id = class_memberships.class_id and teacher_id = auth.uid()
    )
  );

create policy "student_view_own_memberships"
  on public.class_memberships for select
  using (student_id = auth.uid());

create policy "student_join_class"
  on public.class_memberships for insert
  with check (student_id = auth.uid());

-- ── TOPICS (public read for all authenticated users) ──
create policy "authenticated_read_topics"
  on public.topics for select
  to authenticated using (true);

-- ── SUBTOPICS ──
create policy "authenticated_read_subtopics"
  on public.subtopics for select
  to authenticated using (true);

-- ── QUESTIONS ──
create policy "authenticated_read_questions"
  on public.questions for select
  to authenticated using (true);

-- ── TOPIC MASTERY ──
create policy "student_own_mastery"
  on public.topic_mastery for all
  using (student_id = auth.uid());

create policy "teacher_view_class_mastery"
  on public.topic_mastery for select
  using (
    exists (
      select 1 from public.classes c
      join public.class_memberships cm on cm.class_id = c.id
      where c.teacher_id = auth.uid() and cm.student_id = topic_mastery.student_id
    )
  );

-- ── PRACTICE ATTEMPTS ──
create policy "student_own_attempts"
  on public.practice_attempts for all
  using (student_id = auth.uid());

create policy "teacher_view_class_attempts"
  on public.practice_attempts for select
  using (
    exists (
      select 1 from public.classes c
      join public.class_memberships cm on cm.class_id = c.id
      where c.teacher_id = auth.uid() and cm.student_id = practice_attempts.student_id
    )
  );

-- ── ESSAYS ──
create policy "student_own_essays"
  on public.essays for all
  using (student_id = auth.uid());

create policy "teacher_view_assignment_essays"
  on public.essays for select
  using (
    exists (
      select 1 from public.assignments a
      where a.id = essays.assignment_id and a.teacher_id = auth.uid()
    )
  );

create policy "teacher_update_assignment_essays"
  on public.essays for update
  using (
    exists (
      select 1 from public.assignments a
      where a.id = essays.assignment_id and a.teacher_id = auth.uid()
    )
  );

-- ── ASSIGNMENTS ──
create policy "teacher_manage_own_assignments"
  on public.assignments for all
  using (teacher_id = auth.uid());

create policy "student_view_class_assignments"
  on public.assignments for select
  using (
    exists (
      select 1 from public.class_memberships cm
      where cm.class_id = assignments.class_id and cm.student_id = auth.uid()
    )
  );

-- ── ASSIGNMENT SUBMISSIONS ──
create policy "student_own_submissions"
  on public.assignment_submissions for all
  using (student_id = auth.uid());

create policy "teacher_view_assignment_submissions"
  on public.assignment_submissions for select
  using (
    exists (
      select 1 from public.assignments a
      where a.id = assignment_submissions.assignment_id and a.teacher_id = auth.uid()
    )
  );

-- ── STREAK EVENTS ──
create policy "student_own_streaks"
  on public.streak_events for all
  using (student_id = auth.uid());

-- ── ACTIVITY EVENTS ──
create policy "student_own_activity"
  on public.activity_events for all
  using (student_id = auth.uid());

create policy "teacher_view_class_activity"
  on public.activity_events for select
  using (
    exists (
      select 1 from public.classes c
      join public.class_memberships cm on cm.class_id = c.id
      where c.teacher_id = auth.uid() and cm.student_id = activity_events.student_id
    )
  );
