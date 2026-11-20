import { html } from '../lib/html.mjs';
import { absolute } from '../lib/routes.mjs';
import { studio } from '../site.mjs';

// One link for ads and social bios (e.g. fernislabs.com/sinyal/indir/): the script sends
// an iPhone/iPad to the App Store listing and an Android phone to Google Play. Anyone else
// (a computer, an unknown device, no JavaScript) sees both store buttons. Store URLs come
// from the app module, so the buttons and the redirect never drift apart.
//
// Optional campaign label: ?k=instagram. The script passes it to Google Play as an install
// referrer (utm_source), which shows up in Play Console's acquisition reports. It collects
// and stores nothing itself. Kept out of search results and the sitemap.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

// Turkish is in the markup; the script swaps in English for any other phone language.
const T = {
  title: { tr: 'Sinyal’i indir', en: 'Get Sinyal' },
  lead: {
    tr: 'Telefonuna uygun mağazayı seç.',
    en: 'Choose the store for your phone.',
  },
  appStore: { tr: 'App Store’dan indir', en: 'Download on the App Store' },
  googlePlay: { tr: 'Google Play’den indir', en: 'Get it on Google Play' },
  opening: { tr: 'Mağaza açılıyor…', en: 'Opening the store…' },
};

const t = (key) => html`data-en="${T[key].en}">${T[key].tr}`;

export const storeRedirectPage = (app, slug = 'indir') => ({
  file: `${app.slug}/${slug}/index.html`,
  render: () => html`<!doctype html>
<html lang="tr" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta http-equiv="Content-Security-Policy" content="${CSP}">
    <meta name="referrer" content="no-referrer">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="${app.theme.bg}">
    <title>${app.name}</title>
    <meta name="description" content="${app.copy.tr.tagline}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${app.name}">
    <meta property="og:description" content="${app.copy.tr.tagline}">
    <meta property="og:image" content="${absolute(app.icon)}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/apps/${app.slug}/indir/indir.css">
  </head>
  <body>
    <main class="shell">
      <section class="card">
        <img class="card__icon" src="${app.icon}" width="88" height="88" alt="">
        <h1 data-i18n ${t('title')}</h1>
        <p class="lead" id="lead" data-i18n ${t('lead')}</p>
        <p class="lead" id="opening" hidden data-i18n ${t('opening')}</p>
        <div class="actions">
          <a class="button" data-store="appStore" href="${app.stores.appStore}" rel="noopener" data-i18n ${t('appStore')}</a>
          <a class="button" data-store="googlePlay" href="${app.stores.googlePlay}" rel="noopener" data-i18n ${t('googlePlay')}</a>
        </div>
      </section>
      <p class="foot">${studio.name}</p>
    </main>
    <script src="/apps/${app.slug}/indir/indir.js"></script>
  </body>
</html>
`,
});
