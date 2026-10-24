const $ = (id) => document.getElementById(id);
const fields = ["skinName","heroType","theme","weapon","color1","color2","color3","effects","rarity"];
let saved = [];
try { saved = JSON.parse(localStorage.getItem("skinStudioConcepts") || "[]"); } catch (_) { saved = []; }

function readForm() {
  return {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()),
    name: $("skinName").value.trim() || "Untitled Concept",
    heroType: $("heroType").value,
    theme: $("theme").value,
    weapon: $("weapon").value.trim() || "Unspecified signature detail",
    color1: $("color1").value,
    color2: $("color2").value,
    color3: $("color3").value,
    effects: $("effects").value.trim() || "Custom visual effects",
    rarity: $("rarity").value,
    updatedAt: new Date().toISOString()
  };
}
function currentFromForm() { return readForm(); }
function makePrompt(c) {
  return `Create an original fantasy game character skin concept inspired by the broad role of a ${c.heroType.toLowerCase()}, with a ${c.theme.toLowerCase()} theme. Concept name: "${c.name}". Signature detail: ${c.weapon}. Color palette: main ${c.color1}, accent ${c.color2}, highlight ${c.color3}. Visual effects: ${c.effects}. Mood and finish: ${c.rarity} concept, polished high-quality game concept art, dramatic lighting, clear silhouette, detailed materials. Original design only; do not copy an existing official skin, logo, or protected character artwork.`;
}
function updatePreview() {
  const c = currentFromForm();
  $("previewName").textContent = c.name;
  $("previewTier").textContent = c.rarity.toUpperCase();
  $("previewRole").textContent = c.heroType.toUpperCase();
  $("previewTheme").textContent = c.theme.toUpperCase();
  $("previewWeapon").textContent = c.weapon;
  $("previewEffects").textContent = c.effects;
  $("characterPreview").style.setProperty("--main", c.color1);
  $("characterPreview").style.setProperty("--glow", c.color2);
  $("characterPreview").style.setProperty("--hi", c.color3);
  $("promptText").textContent = makePrompt(c);
}
function persist() {
  try { localStorage.setItem("skinStudioConcepts", JSON.stringify(saved)); }
  catch (_) { showToast("Could not save. Your browser storage may be full."); }
}
function showToast(message) {
  const t = $("toast"); t.textContent = message; t.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove("show"), 2300);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function renderGallery() {
  $("savedCount").textContent = saved.length;
  const gallery = $("gallery");
  gallery.querySelectorAll(".concept-card").forEach(n => n.remove());
  $("emptyState").style.display = saved.length ? "none" : "block";
  saved.forEach(c => {
    const card = document.createElement("article");
    card.className = "concept-card";
    card.innerHTML = `<div class="concept-swatch" style="--main:${escapeHtml(c.color1)};--glow:${escapeHtml(c.color2)};--hi:${escapeHtml(c.color3)}"><span>✦</span></div>
      <div class="concept-body"><h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.heroType)} · ${escapeHtml(c.theme)} · ${escapeHtml(c.rarity)}</p>
      <div class="card-actions"><button class="secondary-btn" data-load="${escapeHtml(c.id)}">Edit</button><button class="secondary-btn delete-btn" data-delete="${escapeHtml(c.id)}">Delete</button></div></div>`;
    gallery.appendChild(card);
  });
}
$("skinForm").addEventListener("submit", e => { e.preventDefault(); updatePreview(); showToast("Preview updated"); });
$("saveBtn").addEventListener("click", () => {
  const c = readForm();
  const duplicate = saved.findIndex(x => x.name.toLowerCase() === c.name.toLowerCase());
  if (duplicate >= 0) saved[duplicate] = {...c, id:saved[duplicate].id};
  else saved.unshift(c);
  persist(); renderGallery(); updatePreview(); showToast("Concept saved to this device");
});
$("gallery").addEventListener("click", e => {
  const loadId = e.target.dataset.load, deleteId = e.target.dataset.delete;
  if (loadId) {
    const c = saved.find(x => x.id === loadId); if (!c) return;
    fields.forEach(key => { if ($(key)) $(key).value = c[key] ?? $(key).value; });
    updatePreview(); $("studio").scrollIntoView({behavior:"smooth"}); showToast("Concept loaded");
  }
  if (deleteId) {
    saved = saved.filter(x => x.id !== deleteId); persist(); renderGallery(); showToast("Concept deleted");
  }
});
fields.forEach(key => $(key).addEventListener("input", updatePreview));
$("copyPrompt").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("promptText").textContent); showToast("Prompt copied"); }
  catch (_) { showToast("Clipboard unavailable; select and copy the prompt text"); }
});
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({app:"MLBB Skin Studio",type:"fan-made concept data",concepts:saved}, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "mlbb-skin-studio-concepts.json"; a.click(); URL.revokeObjectURL(url);
  showToast("JSON export created");
});
updatePreview(); renderGallery();

let deferredPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault(); deferredPrompt = event; $("installBtn").hidden = false;
});
$("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) { showToast("Use your browser menu and choose Install app or Add to Home screen"); return; }
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("installBtn").hidden = true;
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}
