/*
 * 00338.com — site configuration. Edit this file only; no build step needed for these values.
 * (After editing, the GitHub Action rebuilds and redeploys automatically.)
 */
window.SITE_CONFIG = {
  siteName: '00338 Number Lab',
  domain: '00338.com',

  // ---- Google AdSense -------------------------------------------------------
  // Paste your publisher ID (e.g. 'ca-pub-1234567890123456') and slot IDs once approved.
  // Also update /ads.txt (see README). Ads only load after the visitor accepts cookies.
  adsenseClient: '',
  adSlots: { top: '', inArticle: '', sidebar: '', footer: '' },
  autoAds: true,

  // ---- Analytics (optional) -------------------------------------------------
  ga4Id: '', // e.g. 'G-XXXXXXXXXX'

  // ---- YouTube --------------------------------------------------------------
  // Put your own channel URL here to show the Subscribe button. Replace/add video IDs
  // with your own uploads so embeds earn on your channel.
  youtubeChannel: '',
  videos: [
    { id: 'p1aXXPVPqIA', title: 'Why is 8 lucky in Chinese culture?' },
    { id: 'kRgmrGHeJIc', title: 'Why 8 is the luckiest number' },
    { id: 'pT52hREAf18', title: 'Chinese Lucky Numbers — Numberphile' },
    { id: 'wf13M4MoHS4', title: 'Chinese lucky & unlucky numbers explained' },
    { id: 'sr673iAqLZY', title: 'Meanings behind Chinese numbers' },
    { search: 'Hong Kong car plate auction record', title: 'Record plate auctions (search)' }
  ],

  // ---- Payments / support ---------------------------------------------------
  // PayPal donations route to the site owner's PayPal automatically (address is never shown).
  // Optionally add other links; empty ones are hidden.
  currency: 'USD',
  paypalButtonId: '', // optional: PayPal hosted donate button ID (hides the payee entirely)
  buyMeACoffee: '',   // e.g. 'https://buymeacoffee.com/yourname'
  kofi: '',           // e.g. 'https://ko-fi.com/yourname'
  stripeLink: '',     // Stripe Payment Link
  patreon: '',
  fundingGoal: { label: 'Q4 2026 launch fund', goal: 8888, raised: 0 },

  // ---- Forms ----------------------------------------------------------------
  // Forms post through FormSubmit (free). After the very first submission, FormSubmit
  // emails an activation link to the owner inbox — click it once. For extra privacy,
  // paste the random alias FormSubmit gives you here (e.g. 'a1b2c3d4e5...').
  formAlias: '',

  // ---- Contest --------------------------------------------------------------
  contest: {
    name: 'Luckiest Number Hunt — October 2026',
    endsISO: '2026-10-31T23:59:59+08:00',
    prizes: ['US$288 grand prize', 'US$168 runner-up', '3 × US$28 + featured spotlight']
  },

  outreachUrl: 'https://web.works/contact'
};
