// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Quiz Attempt Saving
// ═══════════════════════════════════════════════════════════════
//  Requires: client.js, auth.js loaded before this file.
//
//  saveQuizResult is called by WA.saveScore() (in auth.js) which
//  is invoked by quiz-engine.js at the results screen. By the time
//  a student finishes a quiz all scripts are already loaded, so the
//  delayed reference to this function from auth.js is intentional
//  and safe.
// ═══════════════════════════════════════════════════════════════

async function saveQuizResult(quizId, score, maxScore) {
  var user = getCurrentUser();
  if (!user) return { ok: false, error: 'not logged in' };

  var sb = getSupabase();
  if (!sb) return { ok: false, error: 'database not configured' };

  try {
    var { data, error } = await sb.rpc('save_attempt', {
      p_profile_id: user.id,
      p_quiz_id:    quizId,
      p_score:      score,
      p_max_score:  maxScore
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data };
  } catch(e) {
    console.warn('Could not save result:', e);
    return { ok: false, error: e.message };
  }
}

window.saveQuizResult = saveQuizResult;
