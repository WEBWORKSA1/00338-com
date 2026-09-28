/* 00338 Number Lab — interactive tools */
(function () {
  'use strict';
  var E = window.NumberEngine, $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var BASE = document.documentElement.getAttribute('data-base') || './';
  var NOTABLE = window.NOTABLE_NUMBERS || [];

  function numberUrl(n) { return (+n < 100 && String(+n) === n) || NOTABLE.indexOf(n) !== -1 ? BASE + 'numbers/' + n + '.html' : BASE + 'tools/number-decoder.html?n=' + encodeURIComponent(n); }

  // ---------- Decoder renderer (shared by all number checkers) ----------
  function render(r, box, ctx) {
    if (!r) { box.innerHTML = '<p class="muted">Type some digits to decode.</p>'; return; }
    var chips = r.digits.map(function (d) {
      var cls = d.score > 0.5 ? 'pos' : d.score < -0.5 ? 'neg' : '';
      return '<div class="chip ' + cls + '" title="' + esc(d.info.sound) + '"><b>' + d.d + '</b><span>' + d.info.han + ' · ' + esc(d.info.key) + '</span></div>';
    }).join('');
    var combos = r.combos.map(function (c) {
      return '<div class="combo ' + (c.score > 0 ? 'pos' : c.score < 0 ? 'neg' : '') + '"><b class="mono">' + c.combo + '</b> — ' + esc(c.text) + '</div>';
    }).join('');
    var pats = r.patterns.map(function (p) { return '<span class="pill">' + esc(p.name) + '</span>'; }).join(' ');
    var tips = r.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    var leadHref = BASE + 'get-a-lucky-number.html?number=' + encodeURIComponent(r.number) + '&intent=' + encodeURIComponent(ctx === 'domain' ? 'domain' : ctx === 'plate' ? 'plate' : ctx === 'phone' ? 'phone' : 'report');
    box.innerHTML =
      '<div class="gauge"><div class="score-ring t-' + r.tier.k + '" style="--p:' + r.score + '"><div><div><b>' + r.score + '</b><small>/ 100</small></div></div></div>' +
      '<div><div class="tier t-' + r.tier.k + '">' + esc(r.tier.label) + '</div>' +
      '<div class="mono" style="font-size:1.1rem">' + esc(r.reading.han) + '</div>' +
      '<div class="small muted">Pinyin: ' + esc(r.reading.pinyin) + '<br>Jyutping: ' + esc(r.reading.jyutping) + '</div></div></div>' +
      '<div class="chips">' + chips + '</div>' +
      (combos ? '<h4 style="margin:.6em 0 .2em">Combinations found</h4>' + combos : '') +
      (pats ? '<p style="margin-top:10px">' + pats + '</p>' : '') +
      (tips ? '<ul class="small" style="margin-top:10px">' + tips + '</ul>' : '') +
      '<div class="result-actions">' +
      '<a class="btn btn-primary" href="' + leadHref + '">' + (ctx === 'domain' || ctx === 'plate' || ctx === 'phone' ? 'Buy / sell / appraise this number' : 'Get my full lucky-number report') + '</a>' +
      '<button class="btn btn-ghost" type="button" data-copy>Copy result</button>' +
      '<button class="btn btn-ghost" type="button" data-share-result>Share</button>' +
      '<a class="btn btn-ghost" href="' + numberUrl(r.number) + '">Full page for ' + esc(r.number.length > 12 ? r.number.slice(0, 12) + '…' : r.number) + '</a>' +
      '</div>';
    var text = E.summary(r) + ' Decoded on 00338.com';
    $('[data-copy]', box).addEventListener('click', function () { window.Site.copy(text + ' ' + location.origin + location.pathname + '?n=' + r.number); });
    $('[data-share-result]', box).addEventListener('click', function () { window.Site.share('Lucky number check: ' + r.number, text, location.origin + location.pathname + '?n=' + r.number); });
  }
  window.renderNumber = render;

  $$('[data-tool="decoder"]').forEach(function (tool) {
    var input = $('input[name="n"]', tool), out = $('.result', tool), ctx = tool.getAttribute('data-context') || 'general';
    var dialect = 'both';
    function run(push) {
      var raw = input.value;
      if (ctx === 'plate') raw = raw.toUpperCase();
      var r = E.analyze(raw, { dialect: dialect, context: ctx });
      render(r, out, ctx);
      if (r && push && history.replaceState) history.replaceState(null, '', '?n=' + encodeURIComponent(r.number));
      if (r && window.Site) window.Site.track('decode', { context: ctx, digits: r.number.length });
    }
    $$('.seg button', tool).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.seg button', tool).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); dialect = b.getAttribute('data-dialect'); run(false);
      });
    });
    var form = $('form', tool);
    form.addEventListener('submit', function (e) { e.preventDefault(); run(true); });
    input.addEventListener('input', function () { if (input.value.replace(/\D/g, '').length) run(false); });
    var q = new URLSearchParams(location.search).get('n');
    if (q) input.value = q;
    if (input.value) run(false);
  });

  // ---------- Compare two numbers ----------
  $$('[data-tool="compare"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var list = $$('input', form).map(function (i) { return i.value; }).filter(Boolean).map(function (v) { return E.analyze(v); }).filter(Boolean);
      list.sort(function (a, b) { return b.score - a.score; });
      out.innerHTML = '<table class="table"><thead><tr><th>#</th><th>Number</th><th>Score</th><th>Verdict</th><th>Combos</th></tr></thead><tbody>' +
        list.map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td class="mono"><b>' + r.number + '</b></td><td class="mono">' + r.score + '</td><td>' + esc(r.tier.label) + '</td><td class="mono">' + (r.combos.map(function (c) { return c.combo; }).join(', ') || '—') + '</td></tr>'; }).join('') + '</tbody></table>';
    });
  });

  // ---------- Lucky number generator ----------
  $$('[data-tool="generator"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var len = Math.max(2, Math.min(12, +form.len.value || 4)), count = Math.max(1, Math.min(20, +form.count.value || 6));
      var must = (form.must.value || '').replace(/\D/g, ''), avoid4 = form.avoid4.checked;
      var pool = avoid4 ? '012356789' : '0123456789';
      var weights = { '8': 5, '6': 3, '9': 3, '2': 2, '1': 2, '3': 2, '0': 1, '5': 1, '7': 1, '4': 1 };
      var bag = pool.split('').reduce(function (a, d) { for (var i = 0; i < weights[d]; i++) a.push(d); return a; }, []);
      var results = [], tries = 0;
      while (results.length < count && tries < 4000) {
        tries++;
        var s = must;
        while (s.length < len) s += bag[Math.floor(Math.random() * bag.length)];
        s = s.slice(0, len);
        if (must && form.mustEnd.checked) s = s.slice(0, len - must.length) + must;
        var r = E.analyze(s);
        if (r.score >= 70 && !results.some(function (x) { return x.number === r.number; })) results.push(r);
      }
      results.sort(function (a, b) { return b.score - a.score; });
      out.innerHTML = '<div class="related" style="margin-top:14px">' + results.map(function (r) { return '<a href="' + BASE + 'tools/number-decoder.html?n=' + r.number + '" title="' + r.score + '/100">' + r.number + ' <span class="small muted">' + r.score + '</span></a>'; }).join('') + '</div>' +
        '<p class="small muted" style="margin-top:10px">Click any number to see the full breakdown. Want a real phone number or plate with this pattern? <a href="' + BASE + 'get-a-lucky-number.html?intent=phone">Request one</a>.</p>';
    });
  });

  // ---------- Zodiac ----------
  var ZOD = window.ZODIAC_DATA || [];
  function lunarParts(date) {
    try {
      var parts = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var zh = new Intl.DateTimeFormat('zh-u-ca-chinese', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }).formatToParts(date);
      var z = {}; zh.forEach(function (p) { z[p.type] = p.value; });
      return { year: +(o.relatedYear || o.year), month: parseInt(o.month, 10), leap: /bis/.test(o.month || ''), day: +o.day, yearName: z.yearName, monthZh: z.month };
    } catch (e) { return null; }
  }
  window.lunarParts = lunarParts;
  function utcDate(y, m, d) { return new Date(Date.UTC(y, m - 1, d, 12)); }
  var DAYZH = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

  $$('[data-tool="zodiac"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var y = +form.y.value, m = +form.m.value, d = +form.d.value;
      var lp = lunarParts(utcDate(y, m, d));
      var ly = lp ? lp.year : y;
      var z = E.zodiacForLunarYear(ly), info = ZOD[z.index] || {};
      var lifePath = E.lifePath(y, m, d);
      out.innerHTML = '<div class="card" style="margin-top:16px"><div class="gauge"><div style="font:700 4rem/1 var(--serif);color:var(--red)">' + esc(info.glyph || '') + '</div><div>' +
        '<h3 style="margin:0">' + (z.yin ? 'Yin ' : 'Yang ') + z.element + ' ' + z.animal + '</h3>' +
        '<p class="small muted" style="margin:0">Lunar year ' + ly + (lp && lp.yearName ? ' (' + esc(lp.yearName) + ')' : '') + (lp && ly !== y ? ' — born before Lunar New Year, so you belong to the previous animal year.' : '') + '</p></div></div>' +
        '<p style="margin-top:12px">' + esc(info.traits || '') + '</p>' +
        '<div class="row"><div><b>Lucky numbers:</b> <span class="mono">' + esc((info.lucky || []).join(', ')) + '</span><br><b>Lucky colours:</b> ' + esc((info.colors || []).join(', ')) + '</div>' +
        '<div><b>Best matches:</b> ' + esc((info.best || []).join(', ')) + '<br><b>Western life-path number:</b> <span class="mono">' + lifePath + '</span></div></div>' +
        '<div class="result-actions"><a class="btn btn-primary" href="' + BASE + 'zodiac/' + z.animal.toLowerCase() + '.html">Full ' + z.animal + ' guide</a>' +
        '<a class="btn btn-ghost" href="' + BASE + 'get-a-lucky-number.html?intent=report">Personal number report</a></div></div>';
    });
  });

  $$('[data-tool="compat"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool);
    // Traditional trines (三合) and clashes (六冲)
    var trines = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];
    var allies = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
    function sameGroup(a, b, groups) { return groups.some(function (g) { return g.indexOf(a) !== -1 && g.indexOf(b) !== -1; }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = +form.a.value, b = +form.b.value, score, why;
      if (a === b) { score = 72; why = 'Same sign — you understand each other, but share the same blind spots.'; }
      else if (sameGroup(a, b, trines)) { score = 92; why = 'Trine match (三合) — a traditional "harmony" triangle.'; }
      else if (sameGroup(a, b, allies)) { score = 86; why = 'Secret friends (六合) — complementary pairing.'; }
      else if (Math.abs(a - b) === 6) { score = 38; why = 'Opposite signs (六冲) — the classic clash; needs extra patience.'; }
      else { score = 60 + ((a * 7 + b * 5) % 15); why = 'Neutral pairing — outcome depends on effort, not stars.'; }
      out.innerHTML = '<div class="card" style="margin-top:16px"><div class="gauge"><div class="score-ring ' + (score >= 70 ? 't-good' : score >= 48 ? 't-mixed' : 't-bad') + '" style="--p:' + score + '"><div><div><b>' + score + '</b><small>%</small></div></div></div><div><h3 style="margin:0">' + E.ANIMALS[a] + ' + ' + E.ANIMALS[b] + '</h3><p class="muted" style="margin:0">' + esc(why) + '</p></div></div></div>';
    });
  });

  // ---------- Lunar converter ----------
  $$('[data-tool="lunar"]').forEach(function (tool) {
    var f1 = $('form.to-lunar', tool), f2 = $('form.to-solar', tool), o1 = $('.out1', tool), o2 = $('.out2', tool);
    var today = new Date(); var iso = today.toISOString().slice(0, 10);
    f1.date.value = iso;
    function showLunar() {
      var p = f1.date.value.split('-').map(Number), lp = lunarParts(utcDate(p[0], p[1], p[2]));
      if (!lp) { o1.innerHTML = '<p>Your browser does not support the Chinese calendar API. Try Chrome, Edge, Firefox or Safari.</p>'; return; }
      var z = E.zodiacForLunarYear(lp.year);
      o1.innerHTML = '<div class="answer-box"><div style="font:700 1.6rem var(--serif)">' + esc(lp.yearName || '') + '年 ' + esc(lp.monthZh || '') + ' ' + DAYZH[lp.day - 1] + '</div>' +
        '<div>Lunar month <b>' + lp.month + (lp.leap ? ' (leap)' : '') + '</b>, day <b>' + lp.day + '</b> · Year of the <b>' + z.element + ' ' + z.animal + '</b></div>' +
        '<div class="small muted">Date-number luck of ' + f1.date.value.replace(/-/g, '') + ': ' + E.analyze(f1.date.value).score + '/100</div></div>';
    }
    f1.addEventListener('submit', function (e) { e.preventDefault(); showLunar(); });
    f1.date.addEventListener('change', showLunar);
    showLunar();
    f2.addEventListener('submit', function (e) {
      e.preventDefault();
      var y = +f2.y.value, m = +f2.m.value, d = +f2.d.value, leap = f2.leap.checked;
      var cur = utcDate(y, 1, 1), found = null;
      for (var i = 0; i < 420; i++) {
        var lp = lunarParts(cur);
        if (lp && lp.year === y && lp.month === m && lp.day === d && lp.leap === leap) { found = new Date(cur); break; }
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      o2.innerHTML = found ? '<div class="answer-box"><b>' + found.toUTCString().slice(0, 16) + '</b><div class="small muted">Gregorian (Western) date</div></div>' : '<p class="muted">No such lunar date (check the leap-month box or day 30).</p>';
    });
  });

  // ---------- Lucky dates ----------
  $$('[data-tool="dates"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool);
    var t = new Date(); form.from.value = t.toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = form.from.value.split('-').map(Number), start = utcDate(p[0], p[1], p[2]), days = +form.span.value || 90, purpose = form.purpose.value;
      var rows = [];
      for (var i = 0; i < days; i++) {
        var dt = new Date(start); dt.setUTCDate(dt.getUTCDate() + i);
        var ymd = dt.toISOString().slice(0, 10), compact = ymd.replace(/-/g, '');
        var lp = lunarParts(dt), score = E.analyze(compact).score, note = [];
        var md = String(dt.getUTCMonth() + 1) + String(dt.getUTCDate());
        if (/8/.test(String(dt.getUTCDate()))) { score += 6; note.push('day contains 8'); }
        if (/4/.test(String(dt.getUTCDate()))) { score -= 8; note.push('day contains 4'); }
        if (lp) {
          if (lp.day === 1 || lp.day === 15) { score += 5; note.push(lp.day === 1 ? 'new moon (初一)' : 'full moon (十五)'); }
          if (lp.month === 7 && !lp.leap && (purpose === 'wedding' || purpose === 'moving')) { score -= 15; note.push('Ghost Month'); }
          if (purpose === 'wedding' && (dt.getUTCMonth() + 1 === 5 && dt.getUTCDate() === 20)) { score += 12; note.push('520 "I love you" day'); }
        }
        if (md === '88' || ymd.slice(5) === '08-08') { score += 10; note.push('8/8 double prosperity'); }
        rows.push({ ymd: ymd, dow: dt.toUTCString().slice(0, 3), score: Math.max(1, Math.min(99, score)), lunar: lp ? (lp.month + (lp.leap ? 'L' : '') + '/' + lp.day) : '', note: note.join(', ') });
      }
      rows.sort(function (a, b) { return b.score - a.score; });
      out.innerHTML = '<table class="table"><thead><tr><th>Date</th><th>Day</th><th>Lunar (M/D)</th><th>Score</th><th>Why</th></tr></thead><tbody>' +
        rows.slice(0, 15).map(function (r) { return '<tr><td class="mono"><b>' + r.ymd + '</b></td><td>' + r.dow + '</td><td class="mono">' + r.lunar + '</td><td class="mono">' + r.score + '</td><td class="small">' + esc(r.note || 'balanced digits') + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<p class="small muted">Number-symbolism ranking for cultural fun. For a traditional almanac (通胜) reading, <a href="' + BASE + 'get-a-lucky-number.html?intent=consult">book a consultation</a>.</p>';
    });
  });

  // ---------- Numerology ----------
  $$('[data-tool="numerology"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.out', tool), M = window.LIFE_PATH || {};
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = form.dob.value.split('-').map(Number), lp = E.lifePath(p[0], p[1], p[2]), nn = form.name.value ? E.nameNumber(form.name.value) : null;
      out.innerHTML = '<div class="grid g2" style="margin-top:16px"><div class="card"><span class="eyebrow">Life path</span><div class="num-hero" style="font-size:4rem">' + lp + '</div><p>' + esc(M[lp] || '') + '</p></div>' +
        (nn ? '<div class="card"><span class="eyebrow">Name number</span><div class="num-hero" style="font-size:4rem">' + nn + '</div><p>' + esc(M[nn] || '') + '</p></div>' : '<div class="card"><p class="muted">Add your full name to get your expression (name) number.</p></div>') + '</div>';
    });
  });

  // ---------- Stock code ----------
  $$('[data-tool="stock"]').forEach(function (tool) {
    var form = $('form', tool), out = $('.result', tool);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = form.code.value.replace(/\D/g, '');
      if (!code) return;
      var padded = code.padStart(5, '0');
      render(E.analyze(padded, { context: 'stock' }), out, 'stock');
      out.insertAdjacentHTML('afterbegin', '<p class="small muted">HK code <b class="mono">' + padded + '.HK</b> — look up the listed company on <a href="https://www.hkexnews.hk/" rel="noopener" target="_blank">HKEXnews</a>. Symbolism only; not investment advice.</p>');
    });
  });
})();
