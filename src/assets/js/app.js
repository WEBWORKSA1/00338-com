/* 00338 Number Lab — site runtime (no dependencies) */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  // ---- Private inbox (never rendered in HTML) -------------------------------
  var _k = [51, 56, 0, 51, 56, 8, 90];
  var _b = [68, 93, 98, 68, 87, 122, 49, 64, 89, 49, 115, 95, 101, 59, 90, 84, 46, 80, 87, 101];
  function inbox() { return _b.map(function (c, i) { return String.fromCharCode(c ^ _k[i % _k.length]); }).join(''); }
  function endpoint() { return 'https://formsubmit.co/ajax/' + (C.formAlias || inbox()); }
  window.Site = window.Site || {};
  window.Site.mail = function (subject, body) {
    var href = 'mai' + 'lto:' + inbox() + '?subject=' + encodeURIComponent(subject || 'Inquiry from 00338.com') + (body ? '&body=' + encodeURIComponent(body) : '');
    window.location.href = href;
  };
  $$('[data-mail]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); window.Site.mail(a.getAttribute('data-mail')); });
  });

  // ---- Theme ---------------------------------------------------------------
  var root = document.documentElement, saved = store.get('theme');
  if (saved) root.setAttribute('data-theme', saved);
  $$('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store.set('theme', next);
    });
  });

  // ---- Nav -----------------------------------------------------------------
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) burger.addEventListener('click', function () {
    var open = menu.classList.toggle('show'); burger.setAttribute('aria-expanded', open);
  });
  $$('.menu button.dd').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.parentNode, open = li.classList.toggle('open'); b.setAttribute('aria-expanded', open);
    });
  });

  // ---- Toast ---------------------------------------------------------------
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }
  window.Site.toast = toast;

  // ---- Consent + ads + analytics --------------------------------------------
  function loadScript(src, attrs) {
    var s = document.createElement('script'); s.async = true; s.src = src;
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s); return s;
  }
  function startAds() {
    if (!C.adsenseClient) return;
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + C.adsenseClient, { crossorigin: 'anonymous' });
    $$('.ad-slot').forEach(function (slot) {
      var id = (C.adSlots || {})[slot.getAttribute('data-slot')];
      if (!id) return;
      slot.classList.add('filled'); slot.innerHTML = '';
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle'; ins.style.display = 'block';
      ins.setAttribute('data-ad-client', C.adsenseClient); ins.setAttribute('data-ad-slot', id);
      ins.setAttribute('data-ad-format', 'auto'); ins.setAttribute('data-full-width-responsive', 'true');
      slot.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }
  function startAnalytics() {
    if (!C.ga4Id) return;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + C.ga4Id);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', C.ga4Id, { anonymize_ip: true });
  }
  window.Site.track = function (name, params) { if (window.gtag) window.gtag('event', name, params || {}); };
  var consent = store.get('consent');
  var banner = $('.consent');
  function applyConsent(v) {
    store.set('consent', v); if (banner) banner.classList.remove('show');
    if (v === 'all') { startAds(); startAnalytics(); }
    else if (C.adsenseClient) { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; startAds(); }
  }
  if (banner) {
    if (!consent) banner.classList.add('show'); else applyConsent(consent);
    $$('[data-consent]', banner).forEach(function (b) { b.addEventListener('click', function () { applyConsent(b.getAttribute('data-consent')); }); });
  }
  $$('[data-open-consent]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); if (banner) banner.classList.add('show'); }); });

  // ---- Forms ---------------------------------------------------------------
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k === '_honey') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
    return data;
  }
  $$('form[data-form]').forEach(function (form) {
    var status = $('.form-status', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._honey && form._honey.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var type = form.getAttribute('data-form');
      var data = serialize(form);
      data._subject = '[00338.com] ' + (form.getAttribute('data-subject') || type) + (data.number ? ' — ' + data.number : '');
      data._template = 'table';
      data._captcha = 'false';
      data.form_type = type;
      data.page = location.href;
      data.submitted_at = new Date().toISOString();
      var btn = $('button[type="submit"]', form); var label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      fetch(endpoint(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'Failed'); return j; }); })
        .then(function () {
          if (status) { status.className = 'form-status ok'; status.textContent = form.getAttribute('data-success') || 'Thank you — received! We reply within 24 hours.'; }
          window.Site.track('generate_lead', { form_type: type });
          form.reset();
          var redirect = form.getAttribute('data-redirect'); if (redirect) setTimeout(function () { location.href = redirect; }, 900);
        })
        .catch(function () {
          if (status) {
            status.className = 'form-status err';
            status.innerHTML = 'We could not send that automatically. <a href="#" class="mail-fallback">Click here to send it by email instead</a>.';
            var fb = $('.mail-fallback', status);
            fb.addEventListener('click', function (ev) {
              ev.preventDefault();
              window.Site.mail(data._subject, Object.keys(data).filter(function (k) { return k[0] !== '_'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n'));
            });
          }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
    });
  });

  // Multi-step lead form
  $$('[data-steps]').forEach(function (form) {
    var panes = $$('[data-step]', form), bars = $$('.steps span', form), i = 0;
    function show(n) {
      panes.forEach(function (p, k) { p.hidden = k !== n; });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= n); });
      i = n;
    }
    $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () {
      var ok = $$('input,select,textarea', panes[i]).every(function (el) { return el.checkValidity() || (el.reportValidity(), false); });
      if (ok) show(Math.min(i + 1, panes.length - 1));
    }); });
    $$('[data-prev]', form).forEach(function (b) { b.addEventListener('click', function () { show(Math.max(i - 1, 0)); }); });
    show(0);
  });

  // Prefill from URL (?number=, ?intent=, ?plan=)
  var qs = new URLSearchParams(location.search);
  ['number', 'intent', 'plan', 'role', 'amount'].forEach(function (k) {
    var v = qs.get(k); if (!v) return;
    $$('[name="' + k + '"]').forEach(function (el) {
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = el.value === v;
      else el.value = v;
    });
  });

  // ---- Lite YouTube --------------------------------------------------------
  function ytCard(v) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'yt' + (v.search ? ' search' : '');
    b.setAttribute('aria-label', 'Play video: ' + v.title);
    if (v.id) b.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg)';
    b.innerHTML = '<span class="play"></span><span class="cap">' + esc(v.title) + '</span>';
    b.addEventListener('click', function () {
      if (v.search) { window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(v.search), '_blank', 'noopener'); return; }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true; f.title = v.title;
      b.replaceWith((function () { var d = document.createElement('div'); d.className = 'yt'; d.appendChild(f); return d; })());
      window.Site.track('video_play', { video: v.id });
    });
    return b;
  }
  $$('[data-videos]').forEach(function (box) {
    var n = +box.getAttribute('data-videos') || 99;
    (C.videos || []).slice(0, n).forEach(function (v) { var w = document.createElement('div'); w.appendChild(ytCard(v)); box.appendChild(w); });
  });
  $$('[data-video-id]').forEach(function (el) { el.replaceWith(ytCard({ id: el.getAttribute('data-video-id'), title: el.getAttribute('data-title') || 'Video' })); });
  $$('[data-yt-channel]').forEach(function (el) { if (C.youtubeChannel) { el.href = C.youtubeChannel; el.hidden = false; } else el.hidden = true; });

  // ---- Donations -----------------------------------------------------------
  $$('[data-donate]').forEach(function (box) {
    var amount = 28, btns = $$('.tier-btn', box), custom = $('[name="custom_amount"]', box), purpose = $('[name="purpose"]', box), freq = $('[name="frequency"]', box);
    btns.forEach(function (b) { b.addEventListener('click', function () {
      btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
      amount = +b.getAttribute('data-amount'); if (custom) custom.value = '';
    }); });
    var go = $('[data-paypal]', box);
    if (go) go.addEventListener('click', function () {
      var a = custom && +custom.value > 0 ? +custom.value : amount;
      var item = '00338.com support — ' + (purpose ? purpose.value : 'General operations') + (freq && freq.value === 'monthly' ? ' (monthly pledge)' : '');
      var url = C.paypalButtonId ? 'https://www.paypal.com/donate/?hosted_button_id=' + encodeURIComponent(C.paypalButtonId) + '&amount=' + encodeURIComponent(a) : 'https://www.paypal.com/donate/?business=' + encodeURIComponent(inbox()) + '&amount=' + encodeURIComponent(a) + '&currency_code=' + encodeURIComponent(C.currency || 'USD') + '&item_name=' + encodeURIComponent(item) + '&no_recurring=0';
      window.Site.track('begin_checkout', { value: a, currency: C.currency || 'USD', purpose: item });
      window.open(url, '_blank', 'noopener');
    });
  });
  $$('[data-pay-link]').forEach(function (a) {
    var url = C[a.getAttribute('data-pay-link')];
    if (url) { a.href = url; a.hidden = false; } else a.hidden = true;
  });
  $$('[data-goal]').forEach(function (el) {
    var g = C.fundingGoal || { goal: 1, raised: 0, label: '' };
    var pct = Math.min(100, Math.round((g.raised / g.goal) * 100));
    el.innerHTML = '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + Math.max(pct, 2) + '%"></span></div>' +
      (g.raised > 0 ? '<p class="small muted" style="margin-top:6px"><b class="mono">$' + g.raised.toLocaleString() + '</b> of <b class="mono">$' + g.goal.toLocaleString() + '</b> — ' + esc(g.label) + ' (' + pct + '%)</p>'
        : '<p class="small muted" style="margin-top:6px">Goal: <b class="mono">$' + g.goal.toLocaleString() + '</b> — ' + esc(g.label) + '. Be one of the first supporters!</p>');
  });

  // ---- Contest countdown ---------------------------------------------------
  $$('[data-countdown]').forEach(function (el) {
    var end = new Date((C.contest || {}).endsISO || el.getAttribute('data-countdown')).getTime();
    function tick() {
      var d = Math.max(0, end - Date.now()), s = Math.floor(d / 1000);
      var parts = [[Math.floor(s / 86400), 'days'], [Math.floor(s % 86400 / 3600), 'hours'], [Math.floor(s % 3600 / 60), 'mins'], [s % 60, 'secs']];
      el.innerHTML = parts.map(function (p) { return '<div><b>' + String(p[0]).padStart(2, '0') + '</b><span>' + p[1] + '</span></div>'; }).join('');
    }
    tick(); setInterval(tick, 1000);
  });
  $$('[data-contest-name]').forEach(function (el) { if (C.contest) el.textContent = C.contest.name; });
  $$('[data-prizes]').forEach(function (el) { if (C.contest) el.innerHTML = C.contest.prizes.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join(''); });

  // ---- Share / copy --------------------------------------------------------
  window.Site.share = function (title, text, url) {
    url = url || location.href;
    if (navigator.share) return navigator.share({ title: title, text: text, url: url }).catch(function () {});
    window.Site.copy(text + ' ' + url);
  };
  window.Site.copy = function (text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { toast('Copied to clipboard'); })
      .catch(function () { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); toast('Copied'); } catch (e) {} t.remove(); });
  };
  $$('[data-share]').forEach(function (b) { b.addEventListener('click', function () { window.Site.share(document.title, b.getAttribute('data-share') || document.title); }); });

  // ---- Reveal on scroll + sticky CTA ---------------------------------------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  var sticky = $('.sticky-cta');
  if (sticky) window.addEventListener('scroll', function () { sticky.classList.toggle('show', window.scrollY > 700); }, { passive: true });

  // Year
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
