/*!
 * 00338 Number Lab — Chinese number-meaning engine (browser + Node).
 * Cultural / entertainment reference only. © 00338.com. MIT-licensed code.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NumberEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // score: -3 (very unlucky) … +3 (very lucky). m = Mandarin reading, c = Cantonese reading.
  var DIGITS = {
    '0': { han: '零', py: 'líng', jp: 'ling4', m: 0, c: 0, key: 'Wholeness',
      sound: 'Neutral. Folk sound-alikes include 灵 (líng, "spirited, efficacious") and 良 ("good"), but most people read 0 as "complete / nothing".',
      note: 'Often used as a filler or to emphasise a round, complete figure. In phone numbers 00 is the international dialling prefix (China uses 00).' },
    '1': { han: '一', py: 'yī / yāo', jp: 'jat1', m: 1, c: 1, key: 'Unity & firsts',
      sound: 'Stands for "one", "first" and "whole". In phone numbers it is read yāo (幺), which can echo 要 ("want / will").',
      note: 'Neutral-to-positive. Powerful in combos: 168 一路发 "prosperity all the way", 1314 一生一世 "one life, one world".' },
    '2': { han: '二', py: 'èr / liǎng', jp: 'ji6', m: 1, c: 2, key: 'Pairs & ease',
      sound: 'Good things come in pairs (好事成双). In Cantonese 二 (ji6) sounds like 易 "easy".',
      note: 'Popular for weddings and gifts in even numbers. Caution: 250 (二百五) is slang for "idiot".' },
    '3': { han: '三', py: 'sān', jp: 'saam1', m: 0, c: 2, key: 'Life & growth',
      sound: 'Cantonese: sounds like 生 (saang1) "life, birth, growth" — lucky. Mandarin: can echo 散 (sàn) "to scatter / break up" — mixed.',
      note: 'A classic Cantonese pairing is 3 + 8 ("生发", growth and prosperity). In Mandarin contexts some avoid 3 for gifts.' },
    '4': { han: '四', py: 'sì', jp: 'sei3', m: -3, c: -3, key: 'Avoided',
      sound: 'Sounds like 死 (sǐ / sei2) "death" in both Mandarin and Cantonese.',
      note: 'The most avoided digit in Chinese culture — many buildings skip 4th, 14th and 24th floors; numbers with 4 sell for less.' },
    '5': { han: '五', py: 'wǔ', jp: 'ng5', m: 0, c: -1, key: 'Five elements',
      sound: 'Mandarin: 五 links to the Five Elements (五行) and sounds like 我 (wǒ) "me" in internet slang (520 = "I love you"). Cantonese: ng5 sounds like 唔 "not".',
      note: 'Context-dependent: 5 before 8 in Cantonese (58, 唔发) can read as "no prosperity".' },
    '6': { han: '六', py: 'liù', jp: 'luk6', m: 2, c: 2, key: 'Smooth flow',
      sound: 'Sounds like 流 "flow" and 禄 "fortune / official salary". 六六大顺 = "everything goes smoothly".',
      note: '666 means "awesome / slick" in Chinese internet slang — the opposite of its Western connotation.' },
    '7': { han: '七', py: 'qī', jp: 'cat1', m: 0, c: 0, key: 'Rise & togetherness',
      sound: 'Can echo 起 "rise" and 齐 "together". Also associated with 气 "energy".',
      note: 'The 7th lunar month is Ghost Month, so some avoid 7 for big events then. Qixi (七夕, 7th day of 7th month) is Chinese Valentine\'s Day.' },
    '8': { han: '八', py: 'bā', jp: 'baat3', m: 3, c: 3, key: 'Prosperity',
      sound: 'Sounds like 发 (fā / faat3) "to prosper, make a fortune".',
      note: 'The luckiest digit. The Beijing Olympics opened at 8:08 pm on 8/8/2008; HK plate "88" sold for HK$11.4M (2025).' },
    '9': { han: '九', py: 'jiǔ', jp: 'gau2', m: 2, c: 2, key: 'Longevity',
      sound: 'Sounds like 久 "long-lasting, eternal".',
      note: 'Imperial number — associated with the emperor; 999 roses = everlasting love.' }
  };

  // Combos (checked as substrings, longest first). score is added on top of digit scores.
  var COMBOS = [
    { k: '5201314', s: 4, t: '我爱你一生一世 — "I love you for a lifetime". The ultimate romantic code.' },
    { k: '1314', s: 3, t: '一生一世 — "one life, one world", forever.' },
    { k: '3344', s: 1, t: '生生世世 — "life after life", eternal (sound-alike overrides the 4s here).', offset4: 2 },
    { k: '1688', s: 3, t: '一路发发 — "prosperity all the way, doubled".' },
    { k: '9999', s: 3, t: '久久久久 — "forever and ever".' },
    { k: '8888', s: 4, t: 'Quadruple prosperity — among the most prized endings.' },
    { k: '6666', s: 3, t: 'Ultra-smooth — "everything flows".' },
    { k: '520', s: 2, t: '我爱你 — "I love you" (May 20 is China\'s internet Valentine\'s Day).' },
    { k: '521', s: 2, t: '我愿意 / 我爱你 — "I\'m willing / I love you".' },
    { k: '168', s: 3, t: '一路发 — "prosperity all the way".' },
    { k: '518', s: 3, t: '我要发 — "I will prosper".' },
    { k: '918', s: 2, t: '就要发 — "about to prosper".' },
    { k: '888', s: 3, t: '发发发 — triple prosperity.' },
    { k: '666', s: 2, t: '六六六 — "slick, awesome, smooth".' },
    { k: '999', s: 2, t: '久久久 — enduring.' },
    { k: '250', s: -3, t: '二百五 — slang for "idiot". Avoid in names, prices and gifts.' },
    { k: '748', s: -3, t: '去死吧 — "go die" (internet slang).' },
    { k: '514', s: -2, t: '吾要死 — can read as "I want to die" in slang; avoided.' },
    { k: '338', s: 1, c: 2, m: -1, t: 'Cantonese folk reading 生生发 (saang saang faat) — "grow, grow, prosper". In Mandarin the embedded 三八 (38) can read as slang, so this one is dialect-dependent.' },
    { k: '38', s: -2, t: '三八 — Women\'s Day (March 8) but also a common insult for a gossipy woman (三八婆). Context matters.' },
    { k: '58', s: -2, t: '唔发 (Cantonese) — "no prosperity".' },
    { k: '28', s: 2, t: '易发 (Cantonese) — "easy prosperity". HK plate "28" sold for HK$18.1M.' },
    { k: '24', s: -2, t: '易死 (Cantonese) — "easy death".' },
    { k: '14', s: -2, t: '要死 / 实死 — "will die / certain death".' },
    { k: '74', s: -2, t: '气死 — "furious / anger to death".' },
    { k: '13', s: -1, t: '十三点 — Shanghainese slang for "silly". Western 13 superstition also applies.' },
    { k: '18', s: 2, t: '要发 / 实发 — "will prosper / sure prosperity". HK plate "18" sold for HK$16.5M.' },
    { k: '68', s: 2, t: '六八 — 路发 / 禄发 "road to prosperity".' },
    { k: '88', s: 2, t: '发发 — double prosperity; also looks like 囍 double happiness. Online, 88 = "bye-bye".' },
    { k: '99', s: 1, t: '久久 — long-lasting.' },
    { k: '66', s: 1, t: '六六 — smooth.' },
    { k: '33', s: 0, t: 'Cantonese: 生生 "life after life / growing"; Mandarin: 散散 can read as "scatter". Dialect-dependent.', c: 1, m: -1 },
    { k: '00', s: 0, t: '00 — the international dialling prefix in China; also "00后", China\'s post-2000 generation.' }
  ];

  function clean(str) { return String(str == null ? '' : str).replace(/[^0-9]/g, ''); }

  function patterns(n) {
    var out = [];
    if (n.length >= 2 && /^(\d)\1+$/.test(n)) out.push({ name: 'Repdigit', s: 2, t: 'All digits identical — rare and collectible.' });
    var trip = n.match(/(\d)\1\1/g);
    if (trip && !/^(\d)\1+$/.test(n)) out.push({ name: 'Triple', s: 1, t: 'Contains a triple (' + trip.join(', ') + ').' });
    if (n.length >= 4 && /^(\d)(\d)\1\2$/.test(n.slice(-4))) out.push({ name: 'ABAB ending', s: 1, t: 'Rhythmic ABAB ending — easy to remember.' });
    if (n.length >= 4 && /^(\d)\1(\d)\2$/.test(n.slice(-4)) && n.slice(-4)[0] !== n.slice(-4)[2]) out.push({ name: 'AABB ending', s: 1, t: 'AABB ending — memorable and sought-after.' });
    if (n.length >= 3) {
      var asc = true, desc = true;
      for (var i = 1; i < n.length; i++) {
        if (+n[i] !== +n[i - 1] + 1) asc = false;
        if (+n[i] !== +n[i - 1] - 1) desc = false;
      }
      if (asc) out.push({ name: 'Rising sequence', s: 1, t: 'Step-by-step rising (步步高) — progress.' });
      if (desc) out.push({ name: 'Falling sequence', s: -1, t: 'Descending run — some read it as decline.' });
    }
    if (n.length >= 3 && n === n.split('').reverse().join('') && !/^(\d)\1+$/.test(n)) out.push({ name: 'Palindrome', s: 1, t: 'Reads the same both ways — balance.' });
    return out;
  }

  /**
   * analyze(input, {dialect: 'mandarin'|'cantonese'|'both', context: 'general'|'phone'|'plate'|'domain'|'stock'|'date'})
   */
  function analyze(input, opts) {
    opts = opts || {};
    var dialect = opts.dialect || 'both';
    var n = clean(input);
    if (!n) return null;
    var dScore = function (d) {
      var x = DIGITS[d];
      if (dialect === 'mandarin') return x.m;
      if (dialect === 'cantonese') return x.c;
      return (x.m + x.c) / 2;
    };

    // Combos: non-overlapping greedy scan, longest first
    var found = [], used = new Array(n.length).fill(false), comboAdj = 0;
    COMBOS.slice().sort(function (a, b) { return b.k.length - a.k.length; }).forEach(function (c) {
      var idx = n.indexOf(c.k);
      while (idx !== -1) {
        var free = true;
        for (var j = idx; j < idx + c.k.length; j++) if (used[j]) { free = false; break; }
        if (free) {
          for (var j2 = idx; j2 < idx + c.k.length; j2++) used[j2] = true;
          var s = c.s;
          if (c.m !== undefined && dialect === 'mandarin') s = c.m;
          if (c.c !== undefined && dialect === 'cantonese') s = c.c;
          if (c.offset4) s += c.offset4;
          found.push({ combo: c.k, at: idx, score: s, text: c.t });
          comboAdj += s;
        }
        idx = n.indexOf(c.k, idx + 1);
      }
    });

    // Digits: weight later digits a little more (endings matter most in phones/plates).
    var raw = 0, weightSum = 0, digits = [];
    for (var i = 0; i < n.length; i++) {
      var w = 1 + (i / Math.max(1, n.length - 1)) * 0.8;
      if (i === n.length - 1) w += 0.7;
      var sc = dScore(n[i]);
      raw += (used[i] ? sc * 0.25 : sc) * w; weightSum += w;
      digits.push({ d: n[i], score: sc, info: DIGITS[n[i]] });
    }
    var avg = raw / weightSum; // -3..3

    var pats = patterns(n), patAdj = pats.reduce(function (a, p) { return a + p.s; }, 0);
    var fours = (n.match(/4/g) || []).length;
    var endsWith4 = n[n.length - 1] === '4';
    var endsWith8 = n[n.length - 1] === '8';

    // Normalise to 0–100
    var score = 50 + avg * 12 + comboAdj * 7 + patAdj * 3 + (endsWith8 ? 4 : 0) - (endsWith4 ? 6 : 0);
    score = Math.max(1, Math.min(99, Math.round(score)));

    var tier = score >= 85 ? { k: 'excellent', label: 'Very lucky 大吉' }
      : score >= 68 ? { k: 'good', label: 'Lucky 吉' }
      : score >= 48 ? { k: 'mixed', label: 'Neutral / mixed 平' }
      : score >= 30 ? { k: 'poor', label: 'Unlucky 凶' }
      : { k: 'bad', label: 'Very unlucky 大凶' };

    var tips = [];
    if (fours) tips.push('Contains ' + fours + ' × "4" (sounds like death). Chinese buyers typically discount these numbers.');
    if (endsWith8) tips.push('Ends in 8 — the most valuable ending for phone numbers, plates and prices.');
    if (n.indexOf('38') !== -1) tips.push('Contains "38" — fine for Women\'s Day themes, but it doubles as a mild insult; test with your audience.');
    if (/^[0-9]$/.test(n)) tips.push('Single-digit numbers are the most prestigious (and most expensive) in plate auctions.');
    if (opts.context === 'domain' && n.length <= 4) tips.push('Short numeric .com domains are a scarce asset class; Chinese buyers historically own ~48% of all 3-digit .coms.');
    if (opts.context === 'phone' && n.length >= 4) tips.push('The last 4 digits carry most of the perceived value — focus your search there.');

    return {
      input: String(input), number: n, dialect: dialect, score: score, tier: tier,
      digits: digits, combos: found.sort(function (a, b) { return a.at - b.at; }), patterns: pats,
      fours: fours, tips: tips,
      reading: {
        han: n.split('').map(function (d) { return DIGITS[d].han; }).join(''),
        pinyin: n.split('').map(function (d) { return DIGITS[d].py.split(' / ')[0]; }).join(' '),
        jyutping: n.split('').map(function (d) { return DIGITS[d].jp; }).join(' ')
      }
    };
  }

  function summary(r) {
    if (!r) return '';
    var parts = [];
    parts.push(r.number + ' scores ' + r.score + '/100 (' + r.tier.label.replace(/ [^ ]+$/, '') + ').');
    if (r.combos.length) parts.push('Key combos: ' + r.combos.map(function (c) { return c.combo; }).join(', ') + '.');
    var best = r.digits.slice().sort(function (a, b) { return b.score - a.score; })[0];
    if (best && best.score > 0) parts.push('Strongest digit: ' + best.d + ' (' + best.info.key.toLowerCase() + ').');
    if (r.fours) parts.push('Watch-out: contains 4.');
    return parts.join(' ');
  }

  // Life-path numerology (Western, Pythagorean) — offered as a companion tool.
  function reduce(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) num = String(num).split('').reduce(function (a, b) { return a + +b; }, 0);
    return num;
  }
  function lifePath(y, m, d) { return reduce(reduce(+y) + reduce(+m) + reduce(+d)); }
  var PYTH = { a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3, d: 4, m: 4, v: 4, e: 5, n: 5, w: 5, f: 6, o: 6, x: 6, g: 7, p: 7, y: 7, h: 8, q: 8, z: 8, i: 9, r: 9 };
  function nameNumber(name) {
    var t = String(name).toLowerCase().split('').reduce(function (a, ch) { return a + (PYTH[ch] || 0); }, 0);
    return t ? reduce(t) : null;
  }

  // Chinese zodiac by lunar year (uses Intl chinese calendar where available for the new-year boundary).
  var ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  var ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  function zodiacForLunarYear(ly) {
    var a = ((ly - 4) % 12 + 12) % 12, e = ((ly - 4) % 10 + 10) % 10;
    return { animal: ANIMALS[a], index: a, element: ELEMENTS[e], yin: e % 2 === 1 };
  }

  return { DIGITS: DIGITS, COMBOS: COMBOS, analyze: analyze, summary: summary, clean: clean,
    lifePath: lifePath, nameNumber: nameNumber, ANIMALS: ANIMALS, zodiacForLunarYear: zodiacForLunarYear };
});
