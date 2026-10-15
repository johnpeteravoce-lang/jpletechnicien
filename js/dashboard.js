const $ = (id) => document.getElementById(id);
const msg = $("msg");
const fmt = (d) => new Date(d).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
let user;

(async function init() {
  const { data } = await sb.auth.getSession();
  if (!data.session) return location.replace("index.html"); // page protégée
  user = data.session.user;
  render();
  loadNotes();
})();

// Déconnexion depuis un autre onglet ou session expirée
sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") location.replace("index.html"); });

function render() {
  const name = user.user_metadata?.full_name || user.email.split("@")[0];
  $("hello").textContent = "Bonjour " + name;
  $("name").value = name;
  $("email").textContent = user.email;
  $("since").textContent = fmt(user.created_at);
  $("last").textContent = fmt(user.last_sign_in_at || user.created_at);
}

async function loadNotes() {
  const { data, error } = await sb.from("notes").select("*").order("created_at", { ascending: false });
  const box = $("notes");
  box.textContent = "";
  if (error) return (box.textContent = "Notes indisponibles : exécutez schema.sql dans Supabase.");
  $("count").textContent = data.length;
  if (!data.length) box.textContent = "Aucune note pour le moment. Ajoutez la première ci-dessus.";
  data.forEach((n) => {
    const row = document.createElement("div"); row.className = "note";
    const txt = document.createElement("div");
    txt.textContent = n.content; // textContent : pas d'injection HTML
    const small = document.createElement("small"); small.textContent = fmt(n.created_at);
    txt.append(document.createElement("br"), small);
    const del = document.createElement("button"); del.textContent = "Supprimer";
    del.onclick = async () => { await sb.from("notes").delete().eq("id", n.id); loadNotes(); };
    row.append(txt, del); box.append(row);
  });
}

$("noteForm").onsubmit = async (e) => {
  e.preventDefault();
  const { error } = await sb.from("notes").insert({ content: $("note").value.trim(), user_id: user.id });
  if (error) return showMsg(msg, error.message, "error");
  $("note").value = ""; loadNotes();
};

$("profileForm").onsubmit = async (e) => {
  e.preventDefault();
  const upd = { data: { full_name: $("name").value.trim() } };
  if ($("np").value) upd.password = $("np").value;
  const { data, error } = await sb.auth.updateUser(upd);
  if (error) return showMsg(msg, error.message, "error");
  user = data.user; $("np").value = ""; render();
  showMsg(msg, "Profil mis à jour.", "ok");
};

$("logout").onclick = async () => { await sb.auth.signOut(); location.replace("index.html"); };
