// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey Economics Quiz · Supabase Client Singleton
// ═══════════════════════════════════════════════════════════════
//  Requires: supabase-js CDN loaded, config.js loaded before this.
// ═══════════════════════════════════════════════════════════════

var _sb = null;

function getSupabase() {
  if (!_sb && typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sb;
}
