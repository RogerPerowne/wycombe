// ═══════════════════════════════════════════════════════════════
//  assets/js/db/client.js — Supabase client singleton
//  Requires: config.js loaded first, Supabase CDN loaded
// ═══════════════════════════════════════════════════════════════

var _sbClient = null;

function getSupabase() {
  if (!_sbClient && typeof supabase !== 'undefined') {
    _sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE);
  }
  return _sbClient;
}
