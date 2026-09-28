#!/usr/bin/env node
/* 00338.com static site generator — zero dependencies. Usage: node build/build.js  → outputs ./dist */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, 'dist');
const E = require(path.join(SRC, 'assets/js/engine.js'));
const D = require('./data.js');
const ARTICLES = require('./articles.js');
const SITE = 'https://00338.com';
const OUTREACH = 'https://web.works/contact';
const TODAY = new Date().toISOString().slice(0, 10);
const VERSION = Date.now().toString(36);
const pages = [];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(a, b) { fs.mkdirSync(b, { recursive: true }); for (const f of fs.readdirSync(a)) { const s = path.join(a, f), d = path.join(b, f); if (fs.statSync(s).isDirectory()) copyDir(s, d); else if (f.endsWith('.b64')) fs.writeFileSync(d.slice(0, -4), Buffer.from(fs.readFileSync(s, 'utf8').trim(), 'base64')); else fs.copyFileSync(s, d); } }
function write(rel, html) { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); }

// ---------------------------------------------------------------- chrome
const NAV = [
  { label: 'Decoder', href: 'tools/number-decoder.html' },
  { label: 'Tools', children: [
    ['Number Decoder', 'tools/number-decoder.html'], ['Lucky Phone Number Checker', 'tools/lucky-phone-number-checker.html'],
    ['Licence Plate Checker', 'tools/lucky-license-plate-checker.html'], ['Numeric Domain Checker', 'tools/numeric-domain-checker.html'],
    ['Lucky Number Generator', 'tools/lucky-number-generator.html'], ['Lucky Date Picker', 'tools/lucky-date-picker.html'],
    ['Lunar Calendar Converter', 'tools/lunar-calendar-converter.html'], ['Chinese Zodiac Calculator', 'tools/chinese-zodiac-calculator.html'],
    ['Numerology Calculator', 'tools/numerology-calculator.html'], ['HK Stock Code Decoder', 'tools/hk-stock-code-decoder.html'],
    ['All tools →', 'tools/index.html']] },
  { label: 'Numbers', children: [['0–9 & famous combos', 'numbers/index.html'], ['8 — prosperity', 'numbers/8.html'], ['4 — avoided', 'numbers/4.html'], ['168', 'numbers/168.html'], ['520', 'numbers/520.html'], ['00338', 'numbers/00338.html']] },
  { label: 'Zodiac', href: 'zodiac/index.html' },
  { label: 'Learn', children: [...ARTICLES.slice(0, 7).map((a) => [a.short, 'learn/' + a.slug + '.html']), ['All guides →', 'learn/index.html']] },
  { label: 'Videos', href: 'videos.html' },
  { label: 'Community', children: [['Contests & prizes', 'contests.html'], ['Support us', 'support.html'], ['Careers', 'careers.html'], ['Advertise & sponsor', 'advertise.html']] }
];

function head(p) {
  const base = p.base, canonical = SITE + '/' + (p.path === 'index.html' ? '' : p.path);
  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: '00338 Number Lab', url: SITE + '/', potentialAction: { '@type': 'SearchAction', target: SITE + '/tools/number-decoder.html?n={n}', 'query-input': 'required name=n' } }];
  if (p.crumbs) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: p.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE + '/' + c[1] })) });
  if (p.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
  if (p.article) ld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, datePublished: '2026-09-28', dateModified: TODAY, author: { '@type': 'Organization', name: '00338 Number Lab Editorial' }, publisher: { '@type': 'Organization', name: '00338 Number Lab' }, mainEntityOfPage: canonical });
  if (p.ld) ld.push(p.ld);
  return `<!doctype html>
<html lang="en" data-base="${base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(p.title)}${p.path === 'index.html' ? '' : ' | 00338'}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${p.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#C8102E">
<meta property="og:type" content="${p.article ? 'article' : 'website'}">
<meta property="og:site_name" content="00338 Number Lab">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/img/icon-192.png">
<link rel="manifest" href="${base}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&family=Noto+Serif+SC:wght@600;700&display=swap">
<link rel="stylesheet" href="${base}assets/css/style.css?v=${VERSION}">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar" role="note"><a href="${OUTREACH}" target="_blank" rel="noopener">Contact</a>, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership → <a href="${OUTREACH}" target="_blank" rel="noopener">web.works/contact</a></div>
${header(p)}
<main id="main">`;
}

function header(p) {
  const b = p.base;
  const items = NAV.map((n, i) => {
    if (!n.children) return `<li><a href="${b}${n.href}"${p.path === n.href ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
    return `<li><button class="dd" type="button" aria-expanded="false" aria-controls="sub${i}">${n.label} ▾</button><ul class="sub" id="sub${i}">${n.children.map(([l, h]) => `<li><a href="${b}${h}">${esc(l)}</a></li>`).join('')}</ul></li>`;
  }).join('');
  return `<header class="site-header"><div class="wrap nav">
<a class="brand" href="${b}index.html" aria-label="00338 Number Lab home"><span class="seal">吉</span><span><span class="name"><b>00</b>33<b>8</b></span><small>Number Lab</small></span></a>
<button class="icon-btn burger" type="button" aria-label="Menu" aria-expanded="false">☰</button>
<ul class="menu">${items}
<li><button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode" title="Light / dark"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></li>
<li><a class="cta" href="${b}get-a-lucky-number.html">Get a lucky number</a></li></ul>
</div></header>`;
}

function footer(p) {
  const b = p.base;
  return `</main>
<section class="section-alt" style="padding:36px 0"><div class="wrap" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
<div><b>Interested in this website, the 00338.com domain, sponsorship, advertising or a partnership?</b><div class="small muted">Serious enquiries are answered quickly.</div></div>
<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="${OUTREACH}" target="_blank" rel="noopener">Contact via web.works</a><a class="btn btn-ghost" href="${b}advertise.html">Media kit & rates</a></div>
</div></section>
<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><a class="brand" href="${b}index.html" style="color:#fff"><span class="seal">吉</span><span><span class="name" style="color:#fff"><b>00</b>33<b>8</b></span><small style="color:#A99C8F">Number Lab</small></span></a>
<p class="small" style="margin-top:12px">Decode the culture, sound and money behind Chinese numbers. Free tools, honest meanings, real data.</p>
<form class="newsletter" data-form="newsletter" data-subject="Newsletter signup" data-success="You're in! Your first Lucky Number of the Day arrives soon." novalidate>
<label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<input type="email" name="email" placeholder="Email for daily lucky numbers" aria-label="Email address" required>
<button class="btn btn-gold" type="submit">Join</button><div class="form-status" role="status"></div></form></div>
<div><h4>Tools</h4><ul><li><a href="${b}tools/number-decoder.html">Number Decoder</a></li><li><a href="${b}tools/lucky-phone-number-checker.html">Phone Checker</a></li><li><a href="${b}tools/lucky-license-plate-checker.html">Plate Checker</a></li><li><a href="${b}tools/numeric-domain-checker.html">Domain Checker</a></li><li><a href="${b}tools/lunar-calendar-converter.html">Lunar Calendar</a></li><li><a href="${b}tools/chinese-zodiac-calculator.html">Zodiac</a></li></ul></div>
<div><h4>Learn</h4><ul><li><a href="${b}learn/chinese-lucky-numbers-guide.html">Lucky numbers guide</a></li><li><a href="${b}learn/meaning-of-00338.html">Meaning of 00338</a></li><li><a href="${b}numbers/index.html">Number directory</a></li><li><a href="${b}zodiac/index.html">12 zodiac signs</a></li><li><a href="${b}videos.html">Videos</a></li></ul></div>
<div><h4>Work with us</h4><ul><li><a href="${b}get-a-lucky-number.html">Buy / sell lucky numbers</a></li><li><a href="${b}advertise.html">Advertise & sponsor</a></li><li><a href="${b}support.html">Support / donate</a></li><li><a href="${b}contests.html">Contests & prizes</a></li><li><a href="${b}careers.html">Careers</a></li><li><a href="${b}contact.html">Contact</a></li></ul></div>
<div><h4>Legal</h4><ul><li><a href="${b}about.html">About & methodology</a></li><li><a href="${b}privacy.html">Privacy & cookies</a></li><li><a href="${b}terms.html">Terms of use</a></li><li><a href="${b}disclaimer.html">Trademark & copyright</a></li><li><a href="#" data-open-consent>Cookie settings</a></li><li><a href="${b}sitemap.html">Sitemap</a></li></ul></div>
</div>
<div class="legal">© <span data-year>2026</span> 00338.com — 00338 Number Lab. Content is for cultural and entertainment reference only; not financial, legal or investment advice. "00338" is used here as a number, not a trademark; we are not affiliated with any company, exchange or brand whose identifiers contain the same digits. Third-party names and marks belong to their owners. <a href="${b}disclaimer.html">Full disclosure</a>.</div>
</div></footer>
<div class="consent" role="dialog" aria-label="Cookie consent"><b>Cookies & ads</b><p class="small" style="margin:.4em 0 0">We use cookies for analytics and Google AdSense ads that keep this site free. Choose "Accept all" for personalised ads, or "Essential only" for non-personalised ads. <a href="${b}privacy.html">Privacy policy</a>.</p><div class="btns"><button class="btn btn-primary" data-consent="all" type="button">Accept all</button><button class="btn btn-ghost" data-consent="essential" type="button">Essential only</button></div></div>
<a class="btn btn-primary sticky-cta" href="${b}get-a-lucky-number.html">🧧 Get a lucky number</a>
<script src="${b}assets/js/config.js?v=${VERSION}"></script>
${p.tools ? `<script>window.NOTABLE_NUMBERS=${JSON.stringify(D.NOTABLE)};window.ZODIAC_DATA=${JSON.stringify(D.ZODIAC.map((z) => ({ glyph: z.glyph, traits: z.traits, lucky: z.lucky, colors: z.colors, best: z.best })))};window.LIFE_PATH=${JSON.stringify(D.LIFE_PATH)};</script>
<script src="${b}assets/js/engine.js?v=${VERSION}"></script><script src="${b}assets/js/tools.js?v=${VERSION}" defer></script>` : ''}
<script src="${b}assets/js/app.js?v=${VERSION}" defer></script>
</body></html>`;
}

const ad = (slot, extra = '') => `<div class="ad-slot ${extra}" data-slot="${slot}" aria-label="Advertisement"><span class="ad-label">Advertisement</span><span>Ad space · <a href="__BASE__advertise.html">advertise here</a></span></div>`;

function page(p, body) {
  p.base = '../'.repeat(p.path.split('/').length - 1) || './';
  let html = head(p) + body.replace(/__BASE__/g, p.base) + footer(p);
  if (p.path === '404.html') html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<script>document.write(\'<base href="\' + (location.pathname.indexOf(\'/00338-com/\') === 0 ? \'/00338-com/\' : \'/\') + \'">\')</script>').replace('<a class="btn btn-primary" href="/">Go home</a>', '<a class="btn btn-primary" href="index.html">Go home</a>');
  write(p.path, html.replace(/__BASE__/g, p.base));
  if (!p.noindex) pages.push({ path: p.path, pri: p.pri || 0.6 });
}
const crumbsHtml = (c) => `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="__BASE__index.html">Home</a>${c.map(([n, h], i) => ' / ' + (i === c.length - 1 ? `<span>${esc(n)}</span>` : `<a href="__BASE__${h}">${esc(n)}</a>`)).join('')}</nav>`;

// ---------------------------------------------------------------- reusable blocks
function decoderWidget(opts = {}) {
  const ctx = opts.context || 'general', val = opts.value || '';
  const ph = { phone: 'e.g. 138 8888 1688', plate: 'e.g. 2288 or AB 1688', domain: 'e.g. 518 (for 518.com)', general: 'Type any number…' }[ctx] || 'Type any number…';
  const r = val ? E.analyze(val) : null;
  return `<div class="decoder" data-tool="decoder" data-context="${ctx}">
<form role="search" aria-label="Decode a number"><div class="decoder-input"><input name="n" inputmode="numeric" autocomplete="off" placeholder="${ph}" value="${esc(val)}" aria-label="Number to decode" maxlength="40"><button class="btn btn-primary" type="submit">Decode</button></div></form>
<div style="margin-top:12px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div class="seg" role="group" aria-label="Dialect"><button type="button" data-dialect="both" aria-pressed="true">Blended</button><button type="button" data-dialect="mandarin" aria-pressed="false">Mandarin</button><button type="button" data-dialect="cantonese" aria-pressed="false">Cantonese</button></div><span class="small muted">Free · instant · no sign-up</span></div>
<div class="result" aria-live="polite">${r ? '' : '<p class="muted small" style="margin:14px 0 0">Every digit, combo and pattern — scored in Mandarin & Cantonese.</p>'}</div>
</div>`;
}

function leadInline() {
  return `<div class="callout gold" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:space-between"><div><b>Want a number like this for yourself?</b><div class="small">We source lucky phone numbers, plates and numeric domains — or appraise yours. Free quote in 24h.</div></div><a class="btn btn-primary" href="__BASE__get-a-lucky-number.html">Get my free quote</a></div>`;
}

function leadSection(title = 'Own a luckier number — or cash in on yours') {
  return `<section id="lead"><div class="wrap"><div class="lead reveal"><div class="lead-grid">
<div><span class="eyebrow" style="color:var(--gold)">Lucky Number Desk</span><h2>${title}</h2>
<p class="muted">Tell us what you need. A specialist replies within 24 hours with options, prices or a valuation — no obligation.</p>
<ul class="ticks"><li>Lucky phone numbers (靓号) & business lines</li><li>Personalised & auction licence plates</li><li>Numeric & premium domain names — buy, sell, appraise</li><li>Business-name, date & number consultations</li></ul>
<div class="trust"><span>🔒 Private — details never shared</span><span>⏱ 24-hour reply</span><span>🤝 Escrow-friendly</span></div></div>
${leadForm()}
</div></div></div></section>`;
}

function leadForm() {
  return `<form class="card" data-form="lead" data-steps data-subject="Lucky Number Desk lead" data-success="Thank you! Your request is in — expect a reply within 24 hours." novalidate>
<div class="steps" aria-hidden="true"><span></span><span></span><span></span></div>
<label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<div data-step><p style="font-weight:700;margin-bottom:8px">1. What can we help with?</p>
<div class="intent">
<label><input type="radio" name="intent" value="phone" required> 📱 Lucky phone number</label>
<label><input type="radio" name="intent" value="plate"> 🚗 Licence plate</label>
<label><input type="radio" name="intent" value="domain"> 🌐 Numeric domain</label>
<label><input type="radio" name="intent" value="sell"> 💰 Sell / appraise mine</label>
<label><input type="radio" name="intent" value="consult"> 🧭 Consultation</label>
<label><input type="radio" name="intent" value="report"> 📜 Personal number report</label>
</div>
<div class="field"><label for="lf-num">Number / pattern you have in mind <span class="muted small">(optional)</span></label><input id="lf-num" name="number" placeholder="e.g. ends in 8888, or 00338.com"></div>
<button class="btn btn-primary btn-block" type="button" data-next>Continue →</button></div>
<div data-step hidden><p style="font-weight:700;margin-bottom:8px">2. A few details</p>
<div class="row"><div class="field"><label for="lf-budget">Budget (USD)</label><select id="lf-budget" name="budget"><option>Under $500</option><option>$500 – $2,000</option><option>$2,000 – $10,000</option><option>$10,000 – $50,000</option><option>$50,000+</option><option>Selling — tell me the value</option></select></div>
<div class="field"><label for="lf-region">Region / market</label><select id="lf-region" name="region"><option>Hong Kong</option><option>Mainland China</option><option>Taiwan</option><option>Singapore / Malaysia</option><option>USA / Canada</option><option>UK / Europe</option><option>Australia / NZ</option><option>Other</option></select></div></div>
<div class="field"><label for="lf-time">Timeline</label><select id="lf-time" name="timeline"><option>This week</option><option>This month</option><option>1–3 months</option><option>Just researching</option></select></div>
<div class="field"><label for="lf-msg">Anything else?</label><textarea id="lf-msg" name="message" placeholder="Occasion, preferred digits, dialect, brand name…"></textarea></div>
<div style="display:flex;gap:8px"><button class="btn btn-ghost" type="button" data-prev>← Back</button><button class="btn btn-primary" style="flex:1" type="button" data-next>Continue →</button></div></div>
<div data-step hidden><p style="font-weight:700;margin-bottom:8px">3. Where should we send options?</p>
<div class="row"><div class="field"><label for="lf-name">Name</label><input id="lf-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="lf-email">Email</label><input id="lf-email" type="email" name="email" autocomplete="email" required></div></div>
<div class="field"><label for="lf-wa">WhatsApp / WeChat / phone <span class="muted small">(optional, faster)</span></label><input id="lf-wa" name="contact_phone" autocomplete="tel"></div>
<label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted about this request. See our <a href="__BASE__privacy.html">privacy policy</a>.</label>
<div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" type="button" data-prev>← Back</button><button class="btn btn-primary" style="flex:1" type="submit">Get my free options</button></div>
<p class="form-note" style="margin-top:8px">No spam. One reply, then only if you ask.</p></div>
<div class="form-status" role="status"></div>
</form>`;
}

const faqHtml = (faq) => `<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p style="margin:.6em 0 0">${a}</p></details>`).join('')}</section>`;

function aside(extra = '') {
  return `<aside class="aside">
<div class="card"><h3>Decode any number</h3><form action="__BASE__tools/number-decoder.html" method="get"><div class="field"><input name="n" inputmode="numeric" placeholder="e.g. 168" aria-label="Number"></div><button class="btn btn-primary btn-block">Decode</button></form></div>
${extra}
${ad('sidebar', 'tall')}
<div class="card"><h3>🧧 Lucky Number Desk</h3><p class="small">Buy, sell or appraise lucky phone numbers, plates and domains.</p><a class="btn btn-gold btn-block" href="__BASE__get-a-lucky-number.html">Free quote</a></div>
<div class="card"><h3>Support free tools</h3><p class="small">Keep 00338 ad-light and independent.</p><a class="btn btn-ghost btn-block" href="__BASE__support.html">Send a red packet</a></div>
</aside>`;
}

function tableFrom(rows, cols) {
  return `<table><thead><tr>${cols.map((c) => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td${c[2] ? ' class="mono"' : ''}>${esc(r[c[1]] || '—')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

// ---------------------------------------------------------------- HOME
function home() {
  const digitGrid = '0123456789'.split('').map((d) => { const x = E.DIGITS[d]; const cls = x.m + x.c > 1 ? 'lucky' : x.m + x.c < -1 ? 'unlucky' : ''; return `<a class="${cls}" href="numbers/${d}.html"><div><b>${d}</b><span>${x.han} · ${esc(x.key)}</span></div></a>`; }).join('');
  const zod = D.ZODIAC.map((z) => `<a href="zodiac/${z.animal.toLowerCase()}.html"><span class="glyph">${z.glyph}</span><span>${z.animal}</span></a>`).join('');
  const tools = [
    ['🔢', 'Number Decoder', 'Any digits → meaning, score, combos.', 'tools/number-decoder.html'],
    ['📱', 'Phone Number Checker', 'Score your mobile or business line.', 'tools/lucky-phone-number-checker.html'],
    ['🚗', 'Licence Plate Checker', 'HK-style plate luck in seconds.', 'tools/lucky-license-plate-checker.html'],
    ['🌐', 'Numeric Domain Checker', 'How Chinese buyers read your .com.', 'tools/numeric-domain-checker.html'],
    ['🎲', 'Lucky Number Generator', 'Generate high-scoring numbers.', 'tools/lucky-number-generator.html'],
    ['📅', 'Lucky Date Picker', 'Best dates for weddings & launches.', 'tools/lucky-date-picker.html'],
    ['🌙', 'Lunar Calendar Converter', 'Western ↔ Chinese dates, 1900–2100.', 'tools/lunar-calendar-converter.html'],
    ['🐉', 'Zodiac Calculator', 'Your sign, element & best matches.', 'tools/chinese-zodiac-calculator.html']
  ].map(([i, t, d, h]) => `<a class="card reveal" href="${h}"><div class="kicker">${i}</div><h3>${t}</h3><p class="small muted" style="margin:0">${d}</p></a>`).join('');
  const arts = ARTICLES.slice(0, 6).map((a) => `<a class="card reveal" href="learn/${a.slug}.html"><span class="pill">${esc(a.cat)}</span><h3 style="margin-top:10px">${esc(a.short)}</h3><p class="small muted" style="margin:0">${esc(a.desc)}</p></a>`).join('');
  const body = `
<section class="hero"><div class="wrap hero-grid">
<div><span class="eyebrow">Chinese number meanings · 数字吉凶</span>
<h1>Every number <span style="color:var(--red)">speaks.</span><br>Decode what yours says.</h1>
<p class="lede">Instant meanings for phone numbers, licence plates, prices, dates and domains — in Mandarin <em>and</em> Cantonese — backed by real auction data.</p>
<div class="stats"><div><b>10</b><span>digits decoded</span></div><div><b>30+</b><span>famous combos</span></div><div><b>HK$26M</b><span>record plate price</span></div><div><b>2</b><span>dialects compared</span></div></div>
</div>
${decoderWidget({ value: '' })}
</div></section>
${ad('top')}
<section><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap"><div><span class="eyebrow">Start here</span><h2>Tap a digit</h2></div><a href="numbers/index.html">Full number directory →</a></div>
<div class="digit-grid reveal" style="margin-top:14px">${digitGrid}</div></div></section>
<section class="section-alt"><div class="wrap"><span class="eyebrow">Free tools</span><h2>Everything numbers, in one lab</h2><div class="grid g4" style="margin-top:18px">${tools}</div></div></section>
${leadSection()}
<section><div class="wrap"><div class="grid g2" style="align-items:center">
<div class="reveal"><span class="eyebrow">Why 00338?</span><h2>00 · 33 · 8 — a number with a story</h2><p>00 is China's international dialling prefix and the nickname of its post-2000 generation. In Cantonese, 3-3-8 reads <b>生生发</b> — "grow, grow, prosper". It's also a Hong Kong stock code. We built an independent lab to decode numbers like it — honestly, including the catch.</p><a class="btn btn-ghost" href="learn/meaning-of-00338.html">Read the story</a></div>
<div class="card reveal" style="text-align:center"><div class="num-hero">00338</div><p class="muted" style="margin:.5em 0 0">生生发 · saang saang faat</p><div class="related" style="justify-content:center;margin-top:14px"><a href="tools/number-decoder.html?n=00338">Decode it</a><a href="numbers/338.html">338</a><a href="numbers/00.html">00</a><a href="numbers/38.html">38</a></div></div>
</div></div></section>
<section class="section-alt"><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap"><div><span class="eyebrow">Chinese zodiac · 生肖</span><h2>Find your animal & lucky numbers</h2></div><a href="tools/chinese-zodiac-calculator.html">Zodiac calculator →</a></div>
<div class="zodiac-grid reveal" style="margin-top:14px">${zod}</div></div></section>
<section><div class="wrap"><span class="eyebrow">Money & culture</span><h2>What luck is worth</h2>
<div class="grid g3" style="margin-top:14px">
<div class="card reveal"><div class="kicker mono" style="color:var(--red)">HK$18.1M</div><b>Plate "28"</b><p class="small muted">易发 "easy prosperity" in Cantonese — Hong Kong, 2016.</p></div>
<div class="card reveal"><div class="kicker mono" style="color:var(--red)">¥2.33M</div><b>Phone 8888 8888</b><p class="small muted">Chengdu, 2003 — the number that made headlines.</p></div>
<div class="card reveal"><div class="kicker mono" style="color:var(--red)">~48%</div><b>of 3-digit .coms</b><p class="small muted">held by Chinese owners in 2015 (NamePros data).</p></div>
</div></div></section>
${ad('inArticle')}
<section class="section-alt"><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap"><div><span class="eyebrow">Watch</span><h2>Numbers on video</h2></div><a href="videos.html">All videos →</a> <a class="btn btn-primary" data-yt-channel hidden target="_blank" rel="noopener">▶ Subscribe on YouTube</a></div>
<div class="grid g3" style="margin-top:14px" data-videos="3"></div></div></section>
<section><div class="wrap"><span class="eyebrow">Learn</span><h2>Guides & data</h2><div class="grid g3" style="margin-top:14px">${arts}</div></div></section>
<section><div class="wrap" style="max-width:860px">${faqHtml(ARTICLES[0].faq)}</div></section>
<section class="section-alt"><div class="wrap grid g3">
<div class="card reveal"><span class="eyebrow">Contest</span><h3 data-contest-name>Luckiest Number Hunt</h3><p class="small">Share the luckiest number you've spotted — plate, receipt, phone, price. Cash prizes every month.</p><div class="countdown" data-countdown style="margin:12px 0"></div><a class="btn btn-primary" href="contests.html">Enter free</a></div>
<div class="card reveal"><span class="eyebrow">Support</span><h3>Send a red packet 🧧</h3><p class="small">Fund free tools, prizes, promotion and new hires.</p><div data-goal></div><a class="btn btn-gold" href="support.html">Support 00338</a></div>
<div class="card reveal"><span class="eyebrow">Partners</span><h3>Advertise & sponsor</h3><p class="small">Reach buyers of lucky numbers, feng shui, weddings, travel and Asia-focused brands.</p><a class="btn btn-ghost" href="advertise.html">See rates</a> <a class="btn btn-ghost" href="careers.html">We're hiring</a></div>
</div></section>`;
  page({ path: 'index.html', title: '00338 Number Lab — Chinese Lucky Number Meanings, Decoder & Tools', desc: 'Decode any number in Chinese culture: meanings of 0–9, lucky combos like 168 and 520, phone, plate and domain checkers, lunar calendar and zodiac tools.', tools: true, pri: 1.0, faq: ARTICLES[0].faq }, body);
}

// ---------------------------------------------------------------- TOOLS
const TOOL_PAGES = [
  { slug: 'number-decoder', name: 'Chinese Number Decoder', h1: 'Chinese Number Meaning Decoder', desc: 'Type any number to see what it means in Chinese culture — digit by digit, combos, patterns and a lucky score in Mandarin and Cantonese.', icon: '🔢', widget: () => decoderWidget({ context: 'general' }),
    how: '<p>The decoder reads each digit by its Chinese homophone, detects famous combinations (168, 520, 1314, 250…), spots patterns (repeats, sequences, palindromes) and weights the ending more heavily — just like buyers of phone numbers and plates do. Switch between Mandarin, Cantonese or a blended view.</p>' },
  { slug: 'lucky-phone-number-checker', name: 'Lucky Phone Number Checker', h1: 'Lucky Phone Number Checker (靓号)', desc: 'Check how lucky your mobile or business phone number is in Chinese numerology — last-4 analysis, combos and dialect scores.', icon: '📱', widget: () => decoderWidget({ context: 'phone' }),
    how: '<p>Paste your full number (spaces and + are fine). The last four digits carry most of the perceived value, so they are weighted most. Numbers ending in 8, 88, 168 or 8888 score highest; 4, 14 and 74 endings score lowest.</p>' },
  { slug: 'lucky-license-plate-checker', name: 'Licence Plate Checker', h1: 'Lucky Licence Plate Checker', desc: 'Check the luck of a car licence plate number — Hong Kong-style plate numerology with Cantonese readings and auction context.', icon: '🚗', widget: () => decoderWidget({ context: 'plate' }),
    how: '<p>Letters are ignored; the digits are scored with extra weight on Cantonese readings (Hong Kong) if you choose. Single-digit and two-digit plates like 8, 18, 28 and 88 have sold for tens of millions of HK dollars.</p>' },
  { slug: 'numeric-domain-checker', name: 'Numeric Domain Checker', h1: 'Numeric Domain Name Checker', desc: 'See how Chinese buyers read a numeric domain name: digit meanings, patterns, 4-avoidance and a luck score.', icon: '🌐', widget: () => decoderWidget({ context: 'domain' }),
    how: '<p>Enter the digits of your domain (e.g. 518 for 518.com). Short, 4-free names with 8/6/9 and meaningful combos appeal most to Chinese end-users and investors.</p>' },
  { slug: 'lucky-number-generator', name: 'Lucky Number Generator', h1: 'Lucky Number Generator', desc: 'Generate lucky numbers that score high in Chinese numerology — set length, required digits and avoid 4.', icon: '🎲',
    widget: () => `<div class="decoder" data-tool="generator"><form><div class="row"><div class="field"><label for="g-len">Length</label><input id="g-len" name="len" type="number" min="2" max="12" value="4"></div><div class="field"><label for="g-count">How many</label><input id="g-count" name="count" type="number" min="1" max="20" value="8"></div></div><div class="field"><label for="g-must">Must include digits (optional)</label><input id="g-must" name="must" inputmode="numeric" placeholder="e.g. 168"></div><label class="check"><input type="checkbox" name="mustEnd" checked> Put them at the end</label><label class="check"><input type="checkbox" name="avoid4" checked> Avoid 4</label><button class="btn btn-primary btn-block" style="margin-top:12px">Generate</button></form><div class="out"></div></div>`,
    how: '<p>Digits are drawn with weights favouring 8, 6 and 9, then every candidate is scored by the decoder and only numbers scoring 70+ are kept.</p>' },
  { slug: 'lucky-date-picker', name: 'Lucky Date Picker', h1: 'Lucky Date Picker for Weddings, Moves & Launches', desc: 'Find auspicious dates by Chinese number symbolism and the lunar calendar — for weddings, moving house, business openings and launches.', icon: '📅',
    widget: () => `<div class="decoder" data-tool="dates"><form><div class="row"><div class="field"><label for="d-from">From</label><input id="d-from" name="from" type="date"></div><div class="field"><label for="d-span">Search window</label><select id="d-span" name="span"><option value="30">30 days</option><option value="90" selected>90 days</option><option value="180">6 months</option><option value="365">1 year</option></select></div></div><div class="field"><label for="d-p">Occasion</label><select id="d-p" name="purpose"><option value="wedding">Wedding</option><option value="moving">Moving house</option><option value="business">Business opening / launch</option><option value="travel">Travel</option></select></div><button class="btn btn-primary btn-block">Find lucky dates</button></form><div class="out"></div></div>`,
    how: '<p>Dates are ranked by the luck of their digits (YYYYMMDD), day-of-month digits, new-moon and full-moon lunar days, and occasion rules (e.g. Ghost Month is penalised for weddings and moves; 20 May gets a love bonus).</p>' },
  { slug: 'lunar-calendar-converter', name: 'Lunar Calendar Converter', h1: 'Chinese Lunar Calendar Converter', desc: 'Convert Western (Gregorian) dates to the Chinese lunar calendar and back, with leap months, stem-branch year name and zodiac.', icon: '🌙',
    widget: () => `<div class="decoder" data-tool="lunar"><h3>Western → Lunar</h3><form class="to-lunar"><div class="decoder-input"><input type="date" name="date" aria-label="Date"><button class="btn btn-primary">Convert</button></div></form><div class="out1" style="margin-top:12px"></div><h3 style="margin-top:18px">Lunar → Western</h3><form class="to-solar"><div class="row"><div class="field"><label for="ly">Lunar year</label><input id="ly" name="y" type="number" value="2026" min="1901" max="2099"></div><div class="field"><label for="lm">Month</label><input id="lm" name="m" type="number" value="8" min="1" max="12"></div></div><div class="row"><div class="field"><label for="ld">Day</label><input id="ld" name="d" type="number" value="15" min="1" max="30"></div><div class="field" style="align-self:end"><label class="check"><input type="checkbox" name="leap"> Leap month (闰月)</label></div></div><button class="btn btn-primary btn-block">Convert</button></form><div class="out2" style="margin-top:12px"></div></div>`,
    how: '<p>Conversions use your browser\'s built-in Chinese calendar (Unicode CLDR / ICU), which follows the astronomical rules used for the official calendar. Today\'s lunar date loads automatically.</p>' },
  { slug: 'chinese-zodiac-calculator', name: 'Chinese Zodiac Calculator', h1: 'Chinese Zodiac Calculator & Compatibility', desc: 'Find your Chinese zodiac animal, element and lucky numbers from your birth date — with the Lunar New Year cut-off — plus a compatibility check.', icon: '🐉',
    widget: () => `<div class="decoder" data-tool="zodiac"><form><div class="row"><div class="field"><label for="zy">Birth year</label><input id="zy" name="y" type="number" min="1901" max="2099" value="1990" required></div><div class="field"><label for="zm">Month</label><select id="zm" name="m">${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => `<option value="${i + 1}">${m}</option>`).join('')}</select></div></div><div class="field"><label for="zd">Day</label><input id="zd" name="d" type="number" min="1" max="31" value="15"></div><button class="btn btn-primary btn-block">Find my sign</button></form><div class="out"></div></div>
<div class="decoder" data-tool="compat" style="margin-top:18px"><h3>Compatibility</h3><form><div class="row"><div class="field"><label for="ca">Sign A</label><select id="ca" name="a">${E.ANIMALS.map((a, i) => `<option value="${i}">${a}</option>`).join('')}</select></div><div class="field"><label for="cb">Sign B</label><select id="cb" name="b">${E.ANIMALS.map((a, i) => `<option value="${i}"${i === 4 ? ' selected' : ''}>${a}</option>`).join('')}</select></div></div><button class="btn btn-primary btn-block">Check match</button></form><div class="out"></div></div>`,
    how: '<p>Your animal is based on the <em>lunar</em> year, which starts at Lunar New Year (late January to mid-February). If you were born in January or early February, you may belong to the previous year\'s animal — the calculator handles that for you. Compatibility uses the traditional trines (三合), secret friends (六合) and clashes (六冲).</p>' },
  { slug: 'numerology-calculator', name: 'Numerology Calculator', h1: 'Numerology Calculator: Life Path & Name Number', desc: 'Calculate your life path number and name (expression) number, with master numbers 11, 22 and 33.', icon: '✨',
    widget: () => `<div class="decoder" data-tool="numerology"><form><div class="row"><div class="field"><label for="nd">Date of birth</label><input id="nd" type="date" name="dob" required value="1990-08-08"></div><div class="field"><label for="nn">Full name (optional)</label><input id="nn" name="name" placeholder="e.g. Alex Chan"></div></div><button class="btn btn-primary btn-block">Calculate</button></form><div class="out"></div></div>`,
    how: '<p>Western (Pythagorean) numerology: the life path reduces your birth date to one digit (keeping master numbers 11, 22, 33); the name number maps letters A–Z to 1–9. We include it alongside Chinese symbolism because many visitors compare both.</p>' },
  { slug: 'hk-stock-code-decoder', name: 'HK Stock Code Decoder', h1: 'Hong Kong Stock Code Number Decoder', desc: 'Read any five-digit Hong Kong stock code through Chinese number symbolism. Culture only — not investment advice.', icon: '📈',
    widget: () => `<div class="decoder" data-tool="stock"><form><div class="decoder-input"><input name="code" inputmode="numeric" placeholder="e.g. 00338 or 5" aria-label="Stock code" maxlength="5"><button class="btn btn-primary">Decode</button></div></form><div class="result" aria-live="polite"></div></div>`,
    how: '<p>Codes are padded to five digits and decoded like any number. We deliberately show no company names, prices or recommendations — symbolism says nothing about a business. For company filings use HKEXnews.</p>' }
];

function tools() {
  TOOL_PAGES.forEach((t, i) => {
    const others = TOOL_PAGES.filter((x) => x !== t).slice(0, 6).map((x) => `<a class="card" href="${x.slug}.html"><div class="kicker">${x.icon}</div><b>${x.name}</b></a>`).join('');
    const faq = [
      [`Is the ${t.name} free?`, 'Yes — free, instant and no sign-up. It runs entirely in your browser.'],
      ['How accurate is it?', 'It encodes widely shared cultural readings (homophones, famous combos, dialect differences). Luck is cultural, not scientific — use results as guidance and for fun.'],
      ['Can you find me a number like this?', 'Yes. Our Lucky Number Desk sources phone numbers, plates and domains, and appraises numbers you own. <a href="../get-a-lucky-number.html">Request a free quote</a>.']
    ];
    const crumbs = [['Tools', 'tools/index.html'], [t.name, 'tools/' + t.slug + '.html']];
    const body = `<div class="wrap">${crumbsHtml(crumbs)}<div class="layout"><article>
<h1>${t.icon} ${esc(t.h1)}</h1><p class="lede muted" style="font-size:1.1rem">${esc(t.desc)}</p>
${t.widget()}
${ad('inArticle')}
<div class="prose"><h2>How it works</h2>${t.how}</div>
${leadInline()}
${faqHtml(faq)}
<h2 style="margin-top:1.5em">More tools</h2><div class="grid g3">${others}</div>
</article>${aside()}</div></div>${leadSection()}`;
    page({ path: 'tools/' + t.slug + '.html', title: t.h1 + ' — Free Online Tool', desc: t.desc, tools: true, crumbs: crumbs.map(([n, h]) => [n, h]), faq, pri: 0.9,
      ld: { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, url: SITE + '/tools/' + t.slug + '.html' } }, body);
  });
  const cards = TOOL_PAGES.map((t) => `<a class="card reveal" href="${t.slug}.html"><div class="kicker">${t.icon}</div><h3>${t.name}</h3><p class="small muted" style="margin:0">${esc(t.desc)}</p></a>`).join('');
  page({ path: 'tools/index.html', title: 'Free Chinese Number, Zodiac & Calendar Tools', desc: 'All 00338 tools: number decoder, phone, plate and domain checkers, lucky number generator, lucky date picker, lunar converter, zodiac and numerology calculators.', crumbs: [['Tools', 'tools/index.html']], pri: 0.9 },
    `<div class="wrap">${crumbsHtml([['Tools', 'tools/index.html']])}<h1>Free tools</h1><p class="muted">Ten instant tools. No sign-up, no install — they run in your browser.</p><div class="grid g3">${cards}</div>${ad('inArticle')}</div>${leadSection()}`);
}

// ---------------------------------------------------------------- NUMBER PAGES
function numberList() {
  const list = [];
  for (let i = 0; i < 100; i++) list.push(String(i));
  D.NOTABLE.forEach((n) => { if (!list.includes(n)) list.push(n); });
  return list;
}
function numberPages() {
  const list = numberList();
  list.forEach((n, idx) => {
    const r = E.analyze(n), rm = E.analyze(n, { dialect: 'mandarin' }), rc = E.analyze(n, { dialect: 'cantonese' });
    const note = D.NOTES[n];
    const prev = list[idx - 1], next = list[idx + 1];
    const digitRows = [...new Set(n.split(''))].map((d) => { const x = E.DIGITS[d]; return `<tr><td class="mono"><b>${d}</b></td><td>${x.han} ${x.py}</td><td>${x.jp}</td><td>${esc(x.sound)}</td></tr>`; }).join('');
    const combos = r.combos.map((c) => `<div class="combo ${c.score > 0 ? 'pos' : c.score < 0 ? 'neg' : ''}"><b class="mono">${c.combo}</b> — ${esc(c.text)}</div>`).join('') || '<p class="muted">No famous combination — the meaning comes from the individual digits.</p>';
    const verdictWord = r.score >= 68 ? 'lucky' : r.score >= 48 ? 'neutral-to-mixed' : 'unlucky';
    const uses = [];
    if (r.score >= 68) uses.push(`<li><b>Phone endings & prices:</b> ${n} works well for Chinese-speaking customers.</li>`, `<li><b>Gifts & red packets:</b> ${n.length <= 4 ? `an amount of ${n} sends a positive message` : 'use its lucky ending for amounts'}.</li>`);
    else if (r.score >= 48) uses.push(`<li><b>Everyday use:</b> ${n} is fine for most purposes; it won't impress or offend.</li>`, `<li><b>Branding:</b> test with your audience's dialect — Mandarin ${rm.score}/100 vs Cantonese ${rc.score}/100.</li>`);
    else uses.push(`<li><b>Avoid</b> ${n} for prices, gifts, wedding dates and business numbers aimed at Chinese-speaking audiences.</li>`, `<li><b>Already have it?</b> Context matters — a lucky ending or a romantic combo can soften it.</li>`);
    const near = [];
    for (const d of [-2, -1, 1, 2]) { const v = String(+n + d); if (/^\d+$/.test(n) && n.length < 9 && +n + d >= 0 && list.includes(v) && v !== n) near.push(v); }
    const featured = ['8', '88', '168', '518', '520', '888', '1314', '8888', '4', '250', '00338', '666'].filter((x) => x !== n);
    const related = [...new Set([...near, ...featured])].slice(0, 12).map((v) => `<a href="${v}.html">${v}</a>`).join('');
    const faq = [
      [`Is ${n} a lucky number in Chinese culture?`, `${E.summary(r)} Overall it reads as ${verdictWord}.`],
      [`How do you say ${n} in Chinese?`, `${r.reading.han} — Mandarin: ${r.reading.pinyin}; Cantonese (Jyutping): ${r.reading.jyutping}.`],
      [`Is ${n} luckier in Cantonese or Mandarin?`, `Mandarin score ${rm.score}/100, Cantonese score ${rc.score}/100, blended ${r.score}/100.`]
    ];
    const crumbs = [['Numbers', 'numbers/index.html'], [n, 'numbers/' + n + '.html']];
    const body = `<div class="wrap">${crumbsHtml(crumbs)}<div class="layout"><article>
<div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap"><div class="num-hero">${n}</div><div><h1 style="margin:0;font-size:clamp(1.6rem,3.5vw,2.4rem)">Meaning of ${n} in Chinese culture</h1><div class="mono muted" style="font-size:1.1rem">${r.reading.han} · ${r.reading.pinyin}</div></div></div>
<div class="answer-box" style="margin-top:18px"><b>Quick answer:</b> ${esc(E.summary(r))} ${note ? esc(note) : ''}</div>
<div class="grid g3" style="margin:12px 0 20px"><div class="card" style="text-align:center"><div class="small muted">Blended</div><div class="mono" style="font:800 2rem var(--mono)">${r.score}</div><div class="tier t-${r.tier.k}" style="font-size:.95rem">${r.tier.label}</div></div><div class="card" style="text-align:center"><div class="small muted">Mandarin</div><div class="mono" style="font:800 2rem var(--mono)">${rm.score}</div><div class="tier t-${rm.tier.k}" style="font-size:.95rem">${rm.tier.label}</div></div><div class="card" style="text-align:center"><div class="small muted">Cantonese</div><div class="mono" style="font:800 2rem var(--mono)">${rc.score}</div><div class="tier t-${rc.tier.k}" style="font-size:.95rem">${rc.tier.label}</div></div></div>
<div class="prose">
<h2>Digit by digit</h2><table><thead><tr><th>Digit</th><th>Mandarin</th><th>Cantonese</th><th>Sounds like / meaning</th></tr></thead><tbody>${digitRows}</tbody></table>
<h2>Combinations inside ${n}</h2>${combos}
${r.patterns.length ? `<h2>Patterns</h2><ul>${r.patterns.map((p) => `<li><b>${esc(p.name)}:</b> ${esc(p.t)}</li>`).join('')}</ul>` : ''}
${ad('inArticle')}
<h2>How to use ${n}</h2><ul>${uses.join('')}${r.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
</div>
<h2>Try your own number</h2>${decoderWidget({ value: n })}
${leadInline()}
${faqHtml(faq)}
<h2 style="margin-top:1.4em">Related numbers</h2><div class="related">${related}</div>
<div class="pager">${prev ? `<a class="btn btn-ghost" href="${prev}.html">← ${prev}</a>` : '<span></span>'}<a class="btn btn-ghost" href="index.html">All numbers</a>${next ? `<a class="btn btn-ghost" href="${next}.html">${next} →</a>` : '<span></span>'}</div>
</article>${aside()}</div></div>`;
    page({ path: 'numbers/' + n + '.html', title: `${n} Meaning in Chinese — Lucky or Unlucky? (${r.score}/100)`, desc: `What does ${n} mean in Chinese culture? ${E.summary(r)} Mandarin vs Cantonese readings, combos and how to use it.`.slice(0, 300), tools: true, crumbs, faq, pri: n.length <= 1 || D.NOTES[n] ? 0.8 : 0.5 }, body);
  });
  // index
  const cell = (n) => { const r = E.analyze(n); return `<a href="${n}.html" title="${r.score}/100 — ${esc(r.tier.label)}" style="border-color:${r.score >= 68 ? 'color-mix(in srgb,var(--jade) 45%,var(--line))' : r.score < 48 ? 'color-mix(in srgb,var(--bad) 45%,var(--line))' : 'var(--line)'}">${n}</a>`; };
  const body = `<div class="wrap">${crumbsHtml([['Numbers', 'numbers/index.html']])}<h1>Chinese number directory</h1><p class="muted">Every number from 0 to 99 plus the famous combinations. Green borders are lucky, red are unlucky. Can't find yours? <a href="../tools/number-decoder.html">Decode any number</a>.</p>
<h2>Single digits</h2><div class="related">${list.slice(0, 10).map(cell).join('')}</div>
<h2 style="margin-top:1.2em">10 – 99</h2><div class="related">${list.slice(10, 100).map(cell).join('')}</div>
${ad('inArticle')}
<h2>Famous combinations</h2><div class="related">${list.slice(100).map(cell).join('')}</div></div>${leadSection()}`;
  page({ path: 'numbers/index.html', title: 'Chinese Number Meanings Directory (0–99 & Famous Combos)', desc: 'Browse the meaning of every number from 0 to 99 and famous Chinese number combinations like 168, 520, 1314, 888 and 5201314.', crumbs: [['Numbers', 'numbers/index.html']], pri: 0.9 }, body);
}

// ---------------------------------------------------------------- ZODIAC
function lunarNewYear(y) {
  const f = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: 'UTC', month: 'numeric', day: 'numeric' });
  for (let d = new Date(Date.UTC(y, 0, 15, 12)); d.getUTCMonth() < 2; d.setUTCDate(d.getUTCDate() + 1)) {
    const p = f.formatToParts(d); const m = p.find((x) => x.type === 'month').value, day = p.find((x) => x.type === 'day').value;
    if (m === '1' && day === '1') return d.toISOString().slice(0, 10);
  }
  return '';
}
function zodiac() {
  D.ZODIAC.forEach((z, i) => {
    const years = []; for (let y = 1924; y <= 2031; y++) if (((y - 4) % 12 + 12) % 12 === i) years.push(y);
    const rows = years.map((y) => { const zz = E.zodiacForLunarYear(y); return `<tr><td class="mono">${y}</td><td>${zz.yin ? 'Yin' : 'Yang'} ${zz.element}</td><td class="mono">${lunarNewYear(y)}</td></tr>`; }).join('');
    const clash = D.ZODIAC[(i + 6) % 12].animal;
    const faq = [
      [`What are the lucky numbers for the ${z.animal}?`, `Popular almanac lists give ${z.lucky.join(' and ')} for the ${z.animal}; less favourable numbers are ${z.unlucky.join(', ')}. Lists vary between almanacs.`],
      [`Which signs are most compatible with the ${z.animal}?`, `${z.best.join(', ')}. The traditional clash sign is the ${clash}.`],
      [`What years are the Year of the ${z.animal}?`, `${years.slice(-6).join(', ')} — remember the year starts at Lunar New Year, not 1 January.`]
    ];
    const crumbs = [['Zodiac', 'zodiac/index.html'], [z.animal, 'zodiac/' + z.animal.toLowerCase() + '.html']];
    const body = `<div class="wrap">${crumbsHtml(crumbs)}<div class="layout"><article>
<div style="display:flex;gap:20px;align-items:center"><div style="font:700 5rem/1 var(--serif);color:var(--red)">${z.glyph}</div><div><h1 style="margin:0">Year of the ${z.animal}</h1><div class="muted">${z.glyph} ${z.py} · Chinese zodiac sign ${i + 1} of 12</div></div></div>
<div class="answer-box" style="margin-top:18px"><b>Lucky numbers:</b> <span class="mono">${z.lucky.join(', ')}</span> · <b>Lucky colours:</b> ${z.colors.join(', ')} · <b>Best matches:</b> ${z.best.join(', ')} · <b>Clash:</b> ${clash}</div>
<div class="prose"><h2>Personality</h2><p>${esc(z.traits)}</p><h2>Career & money</h2><p>${esc(z.career)}</p><h2>Numbers for the ${z.animal}</h2><p>${esc(z.number)}</p>
${ad('inArticle')}
<h2>${z.animal} years & Lunar New Year dates</h2><table><thead><tr><th>Year</th><th>Element</th><th>Year begins</th></tr></thead><tbody>${rows}</tbody></table></div>
${leadInline()}
${faqHtml(faq)}
<h2 style="margin-top:1.4em">Other signs</h2><div class="zodiac-grid">${D.ZODIAC.filter((x) => x !== z).map((x) => `<a href="${x.animal.toLowerCase()}.html"><span class="glyph">${x.glyph}</span><span>${x.animal}</span></a>`).join('')}</div>
</article>${aside(`<div class="card"><h3>Your exact sign</h3><p class="small">Born in Jan/Feb? Check the Lunar New Year cut-off.</p><a class="btn btn-primary btn-block" href="__BASE__tools/chinese-zodiac-calculator.html">Zodiac calculator</a></div>`)}</div></div>`;
    page({ path: 'zodiac/' + z.animal.toLowerCase() + '.html', title: `Year of the ${z.animal} (${z.glyph}): Lucky Numbers, Years, Traits & Compatibility`, desc: `Chinese zodiac ${z.animal}: lucky numbers ${z.lucky.join(', ')}, colours, personality, best matches, clash sign and every ${z.animal} year with Lunar New Year dates.`, crumbs, faq, pri: 0.8 }, body);
  });
  const grid = D.ZODIAC.map((z) => `<a href="${z.animal.toLowerCase()}.html"><span class="glyph">${z.glyph}</span><span>${z.animal}</span></a>`).join('');
  const table = D.ZODIAC.map((z) => `<tr><td><a href="${z.animal.toLowerCase()}.html">${z.glyph} ${z.animal}</a></td><td class="mono">${z.lucky.join(', ')}</td><td>${z.colors.join(', ')}</td><td>${z.best.join(', ')}</td></tr>`).join('');
  page({ path: 'zodiac/index.html', title: 'Chinese Zodiac: 12 Animals, Lucky Numbers & Compatibility', desc: 'The 12 Chinese zodiac animals with lucky numbers, colours, compatibility and years. 2026 is the Year of the Fire Horse.', crumbs: [['Zodiac', 'zodiac/index.html']], pri: 0.9 },
    `<div class="wrap">${crumbsHtml([['Zodiac', 'zodiac/index.html']])}<h1>The 12 Chinese zodiac signs</h1><p class="muted">2026 is the Year of the <a href="horse.html">Fire Horse</a> (丙午), which began on ${lunarNewYear(2026)}. Find your sign with the <a href="../tools/chinese-zodiac-calculator.html">calculator</a>.</p><div class="zodiac-grid">${grid}</div>${ad('inArticle')}<div class="prose"><table><thead><tr><th>Sign</th><th>Lucky numbers</th><th>Colours</th><th>Best matches</th></tr></thead><tbody>${table}</tbody></table><p class="small muted">Lucky-number lists vary between almanacs; we follow commonly published lists.</p></div></div>${leadSection()}`);
}

// ---------------------------------------------------------------- ARTICLES
function articles() {
  ARTICLES.forEach((a, i) => {
    let body = a.body
      .replace('{{AD}}', ad('inArticle'))
      .replace(/\{\{AD\}\}/g, '')
      .replace('{{LEAD}}', leadInline())
      .replace('{{PLATES}}', tableFrom(D.PLATES, [['Plate', 'plate', 1], ['Price', 'price'], ['Year', 'year'], ['Note', 'note']]))
      .replace('{{PHONES}}', tableFrom(D.PHONES, [['Number', 'number', 1], ['Price', 'price'], ['Year', 'year'], ['Where', 'where']]))
      .replace('{{DOMAINS}}', tableFrom(D.DOMAINS, [['Domain', 'domain', 1], ['Price', 'price'], ['Year', 'year'], ['Note', 'note']]));
    const toc = [...body.matchAll(/<h2(?: id="([^"]+)")?>([^<]+)<\/h2>/g)].filter((m) => m[1]).map((m) => `<li><a href="#${m[1]}">${m[2]}</a></li>`).join('');
    const crumbs = [['Learn', 'learn/index.html'], [a.short, 'learn/' + a.slug + '.html']];
    const next = ARTICLES[(i + 1) % ARTICLES.length];
    const more = ARTICLES.filter((x) => x !== a).slice(0, 3).map((x) => `<a class="card" href="${x.slug}.html"><span class="pill">${esc(x.cat)}</span><h3 style="margin-top:8px">${esc(x.short)}</h3></a>`).join('');
    const html = `<div class="wrap">${crumbsHtml(crumbs)}<div class="layout"><article>
<span class="pill">${esc(a.cat)}</span><h1 style="margin-top:12px">${esc(a.title)}</h1>
<div class="byline">By the 00338 Number Lab editorial team · Updated ${TODAY} · ${a.mins} min read</div>
<div class="answer-box"><b>Quick answer:</b> ${a.answer}</div>
${a.sponsor ? '<div class="callout small">📊 <b>Data sponsor slot available</b> — put your brand on this data page. <a href="__BASE__advertise.html">Enquire</a>.</div>' : ''}
${toc ? `<nav class="card toc" aria-label="Contents" style="margin-bottom:1em"><b>Contents</b><ol>${toc}</ol></nav>` : ''}
${a.video ? `<div data-video-id="${a.video}" data-title="${esc(a.short)} — video"></div>` : ''}
<div class="prose">${body}</div>
${faqHtml(a.faq)}
<div style="display:flex;gap:10px;flex-wrap:wrap;margin:20px 0"><button class="btn btn-ghost" type="button" data-share="${esc(a.title)}">Share this guide</button><a class="btn btn-ghost" href="${next.slug}.html">Next: ${esc(next.short)} →</a></div>
<h2>Keep reading</h2><div class="grid g3">${more}</div>
</article>${aside()}</div></div>${leadSection()}`;
    page({ path: 'learn/' + a.slug + '.html', title: a.title, desc: a.desc, crumbs, faq: a.faq, article: true, pri: 0.8 }, html);
  });
  const cards = ARTICLES.map((a) => `<a class="card reveal" href="${a.slug}.html"><span class="pill">${esc(a.cat)}</span><h3 style="margin-top:10px">${esc(a.title)}</h3><p class="small muted" style="margin:0">${esc(a.desc)}</p><p class="small" style="margin:.6em 0 0">${a.mins} min read</p></a>`).join('');
  page({ path: 'learn/index.html', title: 'Guides: Chinese Number Culture, Data & Etiquette', desc: 'In-depth guides on Chinese lucky numbers, Cantonese vs Mandarin readings, plate auctions, numeric domains, number slang and red-packet etiquette.', crumbs: [['Learn', 'learn/index.html']], pri: 0.9 },
    `<div class="wrap">${crumbsHtml([['Learn', 'learn/index.html']])}<h1>Guides & data</h1><p class="muted">Sourced, practical and honest — including when a "lucky" number has a catch.</p><div class="grid g3">${cards}</div>${ad('inArticle')}</div>`);
}

// ---------------------------------------------------------------- BUSINESS PAGES
function simple(pathName, title, desc, inner, opts = {}) {
  const crumbs = [[opts.crumb || title, pathName]];
  page({ path: pathName, title, desc, crumbs, faq: opts.faq, noindex: opts.noindex, pri: opts.pri || 0.6, tools: opts.tools }, `<div class="wrap">${crumbsHtml(crumbs)}${inner}</div>${opts.after || ''}`);
}

function business() {
  // Lead-gen hub
  simple('get-a-lucky-number.html', 'Buy, Sell or Appraise Lucky Numbers — Phone Numbers, Plates & Domains', 'Get a free quote for lucky phone numbers, licence plates and numeric domains, sell or appraise yours, or book a number & naming consultation. Reply within 24 hours.',
    `<div class="grid g2" style="align-items:start;margin-top:10px"><div>
<span class="eyebrow">Lucky Number Desk · 靓号服务</span><h1>Get the number that works for you</h1>
<p class="lede muted" style="font-size:1.1rem">Whether you want a prosperity-ending mobile number, an auction plate, a numeric .com or a naming check before launch — tell us once, and we'll come back with real options within 24 hours.</p>
<div class="grid g2" style="margin:18px 0">
<div class="card"><div class="kicker">📱</div><b>Phone numbers</b><p class="small muted">Business lines & mobiles ending 8, 88, 168, 8888.</p></div>
<div class="card"><div class="kicker">🚗</div><b>Licence plates</b><p class="small muted">Auction guidance & private-sale sourcing.</p></div>
<div class="card"><div class="kicker">🌐</div><b>Numeric domains</b><p class="small muted">Buy, sell, broker or appraise 2–6 digit names.</p></div>
<div class="card"><div class="kicker">🧭</div><b>Consultations</b><p class="small muted">Business names, prices, launch dates, floor & unit numbers.</p></div>
</div>
<h2>How it works</h2><ol><li><b>Tell us what you need</b> — 60 seconds.</li><li><b>We research</b> availability, comparable sales and dialect readings.</li><li><b>You get options</b> with prices, or a written valuation.</li><li><b>Close safely</b> — escrow-friendly transfers for domains and private sales.</li></ol>
<div class="callout"><b>Why trust us?</b> We publish our <a href="about.html">methodology</a>, cite every price we mention, and tell you when a "lucky" number has a catch. No obligation, no spam.</div>
<h2>Plans</h2>
<table class="table"><thead><tr><th>Service</th><th>Price</th></tr></thead><tbody><tr><td>Number sourcing (phone / plate / domain)</td><td>Free quote; success fee only</td></tr><tr><td>Personal lucky-number report (PDF)</td><td>US$28</td></tr><tr><td>Business name & number check</td><td>US$168</td></tr><tr><td>Domain appraisal (numeric / premium)</td><td>US$88</td></tr><tr><td>Brokerage for sellers</td><td>Commission on sale</td></tr></tbody></table>
<p class="small muted">Prices are indicative; you'll get a written quote before any payment.</p>
</div><div style="position:sticky;top:84px">${leadForm()}</div></div>
${faqHtml([['How fast will you reply?', 'Within 24 hours, usually sooner.'], ['Do you guarantee a specific number?', 'We can only offer what is available or for sale; we will always tell you honestly what is realistic for your budget.'], ['Can you help me sell a number I own?', 'Yes — choose "Sell / appraise mine" and tell us the number. We\'ll suggest a price range based on comparable sales.'], ['Is my information private?', 'Yes. We use it only to respond to your request. See our privacy policy.']])}`,
    { crumb: 'Get a lucky number', pri: 0.95, faq: [['How fast will you reply?', 'Within 24 hours, usually sooner.']], after: '' });

  // Advertise / sponsor / partnership
  simple('advertise.html', 'Advertise, Sponsor or Partner with 00338', 'Media kit and rates for advertising, sponsorship and partnerships on 00338.com — reach an audience researching lucky numbers, Chinese culture, weddings, property and premium domains.',
    `<span class="eyebrow">Media kit</span><h1>Advertise, sponsor or partner</h1><p class="lede muted" style="font-size:1.1rem;max-width:60ch">Our visitors are actively choosing numbers, dates and names — for phones, cars, weddings, businesses and domains. That is high-intent attention.</p>
<div class="grid g3" style="margin:20px 0">
<div class="card"><h3>Sitewide sponsor</h3><p class="mono" style="font-size:1.4rem;color:var(--red)">from US$888/mo</p><ul class="small"><li>Logo in header & footer</li><li>"Presented by" on all tools</li><li>Monthly newsletter feature</li></ul></div>
<div class="card"><h3>Tool or data-page sponsor</h3><p class="mono" style="font-size:1.4rem;color:var(--red)">from US$288/mo</p><ul class="small"><li>Plate-auction, domain-sales or zodiac pages</li><li>Native unit next to results</li><li>UTM-tracked clicks report</li></ul></div>
<div class="card"><h3>Contest sponsor</h3><p class="mono" style="font-size:1.4rem;color:var(--red)">from US$168/contest</p><ul class="small"><li>Name the prize</li><li>Logo on entry pages & winners post</li><li>Opt-in lead share (with consent)</li></ul></div>
</div>
<div class="grid g2" style="align-items:start"><div class="prose"><h2>Also available</h2><ul><li>Sponsored guides & videos (clearly labelled)</li><li>Affiliate & referral partnerships (phone carriers, registrars, marketplaces, feng shui & jewellery retailers)</li><li>API / white-label decoder widget for your site</li><li>Acquisition of the website or the 00338.com domain</li></ul><h2>Audience & placements</h2><p>English-language audience interested in Chinese culture, Greater China business, weddings, property and premium digital assets. Placements: header banner, in-result native unit, in-article, sidebar and newsletter. Ask for current traffic figures.</p>
<p><b>Domain, acquisition & strategic partnership enquiries:</b> <a href="${OUTREACH}" target="_blank" rel="noopener">web.works/contact</a></p></div>
<form class="card" data-form="sponsor" data-subject="Advertising / sponsorship enquiry" novalidate><h3>Request the media kit</h3><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<div class="field"><label for="a-type">I'm interested in</label><select id="a-type" name="plan"><option>Sitewide sponsor</option><option>Tool / data-page sponsor</option><option>Contest sponsor</option><option>Sponsored content / video</option><option>Affiliate partnership</option><option>API / widget licence</option><option>Buying the website / domain</option><option>Other partnership</option></select></div>
<div class="row"><div class="field"><label for="a-name">Name</label><input id="a-name" name="name" required></div><div class="field"><label for="a-co">Company</label><input id="a-co" name="company"></div></div>
<div class="row"><div class="field"><label for="a-email">Work email</label><input id="a-email" type="email" name="email" required></div><div class="field"><label for="a-bud">Monthly budget</label><select id="a-bud" name="budget"><option>Under $300</option><option>$300 – $1,000</option><option>$1,000 – $5,000</option><option>$5,000+</option></select></div></div>
<div class="field"><label for="a-msg">Goals</label><textarea id="a-msg" name="message"></textarea></div>
<button class="btn btn-primary btn-block" type="submit">Send enquiry</button><div class="form-status" role="status"></div></form></div>`,
    { crumb: 'Advertise & sponsor', pri: 0.7 });

  // Support / donations
  simple('support.html', 'Support 00338 — Donate a Red Packet', 'Support free Chinese number tools and culture guides. Donations fund operations, promotion, marketing, hiring writers and developers, and contest prizes.',
    `<div class="grid g2" style="align-items:start;margin-top:10px"><div><span class="eyebrow">Support · 支持我们</span><h1>Send us a red packet 🧧</h1><p class="lede muted" style="font-size:1.1rem">00338 is independent and free. Your support keeps the tools running, the ads light, and the prizes coming.</p>
<div data-goal style="margin:14px 0 20px"></div>
<h2>Where your support goes</h2>
<div class="grid g2">
<div class="card"><b>⚙️ Operations</b><p class="small muted">Hosting, data sources, tools and maintenance.</p></div>
<div class="card"><b>📣 Promotion & marketing</b><p class="small muted">Reaching more people who need honest number guidance.</p></div>
<div class="card"><b>👩‍💻 Hiring talent</b><p class="small muted">Native Cantonese & Mandarin writers, video creators, developers.</p></div>
<div class="card"><b>🏆 Contests & prizes</b><p class="small muted">Monthly cash prizes and community spotlights.</p></div>
</div>
<h2 style="margin-top:1em">Supporter perks</h2><ul><li><b>US$8+</b> — name on the supporter wall (optional)</li><li><b>US$28+</b> — your personal lucky-number PDF report</li><li><b>US$88+</b> — early access to new tools + thank-you in the newsletter</li><li><b>US$288+</b> — "Patron" badge and a say in which tools we build next</li></ul>
<h2>Supporter wall</h2><p class="muted small">Be the first name here — thank you!</p></div>
<div class="card" data-donate style="position:sticky;top:84px"><div class="redpacket"><div>红包</div><b>Lucky support</b><div class="small">Choose an amount — every one ends in luck.</div></div>
<div class="tiers" style="margin-top:14px"><button type="button" class="tier-btn" data-amount="8" aria-pressed="false"><b>$8</b><span class="small">发</span></button><button type="button" class="tier-btn" data-amount="28" aria-pressed="true"><b>$28</b><span class="small">易发</span></button><button type="button" class="tier-btn" data-amount="88" aria-pressed="false"><b>$88</b><span class="small">发发</span></button><button type="button" class="tier-btn" data-amount="168" aria-pressed="false"><b>$168</b><span class="small">一路发</span></button></div>
<div class="field" style="margin-top:12px"><label for="s-custom">Or custom amount (USD)</label><input id="s-custom" name="custom_amount" type="number" min="1" inputmode="decimal" placeholder="e.g. 520"></div>
<div class="row"><div class="field"><label for="s-purpose">Put it towards</label><select id="s-purpose" name="purpose"><option>General operations</option><option>Promotion & marketing</option><option>Hiring talent</option><option>Contest prizes</option></select></div><div class="field"><label for="s-freq">Frequency</label><select id="s-freq" name="frequency"><option value="once">One-time</option><option value="monthly">Monthly</option></select></div></div>
<button class="btn btn-primary btn-block" type="button" data-paypal>Donate securely with PayPal</button>
<div style="display:grid;gap:8px;margin-top:8px"><a class="btn btn-ghost btn-block" data-pay-link="buyMeACoffee" hidden target="_blank" rel="noopener">☕ Buy Me a Coffee</a><a class="btn btn-ghost btn-block" data-pay-link="kofi" hidden target="_blank" rel="noopener">Ko-fi</a><a class="btn btn-ghost btn-block" data-pay-link="stripeLink" hidden target="_blank" rel="noopener">Card (Stripe)</a><a class="btn btn-ghost btn-block" data-pay-link="patreon" hidden target="_blank" rel="noopener">Become a monthly patron</a></div>
<p class="form-note" style="margin-top:10px">Payments are processed by PayPal. Donations are voluntary support for a commercial website and are not tax-deductible.</p></div></div>
<section style="padding:30px 0 0"><h2>Pledge larger support or sponsor a prize</h2><form class="card" data-form="pledge" data-subject="Support pledge" novalidate><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label><div class="row"><div class="field"><label for="p-name">Name / organisation</label><input id="p-name" name="name" required></div><div class="field"><label for="p-email">Email</label><input id="p-email" type="email" name="email" required></div></div><div class="row"><div class="field"><label for="p-amt">Pledge (USD)</label><input id="p-amt" name="amount" type="number" min="1"></div><div class="field"><label for="p-for">For</label><select id="p-for" name="purpose"><option>Operations</option><option>Promotion & marketing</option><option>Hiring talent</option><option>Contest prize</option></select></div></div><label class="check"><input type="checkbox" name="public_wall" value="yes"> Show my name on the supporter wall</label><button class="btn btn-primary" style="margin-top:10px" type="submit">Send pledge</button><div class="form-status" role="status"></div></form></section>`,
    { crumb: 'Support', pri: 0.7 });

  // Contests
  simple('contests.html', 'Contests & Prizes — Luckiest Number Hunt', 'Enter the monthly Luckiest Number Hunt: share the luckiest number you spot in real life and win cash prizes. Free to enter. Official rules inside.',
    `<div class="grid g2" style="align-items:start;margin-top:10px"><div><span class="eyebrow">Monthly contest</span><h1 data-contest-name>Luckiest Number Hunt</h1><p class="lede muted" style="font-size:1.1rem">Spot a gloriously lucky (or hilariously unlucky) number in the wild — a plate, receipt, price tag, flight, room, phone number — and share it. Best finds win.</p>
<div class="countdown" data-countdown style="margin:16px 0"></div>
<h2>Prizes</h2><ol data-prizes></ol>
<h2>How to enter</h2><ol><li>Photograph or describe the number and where you found it.</li><li>Tell us what it means (use the <a href="tools/number-decoder.html">decoder</a>!).</li><li>Submit the form. <b>Bonus entries:</b> join the newsletter, and share your entry with #00338Lucky.</li></ol>
<h2>Judging</h2><p>Entries are judged on luck score, story and creativity by the 00338 editorial team. Winners are announced on this page and in the newsletter within 7 days of the close.</p>
<details class="card"><summary><b>Official rules (summary)</b></summary><div class="small" style="margin-top:10px"><p>No purchase necessary. Open to individuals aged 18+ where not prohibited by law; void where prohibited. One entry per person per month (bonus entries as listed). Entrants grant 00338.com a non-exclusive licence to display their entry with credit. Do not submit other people's personal data (blur plates of vehicles you don't own, and private phone numbers). Prizes paid via PayPal or equivalent within 30 days; winners are responsible for any taxes. We may cancel or modify the contest if needed; decisions are final. Sponsor: 00338.com.</p></div></details>
</div>
<form class="card" data-form="contest" data-subject="Contest entry" data-success="Entry received — good luck! 祝你好运!" novalidate style="position:sticky;top:84px"><h3>Submit your entry</h3><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<div class="row"><div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required></div><div class="field"><label for="c-email">Email</label><input id="c-email" type="email" name="email" required></div></div>
<div class="field"><label for="c-num">The number</label><input id="c-num" name="number" required placeholder="e.g. 8888"></div>
<div class="field"><label for="c-where">Where did you find it?</label><input id="c-where" name="where" placeholder="Taxi plate in Kowloon, receipt total…"></div>
<div class="field"><label for="c-story">Your story / why it's lucky</label><textarea id="c-story" name="story" required></textarea></div>
<div class="field"><label for="c-photo">Photo link (optional)</label><input id="c-photo" name="photo_url" type="url" placeholder="Instagram, Google Drive, Imgur…"></div>
<label class="check"><input type="checkbox" name="rules" value="accepted" required> I'm 18+ and accept the official rules.</label>
<label class="check" style="margin-top:6px"><input type="checkbox" name="newsletter" value="yes" checked> Bonus entry: send me the Lucky Number of the Day.</label>
<button class="btn btn-primary btn-block" style="margin-top:12px" type="submit">Enter contest</button><div class="form-status" role="status"></div>
<p class="form-note" style="margin-top:8px">Want to sponsor a prize? <a href="advertise.html?plan=Contest%20sponsor">Become a contest sponsor</a>.</p></form></div>`,
    { crumb: 'Contests', pri: 0.7 });

  // Careers
  const roles = [
    ['Cantonese & Mandarin culture writer', 'Freelance · Remote', 'Write sourced guides on number culture, festivals and etiquette.'],
    ['Short-form video creator', 'Freelance · Remote', 'Produce YouTube Shorts/TikTok explainers ("What 520 really means").'],
    ['Front-end developer (JS)', 'Contract · Remote', 'Build new tools and widgets on a fast static stack.'],
    ['Partnerships & ad sales', 'Commission · Remote', 'Sign sponsors and affiliates in weddings, property, telecom and domains.'],
    ['Community & contest manager', 'Part-time · Remote', 'Run monthly contests, judge entries and grow the newsletter.'],
    ['Domain & number broker', 'Commission · Remote', 'Source and sell premium numbers and numeric domains.']
  ];
  simple('careers.html', 'Careers at 00338 — Writers, Creators, Developers & Sales', 'Join 00338 Number Lab: remote roles for Cantonese and Mandarin writers, video creators, developers, partnerships and brokers.',
    `<span class="eyebrow">Careers</span><h1>Build the world's home for number culture</h1><p class="lede muted" style="font-size:1.1rem;max-width:60ch">Small, remote and ambitious. We're looking for people who love language, culture and building things that get used.</p>
<div class="grid g3" style="margin:20px 0">${roles.map(([t, m, d]) => `<div class="card"><span class="pill">${m}</span><h3 style="margin-top:10px">${t}</h3><p class="small muted">${d}</p><a class="btn btn-ghost" href="careers.html?role=${encodeURIComponent(t)}#apply">Apply</a></div>`).join('')}</div>
<form id="apply" class="card" data-form="careers" data-subject="Job application" data-success="Application received — thank you! We review every application." novalidate style="max-width:760px"><h2>Apply</h2><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<div class="row"><div class="field"><label for="j-name">Name</label><input id="j-name" name="name" required></div><div class="field"><label for="j-email">Email</label><input id="j-email" type="email" name="email" required></div></div>
<div class="row"><div class="field"><label for="j-role">Role</label><select id="j-role" name="role">${roles.map(([t]) => `<option>${t}</option>`).join('')}<option>Other / open application</option></select></div><div class="field"><label for="j-loc">Location & time zone</label><input id="j-loc" name="location"></div></div>
<div class="row"><div class="field"><label for="j-lang">Languages</label><input id="j-lang" name="languages" placeholder="English, Cantonese, Mandarin…"></div><div class="field"><label for="j-rate">Expected rate</label><input id="j-rate" name="rate"></div></div>
<div class="field"><label for="j-port">Portfolio / LinkedIn / CV link</label><input id="j-port" name="portfolio" type="url" required placeholder="https://"></div>
<div class="field"><label for="j-why">Why you?</label><textarea id="j-why" name="message" required></textarea></div>
<button class="btn btn-primary" type="submit">Submit application</button><div class="form-status" role="status"></div></form>`,
    { crumb: 'Careers', pri: 0.6 });

  // Videos
  simple('videos.html', 'Videos: Chinese Lucky Numbers Explained', 'Watch explainers on Chinese lucky numbers, why 8 is lucky, number slang, plate auctions and more.',
    `<span class="eyebrow">Watch</span><h1>Videos</h1><p class="muted">Explainers from around YouTube, hand-picked. <a data-yt-channel hidden target="_blank" rel="noopener">Subscribe to our channel →</a></p>${ad('top')}<div class="grid g3" data-videos style="margin-top:16px"></div>
<div class="callout gold" style="margin-top:24px"><b>Creators:</b> want your video featured or sponsored here? <a href="advertise.html?plan=Sponsored%20content%20%2F%20video">Get in touch</a>. Want to make videos with us? <a href="careers.html?role=Short-form%20video%20creator#apply">We're hiring</a>.</div>`,
    { crumb: 'Videos', pri: 0.7 });

  // Contact
  simple('contact.html', 'Contact 00338', 'Contact the 00338 Number Lab team — questions, corrections, partnerships and media.',
    `<div class="grid g2" style="align-items:start;margin-top:10px"><div><span class="eyebrow">Contact</span><h1>Talk to us</h1><p class="muted">Questions, corrections, press or partnership ideas — use the form and we'll reply within 1–2 business days.</p>
<div class="card" style="margin:16px 0"><b>Domain / website acquisition, sponsorship, advertising or partnership?</b><p class="small">Please use our dedicated desk:</p><a class="btn btn-primary" href="${OUTREACH}" target="_blank" rel="noopener">web.works/contact</a></div>
<div class="card"><b>Prefer email?</b><p class="small">Click below to open your mail app — our address stays private on the page.</p><a class="btn btn-ghost" href="#" data-mail="Enquiry from 00338.com">✉️ Email us</a></div></div>
<form class="card" data-form="contact" data-subject="Contact form" novalidate><h3>Send a message</h3><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>
<div class="row"><div class="field"><label for="ct-name">Name</label><input id="ct-name" name="name" required></div><div class="field"><label for="ct-email">Email</label><input id="ct-email" type="email" name="email" required></div></div>
<div class="field"><label for="ct-topic">Topic</label><select id="ct-topic" name="topic"><option>General question</option><option>Correction / feedback</option><option>Lucky number request</option><option>Advertising / sponsorship</option><option>Partnership</option><option>Press / media</option><option>Buying this website or domain</option></select></div>
<div class="field"><label for="ct-msg">Message</label><textarea id="ct-msg" name="message" required></textarea></div>
<button class="btn btn-primary btn-block" type="submit">Send</button><div class="form-status" role="status"></div></form></div>`,
    { crumb: 'Contact', pri: 0.5 });

  // About
  simple('about.html', 'About 00338 Number Lab & Our Methodology', 'Who we are, how the 00338 decoder scores numbers, our sources and editorial standards.',
    `<div class="prose" style="max-width:780px"><span class="eyebrow">About</span><h1>About 00338 Number Lab</h1>
<p>00338 Number Lab is an independent reference site about numbers in Chinese culture — how they sound, what they mean, and what people pay for them. We build free tools, write sourced guides and help people find numbers that work for them.</p>
<h2>Methodology</h2><ul>
<li><b>Digit meanings</b> come from widely documented homophones in Mandarin and Cantonese (e.g. 8 ≈ 发, 4 ≈ 死).</li>
<li><b>Scores</b> (0–100) combine digit values (later digits weighted more, as in phone and plate valuation), famous combinations (168, 520, 1314, 250…), patterns (repeats, sequences, palindromes) and ending bonuses/penalties. Dialect mode switches the digit values.</li>
<li><b>Calendar tools</b> use the Unicode CLDR/ICU Chinese calendar built into modern browsers.</li>
<li><b>Prices and data</b> are cited to public sources on each page.</li></ul>
<h2>Editorial standards</h2><p>We cite sources, date our updates, correct mistakes quickly and say so when a reading is folk etymology or dialect-dependent. Sponsored content is always labelled.</p>
<h2>Independence</h2><p>We are not affiliated with any stock exchange, listed company, government auction or carrier. "00338" is our domain name, used as a number.</p>
<p>Found an error? <a href="contact.html">Tell us</a>.</p></div>`,
    { crumb: 'About', pri: 0.5 });

  // Legal
  simple('privacy.html', 'Privacy & Cookie Policy', 'How 00338.com collects, uses and protects data, including cookies, Google AdSense and form submissions.',
    `<div class="prose" style="max-width:780px"><h1>Privacy & Cookie Policy</h1><p class="byline">Last updated ${TODAY}</p>
<h2>What we collect</h2><ul><li><b>Form data</b> you choose to send (name, email, message, number requests). Forms are delivered to our inbox via FormSubmit, a third-party form processor.</li><li><b>Tool inputs</b> are processed in your browser and are not sent to us.</li><li><b>Analytics</b> (if enabled and you consent): aggregated usage data via Google Analytics.</li><li><b>Preferences</b> such as theme and cookie choice are stored in your browser's local storage.</li></ul>
<h2>Advertising</h2><p>We use Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits. You may opt out of personalised advertising at <a href="https://www.google.com/settings/ads" rel="noopener" target="_blank">Google Ads Settings</a> or <a href="https://www.aboutads.info" rel="noopener" target="_blank">aboutads.info</a>. If you choose "Essential only", we request non-personalised ads.</p>
<h2>Embedded videos</h2><p>YouTube videos load only when you click play, using youtube-nocookie.com.</p>
<h2>Donations</h2><p>Payments are handled by PayPal (and any other processor you choose); we never see your card details.</p>
<h2>Your rights</h2><p>You can ask us to access, correct or delete personal data you sent us (GDPR, UK GDPR, PIPEDA, CCPA and similar laws). <a href="contact.html">Contact us</a>. Change cookie choices any time via <a href="#" data-open-consent>Cookie settings</a>.</p>
<h2>Retention & security</h2><p>We keep enquiries only as long as needed to respond and for legitimate business records. The site is served over HTTPS.</p>
<h2>Children</h2><p>This site is not directed at children under 13, and contests are open to adults only.</p></div>`,
    { crumb: 'Privacy', pri: 0.3 });

  simple('terms.html', 'Terms of Use', 'Terms governing use of 00338.com, its tools, content, contests and services.',
    `<div class="prose" style="max-width:780px"><h1>Terms of Use</h1><p class="byline">Last updated ${TODAY}</p>
<ol><li><b>Entertainment & education.</b> Number meanings, scores, zodiac and date tools are cultural references for entertainment and education. They are not financial, investment, legal, medical or professional advice.</li>
<li><b>No investment advice.</b> Nothing on this site — including the HK stock code decoder — is a recommendation to buy or sell any security.</li>
<li><b>Services.</b> Quotes for numbers, plates, domains and consultations are non-binding until agreed in writing. Third-party auctions, carriers and registrars have their own terms.</li>
<li><b>User content.</b> By submitting contest entries or feedback, you grant us a non-exclusive, worldwide licence to display them with credit. Don't submit unlawful content or other people's private data.</li>
<li><b>Donations</b> are voluntary, non-refundable support for a commercial website and are not tax-deductible.</li>
<li><b>Intellectual property.</b> Site text, design, tools and code © 00338.com unless otherwise stated. See <a href="disclaimer.html">trademark & copyright disclosure</a>.</li>
<li><b>Liability.</b> The site is provided "as is". To the extent permitted by law, we are not liable for decisions made based on its content.</li>
<li><b>Changes.</b> We may update these terms; continued use means acceptance.</li></ol></div>`,
    { crumb: 'Terms', pri: 0.3 });

  simple('disclaimer.html', 'Trademark & Copyright Disclosure', 'Trademark, copyright, affiliation and content disclosures for 00338.com.',
    `<div class="prose" style="max-width:780px"><h1>Trademark & Copyright Disclosure</h1><p class="byline">Last updated ${TODAY}</p>
<h2>About the name "00338"</h2><p>"00338" is a sequence of digits used as this website's domain name (00338.com) and as a descriptive reference to the number itself. <b>We do not claim any trademark rights in the number "00338", and we do not use it to identify or imply connection with any other company, product or service.</b></p>
<h2>No affiliation</h2><p>The same digits are used by third parties as identifiers — for example, as a Hong Kong Stock Exchange stock code, a U.S. National Drug Code labeler code, and in technical advisory numbering. <b>00338.com is not affiliated with, endorsed by, sponsored by or connected to any of those companies, the Hong Kong Exchanges and Clearing Limited, any government body, carrier, registrar or auction operator.</b> We do not use their names, logos or branding. References to them are factual and nominative, for education only.</p>
<h2>Third-party marks</h2><p>All product names, logos, and brands mentioned (e.g. Google, AdSense, YouTube, PayPal, Buy Me a Coffee, Ko-fi, Patreon, Stripe) are property of their respective owners. Use of these names does not imply endorsement.</p>
<h2>Copyright</h2><p>Original text, data compilations, design and code on this site © <span data-year>2026</span> 00338.com. All rights reserved, except where noted. Short quotations with attribution and a link are welcome. Embedded videos remain the property of their creators and are shown via YouTube's official embed player. Price data is cited to its original publishers.</p>
<h2>Cultural content</h2><p>Chinese number meanings, zodiac and calendar traditions are shared cultural heritage in the public domain; our explanations, scoring method and wording are original.</p>
<h2>Takedown & corrections</h2><p>If you believe content infringes your rights, <a href="contact.html">contact us</a> with details and we will review promptly.</p></div>`,
    { crumb: 'Trademark & copyright', pri: 0.3 });

  // 404
  page({ path: '404.html', title: 'Page not found', desc: 'This page is missing — but every number has a meaning.', noindex: true, tools: true },
    `<div class="wrap" style="text-align:center;padding:40px 0"><div class="num-hero">404</div><h1>Page not found</h1><p class="muted">Fun fact: 404 contains two 4s — twice unlucky in Chinese! Let's find you a luckier page.</p><div style="max-width:620px;margin:20px auto;text-align:left">${decoderWidget({})}</div><a class="btn btn-primary" href="/">Go home</a></div>`);
}

// ---------------------------------------------------------------- sitemap & statics
function statics() {
  const urls = pages.map((p) => `<url><loc>${SITE}/${p.path === 'index.html' ? '' : p.path}</loc><lastmod>${TODAY}</lastmod><priority>${p.pri}</priority></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  write('ads.txt', `# Replace pub-0000000000000000 with your AdSense publisher ID after approval, then remove the leading '#'.\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`);
  write('manifest.webmanifest', JSON.stringify({ name: '00338 Number Lab', short_name: '00338', start_url: './index.html', display: 'standalone', background_color: '#FBF8F3', theme_color: '#C8102E', icons: [{ src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
  write('.nojekyll', '');
  const groups = {};
  pages.forEach((p) => { const g = p.path.includes('/') ? p.path.split('/')[0] : 'main'; (groups[g] = groups[g] || []).push(p.path); });
  page({ path: 'sitemap.html', title: 'Sitemap', desc: 'All pages on 00338.com.', noindex: false, pri: 0.2 },
    `<div class="wrap"><h1>Sitemap</h1>${Object.entries(groups).map(([g, list]) => `<h2 style="text-transform:capitalize">${g}</h2><div class="related">${list.map((p) => `<a href="${p}" style="font-family:var(--sans);font-weight:500">${p.replace(/^.*\//, '').replace('.html', '')}</a>`).join('')}</div>`).join('')}</div>`);
}

// ---------------------------------------------------------------- run
rmrf(OUT); fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
if (fs.existsSync(path.join(SRC, 'CNAME'))) fs.copyFileSync(path.join(SRC, 'CNAME'), path.join(OUT, 'CNAME'));
home(); tools(); numberPages(); zodiac(); articles(); business(); statics();
console.log(`Built ${pages.length} indexable pages → ${path.relative(process.cwd(), OUT) || OUT}`);
