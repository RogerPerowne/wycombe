/* econOS – shared sidebar navigation helper */

function buildSidebar(activeItem, role = 'student') {
  const studentNav = `
    <div class="sidebar-logo">
      <a href="../index.html" style="text-decoration:none;">
        <div class="logo-mark">
          <div class="logo-dots">
            <span class="d1"></span><span class="d2"></span><span class="d3"></span>
          </div>
          <div class="logo-wordmark"><span class="econ">econ</span><span class="os">OS</span></div>
        </div>
        <div class="logo-tagline">
          <span class="t-learn">Learn it.</span>
          <span class="t-link"> Link it.</span>
          <span class="t-land"> Land it.</span>
        </div>
      </a>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Home</div>
      <a href="dashboard.html" class="nav-item ${activeItem==='dashboard'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a>
      <a href="exam-mode.html" class="nav-item ${activeItem==='exam'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Exam Mode
      </a>
      <a href="practice.html" class="nav-item ${activeItem==='practice'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Quick Practice
      </a>
      <a href="topics.html" class="nav-item ${activeItem==='topics'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        Topics
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Assignments</div>
      <a href="assignments.html" class="nav-item ${activeItem==='assignments'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        My Assignments
        <span class="nav-badge count">2</span>
      </a>
      <a href="past-work.html" class="nav-item ${activeItem==='pastwork'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        Past Work
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Revision Tools</div>
      <a href="#" class="nav-item ${activeItem==='mixitup'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 4h16M4 12h16M4 20h16"/></svg>
        Mix It Up
        <span class="nav-badge new">New</span>
      </a>
      <a href="exam-questions.html" class="nav-item ${activeItem==='examq'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
        Exam Questions
      </a>
      <a href="flashcards.html" class="nav-item ${activeItem==='flashcards'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
        Flashcards
      </a>
      <a href="essay-practice.html" class="nav-item ${activeItem==='essay'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        Essay Practice
      </a>
      <a href="spot-the-flaw.html" class="nav-item ${activeItem==='spotflaw'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Spot the Flaw
        <span class="nav-badge new">New</span>
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Account</div>
      <a href="progress.html" class="nav-item ${activeItem==='progress'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        My Progress
      </a>
      <a href="settings.html" class="nav-item ${activeItem==='settings'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
        Settings
      </a>
      <a href="../login.html" class="nav-item">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Log out
      </a>
    </nav>
    <div class="sidebar-upgrade">
      <div class="crown">👑</div>
      <h6>Exam Mode Pro</h6>
      <p>Unlock advanced analytics, AI feedback and more.</p>
      <a href="#" class="btn btn-primary btn-sm" style="width:100%;">Upgrade now →</a>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar">AJ</div>
        <div class="user-info">
          <div class="user-name">Alex Johnson</div>
          <div class="user-role">Year 12 · Student</div>
        </div>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
      </div>
    </div>`;

  const teacherNav = `
    <div class="sidebar-logo">
      <a href="../index.html" style="text-decoration:none;">
        <div class="logo-mark">
          <div class="logo-dots">
            <span class="d1"></span><span class="d2"></span><span class="d3"></span>
          </div>
          <div class="logo-wordmark"><span class="econ">econ</span><span class="os">OS</span></div>
        </div>
        <div class="logo-tagline">
          <span class="t-learn">Learn it.</span>
          <span class="t-link"> Link it.</span>
          <span class="t-land"> Land it.</span>
        </div>
      </a>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <a href="dashboard.html" class="nav-item ${activeItem==='dashboard'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a>
      <a href="assignments.html" class="nav-item ${activeItem==='assignments'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Assignments
      </a>
      <a href="students.html" class="nav-item ${activeItem==='students'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/></svg>
        Students
      </a>
      <a href="classes.html" class="nav-item ${activeItem==='classes'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        Classes
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Analytics</div>
      <a href="class-insights.html" class="nav-item ${activeItem==='classinsights'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        Class Insights
      </a>
      <a href="topic-insights.html" class="nav-item ${activeItem==='topicinsights'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        Topic Insights
      </a>
      <div class="nav-section-label" style="margin-top:0.5rem;">Resources</div>
      <a href="question-bank.html" class="nav-item ${activeItem==='qbank'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        Question Bank
      </a>
      <a href="curriculum.html" class="nav-item ${activeItem==='curriculum'?'active':''}">
        <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        Curriculum
      </a>
    </nav>
    <div class="sidebar-upgrade">
      <div class="crown">👑</div>
      <h6>Teacher Pro</h6>
      <p>Unlock advanced analytics and school-wide insights.</p>
      <a href="#" class="btn btn-primary btn-sm" style="width:100%;">Upgrade now →</a>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar" style="background:var(--learn-dark);">MH</div>
        <div class="user-info">
          <div class="user-name">Mr. Harris</div>
          <div class="user-role">Westfield Sixth Form</div>
        </div>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
      </div>
    </div>`;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = role === 'teacher' ? teacherNav : studentNav;
  }
}
