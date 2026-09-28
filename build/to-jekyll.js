#!/usr/bin/env node
/*
 * Converts dist/ (from build.js) into a compact Jekyll site for GitHub Pages branch deploys
 * (no GitHub Actions needed). Shared chrome goes into _layouts/_includes; each page keeps
 * only its unique body plus front matter. Output: ./jekyll  (copy onto the gh-pages branch root,
 * alongside src/assets/).  Usage: node build/build.js && node build/to-jekyll.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), DIST = path.join(ROOT, 'dist'), OUT = path.join(ROOT, 'jekyll');
fs.rmSync(OUT, { recursive: true, force: true });
const walk = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
const put = (rel, s) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const q = (s) => JSON.stringify(s);
const attr = (html, re) => { const m = html.match(re); return m ? m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : ''; };
const V = '20260928';

// ---- layout from the home page chrome
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const B = '{{ page.base }}';
let head = home.slice(0, home.indexOf('<main id="main">') + '<main id="main">'.length);
let foot = home.slice(home.indexOf('</main>'));
head = head
  .replace(/<html lang="en" data-base="[^"]*">/, `<html lang="en" data-base="${B}">`)
  .replace(/<title>[^<]*<\/title>/, '{% if page.n %}{% capture T %}{{ page.n }} Meaning in Chinese — Lucky or Unlucky? ({{ page.sc[0][0] }}/100){% endcapture %}{% capture D %}What does {{ page.n }} mean in Chinese culture? {{ page.sum }} Mandarin vs Cantonese readings, combos and how to use it.{% endcapture %}{% else %}{% assign T = page.title %}{% assign D = page.description %}{% endif %}\n<title>{{ T }}{% unless page.home %} | 00338{% endunless %}</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="{{ D | escape }}">')
  .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="https://00338.com/{{ page.canon }}">')
  .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="{% if page.noindex %}noindex,follow{% else %}index,follow,max-image-preview:large{% endif %}">')
  .replace(/<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="{{ page.ogtype | default: \'website\' }}">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="{{ T | escape }}">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="{{ D | escape }}">')
  .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://00338.com/{{ page.canon }}">')
  .replace(/<meta property="og:image"[^>]*>\n/, '')
  .replace(/<meta name="twitter:card" content="[^"]*">/, '<meta name="twitter:card" content="summary">')
  .replace(/<link rel="apple-touch-icon"[^>]*>\n/, '')
  .replace(/<link rel="manifest"[^>]*>\n/, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n/, '')
  .replace(/ aria-current="page"/g, '')
  .replace(/href="\.\/assets\//g, `href="${B}src/assets/`).replace(/\?v=[a-z0-9]+/g, '?v=' + V)
  .replace(/href="\.\//g, `href="${B}`).replace(/href="(?!https?:|#|\{\{)([a-z0-9-]+[\/.])/g, `href="${B}$1`);
foot = foot
  .replace(/<script>window\.NOTABLE_NUMBERS[\s\S]*?<\/script>\n<script src="[^"]*engine\.js[^"]*"><\/script><script src="[^"]*tools\.js[^"]*" defer><\/script>/,
    `{% if page.tools %}<script src="${B}src/assets/js/site-data.js?v=${V}"></script><script src="${B}src/assets/js/engine.js?v=${V}"></script><script src="${B}src/assets/js/tools.js?v=${V}" defer></script>{% endif %}`)
  .replace(/src="\.\/assets\//g, `src="${B}src/assets/`).replace(/\?v=[a-z0-9]+(?=")/g, '?v=' + V)
  .replace(/href="\.\//g, `href="${B}`)
  .replace(/href="(?!https?:|#|\{\{)([a-z0-9-]+[\/.])/g, `href="${B}$1`);
head = head.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n{% if page.is404 %}<script>document.write(\'<base href="\' + (location.pathname.indexOf(\'/00338-com/\') === 0 ? \'/00338-com/\' : \'/\') + \'">\')</script>{% endif %}');
put('_layouts/default.html', head + '\n{{ content }}\n' + foot);

// site-data.js (was inline)
const inline = home.match(/<script>(window\.NOTABLE_NUMBERS[\s\S]*?)<\/script>/)[1];
put('src/assets/js/site-data.js', inline + '\n');

// ---- shared includes (lead section, standard aside)
const std = {}; // name -> normalised html
function normalise(html, base) { return html.split('"' + base).join('"{{ page.base }}'); }

let bytes = 0, count = 0;
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  const base = attr(html, /data-base="([^"]*)"/);
  let body = html.slice(html.indexOf('<main id="main">') + 16, html.indexOf('</main>'));
  const ld = (html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/) || [''])[0];
  // extract repeated blocks into includes
  body = body.replace(/<section id="lead">[\s\S]*?<\/section>/g, (m) => { const n = normalise(m, base); if (!std.lead) std.lead = n; return n === std.lead ? '{% include lead.html %}' : n; });
  body = body.replace(/<aside class="aside">[\s\S]*?<\/aside>/g, (m) => { const n = normalise(m, base); if (!std.aside && !/Your exact sign/.test(n)) std.aside = n; return n === std.aside ? '{% include aside.html %}' : n; });
  if (/\{\{|\{%/.test(body.replace(/\{% include (lead|aside)\.html %\}/g, '').split('{{ page.base }}').join(''))) throw new Error('Liquid-like syntax in ' + rel);
  const fm = ['---', 'layout: default', 'title: ' + q(attr(html, /<meta property="og:title" content="([^"]*)"/)), 'description: ' + q(attr(html, /<meta name="description" content="([^"]*)"/)),
    'canon: ' + q(rel === 'index.html' ? '' : rel), 'base: ' + q(base), 'permalink: /' + (rel === 'index.html' ? '' : rel)];
  if (rel === 'index.html') fm.push('home: true');
  if (/engine\.js/.test(html)) fm.push('tools: true');
  if (/noindex/.test(attr(html, /<meta name="robots" content="([^"]*)"/))) fm.push('noindex: true');
  if (/og:type" content="article"/.test(html)) fm.push('ogtype: article');
  fm.push('---');
  let out = fm.join('\n') + '\n' + ld.replace(/<script type/, '<script type') + '\n' + body.trim() + '\n';
  if (rel === '404.html') out = out.replace('base: "./"', 'base: ""\nis404: true');
  put(rel, out); bytes += out.length; count++;
}
put('_includes/lead.html', std.lead);
put('_includes/aside.html', std.aside);
for (const f of ['sitemap.xml', 'robots.txt', 'ads.txt']) fs.copyFileSync(path.join(DIST, f), path.join(OUT, f));
put('_config.yml', 'title: 00338 Number Lab\nexclude: [build, docs, README.md, node_modules, dist, jekyll, "*.py"]\nkeep_files: []\n');
console.log(`Jekyll pages: ${count}, page bytes: ${bytes}, includes: ${std.lead.length + std.aside.length}`);

// ---- Number pages: data-driven layout (keeps the branch small) ----------------------------
const E = require(path.join(ROOT, 'src/assets/js/engine.js'));
const D = require('./data.js');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
put('_data/digits.json', JSON.stringify(Object.fromEntries(Object.entries(E.DIGITS).map(([k, v]) => [k, { han: v.han, py: v.py, jp: v.jp, sound: v.sound }]))));
put('_data/combos.json', JSON.stringify(Object.fromEntries(E.COMBOS.map((c) => [c.k, c.t]))));
// sample the decoder/lead/ad/faq markup from a generated page so the layout stays identical
const sample = fs.readFileSync(path.join(OUT, 'numbers/168.html'), 'utf8');
const pick = (re) => (sample.match(re) || [''])[0];
const decoderTpl = pick(/<div class="decoder" data-tool="decoder"[\s\S]*?<div class="result" aria-live="polite"><\/div>\n<\/div>/).replace('value="168"', 'value="{{ page.n }}"');
const leadInlineTpl = pick(/<div class="callout gold"[\s\S]*?Get my free quote<\/a><\/div>/);
const adTpl = pick(/<div class="ad-slot [^"]*" data-slot="inArticle"[\s\S]*?<\/span><\/div>/);
if (!decoderTpl || !leadInlineTpl || !adTpl) throw new Error('template sampling failed');
const layout = `---
layout: default
---
{% assign s0 = page.sc[0][0] %}{% if s0 >= 68 %}{% assign verdict = "lucky" %}{% elsif s0 >= 48 %}{% assign verdict = "neutral-to-mixed" %}{% else %}{% assign verdict = "unlucky" %}{% endif %}{% capture q1 %}Is {{ page.n }} a lucky number in Chinese culture?{% endcapture %}{% capture a1 %}{{ page.sum }} Overall it reads as {{ verdict }}.{% endcapture %}{% capture q2 %}How do you say {{ page.n }} in Chinese?{% endcapture %}{% capture a2 %}{{ page.han }} — Mandarin: {{ page.py }}; Cantonese (Jyutping): {{ page.jp }}.{% endcapture %}{% capture q3 %}Is {{ page.n }} luckier in Cantonese or Mandarin?{% endcapture %}{% capture a3 %}Mandarin score {{ page.sc[1][0] }}/100, Cantonese score {{ page.sc[2][0] }}/100, blended {{ s0 }}/100.{% endcapture %}{% assign names = "Blended,Mandarin,Cantonese" | split: "," %}
<script type="application/ld+json">[{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Numbers","item":"https://00338.com/numbers/index.html"},{"@type":"ListItem","position":2,"name":{{ page.n | jsonify }},"item":"https://00338.com/numbers/{{ page.n }}.html"}]},{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":{{ q1 | jsonify }},"acceptedAnswer":{"@type":"Answer","text":{{ a1 | jsonify }}}},{"@type":"Question","name":{{ q2 | jsonify }},"acceptedAnswer":{"@type":"Answer","text":{{ a2 | jsonify }}}},{"@type":"Question","name":{{ q3 | jsonify }},"acceptedAnswer":{"@type":"Answer","text":{{ a3 | jsonify }}}}]}]</script>
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a> / <a href="../numbers/index.html">Numbers</a> / <span>{{ page.n }}</span></nav><div class="layout"><article>
<div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap"><div class="num-hero">{{ page.n }}</div><div><h1 style="margin:0;font-size:clamp(1.6rem,3.5vw,2.4rem)">Meaning of {{ page.n }} in Chinese culture</h1><div class="mono muted" style="font-size:1.1rem">{{ page.han }} · {{ page.py }}</div></div></div>
<div class="answer-box" style="margin-top:18px"><b>Quick answer:</b> {{ page.sum | escape }} {{ page.note | escape }}</div>
<div class="grid g3" style="margin:12px 0 20px">{% for s in page.sc %}<div class="card" style="text-align:center"><div class="small muted">{{ names[forloop.index0] }}</div><div class="mono" style="font:800 2rem var(--mono)">{{ s[0] }}</div><div class="tier t-{{ s[1] }}" style="font-size:.95rem">{{ s[2] }}</div></div>{% endfor %}</div>
<div class="prose">
<h2>Digit by digit</h2><table><thead><tr><th>Digit</th><th>Mandarin</th><th>Cantonese</th><th>Sounds like / meaning</th></tr></thead><tbody>{% assign digs = page.n | split: "" | uniq %}{% for d in digs %}{% assign x = site.data.digits[d] %}<tr><td class="mono"><b>{{ d }}</b></td><td>{{ x.han }} {{ x.py }}</td><td>{{ x.jp }}</td><td>{{ x.sound | escape }}</td></tr>{% endfor %}</tbody></table>
<h2>Combinations inside {{ page.n }}</h2>{% for c in page.cb %}<div class="combo {{ c[1] }}"><b class="mono">{{ c[0] }}</b> — {{ site.data.combos[c[0]] | escape }}</div>{% else %}<p class="muted">No famous combination — the meaning comes from the individual digits.</p>{% endfor %}
{% if page.pt.size > 0 %}<h2>Patterns</h2><ul>{% for p in page.pt %}<li><b>{{ p[0] }}:</b> {{ p[1] }}</li>{% endfor %}</ul>{% endif %}
${adTpl}
<h2>How to use {{ page.n }}</h2><ul>{% if s0 >= 68 %}<li><b>Phone endings & prices:</b> {{ page.n }} works well for Chinese-speaking customers.</li><li><b>Gifts & red packets:</b> {% if page.n.size <= 4 %}an amount of {{ page.n }} sends a positive message{% else %}use its lucky ending for amounts{% endif %}.</li>{% elsif s0 >= 48 %}<li><b>Everyday use:</b> {{ page.n }} is fine for most purposes; it won't impress or offend.</li><li><b>Branding:</b> test with your audience's dialect — Mandarin {{ page.sc[1][0] }}/100 vs Cantonese {{ page.sc[2][0] }}/100.</li>{% else %}<li><b>Avoid</b> {{ page.n }} for prices, gifts, wedding dates and business numbers aimed at Chinese-speaking audiences.</li><li><b>Already have it?</b> Context matters — a lucky ending or a romantic combo can soften it.</li>{% endif %}{% for u in page.tips %}<li>{{ u | escape }}</li>{% endfor %}</ul>
</div>
<h2>Try your own number</h2>${decoderTpl}
${leadInlineTpl}
<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2><details><summary>{{ q1 }}</summary><p style="margin:.6em 0 0">{{ a1 | escape }}</p></details><details><summary>{{ q2 }}</summary><p style="margin:.6em 0 0">{{ a2 }}</p></details><details><summary>{{ q3 }}</summary><p style="margin:.6em 0 0">{{ a3 }}</p></details></section>
<h2 style="margin-top:1.4em">Related numbers</h2><div class="related">{% for r in page.rel %}<a href="{{ r }}.html">{{ r }}</a>{% endfor %}</div>
<div class="pager">{% if page.prev %}<a class="btn btn-ghost" href="{{ page.prev }}.html">← {{ page.prev }}</a>{% else %}<span></span>{% endif %}<a class="btn btn-ghost" href="index.html">All numbers</a>{% if page.next %}<a class="btn btn-ghost" href="{{ page.next }}.html">{{ page.next }} →</a>{% else %}<span></span>{% endif %}</div>
</article>{% include aside.html %}</div></div>
`;
put('_layouts/number.html', layout);
const list = []; for (let i = 0; i < 100; i++) list.push(String(i)); D.NOTABLE.forEach((n) => { if (!list.includes(n)) list.push(n); });
let nb = 0;
list.forEach((n, idx) => {
  const r = E.analyze(n), rm = E.analyze(n, { dialect: 'mandarin' }), rc = E.analyze(n, { dialect: 'cantonese' });
  const verdictWord = r.score >= 68 ? 'lucky' : r.score >= 48 ? 'neutral-to-mixed' : 'unlucky';
  const uses = [];
  if (r.score >= 68) uses.push(`<b>Phone endings & prices:</b> ${n} works well for Chinese-speaking customers.`, `<b>Gifts & red packets:</b> ${n.length <= 4 ? `an amount of ${n} sends a positive message` : 'use its lucky ending for amounts'}.`);
  else if (r.score >= 48) uses.push(`<b>Everyday use:</b> ${n} is fine for most purposes; it won't impress or offend.`, `<b>Branding:</b> test with your audience's dialect — Mandarin ${rm.score}/100 vs Cantonese ${rc.score}/100.`);
  else uses.push(`<b>Avoid</b> ${n} for prices, gifts, wedding dates and business numbers aimed at Chinese-speaking audiences.`, `<b>Already have it?</b> Context matters — a lucky ending or a romantic combo can soften it.`);
  r.tips.forEach((t) => uses.push(esc(t)));
  const near = []; for (const d of [-2, -1, 1, 2]) { const v = String(+n + d); if (n.length < 9 && +n + d >= 0 && list.includes(v) && v !== n) near.push(v); }
  const featured = ['8', '88', '168', '518', '520', '888', '1314', '8888', '4', '250', '00338', '666'].filter((x) => x !== n);
  const fm = { layout: 'number', permalink: `/numbers/${n}.html`, canon: `numbers/${n}.html`, base: '../', tools: true, n,
    sc: [[r.score, r.tier.k, r.tier.label], [rm.score, rm.tier.k, rm.tier.label], [rc.score, rc.tier.k, rc.tier.label]],
    han: r.reading.han, py: r.reading.pinyin, jp: r.reading.jyutping, sum: E.summary(r), note: D.NOTES[n] || '',
    cb: r.combos.map((c) => [c.combo, c.score > 0 ? 'pos' : c.score < 0 ? 'neg' : '']), pt: r.patterns.map((p) => [p.name, p.t]), tips: r.tips,
    rel: [...new Set([...near, ...featured])].slice(0, 12), prev: list[idx - 1] || null, next: list[idx + 1] || null };
  const s = '---\n' + JSON.stringify(fm) + '\n---\n';
  put(`numbers/${n}.html`, s); nb += s.length;
});
console.log('number pages now', nb, 'bytes');

// ---- Liquid-generated sitemaps (smaller branch) ----
put('sitemap.xml', `---
permalink: /sitemap.xml
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{% for p in site.pages %}{% if p.canon != nil and p.noindex != true %}<url><loc>https://00338.com/{{ p.canon }}</loc><lastmod>{{ site.time | date: '%Y-%m-%d' }}</lastmod></url>
{% endif %}{% endfor %}</urlset>
`);
put('sitemap.html', `---
layout: default
title: "Sitemap"
description: "All pages on 00338.com."
canon: "sitemap.html"
base: "./"
permalink: /sitemap.html
---
<div class="wrap"><h1>Sitemap</h1>{% assign groups = "tools,numbers,zodiac,learn" | split: "," %}<h2>Main</h2><div class="related">{% for p in site.pages %}{% if p.canon and p.noindex != true %}{% unless p.canon contains "/" %}<a href="{{ p.canon | default: 'index.html' }}" style="font-family:var(--sans);font-weight:500">{{ p.title | truncate: 48 }}</a>{% endunless %}{% endif %}{% endfor %}</div>{% for g in groups %}<h2 style="text-transform:capitalize">{{ g }}</h2><div class="related">{% for p in site.pages %}{% assign pre = g | append: "/" %}{% if p.canon and p.canon contains pre %}<a href="{{ p.canon }}" style="font-family:var(--sans);font-weight:500">{{ p.canon | remove: pre | remove: ".html" }}</a>{% endif %}{% endfor %}</div>{% endfor %}</div>
`);
