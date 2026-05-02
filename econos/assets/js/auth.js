// econOS — Authentication helpers
// Depends on: supabase-client.js (window._sb)

const Auth = (function () {
  let _cachedSession = null;
  let _cachedProfile = null;

  // ── Core session helpers ────────────────────────────────────────────────

  async function getSession() {
    if (!window._sb) return null;
    const { data, error } = await window._sb.auth.getSession();
    if (error) { console.error('[Auth] getSession error:', error); return null; }
    _cachedSession = data.session;
    return _cachedSession;
  }

  async function getProfile(userId) {
    if (!window._sb || !userId) return null;
    if (_cachedProfile && _cachedProfile.id === userId) return _cachedProfile;
    const { data, error } = await window._sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) { console.error('[Auth] getProfile error:', error); return null; }
    _cachedProfile = data;
    return _cachedProfile;
  }

  // ── Auth guards ───────────────────────────────────────────────────

  async function requireAuth(loginUrl) {
    const resolvedLogin = loginUrl || _resolveLoginUrl();
    if (!window._sbConfigured) {
      _showConfigBanner();
      return null;
    }
    const session = await getSession();
    if (!session) {
      window.location.href = resolvedLogin;
      return null;
    }
    return session;
  }

  async function requireStudent(loginUrl) {
    const session = await requireAuth(loginUrl);
    if (!session) return null;
    const profile = await getProfile(session.user.id);
    if (!profile) { window.location.href = _resolveLoginUrl(); return null; }
    if (profile.role === 'teacher') {
      window.location.href = _resolveTeacherDash();
      return null;
    }
    return { session, profile };
  }

  async function requireTeacher(loginUrl) {
    const session = await requireAuth(loginUrl);
    if (!session) return null;
    const profile = await getProfile(session.user.id);
    if (!profile || profile.role !== 'teacher') {
      window.location.href = _resolveStudentDash();
      return null;
    }
    return { session, profile };
  }

  // ── Sign out ─────────────────────────────────────────────────────────

  async function signOut(redirectUrl) {
    _cachedSession = null;
    _cachedProfile = null;
    if (window._sb) await window._sb.auth.signOut();
    window.location.href = redirectUrl || _resolveLoginUrl();
  }

  // ── Activity tracking ─────────────────────────────────────────────────

  async function recordActivity(type, topicName, subtopicName, score, maxScore, referenceId) {
    if (!window._sb || !_cachedSession) return;
    const userId = _cachedSession.user.id;

    window._sb.from('activity_events').insert({
      student_id:    userId,
      type,
      topic_name:    topicName,
      subtopic_name: subtopicName,
      score,
      max_score:     maxScore,
      reference_id:  referenceId || null
    }).then(({ error }) => {
      if (error) console.warn('[Auth] recordActivity error:', error.message);
    });

    const today = new Date().toISOString().split('T')[0];
    window._sb.from('streak_events').upsert(
      { student_id: userId, date: today },
      { onConflict: 'student_id,date' }
    ).then(({ error }) => {
      if (error) console.warn('[Auth] streak upsert error:', error.message);
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  function _resolveLoginUrl() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth >= 2 ? '../login.html' : 'login.html';
  }

  function _resolveStudentDash() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth >= 2 ? 'dashboard.html' : 'student/dashboard.html';
  }

  function _resolveTeacherDash() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth >= 2 ? '../teacher/dashboard.html' : 'teacher/dashboard.html';
  }

  function _showConfigBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = [
      'position:fixed;inset:0;z-index:9999;background:#0F172A;',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'font-family:Inter,sans-serif;color:white;text-align:center;padding:2rem;'
    ].join('');
    banner.innerHTML = `
      <div style="font-size:2rem;margin-bottom:1rem;">⚙️</div>
      <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:0.5rem;">Supabase not configured</h2>
      <p style="color:rgba(255,255,255,0.6);max-width:500px;line-height:1.6;">
        Open <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">econos/assets/js/config.js</code>
        and add your Supabase project URL and anon key.<br><br>
        See <code>SETUP.md</code> for full instructions.
      </p>
      <a href="../SETUP.md" style="margin-top:1.5rem;padding:0.625rem 1.25rem;background:#2563EB;border-radius:8px;text-decoration:none;color:white;font-weight:600;">
        View setup guide →
      </a>`;
    document.body.appendChild(banner);
  }

  return {
    getSession,
    getProfile,
    requireAuth,
    requireStudent,
    requireTeacher,
    signOut,
    recordActivity,
    get session() { return _cachedSession; },
    get profile() { return _cachedProfile; }
  };
})();
