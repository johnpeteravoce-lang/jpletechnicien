// Configuration Supabase (la clé "publishable" est faite pour être publique)
const SUPABASE_URL = "https://vyvoavlzelnrxeglxjvc.supabase.co";
const SUPABASE_KEY = "sb_publishable_VU0LXz8s6BOTttokd95iPA_Tq2pB-pq";
const SITE_URL = "https://johnpeteravoce-lang.github.io/jpletechnicien/";

// persistSession: la session reste active après fermeture du navigateur
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = "msg " + (type || "");
  el.hidden = !text;
}
