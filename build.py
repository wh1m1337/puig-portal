#!/usr/bin/env python3
"""Generates the static pages from one shared shell. Run: python3 build.py"""
from pathlib import Path

HEAD = """<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<script>document.documentElement.classList.add("loading");setTimeout(function(){{document.documentElement.classList.remove("loading")}},2500);try{{var t=localStorage.getItem("puig-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<link rel="preload" href="assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/manrope-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/manrope-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
</head>
<body data-page="{page}"{title_key}>
<div id="hdr"></div>
<main id="top">
"""
FOOT = """</main>
<div id="ftr"></div>
<script src="assets/data.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
"""


def page_hero(key_title, key_lead, crumb_key):
    return f"""<section class="page-hero"><div class="wrap">
  <div class="crumbs"><a href="index.html" data-i="nHome">Strona główna</a> / <span data-i="{crumb_key}"></span></div>
  <h1 data-i="{key_title}"></h1>
  <p data-i="{key_lead}"></p>
</div></section>
"""


def head_row(eyebrow, title, link=None, link_key=None, extra=""):
    right = f'<a class="more-link" href="{link}" data-i="{link_key}"></a>' if link else extra
    return f"""<div class="sec-head"><div><div class="eyebrow" data-i="{eyebrow}"></div><h2 data-i="{title}"></h2></div>{right}</div>"""


ALT = ' style="background:var(--surface);border-block:1px solid var(--line)"'

CONTACT_FORM = """<form class="card" id="ctForm">
  <label><span data-i="fName"></span><input name="name" required autocomplete="name"></label>
  <label><span data-i="fMail"></span><input name="email" type="email" required autocomplete="email"></label>
  <label><span data-i="fDept"></span><select name="dept" id="deptSel"></select></label>
  <label><span data-i="fMsg"></span><textarea name="msg" required></textarea></label>
  <button class="btn btn-blue" type="submit" data-i="fSend"></button>
</form>"""

PAGES = {
"index": ("Polsko-Ukraińska Izba Gospodarcza — od 1992 roku wspieramy firmy wchodzące na rynek polski i ukraiński.", None, f"""
<section class="hero"><div class="wrap">
  <div class="hero-grid">
    <div>
      <div class="eyebrow" style="color:var(--gold)" data-i="heroEyebrow"></div>
      <h1 data-i-html="heroTitle"></h1>
      <p class="lead" data-i="heroLead"></p>
      <div class="hero-ctas"><a href="kontakt.html" class="btn btn-gold" data-i="heroCta1"></a><a href="wydarzenia.html" class="btn btn-ghost" data-i="heroCta2"></a></div>
    </div>
    <div class="hero-card"><h3 data-i="nextEvents"></h3><div id="heroEvents"></div></div>
  </div>
  <div class="paths" id="paths"></div>
</div></section>
<section class="stats"><div class="wrap stat-row">
  <div class="card stat"><b>1992</b><span data-i="st1"></span></div>
  <div class="card stat"><b>26</b><span data-i="st2"></span></div>
  <div class="card stat"><b>§</b><span data-i="st3"></span></div>
  <div class="card stat"><b id="evCount">7</b><span data-i="st4"></span></div>
</div></section>
<section><div class="wrap">{head_row("nServices","svcTitle","uslugi.html","allServices")}<div class="svc-grid" id="svcGrid" data-limit="6"></div></div></section>
<section{ALT}><div class="wrap">{head_row("nEvents","evTitle","wydarzenia.html","allEvents")}<div class="ev-list" id="evList" data-limit="3"></div></div></section>
<section><div class="wrap">{head_row("nNews","newsTitle","aktualnosci.html","allNews")}<div class="news-grid" id="newsGrid" data-limit="3"></div></div></section>
<section style="padding-top:0"><div class="wrap"><div class="band"><div><h3 data-i="memTitle"></h3><p data-i="memPageLead"></p></div><a class="btn btn-blue" href="czlonkostwo.html" data-i="ctaJoin"></a></div></div></section>
"""),

"o-izbie": ("Misja, cele i kierownictwo Polsko-Ukraińskiej Izby Gospodarczej.", "nAbout", page_hero("aboutTitle","aboutLead","nAbout") + f"""
<section><div class="wrap two-col">
  <div class="card prose"><h3 data-i="missionT"></h3><p data-i="mission"></p></div>
  <div class="card prose"><h3 data-i="goalsT"></h3><ul data-i-list="goals"></ul></div>
</div></section>
<section style="padding-top:0"><div class="wrap"><div class="band"><div><h3 data-i="commissionT"></h3><p data-i="commission"></p></div><a class="btn btn-blue" href="mailto:info@pol-ukr.com?subject=Komisja%20mi%C4%99dzyrz%C4%85dowa" data-i="commissionCta"></a></div></div></section>
<section id="kierownictwo"{ALT}><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow" data-i="nAbout"></div><h2 data-i="leadT"></h2></div></div>
  <div id="people"></div>
</div></section>
<section><div class="wrap">
  <div class="sec-head"><div><h2 data-i="docsT"></h2></div></div>
  <div class="docs">
    <a class="btn btn-line" href="https://pol-ukr.com/informacje-o-izbie/" data-i="docStatute"></a>
    <a class="btn btn-line" href="https://pol-ukr.com/informacje-o-izbie/" data-i="docReport"></a>
    <a class="btn btn-line" href="https://pol-ukr.com/wp-content/uploads/2024-12-06-PUIG-PREZENTACJA.pdf" data-i="docPres"></a>
  </div>
</div></section>
"""),

"uslugi": ("Doradztwo, legalizacja, misje gospodarcze, tłumaczenia, promocja i eventy — usługi PUIG z cenami.", "nServices", page_hero("svcTitle","svcPageLead","nServices") + f"""
<section><div class="wrap"><div class="svc-grid" id="svcGrid"></div></div></section>
<section{ALT}><div class="wrap"><div class="sec-head"><div><h2 data-i="howT"></h2></div></div><div class="steps" id="howSteps" style="margin-top:0"></div></div></section>
<section><div class="wrap"><div class="sec-head"><div><h2 data-i="ctTitle"></h2><p data-i="ctLead"></p></div></div><div class="contact-grid">{CONTACT_FORM}<div class="card prose"><h3 data-i="hq"></h3><p>ul. Legionowa 9/2, 01-343 Warszawa<br><a href="tel:+48228270081">+48 22 827 00 81</a><br><a href="mailto:info@pol-ukr.com">info@pol-ukr.com</a></p></div></div></div></section>
"""),

"wydarzenia": ("Kalendarz wydarzeń polsko-ukraińskich: mixery biznesowe, fora, misje gospodarcze.", "nEvents", page_hero("evTitle","evPageLead","nEvents") + """
<section><div class="wrap"><div class="chips" id="evFilter"></div><div class="ev-list" id="evList"></div></div></section>
"""),

"czlonkostwo": ("Pakiety członkowskie PUIG i składki według Uchwały nr 2/2026.", "nMembership", page_hero("memTitle","memPageLead","nMembership") + f"""
<section><div class="wrap"><p style="color:var(--muted);margin:0 0 28px" data-i="memLead"></p><div class="mem-grid" id="memGrid"></div><div class="steps" id="steps"></div></div></section>
<section{ALT}><div class="wrap two-col">
  <div class="card prose"><h3 data-i="importantT"></h3><ul data-i-list="important"></ul></div>
  <div class="band" style="flex-direction:column;align-items:flex-start"><div><h3 data-i="nMembers"></h3><p data-i="dirLead"></p></div><a class="btn btn-blue" href="czlonkowie.html" data-i="seeAll"></a></div>
</div></section>
"""),

"czlonkowie": ("Katalog firm członkowskich Polsko-Ukraińskiej Izby Gospodarczej.", "nMembers", page_hero("dirTitle","dirLead","nMembers") + """
<section><div class="wrap">
  <div class="dir-tools"><input class="search" id="dirSearch" type="search" data-i-ph="dirPh" aria-label="Search"></div>
  <div class="chips" id="dirChips"></div>
  <div class="dir" id="dir"></div>
  <div class="band" style="margin-top:32px"><h3 data-i="dirCta"></h3><a class="btn btn-blue" href="czlonkostwo.html" data-i="ctaJoin"></a></div>
</div></section>
"""),

"aktualnosci": ("Aktualności Polsko-Ukraińskiej Izby Gospodarczej i firm członkowskich.", "nNews", page_hero("newsTitle","newsPageLead","nNews") + """
<section><div class="wrap">
  <div class="sec-head"><div class="tabs" id="newsTabs"></div><a class="more-link" href="https://pol-ukr.com/" data-i="archive"></a></div>
  <div class="news-grid" id="newsGrid"></div>
</div></section>
"""),

"odbudowa": ("Odbudowa Ukrainy: Ukraine Facility, Klub z BGK, webinary, wizyty studyjne i konferencje.", "nRebuild", page_hero("rbTitle","rbLead","nRebuild") + """
<section><div class="wrap"><div class="rb-grid" id="rbGrid"></div></div></section>
<section style="padding-top:0"><div class="wrap"><div class="band"><h3 data-i="rbCta"></h3><a class="btn btn-blue" href="kontakt.html" data-i="heroCta1"></a></div></div></section>
"""),

"kontakt": ("Kontakt z PUIG: biuro w Warszawie, przedstawicielstwo w Kijowie i sieć przedstawicieli regionalnych.", "nContact", page_hero("ctTitle","contactPageLead","nContact") + f"""
<section><div class="wrap"><div class="contact-grid">{CONTACT_FORM}
  <div style="display:grid;gap:20px">
    <div class="card prose"><h3 data-i="hq"></h3><p>ul. Legionowa 9/2, 01-343 Warszawa<br><a href="tel:+48228270081">+48 22 827 00 81</a><br><a href="mailto:info@pol-ukr.com">info@pol-ukr.com</a></p>
      <h3 style="margin-top:20px" data-i="kyiv"></h3><p>вул. Хорива 4/10, 04071 Київ<br><a href="tel:+380504105926">+380 50 410 59 26</a></p></div>
    <div class="card cause"><h3 data-i="fundTitle"></h3><p data-i="fundLead"></p><a class="btn btn-gold" href="https://pol-ukr.com/fundusz-pomocy-ukrainie/" data-i="fundCta"></a></div>
  </div>
</div></div></section>
<section id="biura"{ALT}><div class="wrap">
  {head_row("offEyebrow","offTitle",extra='<div class="chips" id="offFilter" style="margin:0"></div>')}
  <div class="off-wrap"><div class="card off-list" id="offList" role="listbox"></div><div class="card off-detail" id="offDetail" aria-live="polite"></div></div>
</div></section>
"""),
}

root = Path(__file__).parent
for name, (desc, title_key, body) in PAGES.items():
    title = "PUIG · Polsko-Ukraińska Izba Gospodarcza"
    html = HEAD.format(title=title, desc=desc, page=name,
                       title_key=f' data-title="{title_key}"' if title_key else "") + body + FOOT
    (root / f"{name}.html").write_text(html, encoding="utf-8")
    print("wrote", f"{name}.html")
