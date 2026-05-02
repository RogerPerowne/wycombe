# Student Tracking - Setup Guide

## What you are getting

Six files that add student login, score tracking, and a teacher dashboard to the existing quiz site:

| File | Purpose |
|---|---|
| `supabase-setup.sql` | Database schema - run once in Supabase |
| `tracker.js` | Auth and score-saving module - loaded on every page |
| `quiz-engine.js` | Modified engine - saves scores when student is logged in |
| `quiz.html` | Modified quiz page - loads tracker.js and Supabase |
| `student-dashboard.html` | Student's progress view (logged-in students) |
| `teacher-dashboard.html` | Admin panel and score overview (password-protected) |

## Setup steps

### 1. Run the database schema

- Open your Supabase project dashboard
- Go to **SQL Editor** (left sidebar)
- Paste the entire contents of `supabase-setup.sql`
- Click **Run**
- You should see "Success" with no errors

This creates three tables (`profiles`, `quiz_attempts`, `app_settings`) and all the RPC functions for login, saving results, and admin operations.

### 2. Configure tracker.js

Open `tracker.js` and replace the two placeholder values at the top:

```javascript
var SUPABASE_URL      = 'YOUR_SUPABASE_URL';
var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

You can find these in your Supabase project:
- Go to **Settings** > **API**
- Copy the **Project URL** (looks like `https://abc123.supabase.co`)
- Copy the **anon public** key (the long string under "Project API keys")

### 3. Upload all files

Replace your existing `quiz-engine.js` and `quiz.html` with the updated versions. Add the four new files (`tracker.js`, `supabase-setup.sql`, `student-dashboard.html`, `teacher-dashboard.html`) alongside them.

### 4. Test it

- Visit `teacher-dashboard.html` in your browser
- Log in with password: **AdamSmith1776!**
- Add a test student (it will generate a random username and PIN)
- Open `quiz.html?topic=demand` in another tab
- Click "Log in" in the top-right corner
- Enter the test student's username and PIN
- Complete the quiz - you should see "Saved" appear
- Check the teacher dashboard - the score should appear in the grid

## How it works

### Student flow
1. Student visits any quiz page and clicks "Log in" in the header
2. Enters their username (e.g. `bold-hawk-42`) and 4-digit PIN
3. Completes quizzes normally - scores auto-save on completion
4. Visits `student-dashboard.html` to see their progress grid
5. Can log out any time; anonymous browsing still works for anyone

### Teacher flow
1. Visit `teacher-dashboard.html` and enter the teacher password
2. **Scores Overview** tab: students down the left, quizzes across the top, colour-coded cells (green 70%+, amber 40-70%, red below 40%)
3. **Manage Students** tab: add new students (generates random username + PIN), reset PINs, remove students
4. Filter by class (U6-B, L6-B, etc.) or paper

### Adding students
- Go to Manage Students tab
- Enter first name, select class, click "Generate & Add"
- The system creates a random username (e.g. `keen-otter-73`) and 4-digit PIN
- Note these down and give to the student (the PIN cannot be viewed again, only reset)
- Repeat for each student, or add in bulk across sessions

### Security model
- No emails or GDPR-sensitive data collected
- Random usernames are meaningless outside the classroom
- All database access goes through server-side RPC functions with Row Level Security
- Teacher operations require the teacher password on every call
- Student PINs are 4-digit codes (appropriate for low-stakes quiz access)
- The Supabase anon key is in client-side code but cannot access tables directly

## Changing the teacher password

Log in to the teacher dashboard, then run this in the browser console:

```javascript
getSupabase().rpc('change_teacher_password', {
  p_old_password: 'AdamSmith1776!',
  p_new_password: 'YourNewPassword'
});
```

Or change it directly in the Supabase SQL Editor:

```sql
UPDATE app_settings SET value = 'YourNewPassword' WHERE key = 'teacher_password';
```

## Adding new class names

The class dropdown in the teacher admin auto-populates from existing students. To add a new class, use the "+ New class..." option when adding the first student for that class.
