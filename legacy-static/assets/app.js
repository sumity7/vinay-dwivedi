/* Site behaviour. Content lives in data.js. */
(() => {
const S = window.SITE, CONFIG = S.config;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
let LANG = "hi";
const t = (hi, en) => LANG === "en" ? en : hi;
const L = o => o[LANG] || o.hi;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageUrl = () => CONFIG.siteUrl || location.href.split("#")[0];
const store = { get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }, set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)) }catch(e){} } };

/* ---------- Toast ---------- */
let toastT;
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove("show"),2800); }

/* ---------- Language ---------- */
function captureStatic(){
  $$("[data-en]").forEach(el => { if (el.dataset.hi === undefined) el.dataset.hi = el.innerHTML; });
  $$("[data-en-ph]").forEach(el => { if (el.dataset.hiPh === undefined) el.dataset.hiPh = el.placeholder; });
}
function setLang(l){
  LANG = l; document.documentElement.lang = l;
  $$("[data-en]").forEach(el => el.innerHTML = l === "en" ? el.dataset.en : el.dataset.hi);
  $$("[data-en-ph]").forEach(el => el.placeholder = l === "en" ? el.dataset.enPh : el.dataset.hiPh);
  $$(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === l));
  renderAll(); store.set("lang", l);
}

/* ---------- Font size ---------- */
function setFs(v){ document.documentElement.style.setProperty("--fs", v); $$(".fs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.fs === String(v))); store.set("fs", v); }

/* ---------- Dates ---------- */
const MONTHS_HI = ["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function fmtDate(iso){ const [y,m,d] = iso.split("-").map(Number); return LANG === "en" ? `${d} ${MONTHS_EN[m-1]} ${y}` : `${d} ${MONTHS_HI[m-1]} ${y}`; }

/* ---------- News ---------- */
function renderNews(){
  const box = $("#newsGrid"); if (!box) return;
  box.innerHTML = S.news.map((n,i) => { const c = L(n); return `
    <article class="news${i===0?" feature":""}">
      ${n.img ? `<div class="ph" data-zoom="${esc(n.img)}" data-cap="${esc(c.title)}"><img src="${esc(n.img)}" alt="${esc(c.title)}" loading="lazy"></div>` : ""}
      <div>
        <time datetime="${n.date}">${fmtDate(n.date)}</time>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
        ${n.link ? `<a class="src" href="${esc(n.link)}" target="_blank" rel="noopener">${t("पूरी पोस्ट देखें","View the full post")}</a>` : ""}
      </div>
    </article>`; }).join("");
}

/* ---------- Gallery ---------- */
let album = "all";
function renderGallery(){
  const chips = $("#galleryChips"), grid = $("#galleryGrid"); if (!grid) return;
  chips.innerHTML = [{id:"all",hi:"सभी",en:"All"}, ...S.albums].filter(a => a.id==="all" || S.gallery.some(g => g.album===a.id))
    .map(a => `<button type="button" data-album="${a.id}" aria-pressed="${a.id===album}">${esc(L(a))}</button>`).join("");
  grid.innerHTML = S.gallery.map((g,i) => `
    <figure data-idx="${i}" ${album!=="all" && g.album!==album ? "hidden" : ""}>
      <img src="${esc(g.img)}" alt="${esc(L(g))}" loading="lazy"><figcaption>${esc(L(g))}</figcaption>
    </figure>`).join("");
}
document.addEventListener("click", e => {
  const chip = e.target.closest("[data-album]");
  if (chip){ album = chip.dataset.album; renderGallery(); }
});

/* ---------- Lightbox (gallery + news) ---------- */
const lb = $("#lightbox"); let lbList = [], lbIdx = 0;
function openLb(list, idx){ lbList = list; lbIdx = idx; showLb(); lb.classList.add("open"); $(".x", lb).focus(); }
function showLb(){
  const it = lbList[lbIdx]; $("img", lb).src = it.img; $("img", lb).alt = it.cap; $(".cap", lb).textContent = it.cap;
  $(".nav-l", lb).hidden = $(".nav-r", lb).hidden = lbList.length < 2;
  $(".share-row a", lb).href = "https://wa.me/?text=" + encodeURIComponent(`${it.cap} — ${t("विनय कुमार द्विवेदी, विधायक मेहनौन","Vinay Kumar Dwivedi, MLA Mehnaun")} ${pageUrl()}`);
}
document.addEventListener("click", e => {
  const fig = e.target.closest("#galleryGrid figure");
  if (fig){ const vis = S.gallery.map((g,i)=>({g,i})).filter(x => album==="all" || x.g.album===album);
    openLb(vis.map(x => ({img:x.g.img, cap:L(x.g)})), vis.findIndex(x => x.i === +fig.dataset.idx)); return; }
  const z = e.target.closest("[data-zoom]");
  if (z) openLb([{img:z.dataset.zoom, cap:z.dataset.cap}], 0);
});
$(".x", lb).addEventListener("click", () => lb.classList.remove("open"));
$(".nav-l", lb).addEventListener("click", () => { lbIdx = (lbIdx-1+lbList.length)%lbList.length; showLb(); });
$(".nav-r", lb).addEventListener("click", () => { lbIdx = (lbIdx+1)%lbList.length; showLb(); });
lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("open"); });
addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lb.classList.remove("open");
  if (e.key === "ArrowLeft") $(".nav-l", lb).click();
  if (e.key === "ArrowRight") $(".nav-r", lb).click();
});

/* ---------- Videos ---------- */
function renderVideos(){
  const box = $("#vidGrid"); if (!box) return;
  box.innerHTML = S.videos.map(v => `
    <a class="vid" href="${esc(v.url)}" target="_blank" rel="noopener">
      <img src="${esc(v.img)}" alt="" loading="lazy">
      <span class="play"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span></span>
      <span class="cap">${esc(L(v))}</span>
    </a>`).join("");
}

/* ---------- Supabase / local store ---------- */
let sb = null;
async function getSb(){
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return null;
  if (sb) return sb;
  const mod = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  return sb = mod.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
}
const LS = "mhn_complaints";
async function saveComplaint(c, file){
  const client = await getSb();
  if (client){
    if (file){ const path = `${c.complaint_id}/${Date.now()}-${file.name.replace(/[^\w.]/g,"_")}`;
      const up = await client.storage.from("complaint-photos").upload(path, file); if (!up.error) c.photo_path = path; }
    const { error } = await client.from("complaints").insert(c); if (error) throw error;
  } else { const all = store.get(LS, []); all.push({...c, created_at:new Date().toISOString()}); store.set(LS, all); }
}
async function findComplaint(id, mobile){
  const client = await getSb();
  if (client){ const { data, error } = await client.rpc("get_complaint_status", { p_id:id, p_mobile:mobile }); if (error) throw error; return data && data[0]; }
  return store.get(LS, []).find(c => c.complaint_id === id && c.mobile === mobile);
}
async function sendFeedback(id, mobile, rating){
  const client = await getSb();
  if (client){ const { error } = await client.rpc("submit_feedback", { p_id:id, p_mobile:mobile, p_rating:rating }); if (error) throw error; return; }
  const all = store.get(LS, []); const c = all.find(x => x.complaint_id===id && x.mobile===mobile); if (c){ c.rating = rating; store.set(LS, all); }
}
async function loadCounts(){
  const client = await getSb(); let c = null;
  if (client){ const { data } = await client.rpc("complaint_counts"); c = data && data[0]; }
  else { const all = store.get(LS, []); if (all.length) c = { total: all.length, resolved: all.filter(x=>x.status==="resolved").length }; }
  const box = $("#dash"); if (!box) return;
  if (!c){ box.hidden = true; return; }
  box.hidden = false;
  $("#d-total").textContent = Number(c.total).toLocaleString("en-IN");
  $("#d-resolved").textContent = Number(c.resolved).toLocaleString("en-IN");
  $("#d-pending").textContent = Number(c.total - c.resolved).toLocaleString("en-IN");
}

/* ---------- Complaint form ---------- */
const CATS = [["road","सड़क","Road"],["power","बिजली","Electricity"],["water","पानी / हैंडपंप","Water / handpump"],["drain","नाली / सफाई","Drainage / sanitation"],
  ["pension","पेंशन","Pension"],["ration","राशन","Ration"],["housing","आवास","Housing"],["health","स्वास्थ्य","Health"],["school","शिक्षा","Education"],
  ["land","भूमि / राजस्व","Land / revenue"],["police","पुलिस","Police"],["other","अन्य","Other"]];
const catLabel = k => { const c = CATS.find(x=>x[0]===k); return c ? t(c[1],c[2]) : k; };
function renderCats(){
  const cur = $("input[name=cat]:checked")?.value;
  $("#cats").innerHTML = CATS.map(([k,h,e]) => `<label><input type="radio" name="cat" value="${k}" ${k===cur?"checked":""}><span>${t(h,e)}</span></label>`).join("");
}
const STATUSES = [["received","प्राप्त","Received"],["review","जाँच में","Under review"],["action","कार्यवाही में","Action taken"],["resolved","निस्तारित","Resolved"]];
const newId = () => { const d=new Date(), p=n=>String(n).padStart(2,"0"); return `MHN-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${Math.floor(1000+Math.random()*9000)}`; };
const validMobile = v => /^[6-9]\d{9}$/.test(v);
const check = (el, ok) => { el.closest(".field").classList.toggle("invalid", !ok); return ok; };
$$("input[inputmode=numeric]").forEach(i => i.addEventListener("input", () => i.value = i.value.replace(/\D/g,"")));
document.addEventListener("input", e => e.target.closest?.(".field")?.classList.remove("invalid"));
document.addEventListener("change", e => e.target.closest?.(".field")?.classList.remove("invalid"));

const form = $("#complaintForm");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const name=$("#c-name"), mob=$("#c-mobile"), vil=$("#c-village"), desc=$("#c-desc"), cons=$("#c-consent"), cat=$("input[name=cat]:checked");
  const ok = [check(name,name.value.trim().length>1), check(mob,validMobile(mob.value.trim())), check(vil,vil.value.trim().length>1),
    check($("#cats"),!!cat), check(desc,desc.value.trim().length>=15), check(cons,cons.checked)].every(Boolean);
  if (!ok){ form.querySelector(".invalid input, .invalid textarea")?.focus(); return; }
  const file = $("#c-photo").files[0];
  if (file && file.size > 5*1024*1024){ toast(t("फोटो 5 MB से छोटी होनी चाहिए।","Photo must be under 5 MB.")); return; }
  const btn = $("#c-submit"); btn.disabled = true; btn.textContent = t("दर्ज हो रही है…","Submitting…");
  const c = { complaint_id:newId(), name:name.value.trim(), mobile:mob.value.trim(), village:vil.value.trim(), block:$("#c-block").value.trim(),
    category:cat.value, description:desc.value.trim(), status:"received" };
  try{ await saveComplaint(c, file); showReceipt(c); loadCounts(); }
  catch(err){ console.error(err); toast(t("शिकायत दर्ज नहीं हो सकी। इंटरनेट जाँचें और दोबारा प्रयास करें।","Couldn't submit. Check your internet and try again.")); }
  finally{ btn.disabled = false; btn.textContent = t("शिकायत दर्ज करें","Submit complaint"); }
});
function showReceipt(c){
  form.hidden = true; $("#receipt").classList.add("show");
  $("#r-id").textContent = c.complaint_id; $("#r-summary").textContent = `${catLabel(c.category)} · ${c.village}`;
  const msg = t(`मेरी शिकायत संख्या ${c.complaint_id} है (${catLabel(c.category)}, ${c.village})। स्थिति: ${pageUrl()}#shikayat`,
                `My complaint number is ${c.complaint_id} (${catLabel(c.category)}, ${c.village}). Status: ${pageUrl()}#shikayat`);
  $("#r-wa").href = "https://wa.me/?text=" + encodeURIComponent(msg);
  $("#receipt").scrollIntoView({behavior: reduce?"auto":"smooth", block:"center"});
}
$("#r-copy").addEventListener("click", async () => { try{ await navigator.clipboard.writeText($("#r-id").textContent); toast(t("संख्या कॉपी हो गई","Number copied")); }catch(e){ toast($("#r-id").textContent); } });
$("#r-new").addEventListener("click", () => { form.reset(); renderCats(); form.hidden = false; $("#receipt").classList.remove("show"); $("#c-name").focus(); });

/* tabs */
function showTab(w){ const n = w==="new"; $("#tab-new").setAttribute("aria-selected",n); $("#tab-track").setAttribute("aria-selected",!n); $("#pane-new").hidden=!n; $("#pane-track").hidden=n; }
$("#tab-new").addEventListener("click", () => showTab("new"));
$("#tab-track").addEventListener("click", () => showTab("track"));
$$('a[href="#track"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); showTab("track"); $("#shikayat").scrollIntoView({behavior: reduce?"auto":"smooth"}); setTimeout(()=>$("#t-id").focus(),400); }));
$$('a[href="#shikayat"]').forEach(a => a.addEventListener("click", () => showTab("new")));

/* track */
let lastTrack = null;
$("#trackForm").addEventListener("submit", async e => {
  e.preventDefault();
  const idEl=$("#t-id"), mEl=$("#t-mobile"), id=idEl.value.trim().toUpperCase(), m=mEl.value.trim();
  if (![check(idEl,/^MHN-\d{6}-\d{4}$/.test(id)), check(mEl,validMobile(m))].every(Boolean)) return;
  const box = $("#t-result"); box.classList.add("show"); box.textContent = t("खोज रहे हैं…","Searching…");
  try{
    const c = await findComplaint(id, m);
    if (!c){ box.innerHTML = `<b>${t("शिकायत नहीं मिली।","No complaint found.")}</b><p style="margin:6px 0 0">${t("संख्या और मोबाइल नंबर दोबारा जाँचें — दोनों वही होने चाहिए जो शिकायत दर्ज करते समय डाले थे।","Check the number and mobile — both must match what you entered when filing.")}</p>`; return; }
    lastTrack = {id, m, c}; renderTrack();
  }catch(err){ console.error(err); box.textContent = t("स्थिति नहीं मिल सकी। बाद में प्रयास करें।","Couldn't load the status. Try again later."); }
});
function renderTrack(){
  if (!lastTrack) return; const {id, m, c} = lastTrack, box = $("#t-result");
  const idx = Math.max(0, STATUSES.findIndex(s => s[0]===c.status));
  const days = c.created_at ? Math.floor((Date.now() - new Date(c.created_at)) / 864e5) : 0;
  const resolved = c.status === "resolved";
  let extra = "";
  if (!resolved){
    const late = days >= 7;
    extra = `<p style="margin:12px 0 0;font-size:16px">${late ? t(`शिकायत ${days} दिन से लंबित है। आप कार्यालय को स्मरण भेज सकते हैं।`,`Pending for ${days} days. You can send the office a reminder.`) : t("कार्यालय 7 दिन में कार्यवाही का प्रयास करता है। उसके बाद आप स्मरण भेज सकते हैं।","The office aims to act within 7 days. After that you can send a reminder.")}</p>
      ${late ? `<div class="mini-actions"><a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.officeWhatsApp}?text=${encodeURIComponent(`स्मरण / Reminder: शिकायत संख्या ${id} (${catLabel(c.category)}, ${c.village}) — ${days} दिन से लंबित।`)}">${t("स्मरण भेजें","Send reminder")}</a></div>` : ""}`;
  } else {
    const r = c.rating || 0;
    extra = `<p style="margin:14px 0 0;font-weight:500">${r ? t("आपकी प्रतिक्रिया के लिए धन्यवाद।","Thanks for your feedback.") : t("समाधान से आप कितने संतुष्ट हैं?","How satisfied are you with the resolution?")}</p>
      <div class="stars" role="group" aria-label="Rating">${[1,2,3,4,5].map(n => `<button type="button" data-rate="${n}" class="${n<=r?"on":""}" aria-label="${n}" ${r?"disabled":""}>★</button>`).join("")}</div>`;
  }
  box.innerHTML = `<b style="font:700 24px var(--display)">${esc(id)}</b>
    <p style="margin:4px 0 0;color:var(--muted)">${esc(catLabel(c.category))} · ${esc(c.village)}</p>
    <div class="status-track">${STATUSES.map((s,i)=>`<div class="${i<=idx?"done":""}">${t(s[1],s[2])}</div>`).join("")}</div>
    ${c.office_note ? `<p style="margin:12px 0 0"><b>${t("कार्यालय की टिप्पणी:","Office note:")}</b> ${esc(c.office_note)}</p>` : ""}${extra}`;
  $$("[data-rate]", box).forEach(b => b.addEventListener("click", async () => {
    const n = +b.dataset.rate; try{ await sendFeedback(id, m, n); c.rating = n; renderTrack(); }catch(e){ toast(t("प्रतिक्रिया नहीं भेजी जा सकी।","Couldn't send feedback.")); }
  }));
}

/* ---------- WhatsApp forms (meeting, views, volunteer) ---------- */
const openWa = msg => window.open(`https://wa.me/${CONFIG.officeWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
$("#meetForm").addEventListener("submit", e => {
  e.preventDefault(); const n=$("#m-name"), mo=$("#m-mobile"), p=$("#m-purpose");
  if (![check(n,n.value.trim().length>1), check(mo,validMobile(mo.value.trim())), check(p,p.value.trim().length>3)].every(Boolean)) return;
  openWa(`मुलाकात अनुरोध / Meeting request\nनाम: ${n.value.trim()}\nमोबाइल: ${mo.value.trim()}\nगाँव: ${$("#m-village").value.trim()||"-"}\nतिथि: ${$("#m-date").value||"-"}\nउद्देश्य: ${p.value.trim()}`);
});
$("#joinForm").addEventListener("submit", e => {
  e.preventDefault(); const n=$("#j-name"), mo=$("#j-mobile"), v=$("#j-village");
  const roles = $$("input[name=role]:checked").map(i => i.parentElement.textContent.trim());
  if (![check(n,n.value.trim().length>1), check(mo,validMobile(mo.value.trim())), check(v,v.value.trim().length>1)].every(Boolean)) return;
  openWa(`जुड़ें अभियान / Volunteer sign-up\nनाम: ${n.value.trim()}\nमोबाइल: ${mo.value.trim()}\nगाँव/बूथ: ${v.value.trim()}\nरुचि: ${roles.join(", ")||"-"}`);
  $("#joinDone").classList.add("show");
});
$("#viewsForm").addEventListener("submit", e => {
  e.preventDefault(); const n=$("#v-name"), msg=$("#v-msg");
  if (![check(n,n.value.trim().length>1), check(msg,msg.value.trim().length>10)].every(Boolean)) return;
  openWa(`सुझाव / Suggestion\nनाम: ${n.value.trim()}\nगाँव: ${$("#v-village").value.trim()||"-"}\nविषय: ${$("#v-topic").value}\n\n${msg.value.trim()}`);
  $("#viewsDone").classList.add("show");
});

/* ---------- Share bar ---------- */
function wireShare(){
  const u = encodeURIComponent(pageUrl()), txt = encodeURIComponent(t("नया मेहनौन — विधायक विनय कुमार द्विवेदी","New Mehnaun — MLA Vinay Kumar Dwivedi"));
  $("#sh-wa").href = `https://wa.me/?text=${txt}%20${u}`;
  $("#sh-fb").href = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
  $("#sh-x").href = `https://twitter.com/intent/tweet?text=${txt}&url=${u}`;
}
$("#sh-copy").addEventListener("click", async () => { try{ await navigator.clipboard.writeText(pageUrl()); toast(t("लिंक कॉपी हो गया","Link copied")); }catch(e){} });

/* ---------- E-card ---------- */
const TPLS = {
  birthday:{hi:"जन्मदिन",en:"Birthday",bg:["#1B1F4B","#2E3577"],accent:"#F5B700",text:"#FFFFFF",dark:true,head:["जन्मदिन की","हार्दिक शुभकामनाएँ"],headEn:["Happy","Birthday"],sub:"मुन्ना भैया को जन्मदिवस (15 अक्टूबर) की अनंत शुभकामनाएँ",subEn:"Warm wishes to Munna Bhaiya on his birthday, 15 October"},
  diwali:{hi:"दीपावली",en:"Diwali",bg:["#3A0D2E","#6B1846"],accent:"#FFC53D",text:"#FFF6E0",dark:true,head:["शुभ","दीपावली"],headEn:["Happy","Diwali"],sub:"आपके जीवन में सुख, समृद्धि और प्रकाश का आगमन हो",subEn:"May your home be filled with light, joy and prosperity"},
  chhath:{hi:"छठ पूजा",en:"Chhath Puja",bg:["#D94F04","#F28C0F"],accent:"#FFF1B8",text:"#FFFFFF",dark:true,head:["छठ पूजा की","शुभकामनाएँ"],headEn:["Happy","Chhath Puja"],sub:"छठी मैया सबकी मनोकामनाएँ पूर्ण करें",subEn:"May Chhathi Maiya bless every family"},
  navratri:{hi:"नवरात्रि",en:"Navratri",bg:["#8C1018","#C2201F"],accent:"#F5B700",text:"#FFFFFF",dark:true,head:["शारदीय","नवरात्रि"],headEn:["Happy","Navratri"],sub:"माँ दुर्गा की कृपा सब पर बनी रहे",subEn:"May Maa Durga's blessings be with all"},
  supporter:{hi:"समर्थक कार्ड",en:"Supporter card",bg:["#F5B700","#FFCF3D"],accent:"#1B1F4B",text:"#1B1F4B",dark:false,head:["नया","मेहनौन"],headEn:["New","Mehnaun"],sub:"मैं हूँ मेहनौन के विकास के साथ",subEn:"I stand with Mehnaun's development"},
  national:{hi:"राष्ट्रीय पर्व",en:"National day",bg:["#FFFFFF","#F4F6FF"],accent:"#E2560B",text:"#1B1F4B",dark:false,head:["जय","हिन्द"],headEn:["Jai","Hind"],sub:"राष्ट्रीय पर्व की हार्दिक शुभकामनाएँ",subEn:"Greetings on our national day"}
};
let tpl = "birthday";
function renderTpls(){
  $("#tplList").innerHTML = Object.keys(TPLS).map(k => `<button type="button" data-k="${k}" aria-pressed="${k===tpl}" style="background:${TPLS[k].bg[0]};color:${TPLS[k].text}">${t(TPLS[k].hi,TPLS[k].en)}</button>`).join("");
}
document.addEventListener("click", e => { const b = e.target.closest("#tplList button, [data-tpl]"); if (b){ tpl = b.dataset.k || b.dataset.tpl; renderTpls(); drawCard(); } });
const cv = $("#card"), ctx = cv.getContext("2d");
const mlaImg = new Image(); mlaImg.src = "images/hero.jpg"; mlaImg.onload = () => drawCard();
let userImg = null;
$("#e-photo").addEventListener("change", e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { userImg = im; drawCard(); }; im.src = r.result; }; r.readAsDataURL(f); });
["#e-name","#e-place"].forEach(s => $(s).addEventListener("input", drawCard));
function coverImg(im,x,y,w,h,fy=.2){ const s=Math.max(w/im.width,h/im.height), sw=w/s, sh=h/s; ctx.drawImage(im,(im.width-sw)/2,Math.max(0,Math.min(im.height-sh,(im.height-sh)*fy)),sw,sh,x,y,w,h); }
function wrapText(text,x,y,maxW,lh){ const words=text.split(" "); let line="", n=0; for (const w of words){ const test=line?line+" "+w:w; if (ctx.measureText(test).width>maxW && line){ ctx.fillText(line,x,y+n*lh); n++; line=w; } else line=test; } ctx.fillText(line,x,y+n*lh); }
function drawCard(){
  const T=TPLS[tpl], W=cv.width, H=cv.height;
  const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,T.bg[0]); g.addColorStop(1,T.bg[1]); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=T.accent; ctx.globalAlpha=.18; ctx.lineWidth=3; for (let i=0;i<5;i++){ ctx.beginPath(); ctx.arc(W-120,140,120+i*48,0,Math.PI*2); ctx.stroke(); } ctx.globalAlpha=1;
  const head = LANG==="en"?T.headEn:T.head; ctx.textAlign="left"; ctx.fillStyle=T.text; ctx.font="600 64px Khand, Mukta, sans-serif"; ctx.fillText(head[0],72,170);
  let hs=150; ctx.font=`700 ${hs}px Khand, Mukta, sans-serif`; while (ctx.measureText(head[1]).width>W-144 && hs>80){ hs-=6; ctx.font=`700 ${hs}px Khand, Mukta, sans-serif`; }
  ctx.fillStyle=T.accent; ctx.fillText(head[1],68,170+hs*.95);
  const ax=W-470, ay=400, aw=400, ah=560;
  ctx.save(); ctx.beginPath(); ctx.moveTo(ax,ay+aw/2); ctx.arc(ax+aw/2,ay+aw/2,aw/2,Math.PI,0); ctx.lineTo(ax+aw,ay+ah); ctx.lineTo(ax,ay+ah); ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.clip();
  if (mlaImg.complete && mlaImg.naturalWidth) coverImg(mlaImg,ax,ay,aw,ah,.08); ctx.restore();
  ctx.lineWidth=10; ctx.strokeStyle=T.accent; ctx.beginPath(); ctx.moveTo(ax,ay+ah); ctx.lineTo(ax,ay+aw/2); ctx.arc(ax+aw/2,ay+aw/2,aw/2,Math.PI,0); ctx.lineTo(ax+aw,ay+ah); ctx.stroke();
  ctx.fillStyle=T.text; ctx.font="500 42px Mukta, sans-serif"; wrapText(LANG==="en"?T.subEn:T.sub,72,470,470,58);
  const name=$("#e-name").value.trim(), place=$("#e-place").value.trim(), uy=1010;
  ctx.fillStyle=T.accent; ctx.globalAlpha=.14; ctx.fillRect(0,uy-40,W,230); ctx.globalAlpha=1;
  let tx=72;
  if (userImg){ ctx.save(); ctx.beginPath(); ctx.arc(152,uy+75,80,0,Math.PI*2); ctx.clip(); coverImg(userImg,72,uy-5,160,160,.3); ctx.restore();
    ctx.lineWidth=8; ctx.strokeStyle=T.accent; ctx.beginPath(); ctx.arc(152,uy+75,80,0,Math.PI*2); ctx.stroke(); tx=270; }
  ctx.fillStyle=T.text; ctx.font="500 34px Mukta, sans-serif"; ctx.fillText(t("शुभकामनाओं सहित","With best wishes"),tx,uy+40);
  ctx.font="700 64px Khand, Mukta, sans-serif"; ctx.fillText(name||t("आपका नाम","Your name"),tx,uy+108);
  if (place){ ctx.font="400 34px Mukta, sans-serif"; ctx.fillText(place,tx,uy+152); }
  ctx.fillStyle=T.dark?"rgba(0,0,0,.28)":"rgba(27,31,75,.08)"; ctx.fillRect(0,H-110,W,110);
  ctx.fillStyle=T.text; ctx.font="700 40px Khand, Mukta, sans-serif"; ctx.fillText(t("विनय कुमार द्विवेदी","Vinay Kumar Dwivedi"),72,H-46);
  ctx.textAlign="right"; ctx.font="500 30px Mukta, sans-serif"; ctx.fillText(t("विधायक, 295-मेहनौन, गोंडा","MLA, 295-Mehnaun, Gonda"),W-72,H-48); ctx.textAlign="left";
}
const cardBlob = () => new Promise(r => cv.toBlob(r,"image/png"));
const cardName = () => `ecard-${tpl}-${($("#e-name").value.trim()||"mehnaun").replace(/\s+/g,"-")}.png`;
$("#e-download").addEventListener("click", async () => { const b=await cardBlob(), a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=cardName(); a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); toast(t("कार्ड डाउनलोड हो गया","Card downloaded")); });
$("#e-share").addEventListener("click", async () => {
  const b=await cardBlob(), f=new File([b],cardName(),{type:"image/png"});
  if (navigator.canShare && navigator.canShare({files:[f]})){ try{ await navigator.share({files:[f], text:t("नया मेहनौन","New Mehnaun")}); }catch(e){} }
  else { $("#e-download").click(); toast(t("कार्ड डाउनलोड हुआ — अब WhatsApp पर भेजें","Card downloaded — now send it on WhatsApp")); }
});

/* ---------- Counters, nav, ribbon ---------- */
const fmtIN = n => Math.round(n).toLocaleString("en-IN");
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; io.unobserve(e.target); if (reduce) return;
  const el=e.target, end=parseFloat(el.dataset.count), suf=el.dataset.suffix||"", dec=String(end).includes(".")?2:0, t0=performance.now();
  (function step(now){ const p=Math.min((now-t0)/1400,1), v=end*(1-Math.pow(1-p,3)); el.textContent=(el.dataset.format==="in"?fmtIN(v):v.toFixed(dec))+suf; if (p<1) requestAnimationFrame(step); })(t0);
}), {threshold:.5});
$$("[data-count]").forEach(el => io.observe(el));
const nav=$("#nav"), menuBtn=$("#menuBtn");
menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open")));
$$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }));
(() => { const d=new Date(); if (d.getMonth()===9 && d.getDate()>=10 && d.getDate()<=20) $("#bdayRibbon").hidden=false; })();
$("#yr").textContent = new Date().getFullYear();
$$(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
$$(".fs button").forEach(b => b.addEventListener("click", () => setFs(+b.dataset.fs)));
$$("a[data-fb]").forEach(a => a.href = CONFIG.facebook);
$$("a[data-ig]").forEach(a => a.href = CONFIG.instagram);

/* ---------- Render ---------- */
function renderAll(){ renderNews(); renderGallery(); renderVideos(); renderCats(); renderTpls(); drawCard(); renderTrack(); wireShare(); }
captureStatic();
const savedFs = store.get("fs", 1); if (savedFs !== 1) setFs(savedFs);
if (store.get("lang","hi") === "en") setLang("en"); else renderAll();
loadCounts();
document.fonts.ready.then(drawCard);
requestAnimationFrame(() => setTimeout(() => document.body.classList.remove("hero-load"), 60));
})();
