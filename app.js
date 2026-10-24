const $ = id => document.getElementById(id);
const STORE = "skinStudioConceptsV2";
let referenceData = "";
let deferredPrompt = null;

const fields = ["name","role","tier","theme","weapon","outfit","effects","mood","mainColor","accentColor","highlightColor","glow"];
function currentConcept(){
  return {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    name: $("name").value.trim() || "Untitled Concept",
    role: $("role").value, tier: $("tier").value, theme: $("theme").value,
    weapon: $("weapon").value.trim(), outfit: $("outfit").value.trim(),
    effects: $("effects").value.trim(), mood: $("mood").value.trim(),
    mainColor: $("mainColor").value, accentColor: $("accentColor").value,
    highlightColor: $("highlightColor").value, glow: Number($("glow").value),
    reference: referenceData, updatedAt: new Date().toISOString()
  };
}
function validHex(v){return /^#[0-9a-f]{6}$/i.test(v);}
function syncColor(colorId, hexId){
  const c=$(colorId), h=$(hexId);
  c.addEventListener("input",()=>{h.value=c.value;updatePreview();});
  h.addEventListener("change",()=>{if(validHex(h.value)){c.value=h.value;updatePreview();}else{h.value=c.value;notify("Please enter a valid hex color, such as #8b5cf6.");}});
}
function promptFor(c){
  return `Create original fantasy game character skin concept art inspired by the broad role of a ${c.role.toLowerCase()}, with a ${c.theme.toLowerCase()} theme. Concept name: "${c.name}". Rarity and finish: ${c.tier}. Signature weapon/detail: ${c.weapon || "distinctive fantasy equipment"}. Outfit and armor: ${c.outfit || "ornate original armor with a strong silhouette"}. Color palette: main ${c.mainColor}, accent ${c.accentColor}, highlight ${c.highlightColor}. Visual effects: ${c.effects || "stylized energy particles and dramatic ability trails"}. Mood and finish: ${c.mood || "high-quality polished game concept art with dramatic lighting"}. Show full body, clear silhouette, detailed materials, dynamic but readable pose, studio concept-art composition. Original design only; do not copy an existing official skin, logo, or protected character artwork.`;
}
function updatePreview(){
  const c=currentConcept();
  document.documentElement.style.setProperty("--main",c.mainColor);
  document.documentElement.style.setProperty("--accent",c.accentColor);
  document.documentElement.style.setProperty("--highlight",c.highlightColor);
  document.documentElement.style.setProperty("--glow",c.glow);
  $("glowValue").textContent=c.glow+"%"; $("previewGlow").textContent=c.glow+"%";
  $("previewName").textContent=c.name; $("previewTier").textContent=c.tier.toUpperCase();
  $("previewRole").textContent=c.role.toUpperCase(); $("previewTheme").textContent=c.theme.toUpperCase();
  $("previewWeapon").textContent=c.weapon || "Not specified";
  $("promptOutput").value=promptFor(c);
}
function notify(msg){
  const t=$("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove("show"),2400);
}
function readStore(){
  try{return JSON.parse(localStorage.getItem(STORE)||"[]");}catch{return [];}
}
function writeStore(items){localStorage.setItem(STORE,JSON.stringify(items));renderGallery();}
function saveConcept(){
  const c=currentConcept(), items=readStore();
  const idx=items.findIndex(x=>x.id===c.id || x.name.toLowerCase()===c.name.toLowerCase());
  if(idx>=0){c.id=items[idx].id;items[idx]=c;}else{items.unshift(c);}
  writeStore(items);notify("Concept saved on this device.");
}
function esc(s){return String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function renderGallery(){
  const items=readStore(), gallery=$("gallery");gallery.innerHTML="";
  $("count").textContent=items.length;$("emptyState").classList.toggle("hidden",items.length>0);
  items.forEach(c=>{
    const card=document.createElement("article");card.className="card";
    card.innerHTML=`<div class="card-art" style="--main:${esc(c.mainColor)};--accent:${esc(c.accentColor)};--highlight:${esc(c.highlightColor)};background:radial-gradient(circle,color-mix(in srgb,${esc(c.accentColor)} 75%,transparent),transparent 62%),${esc(c.mainColor)}">${c.reference?`<img alt="" src="${c.reference}" style="width:100%;height:100%;object-fit:cover">`:"✦"}</div><div class="card-body"><h3>${esc(c.name)}</h3><p>${esc(c.role)} · ${esc(c.theme)} · ${esc(c.tier)}</p><div class="card-actions"><button class="button" data-edit="${esc(c.id)}">Edit</button><button class="button subtle" data-duplicate="${esc(c.id)}">Duplicate</button><button class="button subtle" data-delete="${esc(c.id)}">Delete</button></div></div>`;
    gallery.appendChild(card);
  });
  gallery.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>loadConcept(b.dataset.edit));
  gallery.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteConcept(b.dataset.delete));
  gallery.querySelectorAll("[data-duplicate]").forEach(b=>b.onclick=()=>duplicateConcept(b.dataset.duplicate));
}
function loadConcept(id){
  const c=readStore().find(x=>x.id===id);if(!c)return;
  fields.forEach(k=>{if(c[k]!==undefined && $(k))$(k).value=c[k];});
  referenceData=c.reference||"";showReference(referenceData);updatePreview();
  $("editor").scrollIntoView({behavior:"smooth",block:"start"});notify("Concept loaded into editor.");
}
function deleteConcept(id){
  if(!confirm("Delete this saved concept?"))return;
  writeStore(readStore().filter(c=>c.id!==id));notify("Concept deleted.");
}
function duplicateConcept(id){
  const items=readStore(), c=items.find(x=>x.id===id);if(!c)return;
  const copy={...c,id:(window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now()),name:c.name+" Copy",updatedAt:new Date().toISOString()};
  items.unshift(copy);writeStore(items);notify("Concept duplicated.");
}
function showReference(data){
  $("referencePreview").classList.toggle("hidden",!data);
  if(data)$("referenceImage").src=data;else $("referenceImage").removeAttribute("src");
}
$("editor").addEventListener("submit",e=>{e.preventDefault();updatePreview();notify("Preview updated.");});
$("saveBtn").addEventListener("click",saveConcept);
$("resetBtn").addEventListener("click",()=>{
  if(!confirm("Reset the editor to its starter concept?"))return;
  $("name").value="New Fantasy Concept";$("role").value="Assassin";$("tier").value="Epic";$("theme").value="Shadow";
  $("weapon").value="Twin energy blades";$("outfit").value="Original layered fantasy armor with a clear silhouette";$("effects").value="Glowing energy trails and drifting particles";$("mood").value="Polished concept art, dramatic lighting";
  $("mainColor").value="#2b0033";$("accentColor").value="#8b5cf6";$("highlightColor").value="#e9d5ff";$("glow").value=70;
  ["mainColor","accentColor","highlightColor"].forEach(k=>$(k.replace("Color","Hex")).value=$(k).value);
  referenceData="";showReference("");updatePreview();notify("Editor reset.");
});
syncColor("mainColor","mainHex");syncColor("accentColor","accentHex");syncColor("highlightColor","highlightHex");
["name","role","tier","theme","weapon","outfit","effects","mood","glow"].forEach(k=>$(k).addEventListener("input",updatePreview));
$("reference").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  if(f.size>2*1024*1024){notify("Choose an image smaller than 2 MB for reliable local saving.");e.target.value="";return;}
  const reader=new FileReader();reader.onload=()=>{referenceData=reader.result;showReference(referenceData);notify("Reference image added.");};reader.readAsDataURL(f);
});
$("removeReference").onclick=()=>{referenceData="";showReference("");$("reference").value="";};
$("copyPrompt").onclick=async()=>{
  try{await navigator.clipboard.writeText($("promptOutput").value);notify("Prompt copied.");}
  catch{$("promptOutput").select();document.execCommand("copy");notify("Prompt selected/copied if your browser permits it.");}
};
$("downloadPrompt").onclick=()=>{
  const blob=new Blob([$("promptOutput").value],{type:"text/plain"});downloadBlob(blob,($("name").value||"skin-prompt").replace(/[^a-z0-9-_]/gi,"-")+".txt");
};
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(readStore(),null,2)],{type:"application/json"});downloadBlob(blob,"skin-studio-backup.json");notify("Backup exported.");};
$("importFile").addEventListener("change",async e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  try{const parsed=JSON.parse(await f.text());if(!Array.isArray(parsed))throw Error();
    const existing=readStore(), map=new Map(existing.map(c=>[c.id,c]));
    parsed.forEach(c=>{if(c&&c.name){if(!c.id)c.id=String(Date.now()+Math.random());map.set(c.id,c);}});
    writeStore([...map.values()]);notify("Backup imported.");
  }catch{notify("That file is not a valid Skin Studio JSON backup.");}
  e.target.value="";
});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden");});
$("installBtn").onclick=async()=>{if(!deferredPrompt){notify("Use your browser menu and choose Install app or Add to Home screen.");return;}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden");};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
updatePreview();renderGallery();
