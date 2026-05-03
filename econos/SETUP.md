# econOS — Setup Guide

A production-ready A-Level Economics learning platform. Built with vanilla HTML/CSS/JS and Supabase.

---

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier is fine)
- A web server or static host (Netlify, Vercel, GitHub Pages, etc.)

---

## 1. Create a Supabase Project

1. Log in to [supabase.com](https://supabase.com) and click **New project**
2. Choose a name (e.g. `econos`), set a strong database password, and select a region
3. Wait ~2 minutes for provisioning

---

## 2. Apply the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Open `econos/supabase/schema.sql` from this repo
3. Paste the entire contents into the editor and click **Run**

This creates:
- All tables (profiles, topics, subtopics, questions, mastery, essays, assignments, etc.)
- Row-Level Security (RLS) policies for student/teacher access
- A trigger to auto-create a profile row on user signup
- Indexes for performance

---

## 3. Seed the Database

1. In the SQL Editor, open a new tab
2. Open `econos/supabase/seed.sql` from this repo
3. Paste the entire contents and click **Run**

This inserts:
- Edexcel A-Level Economics themes 1–4 (topics and subtopics)
- 15+ MCQ questions
- Chain-of-reasoning questions (Link it)
- Spot the Flaw questions

The seed is **idempotent** — safe to run multiple times.

---

## 4. Configure Authentication

In your Supabase project:

1. Go to **Authentication → Providers**
2. **Email** is enabled by default — leave it on
3. (Optional) Enable **Google** OAuth:
   - Create a Google Cloud OAuth app at [console.cloud.google.com](https://console.cloud.google.com)
   - Add your site URL to the authorised redirect URIs
   - Paste the Client ID and Secret into Supabase

4. Go to **Authentication → URL Configuration**
   - Set **Site URL** to your deployed domain (e.g. `https://econos.app`)
   - Add any local dev URLs to **Redirect URLs** (e.g. `http://localhost:3000`)

---

## 5. Configure the App

1. In Supabase, go to **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long JWT string)

3. Open `econos/assets/js/config.js` and replace the placeholder values:

```js
window.ECONOS_CONFIG = {
  supabaseUrl:     'https://your-project-ref.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

> **Never commit real keys to a public repo.** If the repo is private, this is fine. For public repos, use Netlify/Vercel environment variable injection at build time.

---

## 6. Deploy

### Netlify (recommended)

1. Push the repo to GitHub
2. Connect to Netlify and set **Publish directory** to `econos`
3. Deploy — done

For the `404.html` to work as a catch-all:
- Netlify automatically serves `404.html` for unmatched routes

### Local development

Any static server works:

```bash
# Python
python3 -m http.server 3000 --directory econos

# Node (npx)
npx serve econos -p 3000

# VS Code — Live Server extension
# Right-click econos/index.html → Open with Live Server
```

---

## 7. Create the First Teacher Account

1. Open `login.html` in a browser
2. Switch to **Sign up**
3. Fill in name, email, password, school name
4. Change the **Role** selector to **Teacher** before submitting

The `handle_new_user` trigger will create a `profiles` row with `role = 'teacher'`.

---

## File Structure

```
econos/
├── assets/
│   ├── css/
│   │   └── main.css
│   └── js/
│       ├── config.js          ← ADD YOUR KEYS HERE
│       ├── supabase-client.js ← initialises window._sb
│       ├── auth.js            ← Auth guards + session helpers
│       ├── api.js             ← All Supabase data queries
│       └── nav.js             ← Sidebar renderer
├── student/
│   ├── dashboard.html
│   ├── topics.html
│   ├── learn.html
│   ├── link.html
│   ├── land.html
│   ├── spot-the-flaw.html
│   └── exam-mode.html
├── teacher/
│   ├── dashboard.html
│   └── builder.html
├── supabase/
│   ├── schema.sql             ← Full DB schema + RLS
│   └── seed.sql               ← Economics content
├── index.html                 ← Landing / redirect
├── login.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── .env.example
└── SETUP.md                   ← This file
```

---

## Role-Based Access

| Role    | Can access                                      |
|---------|-------------------------------------------------|
| student | `/student/*` — dashboard, topics, learn, etc.   |
| teacher | `/teacher/*` — dashboard, assignment builder    |

Pages enforce their role via `Auth.requireStudent()` / `Auth.requireTeacher()`. Visiting a teacher page as a student redirects to the student dashboard and vice versa.

---

## Troubleshooting

**"Supabase not configured" banner appears**
→ `config.js` still has placeholder values. Fill in your real Project URL and anon key.

**Redirect loop on login**
→ Check that your Supabase Site URL matches the domain you're using. Go to Authentication → URL Configuration.

**No data appears after seeding**
→ Confirm the seed ran without errors. Check the `topics` table in Supabase Table Editor.

**RLS blocking queries**
→ Make sure the user is signed in (session exists). RLS policies require `auth.uid()` to match the row owner.

**Google OAuth not working**
→ Verify the redirect URI in Google Cloud includes `https://your-project-ref.supabase.co/auth/v1/callback`.
