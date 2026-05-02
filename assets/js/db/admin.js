// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Teacher/Admin Operations
// ═══════════════════════════════════════════════════════════════
//  Requires: client.js loaded before this file.
//
//  RPC functions used (matching supabase-setup.sql exactly):
//    teacher_login(p_password)
//    get_teacher_data(p_password)
//    create_student(p_password, p_username, p_pin, p_display_name, p_class_set)
//    delete_student(p_password, p_profile_id)
//    reset_pin(p_password, p_profile_id, p_new_pin)
//    change_teacher_password(p_old_password, p_new_password)
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

// ── Teacher auth ─────────────────────────────────────────────────

async function teacherLogin(password) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('teacher_login', { p_password: password });
  if (error) return { ok: false, error: error.message };
  if (!data)  return { ok: false, error: 'Invalid password' };
  return { ok: true };
}

async function getTeacherData(password) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('get_teacher_data', { p_password: password });
  if (error) return { ok: false, error: error.message };
  if (!data)  return { ok: false, error: 'Invalid password or no data' };
  return { ok: true, data: data };
}

// ── Student CRUD ─────────────────────────────────────────────────

async function createStudent(password, username, pin, displayName, classSet) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('create_student', {
    p_password:     password,
    p_username:     username,
    p_pin:          pin,
    p_display_name: displayName,
    p_class_set:    classSet
  });
  if (error)              return { ok: false, error: error.message };
  if (data && data.error) return { ok: false, error: data.error };
  return { ok: true, data: data };
}

async function deleteStudent(password, profileId) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('delete_student', {
    p_password:   password,
    p_profile_id: profileId
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function resetStudentPin(password, profileId, newPin) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('reset_pin', {
    p_password:   password,
    p_profile_id: profileId,
    p_new_pin:    newPin
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function changeTeacherPassword(oldPassword, newPassword) {
  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'Database not configured' };

  var { data, error } = await sb.rpc('change_teacher_password', {
    p_old_password: oldPassword,
    p_new_password: newPassword
  });
  if (error)   return { ok: false, error: error.message };
  if (!data)   return { ok: false, error: 'Old password incorrect' };
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
