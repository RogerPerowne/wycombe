// ═══════════════════════════════════════════════════════════════
//  assets/js/db/attempts.js — Quiz attempt save & retrieval
// ═══════════════════════════════════════════════════════════════

async function saveQuizResult(quizId, score, maxScore) {
  var user = getCurrentUser();
  if (!user) return;

  var sb = getSupabase();
  if (!sb) return;

  try {
    await sb.rpc('save_attempt', {
      p_profile_id: user.id,
      p_quiz_id:    quizId,
      p_score:      score,
      p_max_score:  maxScore
    });

    var badge = document.getElementById('save-badge');
    if (badge) {
      badge.textContent = '✓ Saved';
      badge.style.display = 'inline-block';
      badge.style.opacity = '1';
      setTimeout(function(){ badge.style.opacity = '0'; }, 2500);
    }
  } catch(e) {
    console.warn('Could not save result:', e);
  }
}

async function getMyAttempts(profileId) {
  var sb = getSupabase();
  if (!sb) return [];
  try {
    var { data } = await sb.rpc('get_my_attempts', { p_profile_id: profileId });
    return data || [];
  } catch(e) { return []; }
}
