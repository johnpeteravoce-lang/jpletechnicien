const $ = (id) => document.getElementById(id);
const msg = $("msg");
const forms = { login: $("login"), signup: $("signup"), forgot: $("forgot") };

// Session persistante : si déjà connecté, aller directement au tableau de bord
sb.auth.getSession().then(({ data }) => {
  if (data.session) location.replace("dashboard.html");
});

function show(name) {
  Object.entries(forms).forEach(([k, f]) => (f.hidden = k !== name));
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("on", b.dataset.tab === name));
  $("tabs").hidden = name === "forgot";
  showMsg(msg, "");
}
document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => show(b.dataset.tab)));
$("toForgot").onclick = () => show("forgot");
$("toLogin").onclick = () => show("login");

async function run(form, fn) {
  const btn = form.querySelector(".btn");
  btn.disabled = true;
  try { await fn(); } catch (e) { showMsg(msg, translate(e.message), "error"); }
  btn.disabled = false;
}
function translate(m) {
  if (/Invalid login/i.test(m)) return "Email ou mot de passe incorrect.";
  if (/Email not confirmed/i.test(m)) return "Confirmez d'abord votre email via le lien reçu.";
  if (/already registered/i.test(m)) return "Cet email est déjà inscrit.";
  if (/rate limit/i.test(m)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  return m;
}

forms.login.onsubmit = (e) => { e.preventDefault(); run(forms.login, async () => {
  const { error } = await sb.auth.signInWithPassword({ email: $("le").value.trim(), password: $("lp").value });
  if (error) throw error;
  location.replace("dashboard.html");
}); };

forms.signup.onsubmit = (e) => { e.preventDefault(); run(forms.signup, async () => {
  const { data, error } = await sb.auth.signUp({
    email: $("se").value.trim(), password: $("sp").value,
    options: { data: { full_name: $("sn").value.trim() }, emailRedirectTo: SITE_URL + "dashboard.html" },
  });
  if (error) throw error;
  if (data.session) return location.replace("dashboard.html");
  showMsg(msg, "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse.", "ok");
}); };

forms.forgot.onsubmit = (e) => { e.preventDefault(); run(forms.forgot, async () => {
  const { error } = await sb.auth.resetPasswordForEmail($("fe").value.trim(), { redirectTo: SITE_URL + "reset.html" });
  if (error) throw error;
  showMsg(msg, "Si cet email existe, un lien de réinitialisation vient d'être envoyé.", "ok");
}); };
