# Wycombe Abbey Economics Quiz - v2 Structure

## Folder layout

```
/
├── quiz.html                  ← Quiz runner (all topics)
├── micro-quiz.html            ← Paper 1 hub
├── macro-quiz.html            ← Paper 2 hub
├── economics-gym.html         ← Main landing
│
├── dashboards/
│   ├── student.html           ← Student progress view (requires login)
│   ├── teacher.html           ← Teacher score overview (username + password)
│   └── admin.html             ← Admin panel (add students/teachers, full scores)
│
├── assets/
│   ├── css/
│   │   ├── base.css           ← Variables, reset, header, layout, buttons
│   │   ├── quiz.css           ← All 12 question type styles + results
│   │   └── dashboard.css      ← Hub pages, dashboards, tables, forms
│   │
│   ├── js/
│   │   ├── config.js          ← Supabase URL + publishable key
│   │   ├── quiz-engine.js     ← Quiz engine (all question types)
│   │   ├── db/
│   │   │   ├── client.js      ← Supabase client singleton
│   │   │   ├── auth.js        ← Student login, session, header UI
│   │   │   ├── attempts.js    ← Save/retrieve quiz attempts
│   │   │   └── admin.js       ← Admin/teacher auth + student CRUD
│   │
│   └── data/
│       └── quiz-data.js       ← All 55 quizzes, 550 questions
│
├── migration-v2.sql           ← Apply to Supabase branch first
└── populate-questions.sql     ← Populates questions table (run after migration)
```

## Load order for each page type

**Quiz pages (quiz.html):**
```html
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/quiz.css">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/data/quiz-data.js"></script>
<script src="assets/js/quiz-engine.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/db/client.js"></script>
<script src="assets/js/db/auth.js"></script>
<script src="assets/js/db/attempts.js"></script>
```

**Hub pages (micro-quiz.html etc.) - add after existing scripts:**
```html
<script src="assets/js/config.js"></script>
<script src="assets/js/db/client.js"></script>
<script src="assets/js/db/auth.js"></script>
```

**Dashboards (in /dashboards/ folder - paths use ../):**
```html
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<script src="../assets/js/config.js"></script>
<script src="../assets/js/db/client.js"></script>
<script src="../assets/js/db/auth.js"></script>
<script src="../assets/js/db/admin.js"></script>
```

## Logins

| Who | URL | Credentials |
|---|---|---|
| Students | Any quiz page (Log in button) | username + PIN |
| Teachers | dashboards/teacher.html | username + password (set by admin) |
| Admin | dashboards/admin.html | admin / AdamSmith1776! |

## Supabase setup order

1. Run `migration-v2.sql` (creates new tables + all RPC functions)
2. Run `populate-questions.sql` (inserts all 550 questions)
3. Update `assets/js/config.js` with your Supabase URL and publishable key

## Notes on populate-questions.sql

This file is ~1MB. Supabase's SQL editor may time out on large pastes.
If so, split it into batches of ~100 questions:
- Lines 1-107 = demand, supply, equilibrium quizzes
- Or use the Supabase CLI: `supabase db execute --file populate-questions.sql`
