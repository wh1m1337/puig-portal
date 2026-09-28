let lang="pl", evF="all", newsTab="izba", dirQ="", dirS="all", offF="pl", offSel=0;
const PAGE=document.body.dataset.page||"home";
const $=s=>document.querySelector(s), T=k=>I18N[lang][k]??I18N.pl[k];
const locale=()=>({pl:"pl-PL",uk:"uk-UA",en:"en-GB"})[lang];
const fmt=n=>n.toLocaleString(locale());
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const svg=p=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const dparts=s=>{const d=new Date(s);return{day:d.getDate(),mon:d.toLocaleDateString(locale(),{month:"short"}).replace(".",""),full:d.toLocaleDateString(locale(),{day:"numeric",month:"long",year:"numeric"}),time:s.includes("T")?d.toLocaleTimeString(locale(),{hour:"2-digit",minute:"2-digit"}):""}};
const limit=el=>+el.dataset.limit||Infinity;
const LOGO='<span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

/* chrome: header + footer shared by every page */
function renderChrome(){
  $("#hdr").innerHTML=`<div class="proto">${T("proto")}</div><header><div class="wrap hdr">
    <a class="logo" href="index.html" aria-label="PUIG — ${T("nHome")}">${LOGO}<span>PUIG<small>${T("orgName")}</small></span></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" id="menuBtn">☰</button>
    <nav class="main" id="nav">${NAV.map(([h,k])=>`<a href="${h}"${location.pathname.endsWith("/"+h)?' aria-current="page"':""}>${T(k)}</a>`).join("")}</nav>
    <div class="langs" role="group" aria-label="Language">${["pl","uk","en"].map(l=>`<button data-lang="${l}" aria-pressed="${l===lang}">${l==="uk"?"UA":l.toUpperCase()}</button>`).join("")}</div>
    <button class="theme-btn" id="themeBtn" type="button"></button>
    <a href="czlonkostwo.html" class="btn btn-gold">${T("ctaJoin")}</a></div></header>`;
  $("#ftr").innerHTML=`<footer><div class="wrap"><div class="foot">
    <div><a class="logo" href="index.html" style="color:#fff">${LOGO}<span>PUIG<small style="color:#aebfe3">${T("orgName")}</small></span></a><p style="font-size:14px;margin-top:14px">${T("footAbout")}</p></div>
    <div><h4>${T("fIzba")}</h4><a href="o-izbie.html">${T("fAbout")}</a><a href="o-izbie.html#kierownictwo">${T("fBoard")}</a><a href="czlonkostwo.html">${T("nMembership")}</a><a href="czlonkowie.html">${T("nMembers")}</a></div>
    <div><h4>${T("fRes")}</h4><a href="odbudowa.html">${T("fRebuild")}</a><a href="uslugi.html">${T("nServices")}</a><a href="wydarzenia.html">${T("nEvents")}</a><a href="https://pol-ukr.com/wp-content/uploads/2024-12-06-PUIG-PREZENTACJA.pdf">${T("fPres")}</a></div>
    <div><h4>${T("nContact")}</h4><a href="tel:+48228270081">+48 22 827 00 81</a><a href="mailto:info@pol-ukr.com">info@pol-ukr.com</a><a href="kontakt.html">${T("offTitle")}</a></div>
    </div><div class="legal"><span>© 1992–2026 ${T("orgName")}</span><a href="https://pol-ukr.com/polityka-prywatnosci/" style="display:inline">${T("fPriv")}</a></div></div></footer>`;
  $("#menuBtn").onclick=()=>{const n=$("#nav");n.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",n.classList.contains("open"))};
  $("#themeBtn").onclick=()=>{const t=isDark()?"light":"dark";document.documentElement.dataset.theme=t;try{localStorage.setItem("puig-theme",t)}catch(_){}renderTheme()};
  renderTheme();
}

/* theme */
const SUN='<path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>',MOON='<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
const THEME_L={pl:["Jasny motyw","Ciemny motyw"],uk:["Світла тема","Темна тема"],en:["Light theme","Dark theme"]};
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches};
function renderTheme(){const b=$("#themeBtn");if(!b)return;const d=isDark(),l=THEME_L[lang][d?0:1];b.innerHTML=svg(d?SUN:MOON);b.title=l;b.setAttribute("aria-label",l)}

function renderStatic(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i]").forEach(el=>el.textContent=T(el.dataset.i));
  document.querySelectorAll("[data-i-html]").forEach(el=>el.innerHTML=T(el.dataset.iHtml));
  document.querySelectorAll("[data-i-ph]").forEach(el=>el.placeholder=T(el.dataset.iPh));
  document.querySelectorAll("[data-i-list]").forEach(el=>el.innerHTML=T(el.dataset.iList).map(x=>`<li>${x}</li>`).join(""));
  const t=document.body.dataset.title;document.title=(t?T(t)+" — ":"")+"PUIG · "+T("orgName");
}
function renderPaths(el){el.innerHTML=PATHS.map(p=>`<a class="path" href="${p.href}"><span class="flag">${p.flag}</span><h3>${p.t[lang]}</h3><p>${p.d[lang]}</p><span class="go">→</span></a>`).join("")}
function renderHeroEvents(el){el.innerHTML=EVENTS.slice(0,3).map(e=>{const d=dparts(e.s);return`<a class="next-ev" href="${e.url}"><span class="d">${d.day}<small>${d.mon}</small></span><span><b>${esc(e.t)}</b><span>${esc(e.place)}</span></span></a>`}).join("")}
function renderSvc(el){el.innerHTML=SVC.slice(0,limit(el)).map(s=>`<article class="card svc"><div class="ico">${svg(ICONS[s.i])}</div><h3>${s.t[lang]}</h3><p>${s.d[lang]}</p><div class="price">${s.price?`${T("from")} <b>${fmt(+s.price)}</b> ${s.unit[lang]} ${T("net")}`:`<a href="kontakt.html">${T("ask")} →</a>`}</div></article>`).join("")}
function renderEvents(el){
  const f=$("#evFilter");
  if(f)f.innerHTML=[["all",T("all")],["own",T("own")],["ext",T("ext")]].map(([k,l])=>`<button class="chip" data-ev="${k}" aria-pressed="${evF===k}">${l}</button>`).join("");
  const list=EVENTS.filter(e=>evF==="all"||(evF==="own")===e.own).slice(0,limit(el));
  el.innerHTML=list.map(e=>{const d=dparts(e.s),en=dparts(e.e);const range=e.s.slice(0,10)!==e.e.slice(0,10)?`${d.full} – ${en.full}`:`${d.full}${d.time?" · "+d.time+"–"+en.time:""}`;
    return`<article class="card ev"><div class="date"><b>${d.day}</b><small>${d.mon}</small></div><div><h3>${esc(e.t)}</h3><div class="meta"><span class="tag">${e.own?"PUIG":T("ext")}</span>${range} · ${esc(e.place)}</div></div><div class="acts"><button class="btn btn-line" data-ics="${EVENTS.indexOf(e)}">${T("addCal")}</button><a class="btn btn-blue" href="${e.url}">${T("details")}</a></div></article>`}).join("");
}
function ics(e){
  const z=s=>s.includes("T")?s.replace(/[-:]/g,"")+"00":s.replace(/-/g,"");
  const allDay=!e.s.includes("T");
  let end=e.e; if(allDay){const d=new Date(e.e);d.setDate(d.getDate()+1);end=d.toISOString().slice(0,10)}
  const body=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//PUIG//prototype//PL","BEGIN:VEVENT",`UID:${z(e.s)}-${e.t.length}@pol-ukr.com`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").slice(0,15)}Z`,
    (allDay?"DTSTART;VALUE=DATE:":"DTSTART;TZID=Europe/Warsaw:")+z(e.s),(allDay?"DTEND;VALUE=DATE:":"DTEND;TZID=Europe/Warsaw:")+z(end),`SUMMARY:${e.t}`,`LOCATION:${e.place}`,`URL:${e.url}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type:"text/calendar"}));a.download=e.t.replace(/[^\w]+/g,"-")+".ics";a.click();
}
function renderMem(el){
  el.innerHTML=PKG.map(p=>{
    let amt,extra="";
    if(p.sizes){amt=`<span class="amt" id="basicAmt">${fmt(p.sizes[0][1])} zł <small>${T("perYear")}</small></span>`;
      extra=`<label>${T("size")}<select id="sizeSel">${p.sizes.map(s=>`<option value="${s[1]}">${s[2][lang]} — ${fmt(s[1])} zł</option>`).join("")}</select></label>`}
    else amt=p.amt?`<span class="amt">${fmt(p.amt)} zł <small>${T("perYear")}</small></span>`:`<span class="amt">${T("individual")}</span>`;
    return`<article class="card pkg${p.hl?" hl":""}">${p.hl?`<span class="badge">${T("popular")}</span>`:""}<h3>${p.t[lang]}</h3>${amt}${extra}<ul>${p.f[lang].map(x=>`<li>${x}</li>`).join("")}</ul><a class="btn ${p.hl?"btn-blue":"btn-line"}" href="https://pol-ukr.com/members/">${T("apply")}</a></article>`}).join("");
  $("#sizeSel").onchange=e=>$("#basicAmt").innerHTML=`${fmt(+e.target.value)} zł <small>${T("perYear")}</small>`;
}
function renderSteps(el,items){el.innerHTML=items.map((s,i)=>`<div class="card step"><span class="n">${i+1}</span><p>${s}</p></div>`).join("")}
const COLORS=["#1f5fd1","#d6283a","#0b2a5b","#c79a00","#2e8b57","#7a4bd1"];
function renderDir(el){
  $("#dirChips").innerHTML=[["all",T("all")],...Object.entries(SECT).map(([k,v])=>[k,v[lang]])].map(([k,l])=>`<button class="chip" data-s="${k}" aria-pressed="${dirS===k}">${l}</button>`).join("");
  const q=dirQ.toLowerCase(), ks=Object.keys(SECT);
  const list=MEMBERS.filter(([n,s])=>(dirS==="all"||s===dirS)&&(!q||n.toLowerCase().includes(q)||Object.values(SECT[s]).some(v=>v.toLowerCase().includes(q))));
  el.innerHTML=list.length?list.map(([n,s])=>`<div class="card mem"><span class="av" style="background:${COLORS[ks.indexOf(s)%COLORS.length]}">${esc(n.replace(/[^A-Za-zĄ-ż]/g,"").slice(0,2).toUpperCase())}</span><span><b>${esc(n)}</b><span>${SECT[s][lang]}</span></span></div>`).join(""):`<p class="dir-empty">${T("dirEmpty")}</p>`;
}
function renderNews(el){
  const tabs=$("#newsTabs");
  if(tabs)tabs.innerHTML=[["izba",T("tabIzba")],["mem",T("tabMem")]].map(([k,l])=>`<button class="chip" data-n="${k}" aria-pressed="${newsTab===k}">${l}</button>`).join("");
  el.innerHTML=NEWS[newsTab].slice(0,limit(el)).map(([t,d,slug])=>`<a class="card news" href="https://pol-ukr.com/${slug}/"><span class="src">${newsTab==="izba"?"PUIG":T("tabMem")}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="src" style="margin-top:auto">${T("more")}</span></a>`).join("");
}
function renderOffices(el){
  $("#offFilter").innerHTML=[["pl",T("poland")],["ua",T("ukraine")]].map(([k,l])=>`<button class="chip" data-o="${k}" aria-pressed="${offF===k}">${l} · ${OFFICES.filter(o=>o[0]===k).length}</button>`).join("");
  const list=OFFICES.map((o,i)=>[o,i]).filter(([o])=>o[0]===offF);
  if(!list.some(([,i])=>i===offSel))offSel=list[0][1];
  el.innerHTML=list.map(([o,i])=>`<button role="option" aria-selected="${i===offSel}" data-off="${i}">${esc(o[1])}<small>${o[0].toUpperCase()}</small></button>`).join("");
  const o=OFFICES[offSel];
  $("#offDetail").innerHTML=`<h3>${esc(o[1])}</h3><div class="role">${(o[3]||DEF_ROLE)[lang]}</div><dl><dt>${T("person")}</dt><dd>${esc(o[2])}</dd>${o[4]?`<dt>${T("address")}</dt><dd>${esc(o[4])}</dd>`:""}${o[5]?`<dt>${T("phone")}</dt><dd><a href="tel:${o[5].replace(/\s/g,"")}">${o[5]}</a></dd>`:""}<dt>E-mail</dt><dd><a href="mailto:info@pol-ukr.com">info@pol-ukr.com</a></dd></dl>`;
}
function renderPeople(el){
  el.innerHTML=[["presT","pres"],["vpT","vp"],["councilPL","cpl"],["councilUA","cua"],["auditT","audit"]].map(([h,k])=>
    `<div class="people-group"><h3>${T(h)}</h3><div class="people">${LEAD[k].map(([n,r])=>`<div class="person"><span class="av">${esc(n.split(" ").map(w=>w[0]).slice(0,2).join(""))}</span><span><b>${esc(n)}</b>${r?`<small>${T(r)}</small>`:""}</span></div>`).join("")}</div></div>`).join("");
}
function renderRebuild(el){el.innerHTML=T("rbItems").map(([t,d],i)=>`<article class="card svc"><div class="ico">${svg(ICONS[["globe","chat","home","cal"][i]])}</div><h3>${t}</h3><p>${d}</p></article>`).join("")}
function renderForm(el){el.innerHTML=DEPTS[lang].map(d=>`<option>${d}</option>`).join("")}

const RENDER=[["#paths",renderPaths],["#heroEvents",renderHeroEvents],["#svcGrid",renderSvc],["#evList",renderEvents],["#memGrid",renderMem],
  ["#steps",el=>renderSteps(el,STEPS[lang])],["#howSteps",el=>renderSteps(el,T("how"))],["#dir",renderDir],["#newsGrid",renderNews],["#offList",renderOffices],
  ["#people",renderPeople],["#rbGrid",renderRebuild],["#deptSel",renderForm],["#evCount",el=>el.textContent=EVENTS.length]];
function renderAll(){renderChrome();renderStatic();for(const[s,fn]of RENDER){const el=$(s);if(el)fn(el)}}

document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.lang){lang=b.dataset.lang;try{localStorage.setItem("puig-lang",lang)}catch(_){}renderAll()}
  else if(b.dataset.ev){evF=b.dataset.ev;renderEvents($("#evList"))}
  else if(b.dataset.ics){ics(EVENTS[+b.dataset.ics])}
  else if(b.dataset.s){dirS=b.dataset.s;renderDir($("#dir"))}
  else if(b.dataset.n){newsTab=b.dataset.n;renderNews($("#newsGrid"))}
  else if(b.dataset.o){offF=b.dataset.o;renderOffices($("#offList"))}
  else if(b.dataset.off){offSel=+b.dataset.off;renderOffices($("#offList"))}
});
document.addEventListener("click",e=>{if(e.target.closest("#nav a"))$("#nav").classList.remove("open")});
const ds=$("#dirSearch");if(ds)ds.oninput=e=>{dirQ=e.target.value;renderDir($("#dir"))};
const cf=$("#ctForm");if(cf)cf.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
  location.href=`mailto:info@pol-ukr.com?subject=${encodeURIComponent("["+f.get("dept")+"] "+f.get("name"))}&body=${encodeURIComponent(f.get("msg")+"\n\n— "+f.get("name")+" <"+f.get("email")+">")}`;};
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",renderTheme);
try{const t=localStorage.getItem("puig-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(_){}
try{const s=localStorage.getItem("puig-lang");if(s&&I18N[s])lang=s;else if(/^uk/.test(navigator.language))lang="uk"}catch(_){}
renderAll();
Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1000))]).then(()=>document.documentElement.classList.remove("loading"));
