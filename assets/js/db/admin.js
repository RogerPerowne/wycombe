// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Teacher/Admin Operations
// ═══════════════════════════════════════════════════════════════
//  Requires: client.js loaded before this file.
//
//  RPC functions used:
//    login(p_username, p_credential)
//    get_dashboard_data(p_username, p_credential)
//    create_student(p_username, p_credential, p_new_username, p_new_pin, p_display_name, p_class_set)
//    delete_student(p_username, p_credential, p_student_id)
//    reset_student_pin(p_username, p_credential, p_student_id, p_new_pin)
//    change_my_credential(p_username, p_old_cred, p_new_cred)
// ═══════════════════════════════════════════════════════════════

// ── Username / PIN generators ────────────────────────────────────

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
  var num  = Math.floor(Math.random() * 90) + 10; // 10–99
  return adj + '-' + noun + '-' + num;
}

function generatePin() {
  return String(Math.floor(Math.random() * 9000) + 1000); // 1000–9999
}

// ── Teacher/admin auth ───────────────────────────────────────────

async function teacherLogin(username, credential) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('wa_login', {
    p_username:   username.trim(),
    p_credential: credential.trim()
  });
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Invalid username or password' };
  if (data.role !== 'teacher' && data.role !== 'admin') {
    return { ok: false, error: 'Access denied: teacher or admin account required' };
  }
  return { ok: true, role: data.role };
}

async function getTeacherData(username, credential) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('get_dashboard_data', {
    p_username:   username.trim(),
    p_credential: credential.trim()
  });
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Invalid credentials or no data' };
  return { ok: true, data: data };
}

// ── Student CRUD ─────────────────────────────────────────────────

async function createStudent(username, credential, newUsername, pin, displayName, classSet) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('create_student', {
    p_username:     username.trim(),
    p_credential:   credential.trim(),
    p_new_username: newUsername,
    p_new_pin:      pin,
    p_display_name: displayName,
    p_class_set:    classSet
  });
  if (error)              return { ok: false, error: error.message };
  if (data && data.error) return { ok: false, error: data.error };
  return { ok: true, data: data };
}

async function deleteStudent(username, credential, profileId) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('delete_student', {
    p_username:   username.trim(),
    p_credential: credential.trim(),
    p_student_id: profileId
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function resetStudentPin(username, credential, profileId, newPin) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('reset_student_pin', {
    p_username:   username.trim(),
    p_credential: credential.trim(),
    p_student_id: profileId,
    p_new_pin:    newPin
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function changeTeacherPassword(username, oldCred, newCred) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('change_my_credential', {
    p_username: username.trim(),
    p_old_cred: oldCred,
    p_new_cred: newCred
  });
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Current password incorrect' };
  return { ok: true };
}

// ── Admin: teacher CRUD ──────────────────────────────────────────

async function adminGetTeachers(username, credential) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_get_teachers', { p_username: username.trim(), p_credential: credential.trim() });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data || [] };
}

async function adminAddTeacher(username, credential, newUsername, newPassword, displayName, assignedClasses) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_add_teacher', {
    p_username:          username.trim(),
    p_credential:        credential.trim(),
    p_new_username:      newUsername.trim(),
    p_new_password:      newPassword,
    p_display_name:      displayName.trim(),
    p_assigned_classes:  assignedClasses
  });
  if (error)              return { ok: false, error: error.message };
  if (data && data.error) return { ok: false, error: data.error };
  return { ok: true, data: data };
}

async function adminRemoveTeacher(username, credential, teacherId) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_remove_teacher', { p_username: username.trim(), p_credential: credential.trim(), p_teacher_id: teacherId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Admin: class codes ───────────────────────────────────────────

async function adminGetClassCodes(username, credential) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_get_class_codes', { p_username: username.trim(), p_credential: credential.trim() });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data || [] };
}

async function adminCreateClassCode(username, credential, classSet) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_create_class_code', { p_username: username.trim(), p_credential: credential.trim(), p_class_set: classSet.trim() });
  if (error)              return { ok: false, error: error.message };
  if (data && data.error) return { ok: false, error: data.error };
  return { ok: true, data: data };
}

async function adminRetireClassCode(username, credential, codeId) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };
  var { data, error } = await sb.rpc('admin_retire_class_code', { p_username: username.trim(), p_credential: credential.trim(), p_code_id: codeId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

window.generateUsername      = generateUsername;
window.generatePin           = generatePin;
window.teacherLogin          = teacherLogin;
window.getTeacherData        = getTeacherData;
window.createStudent         = createStudent;
window.deleteStudent         = deleteStudent;
window.resetStudentPin       = resetStudentPin;
window.changeTeacherPassword = changeTeacherPassword;
window.adminGetTeachers      = adminGetTeachers;
window.adminAddTeacher       = adminAddTeacher;
window.adminRemoveTeacher    = adminRemoveTeacher;
window.adminGetClassCodes    = adminGetClassCodes;
window.adminCreateClassCode  = adminCreateClassCode;
window.adminRetireClassCode  = adminRetireClassCode;
