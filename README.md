# 00338.com — 00338 Number Lab

Chinese lucky-number meanings, a Mandarin/Cantonese number decoder, 10 free tools, 200+ SEO pages, and a lead-generation desk for lucky phone numbers, licence plates and numeric domains. Monetised with AdSense, YouTube, sponsorships, paid services, donations and contests.

- **Strategy & research:** [`docs/RESEARCH-AND-STRATEGY.md`](docs/RESEARCH-AND-STRATEGY.md)
- **Phase-wise build prompt & launch checklist:** [`docs/BUILD-PROMPT.md`](docs/BUILD-PROMPT.md)

## How it works

```
src/assets/   CSS, JS (engine, tools, app runtime, config), images
build/        build.js (generator) + data.js + articles.js
dist/         generated site (not committed; built by GitHub Actions)
```

`node build/build.js` → builds `dist/`. No dependencies (Node 18+).

Every push to `main` runs **.github/workflows/deploy.yml**, which builds the site and publishes it to the `gh-pages` branch (GitHub Pages, free plan).

## One-time setup

1. **Settings → Pages →** Source: *Deploy from a branch* → `gh-pages` / `(root)` (the workflow also tries to enable this automatically).
2. **Custom domain:** add `00338.com` in Settings → Pages; at your registrar set A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`. Enable **Enforce HTTPS**.
3. **Forms:** submit any form once; FormSubmit sends an activation link to the owner inbox — click it. Optionally paste the alias it gives you into `src/assets/js/config.js → formAlias`.
4. **AdSense / GA4 / YouTube / payment links:** edit `src/assets/js/config.js`. Update `ads.txt` template in `build/build.js` with your publisher ID.

## Privacy of the contact inbox

The owner's email is never written in any page or file as plain text. It is XOR-encoded in `src/assets/js/app.js` and only decoded in the visitor's browser at the moment a form is sent or the email link is clicked.

## Legal

Content © 00338.com. "00338" is used as a number; no affiliation with any company, exchange or brand using the same digits. See `disclaimer.html` on the site.

Domain / website / sponsorship / partnership enquiries: https://web.works/contact
