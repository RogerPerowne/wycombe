// econOS — Shared sidebar navigation
// Call: buildSidebar(activeItem, role, user, basePath)
// user: { name, initials, school, yearGroup }
// basePath: prefix for all nav hrefs, e.g. 'student/' when calling from root-level pages

function buildSidebar(activeItem, role, user, basePath) {
  basePath = basePath || '';
  role = role || 'student';
  const u = user || {};
  const name     = u.name     || 'Student';
  const initials = u.initials || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const school   = u.school   || '';
  const subLabel = role === 'teacher' ? school : (u.yearGroup ? u.yearGroup + ' · Student' : 'Student');
  const loginPath = '/login';

  const logoBlock = `
    <div class="sidebar-logo">
      <a href="/" style="text-decoration:none;">
        <div class="logo-mark">
          <div class="logo-dots"><span class="d1"></span><span class="d2"></span><span class="d3"></span></div>
          <div class="logo-wordmark"><span class="econ">econ</span><span class="os">OS</span></div>
        </div>
        <div class="logo-tagline">
          <span class="t-learn">Learn it.</span><span class="t-link"> Link it.</span><span class="t-land"> Land it.</span>
        </div>
      </a>
    </div>`;

  const footerBlock = `
    <div class="sidebar-footer">
      <a href="${basePath}settings" class="sidebar-user" style="text-decoration:none;color:inherit;">
        <div class="user-avatar" style="${role === 'teacher' ? 'background:var(--learn-dark);' : ''}">${initials}</div>
        <div class="user-info">
          <div class="user-name">${_esc(name)}</div>
          <div class="user-role">${_esc(subLabel)}</div>
        </div>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756 2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      </a>
    </div>`;

  const studentNav = `
    ${logoBlock}
    <nav class="sidebar-nav">
      <div class="nav-section-label">Home</div>
      <a href="${basePath}dashboard" class="nav-item ${activeItem==='dashboard'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a>
      <a href="${basePath}exam-mode" class="nav-item ${activeItem==='exam'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Exam Mode
      </a>
      <a href="${basePath}topics" class="nav-item ${activeItem==='topics'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        Topics
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Assignments</div>
      <a href="${basePath}assignments" class="nav-item ${activeItem==='assignments'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        My Assignments
        <span class="nav-badge count" id="nav-assign-count" style="display:none;">0</span>
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Revision Tools</div>
      <a href="${basePath}spot-the-flaw" class="nav-item ${activeItem==='spotflaw'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Spot the Flaw
        <span class="nav-badge new">New</span>
      </a>
      <a href="${basePath}land" class="nav-item ${activeItem==='essay'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        Essay Practice
      </a>
      <a href="${basePath}link" class="nav-item ${activeItem==='link'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        Link It
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Simulations</div>
      <a href="${basePath}micro-quiz" class="nav-item ${activeItem==='micro-quiz'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Micro Quiz
      </a>
      <a href="${basePath}macro-quiz" class="nav-item ${activeItem==='macro-quiz'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        Macro Quiz
      </a>
      <a href="${basePath}marcos-pizzeria" class="nav-item ${activeItem==='marcos-pizzeria'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Marco's Pizzeria
      </a>
      <a href="${basePath}cartel-room" class="nav-item ${activeItem==='cartel-room'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Cartel Room
      </a>
      <a href="${basePath}cma-casefile" class="nav-item ${activeItem==='cma-casefile'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        CMA Casefile
      </a>
      <a href="${basePath}economics-gym" class="nav-item ${activeItem==='economics-gym'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Economics Gym
      </a>
      <a href="${basePath}macro-gym" class="nav-item ${activeItem==='macro-gym'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
        Macro Gym
      </a>
      <a href="${basePath}fx-trading-floor" class="nav-item ${activeItem==='fx-trading-floor'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        FX Trading Floor
      </a>
      <a href="${basePath}monetary-policy-simulator" class="nav-item ${activeItem==='monetary-policy-simulator'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
        Monetary Policy
      </a>
      <a href="${basePath}savana-development-simulator" class="nav-item ${activeItem==='savana-development-simulator'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Savana Dev Sim
      </a>
      <a href="${basePath}trade-room" class="nav-item ${activeItem==='trade-room'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
        Trade Room
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Account</div>
      <a href="${basePath}settings" class="nav-item ${activeItem==='settings'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
        Settings
      </a>
      <a href="#" onclick="Auth.signOut('${loginPath}');return false;" class="nav-item">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Log out
      </a>
    </nav>
    <div class="sidebar-upgrade">
      <div class="crown">👑</div>
      <h6>Exam Mode Pro</h6>
      <p>Unlock AI feedback, advanced analytics and more.</p>
      <a href="#" class="btn btn-primary btn-sm" style="width:100%;">Upgrade now →</a>
    </div>
    ${footerBlock}`;

  const teacherNav = `
    ${logoBlock}
    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <a href="${basePath}dashboard" class="nav-item ${activeItem==='dashboard'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a>
      <a href="${basePath}builder" class="nav-item ${activeItem==='builder'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg>
        New Assignment
      </a>
      <a href="${basePath}assignments" class="nav-item ${activeItem==='assignments'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Assignments
      </a>
      <a href="${basePath}students" class="nav-item ${activeItem==='students'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/></svg>
        Students
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Account</div>
      <a href="${basePath}settings" class="nav-item ${activeItem==='settings'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
        Settings
      </a>
      <a href="#" onclick="Auth.signOut('${loginPath}');return false;" class="nav-item">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Log out
      </a>
    </nav>
    <div class="sidebar-upgrade">
      <div class="crown">👑</div>
      <h6>Teacher Pro</h6>
      <p>Unlock advanced analytics and school-wide insights.</p>
      <a href="#" class="btn btn-primary btn-sm" style="width:100%;">Upgrade now →</a>
    </div>
    ${footerBlock}`;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = (role === 'teacher') ? teacherNav : studentNav;
}

function _esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
