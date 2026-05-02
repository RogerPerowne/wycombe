// ═══════════════════════════════════════════════════════════════
//  assets/js/db/auth.js — Student auth & session management
// ═══════════════════════════════════════════════════════════════

// ── SESSION ──────────────────────────────────────────────────

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

// ── LOGIN / LOGOUT ────────────────────────────────────────────

async function doLogin(username, pin) {
  var sb = getSupabase();
  if (!sb) return { error: 'Database not configured' };

  var { data, error } = await sb.rpc('student_login', {
    p_username: username.trim().toLowerCase(),
    p_pin: pin.trim()
  });

  if (error) return { error: error.message };
  if (!data)  return { error: 'Invalid username or PIN' };

  setCurrentUser(data);
  return { user: data };
}

function doLogout() {
  clearCurrentUser();
  updateHeaderUI();
}

// ── HEADER UI ────────────────────────────────────────────────

function updateHeaderUI() {
  var container = document.getElementById('wa-auth');
  if (!container) return;

  var user = getCurrentUser();

  if (user) {
    container.innerHTML =
      '<span id="save-badge" style="display:none;font-family:\'IBM Plex Mono\',monospace;'
      + 'font-size:.52rem;letter-spacing:.07em;text-transform:uppercase;color:#4caf80;'
      + 'padding:.2rem .5rem;border:1px solid rgba(76,175,128,.3);border-radius:3px;'
      + 'margin-right:.4rem;transition:opacity .4s"></span>'
      + '<a href="' + rootPath() + 'dashboards/student.html" style="font-family:\'IBM Plex Mono\','
      + 'monospace;font-size:.55rem;letter-spacing:.06em;color:#e2c47a;margin-right:.4rem;'
      + 'text-decoration:none">' + escHtml(user.display_name) + '</a>'
      + '<button class="hbtn" onclick="doLogout()" style="font-size:.5rem">Log out</button>';
  } else {
    container.innerHTML =
      '<button class="hbtn" onclick="showLoginModal()">Log in</button>';
  }
}

function rootPath() {
  // Work out relative path back to root based on current page depth
  var depth = window.location.pathname.replace(/\/[^/]*$/, '').split('/').filter(Boolean).length;
  // Rough heuristic: if URL contains /dashboards/, we're one level deep
  if (window.location.pathname.indexOf('/dashboards/') !== -1) return '../';
  return '';
}

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── LOGIN MODAL ───────────────────────────────────────────────

function showLoginModal() {
  var existing = document.getElementById('wa-login-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'wa-login-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9000;'
    + 'display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML =
    '<div style="background:#1a2744;border:1px solid #2e3f60;border-radius:12px;'
    + 'padding:2rem 2.2rem;width:340px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.5)">'
    + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.4rem;font-weight:700;'
    + 'color:#fff;margin-bottom:.3rem">Student Login</div>'
    + '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:.52rem;letter-spacing:.08em;'
    + 'text-transform:uppercase;color:#dde3f0;opacity:.5;margin-bottom:1.2rem">Enter your username and PIN</div>'
    + '<input id="wa-login-user" type="text" placeholder="Username e.g. bold-hawk-42" '
    + 'autocomplete="off" autocapitalize="off" class="form-input">'
    + '<input id="wa-login-pin" type="password" placeholder="4-digit PIN" '
    + 'inputmode="numeric" maxlength="4" class="form-input">'
    + '<div id="wa-login-error" class="form-err"></div>'
    + '<div style="display:flex;gap:.6rem">'
    + '<button id="wa-login-btn" onclick="handleLogin()" class="btn b-blue" style="flex:1">Log in</button>'
    + '<button onclick="document.getElementById(\'wa-login-modal\').remove()" '
    + 'class="btn b-sec">Cancel</button>'
    + '</div></div>';

  document.body.appendChild(overlay);
  setTimeout(function(){ document.getElementById('wa-login-user').focus(); }, 100);

  ['wa-login-user','wa-login-pin'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLogin();
    });
  });
}

async function handleLogin() {
  var btn    = document.getElementById('wa-login-btn');
  var errDiv = document.getElementById('wa-login-error');
  var user   = document.getElementById('wa-login-user').value;
  var pin    = document.getElementById('wa-login-pin').value;

  if (!user || !pin) { errDiv.textContent = 'Please enter both username and PIN'; return; }

  btn.textContent = '...';
  btn.disabled = true;
  errDiv.textContent = '';

  var result = await doLogin(user, pin);

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

// ── AUTO-INIT ─────────────────────────────────────────────────

(function(){
  function init() {
    var nav = document.querySelector('.hnav');
    if (nav && !document.getElementById('wa-auth')) {
      var d = document.createElement('div');
      d.id = 'wa-auth';
      d.style.cssText = 'display:flex;align-items:center;gap:.4rem;margin-left:.3rem';
      nav.appendChild(d);
      updateHeaderUI();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
