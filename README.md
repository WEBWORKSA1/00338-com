# 00338.com — 00338 Number Lab

Chinese lucky-number meanings, a Mandarin/Cantonese number decoder, 10 free tools, 200+ SEO pages, and a lead-generation desk for lucky phone numbers, licence plates and numeric domains. Monetised with AdSense, YouTube, sponsorships, paid services, donations and contests.

- **Strategy & research:** [`docs/RESEARCH-AND-STRATEGY.md`](docs/RESEARCH-AND-STRATEGY.md)
- **Phase-wise build prompt & launch checklist:** [`docs/BUILD-PROMPT.md`](docs/BUILD-PROMPT.md)

## How it works

```
main branch      source: src/assets (CSS, JS engine/tools/app/config), build/ (generator + data + articles), docs/
gh-pages branch  the LIVE site, served by GitHub Pages' built-in Jekyll
                 _layouts/ (default, number, zodiac), _includes/ (aside, lead, nlist),
                 _data/ (digits, combos, signs), pages as HTML + front matter
```

- Live: https://webworksa1.github.io/00338-com/ (and https://00338.com once DNS points to GitHub Pages).
- `node build/build.js` builds a fully static preview in `dist/` (Node 18+, no dependencies).
- The live site is the `gh-pages` branch. GitHub Pages builds it automatically with Jekyll on every push — no Actions workflow needed. Number pages (`numbers/*.html`) and zodiac pages (`zodiac/*.html`) are front matter only; the layouts render them.
- To edit site-wide HTML (header, footer, top contact bar, ads, consent banner) edit `gh-pages:_layouts/default.html`. Shared JS/CSS live in `gh-pages:src/assets/`.
- Optional: a GitHub Actions workflow could rebuild from `main` automatically, but the integration used to create this repo had no `workflow` permission, so it was not added.

## One-time setup

1. **Settings → Pages** is already enabled: *Deploy from a branch* → `gh-pages` / `(root)`.
2. **Custom domain:** in Settings → Pages add `00338.com` (this creates a `CNAME` file on `gh-pages`). At your registrar set A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME → `webworksa1.github.io`. When the certificate is issued, turn on **Enforce HTTPS**. All links are relative, so the site works on both the project URL and the custom domain.
3. **Forms:** submit any form once. FormSubmit sends an activation link to the owner inbox; click it. After that, every lead, contact and donation pledge is delivered to the inbox.
4. **AdSense / GA4 / YouTube / payment links:** edit `gh-pages:src/assets/js/config.js` (and `main:src/assets/js/config.js` to keep them in sync). Put your AdSense publisher ID in `gh-pages:ads.txt`.
5. **Social preview image:** upload a 1200×630 `og.png` to `gh-pages:src/assets/img/` (`build/make_images.py` generates one) and add an `og:image` tag to `_layouts/default.html`.

## Privacy of the contact inbox

The owner's email is never written in any page or file as plain text. It is XOR-encoded in `src/assets/js/app.js` and only decoded in the visitor's browser at the moment a form is sent or the email link is clicked.

## Legal

Content © 00338.com. "00338" is used as a number; no affiliation with any company, exchange or brand using the same digits. See `disclaimer.html` on the site.

Domain / website / sponsorship / partnership enquiries: https://web.works/contact
