// ═══════════════════════════════════════════════════════════════
//  assets/js/db/admin.js — Admin & teacher management functions
// ═══════════════════════════════════════════════════════════════

// ── USERNAME / PIN GENERATION ─────────────────────────────────

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
  var adj  = USERNAME_ADJECTIVES[Math.floor(Math.random() * USERNAME_ADJECTIVES.length)];
  var noun = USERNAME_NOUNS[Math.floor(Math.random() * USERNAME_NOUNS.length)];
  var num  = Math.floor(Math.random() * 90) + 10;
  return adj + '-' + noun + '-' + num;
}

function generatePin() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

// ── ADMIN AUTH ────────────────────────────────────────────────

async function adminLogin(username, password) {
  var sb = getSupabase();
  if (!sb) return { error: 'Database not configured' };

  var { data, error } = await sb.rpc('admin_login', {
    p_username: username.trim().toLowerCase(),
    p_password: password
  });

  if (error) return { error: error.message };
  if (!data)  return { error: 'Invalid admin credentials' };
  return { ok: true };
}

// ── TEACHER AUTH ──────────────────────────────────────────────

async function teacherLogin(username, password) {
  var sb = getSupabase();
  if (!sb) return { error: 'Database not configured' };

  var { data, error } = await sb.rpc('teacher_login_v2', {
    p_username: username.trim().toLowerCase(),
    p_password: password
  });

  if (error) return { error: error.message };
  if (!data)  return { error: 'Invalid teacher credentials' };
  return { teacher: data };
}

// ── DATA RETRIEVAL ────────────────────────────────────────────

async function getTeacherData(token) {
  var sb = getSupabase();
  if (!sb) return null;
  try {
    var { data } = await sb.rpc('get_teacher_data_v2', { p_token: token });
    return data;
  } catch(e) { return null; }
}

async function getAdminData(username, password) {
  var sb = getSupabase();
  if (!sb) return null;
  try {
    var { data } = await sb.rpc('get_admin_data', {
      p_username: username,
      p_password: password
    });
    return data;
  } catch(e) { return null; }
}

// ── STUDENT CRUD ──────────────────────────────────────────────

async function createStudent(adminUser, adminPass, firstName, lastName, classSet, email) {
  var sb = getSupabase();
  var username = generateUsername();
  var pin      = generatePin();

  var { data } = await sb.rpc('create_student_v2', {
    p_admin_user:  adminUser,
    p_admin_pass:  adminPass,
    p_username:    username,
    p_pin:         pin,
    p_first_name:  firstName,
    p_last_name:   lastName,
    p_class_set:   classSet,
    p_email:       email || null
  });

  if (data && data.error) return { error: data.error };
  if (data) return { student: data, username, pin };
  return { error: 'Failed to create student' };
}

async function deleteStudent(adminUser, adminPass, profileId) {
  var sb = getSupabase();
  var { data } = await sb.rpc('delete_student_v2', {
    p_admin_user:  adminUser,
    p_admin_pass:  adminPass,
    p_profile_id:  profileId
  });
  return !!data;
}

async function resetStudentPin(adminUser, adminPass, profileId) {
  var sb   = getSupabase();
  var newPin = generatePin();
  var { data } = await sb.rpc('reset_pin_v2', {
    p_admin_user:  adminUser,
    p_admin_pass:  adminPass,
    p_profile_id:  profileId,
    p_new_pin:     newPin
  });
  return data ? { pin: newPin } : { error: 'Failed to reset PIN' };
}

// ── TEACHER CRUD (admin only) ─────────────────────────────────

async function createTeacher(adminUser, adminPass, firstName, lastName, classeSets, teacherUsername, teacherPassword) {
  var sb = getSupabase();
  var { data } = await sb.rpc('create_teacher', {
    p_admin_user:      adminUser,
    p_admin_pass:      adminPass,
    p_username:        teacherUsername,
    p_password:        teacherPassword,
    p_first_name:      firstName,
    p_last_name:       lastName,
    p_class_sets:      classeSets
  });
  if (data && data.error) return { error: data.error };
  return data ? { ok: true } : { error: 'Failed to create teacher' };
}
