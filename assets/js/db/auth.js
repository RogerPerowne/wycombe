// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Student Auth
// ═══════════════════════════════════════════════════════════════
//  Handles student login/logout, session, login modal, and
//  injects auth controls into the page header.
//
//  Requires: client.js loaded before this file.
//
//  Exposes window.WA for quiz-engine.js integration:
//    WA.isLoggedIn()   → boolean
//    WA.saveScore(id, score, total) → Promise<{ok, error?}>
//    WA.showLoginModal()
//    WA.doLogout()
// ═══════════════════════════════════════════════════════════════

// ── Session ─────────────────────────────────────────────────────

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

// ── Root path (read from meta tag set per-page) ─────────────────
// Root-level pages set <meta name="wa-root" content="">
// Pages inside /dashboards/ set <meta name="wa-root" content="../">

function rootPath() {
  var meta = document.querySelector('meta[name="wa-root"]');
  return meta ? (meta.getAttribute('content') || '') : '';
}

// ── Login / Logout ───────────────────────────────────────────────

async function doSignUp(classCode, displayName) {
  var sb = getSupabase();
  if (!sb) return { error: 'Database not configured' };
  var { data, error } = await sb.rpc('sign_up', {
    p_class_code:   classCode.trim().toUpperCase(),
    p_display_name: displayName.trim()
  });
  if (error) return { error: error.message };
  if (!data)  return { error: 'Sign-up failed' };
  if (data.error) return { error: data.error };
  return { result: data };
}

async function doLogin(username, pin) {
  var sb = getSupabase();
  if (!sb) return { error: 'Database not configured' };

  var { data, error } = await sb.rpc('wa_login', {
    p_username:   username.trim(),
    p_credential: pin.trim()
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

// ── Login Modal ──────────────────────────────────────────────────

function showLoginModal() {
  var existing = document.getElementById('wa-login-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'wa-login-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Student Login');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML =
    '<div style="background:#1a2744;border:1px solid #2e3f60;border-radius:12px;padding:2rem 2.2rem;width:340px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.5)">'
    + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:.3rem">Student Login</div>'
    + '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;color:#dde3f0;opacity:.5;margin-bottom:1.2rem">Enter your username and PIN</div>'
    + '<input id="wa-login-user" type="text" placeholder="Username" autocomplete="off" autocapitalize="off" '
    + 'aria-label="Username" '
    + 'style="width:100%;padding:.65rem .8rem;margin-bottom:.6rem;background:rgba(255,255,255,.06);border:1px solid #2e3f60;border-radius:6px;color:#fff;font-family:Nunito,sans-serif;font-size:.9rem;outline:none">'
    + '<input id="wa-login-pin" type="password" placeholder="PIN" inputmode="numeric" maxlength="4" '
    + 'aria-label="PIN" '
    + 'style="width:100%;padding:.65rem .8rem;margin-bottom:.6rem;background:rgba(255,255,255,.06);border:1px solid #2e3f60;border-radius:6px;color:#fff;font-family:Nunito,sans-serif;font-size:.9rem;outline:none">'
    + '<div id="wa-login-error" role="alert" aria-live="polite" style="font-size:.78rem;color:#e05060;margin-bottom:.6rem;min-height:1.2em"></div>'
    + '<div style="display:flex;gap:.6rem">'
    + '<button id="wa-login-btn" '
    + 'style="flex:1;padding:.65rem;border:none;border-radius:6px;background:linear-gradient(135deg,#4a7fb5,#6fa8d8);color:#0f1729;font-family:\'IBM Plex Mono\',monospace;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-weight:600">Log in</button>'
    + '<button '
    + 'style="padding:.65rem .9rem;border:1px solid #2e3f60;border-radius:6px;background:rgba(255,255,255,.05);color:#dde3f0;font-family:\'IBM Plex Mono\',monospace;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer" '
    + 'onclick="document.getElementById(\'wa-login-modal\').remove()" aria-label="Cancel">Cancel</button>'
    + '</div>'
    + '</div>';

  document.body.appendChild(overlay);

  // Attach keydown listeners immediately (no setTimeout needed — elements exist now)
  var userInput = document.getElementById('wa-login-user');
  var pinInput  = document.getElementById('wa-login-pin');
  var loginBtn  = document.getElementById('wa-login-btn');

  userInput.focus();

  loginBtn.onclick = handleLogin;

  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
  });
  pinInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
  });

  // Escape key closes modal
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', onKeyDown);
    }
  }
  document.addEventListener('keydown', onKeyDown);

  // Clean up Escape listener when modal is removed via other means
  overlay.addEventListener('remove', function() {
    document.removeEventListener('keydown', onKeyDown);
  });
}

async function handleLogin() {
  var btn    = document.getElementById('wa-login-btn');
  var errDiv = document.getElementById('wa-login-error');
  if (!btn || !errDiv) return;

  var username = document.getElementById('wa-login-user').value;
  var pin      = document.getElementById('wa-login-pin').value;

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
    btn.textContent = 'Log in';
    btn.disabled = false;
  } else {
    var modal = document.getElementById('wa-login-modal');
    if (modal) modal.remove();
    updateHeaderUI();
  }
}

// ── Header UI ────────────────────────────────────────────────────

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function updateHeaderUI() {
  var container = document.getElementById('wa-auth');
  if (!container) return;

  var user = getCurrentUser();
  var root = rootPath();

  if (user) {
    container.innerHTML =
      '<a href="' + root + 'dashboards/student.html" '
      + 'style="font-family:\'IBM Plex Mono\',monospace;font-size:.55rem;letter-spacing:.06em;color:#e2c47a;margin-right:.4rem;text-decoration:none">'
      + escHtml(user.display_name)
      + '</a>'
      + '<button class="hbtn" onclick="doLogout()" style="font-size:.5rem">Log out</button>';
  } else {
    container.innerHTML =
      '<button class="hbtn" onclick="showLoginModal()">Log in</button>';
  }
}

// ── WA object (interface for quiz-engine.js) ─────────────────────
// Quiz-engine calls WA.isLoggedIn() and WA.saveScore() at results time.
// saveQuizResult is loaded from attempts.js which follows auth.js in
// all page load orders, so by the time a quiz finishes it is defined.

window.WA = {
  isLoggedIn: function() {
    return !!getCurrentUser();
  },
  saveScore: function(quizId, score, total) {
    if (typeof saveQuizResult === 'function') {
      return saveQuizResult(quizId, score, total);
    }
    return Promise.resolve({ ok: false, error: 'attempts module not loaded' });
  },
  showLoginModal: function() { showLoginModal(); },
  doLogout: function() { doLogout(); }
};

// Expose functions globally so inline onclick attributes can find them
window.doSignUp         = doSignUp;
window.showLoginModal   = showLoginModal;
window.handleLogin      = handleLogin;
window.doLogout         = doLogout;
window.updateHeaderUI   = updateHeaderUI;
window.getCurrentUser   = getCurrentUser;
window.setCurrentUser   = setCurrentUser;
window.clearCurrentUser = clearCurrentUser;
window.getSupabase      = getSupabase;
window.escHtml          = escHtml;
window.rootPath         = rootPath;

// ── Auto-init: inject auth UI into header nav ────────────────────

(function() {
  function initAuth() {
    var nav = document.querySelector('.hnav');
    if (nav && !document.getElementById('wa-auth')) {
      var authDiv = document.createElement('div');
      authDiv.id = 'wa-auth';
      authDiv.style.cssText = 'display:flex;align-items:center;gap:.4rem;margin-left:.3rem';
      nav.appendChild(authDiv);
      updateHeaderUI();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
