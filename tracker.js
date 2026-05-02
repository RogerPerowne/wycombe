// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Student Tracker
// ═══════════════════════════════════════════════════════════════
//  Loaded on every quiz page. Handles login/logout, injects
//  user status into the header, and saves quiz results.
//
//  Requires: Supabase JS client loaded via CDN before this file.
//  Config:   Set SUPABASE_URL and SUPABASE_ANON_KEY below.
// ═══════════════════════════════════════════════════════════════

// ── CONFIG (edit these two values) ──────────────────────────
var SUPABASE_URL      = 'YOUR_SUPABASE_URL';
var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
// ─────────────────────────────────────────────────────────────

var _sb = null; // Supabase client (lazy init)

function getSupabase() {
  if (!_sb && typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sb;
}

// ═══════════════════════════════════════════════════════════════
//  SESSION  (sessionStorage-based)
// ═══════════════════════════════════════════════════════════════

function getCurrentUser() {
  try {
    var raw = sessionStorage.getItem('wa_user');
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

function setCurrentUser(profile) {
  sessionStorage.setItem('wa_user', JSON.stringify(profile));
}

function clearCurrentUser() {
  sessionStorage.removeItem('wa_user');
}

// ═══════════════════════════════════════════════════════════════
//  LOGIN / LOGOUT
// ═══════════════════════════════════════════════════════════════

async function doLogin(username, pin) {
  var sb = getSupabase();
  if (!sb) return { error: 'Tracker not configured' };

  var { data, error } = await sb.rpc('student_login', {
    p_username: username.trim(),
    p_pin: pin.trim()
  });

  if (error) return { error: error.message };
  if (!data) return { error: 'Invalid username or PIN' };

  setCurrentUser(data);
  return { user: data };
}

function doLogout() {
  clearCurrentUser();
  updateHeaderUI();
}

// ═══════════════════════════════════════════════════════════════
//  SAVE QUIZ RESULT
// ═══════════════════════════════════════════════════════════════

async function saveQuizResult(quizId, score, maxScore) {
  var user = getCurrentUser();
  if (!user) return;

  var sb = getSupabase();
  if (!sb) return;

  try {
    await sb.rpc('save_attempt', {
      p_profile_id: user.id,
      p_quiz_id: quizId,
      p_score: score,
      p_max_score: maxScore
    });

    // Show saved indicator
    var badge = document.getElementById('save-badge');
    if (badge) {
      badge.textContent = '✓ Saved';
      badge.style.display = 'inline-block';
      setTimeout(function(){ badge.style.opacity = '0'; }, 2500);
    }
  } catch(e) {
    console.warn('Could not save result:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
//  HEADER UI  (login button / user badge)
// ═══════════════════════════════════════════════════════════════

function updateHeaderUI() {
  var container = document.getElementById('wa-auth');
  if (!container) return;

  var user = getCurrentUser();

  if (user) {
    container.innerHTML =
      '<span id="save-badge" style="display:none;font-family:\'IBM Plex Mono\',monospace;font-size:.52rem;letter-spacing:.07em;text-transform:uppercase;color:#4caf80;padding:.2rem .5rem;border:1px solid rgba(76,175,128,.3);border-radius:3px;margin-right:.4rem;transition:opacity .4s"></span>'
      + '<span style="font-family:\'IBM Plex Mono\',monospace;font-size:.55rem;letter-spacing:.06em;color:#e2c47a;margin-right:.4rem">'
      + escHtml(user.display_name)
      + '</span>'
      + '<button class="hbtn" onclick="doLogout()" style="font-size:.5rem">Log out</button>';
  } else {
    container.innerHTML =
      '<button class="hbtn" onclick="showLoginModal()">Log in</button>';
  }
}

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ═══════════════════════════════════════════════════════════════
//  LOGIN MODAL
// ═══════════════════════════════════════════════════════════════

function showLoginModal() {
  // Remove existing
  var existing = document.getElementById('wa-login-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'wa-login-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML =
    '<div style="background:#1a2744;border:1px solid #2e3f60;border-radius:12px;padding:2rem 2.2rem;width:340px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.5)">'
    + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:.3rem">Student Login</div>'
    + '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;color:#dde3f0;opacity:.5;margin-bottom:1.2rem">Enter your username and PIN</div>'
    + '<input id="wa-login-user" type="text" placeholder="Username" autocomplete="off" autocapitalize="off" '
    + 'style="width:100%;padding:.65rem .8rem;margin-bottom:.6rem;background:rgba(255,255,255,.06);border:1px solid #2e3f60;border-radius:6px;color:#fff;font-family:Nunito,sans-serif;font-size:.9rem;outline:none">'
    + '<input id="wa-login-pin" type="password" placeholder="PIN" inputmode="numeric" maxlength="4" '
    + 'style="width:100%;padding:.65rem .8rem;margin-bottom:.6rem;background:rgba(255,255,255,.06);border:1px solid #2e3f60;border-radius:6px;color:#fff;font-family:Nunito,sans-serif;font-size:.9rem;outline:none">'
    + '<div id="wa-login-error" style="font-size:.78rem;color:#e05060;margin-bottom:.6rem;min-height:1.2em"></div>'
    + '<div style="display:flex;gap:.6rem">'
    + '<button id="wa-login-btn" onclick="handleLogin()" '
    + 'style="flex:1;padding:.65rem;border:none;border-radius:6px;background:linear-gradient(135deg,#4a7fb5,#6fa8d8);color:#0f1729;font-family:\'IBM Plex Mono\',monospace;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-weight:600">Log in</button>'
    + '<button onclick="document.getElementById(\'wa-login-modal\').remove()" '
    + 'style="padding:.65rem .9rem;border:1px solid #2e3f60;border-radius:6px;background:rgba(255,255,255,.05);color:#dde3f0;font-family:\'IBM Plex Mono\',monospace;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer">Cancel</button>'
    + '</div>'
    + '</div>';

  document.body.appendChild(overlay);

  // Focus username field
  setTimeout(function(){ document.getElementById('wa-login-user').focus(); }, 100);

  // Enter key submits
  ['wa-login-user','wa-login-pin'].forEach(function(id){
    document.getElementById(id).addEventListener('keydown', function(e){
      if (e.key === 'Enter') handleLogin();
    });
  });
}

async function handleLogin() {
  var btn = document.getElementById('wa-login-btn');
  var errDiv = document.getElementById('wa-login-error');
  var username = document.getElementById('wa-login-user').value;
  var pin = document.getElementById('wa-login-pin').value;

  if (!username || !pin) {
    errDiv.textContent = 'Please enter both username and PIN';
    return;
  }

  btn.textContent = '...';
  btn.disabled = true;
  errDiv.textContent = '';

  var result = await doLogin(username, pin);

  if (result.error) {
    errDiv.textContent = result.error;
    btn.textContent = 'LOG IN';
    btn.disabled = false;
  } else {
    var modal = document.getElementById('wa-login-modal');
    if (modal) modal.remove();
    updateHeaderUI();
  }
}

// ═══════════════════════════════════════════════════════════════
//  USERNAME GENERATOR  (for teacher admin page)
// ═══════════════════════════════════════════════════════════════

var USERNAME_ADJECTIVES = [
  'swift','bold','keen','bright','calm','clear','quick','sharp',
  'true','wise','brave','cool','fair','fast','kind','neat',
  'sage','warm','wild','steady','prime','grand'
];
var USERNAME_NOUNS = [
  'fox','hawk','lynx','wolf','bear','deer','hare','seal',
  'wren','dove','crow','pike','otter','finch','robin','heron'
];

function generateUsername() {
  var adj = USERNAME_ADJECTIVES[Math.floor(Math.random() * USERNAME_ADJECTIVES.length)];
  var noun = USERNAME_NOUNS[Math.floor(Math.random() * USERNAME_NOUNS.length)];
  var num = Math.floor(Math.random() * 90) + 10; // 10-99
  return adj + '-' + noun + '-' + num;
}

function generatePin() {
  return String(Math.floor(Math.random() * 9000) + 1000); // 1000-9999
}

// ═══════════════════════════════════════════════════════════════
//  AUTO-INIT  (inject auth UI into header on page load)
// ═══════════════════════════════════════════════════════════════

(function(){
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
  } else {
    initTracker();
  }

  function initTracker() {
    // Find or create the auth container in the header nav
    var nav = document.querySelector('.hnav');
    if (nav) {
      var authDiv = document.createElement('div');
      authDiv.id = 'wa-auth';
      authDiv.style.cssText = 'display:flex;align-items:center;gap:.4rem;margin-left:.3rem';
      nav.appendChild(authDiv);
      updateHeaderUI();
    }
  }
})();
