// econOS — Supabase client initialisation
// Depends on: config.js loaded first, Supabase CDN UMD script loaded first
// Exposes: window._sb (the Supabase client instance)

(function () {
  const cfg = window.ECONOS_CONFIG || {};
  const isConfigured = cfg.supabaseUrl && cfg.supabaseUrl !== 'YOUR_SUPABASE_URL';

  if (!isConfigured) {
    console.warn(
      '[econOS] Supabase not configured.\n' +
      'Open econos/assets/js/config.js and replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY\n' +
      'with your project credentials from https://supabase.com/dashboard'
    );
    window._sb = null;
    window._sbConfigured = false;
    return;
  }

  try {
    const { createClient } = window.supabase;
    window._sb = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    window._sbConfigured = true;
  } catch (err) {
    console.error('[econOS] Failed to initialise Supabase client:', err);
    window._sb = null;
    window._sbConfigured = false;
  }
})();
