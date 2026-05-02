// econOS — Data API layer
// All Supabase data-fetching functions used across the app.
// Depends on: supabase-client.js (window._sb)

const API = (function () {
  const sb = () => window._sb;

  // ── Profiles ──────────────────────────────────────────────────────────────

  async function updateProfile(userId, updates) {
    const { data, error } = await sb().from('profiles').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return data;
  }

  // ── Topics & Subtopics ────────────────────────────────────────────────────

  async function getTopics() {
    const { data, error } = await sb()
      .from('topics')
      .select('*, subtopics(id, title, slug, order_in_topic, estimated_minutes)')
      .order('theme_number')
      .order('order_in_theme');
    if (error) throw error;
    return data || [];
  }

  async function getTopicBySlug(slug) {
    const { data, error } = await sb()
      .from('topics')
      .select('*, subtopics(*, questions(id, type, difficulty))')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  }

  async function getSubtopicBySlug(topicSlug, subtopicSlug) {
    const { data: topic } = await sb().from('topics').select('id').eq('slug', topicSlug).single();
    if (!topic) return null;
    const { data, error } = await sb()
      .from('subtopics')
      .select('*, topic:topics(id, title, slug, theme_number, theme_name)')
      .eq('topic_id', topic.id)
      .eq('slug', subtopicSlug)
      .single();
    if (error) throw error;
    return data;
  }

  // ── Questions ─────────────────────────────────────────────────────────────

  async function getMCQForSubtopic(subtopicId, limit = 10) {
    const { data, error } = await sb()
      .from('questions')
      .select('*')
      .eq('subtopic_id', subtopicId)
      .eq('type', 'mcq')
      .order('difficulty')
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async function getChainQuestionsForTopic(topicId) {
    const { data, error } = await sb()
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .eq('type', 'chain')
      .limit(5);
    if (error) throw error;
    return data || [];
  }

  async function getFlawQuestions(topicId, limit = 3) {
    const query = sb().from('questions').select('*, subtopic:subtopics(title), topic:topics(title)').eq('type', 'flaw').limit(limit);
    if (topicId) query.eq('topic_id', topicId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function getRandomMCQ(limit = 5, difficulty = null) {
    let query = sb().from('questions').select('*, topic:topics(title), subtopic:subtopics(title)').eq('type', 'mcq');
    if (difficulty) query = query.eq('difficulty', difficulty);
    const { data, error } = await query.limit(50);
    if (error) throw error;
    const pool = data || [];
    // shuffle and take limit
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, limit);
  }

  // ── Topic Mastery ─────────────────────────────────────────────────────────

  async function getStudentMastery(studentId) {
    const { data, error } = await sb()
      .from('topic_mastery')
      .select('*, subtopic:subtopics(id, title, slug, topic:topics(id, title, slug, theme_number, theme_name))')
      .eq('student_id', studentId)
      .order('last_practiced', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function getSubtopicMastery(studentId, subtopicId) {
    const { data, error } = await sb()
      .from('topic_mastery')
      .select('*')
      .eq('student_id', studentId)
      .eq('subtopic_id', subtopicId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function upsertMastery(studentId, subtopicId, updates) {
    const { data, error } = await sb()
      .from('topic_mastery')
      .upsert(
        { student_id: studentId, subtopic_id: subtopicId, last_practiced: new Date().toISOString(), ...updates },
        { onConflict: 'student_id,subtopic_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ── Assignments ───────────────────────────────────────────────────────────

  async function getStudentAssignments(studentId) {
    // Get classes student belongs to
    const { data: memberships, error: memErr } = await sb()
      .from('class_memberships')
      .select('class_id')
      .eq('student_id', studentId);
    if (memErr) throw memErr;
    const classIds = (memberships || []).map(m => m.class_id);
    if (!classIds.length) return [];

    const { data, error } = await sb()
      .from('assignments')
      .select('*, class:classes(name, teacher:profiles(full_name))')
      .in('class_id', classIds)
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date');
    if (error) throw error;
    return data || [];
  }

  async function getAssignmentSubmission(assignmentId, studentId) {
    const { data, error } = await sb()
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function submitAssignment(assignmentId, studentId, score, maxScore) {
    const { data, error } = await sb()
      .from('assignment_submissions')
      .upsert(
        { assignment_id: assignmentId, student_id: studentId, submitted_at: new Date().toISOString(), score, max_score: maxScore },
        { onConflict: 'assignment_id,student_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Teacher: create assignment
  async function createAssignment(teacherId, classId, title, description, dueDate, type, subtopicIds) {
    const { data, error } = await sb()
      .from('assignments')
      .insert({ teacher_id: teacherId, class_id: classId, title, description, due_date: dueDate, type, subtopic_ids: subtopicIds || [] })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ── Essays ────────────────────────────────────────────────────────────────

  async function saveDraftEssay(studentId, question, content, subtopicId, assignmentId) {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const { data, error } = await sb()
      .from('essays')
      .upsert(
        { student_id: studentId, question, content, word_count: wordCount, subtopic_id: subtopicId || null, assignment_id: assignmentId || null },
        { onConflict: 'student_id,question' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function submitEssay(essayId, studentId) {
    const { data, error } = await sb()
      .from('essays')
      .update({ submitted_at: new Date().toISOString() })
      .eq('id', essayId)
      .eq('student_id', studentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function getStudentEssays(studentId, limit = 10) {
    const { data, error } = await sb()
      .from('essays')
      .select('*, subtopic:subtopics(title)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  // ── Practice Attempts ─────────────────────────────────────────────────────

  async function recordAttempt(studentId, questionId, subtopicId, type, answer, correct, score, maxScore, timeSeconds) {
    const { data, error } = await sb()
      .from('practice_attempts')
      .insert({
        student_id: studentId,
        question_id: questionId || null,
        subtopic_id: subtopicId || null,
        type,
        answer,
        correct,
        score,
        max_score: maxScore,
        time_spent_seconds: timeSeconds || null
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ── Activity Feed ─────────────────────────────────────────────────────────

  async function getRecentActivity(studentId, limit = 8) {
    const { data, error } = await sb()
      .from('activity_events')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  // ── Streak ────────────────────────────────────────────────────────────────

  async function getStreakData(studentId) {
    const { data, error } = await sb()
      .from('streak_events')
      .select('date')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(60);
    if (error) throw error;
    const dates = (data || []).map(r => r.date);
    return { dates, streak: _calculateStreak(dates) };
  }

  function _calculateStreak(dates) {
    if (!dates.length) return 0;
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let check = today;
    for (const date of dates) {
      if (date === check) {
        streak++;
        const d = new Date(check);
        d.setDate(d.getDate() - 1);
        check = d.toISOString().split('T')[0];
      } else if (date < check) {
        break;
      }
    }
    return streak;
  }

  // ── Teacher: Class data ───────────────────────────────────────────────────

  async function getTeacherClasses(teacherId) {
    const { data, error } = await sb()
      .from('classes')
      .select('*, class_memberships(student_id)')
      .eq('teacher_id', teacherId)
      .order('created_at');
    if (error) throw error;
    return data || [];
  }

  async function getClassStudents(classId) {
    const { data, error } = await sb()
      .from('class_memberships')
      .select('*, student:profiles(id, full_name, email, year_group)')
      .eq('class_id', classId);
    if (error) throw error;
    return (data || []).map(r => r.student).filter(Boolean);
  }

  async function getClassAssignments(classId) {
    const { data, error } = await sb()
      .from('assignments')
      .select('*, assignment_submissions(student_id, submitted_at, score)')
      .eq('class_id', classId)
      .order('due_date');
    if (error) throw error;
    return data || [];
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  function calcReadiness(masteryData) {
    if (!masteryData || !masteryData.length) return { learn: 0, link: 0, land: 0, overall: 0 };
    const n = masteryData.length;
    const learn = Math.round(masteryData.reduce((s, m) => s + (m.learn_score || 0), 0) / n);
    const link  = Math.round(masteryData.reduce((s, m) => s + (m.link_score  || 0), 0) / n);
    const land  = Math.round(masteryData.reduce((s, m) => s + (m.land_score  || 0), 0) / n);
    const overall = Math.round((learn + link + land) / 3);
    return { learn, link, land, overall };
  }

  function getWeakAreas(masteryData, count = 5) {
    if (!masteryData || !masteryData.length) return [];
    return masteryData
      .map(m => ({
        name: m.subtopic?.title || 'Unknown',
        score: Math.round((m.learn_score + m.link_score + m.land_score) / 3),
        learn: m.learn_score,
        link:  m.link_score,
        land:  m.land_score
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, count);
  }

  function relativeTime(isoStr) {
    const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  }

  function formatDueDate(dateStr) {
    if (!dateStr) return '';
    const due = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - today) / 86400000);
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    if (diff <= 7) return `Due in ${diff} days`;
    return `Due ${due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  }

  // Public API
  return {
    updateProfile,
    getTopics, getTopicBySlug, getSubtopicBySlug,
    getMCQForSubtopic, getChainQuestionsForTopic, getFlawQuestions, getRandomMCQ,
    getStudentMastery, getSubtopicMastery, upsertMastery,
    getStudentAssignments, getAssignmentSubmission, submitAssignment, createAssignment,
    saveDraftEssay, submitEssay, getStudentEssays,
    recordAttempt,
    getRecentActivity,
    getStreakData,
    getTeacherClasses, getClassStudents, getClassAssignments,
    calcReadiness, getWeakAreas, relativeTime, formatDueDate
  };
})();
