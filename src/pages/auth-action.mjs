import { html } from '../lib/html.mjs';
import { studio } from '../site.mjs';

// Where the links in Sinyal's account emails land (Firebase Auth's custom action URL):
// verify an email, set a new password, or undo an email change. One page for all 16 app
// languages; the script reads the link (mode, oobCode, apiKey, lang) and talks to Firebase
// Auth's public REST API directly. Rendered once, outside the tr/en page set, and kept out
// of search results and the sitemap.
//
// The one-time code is in the URL, so the page sends no referrer anywhere, and the policy
// only lets it reach Firebase Auth.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  'connect-src https://identitytoolkit.googleapis.com',
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

export const authActionPage = {
  file: 'sinyal/auth/index.html',
  render: () => html`<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta http-equiv="Content-Security-Policy" content="${CSP}">
    <meta name="referrer" content="no-referrer">
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#15121A">
    <title>Sinyal</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preload" href="/fonts/figtree-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/apps/sinyal/auth/auth.css">
    <script type="module" src="/apps/sinyal/auth/auth.js"></script>
  </head>
  <body>
    <main class="shell">
      <section class="card" aria-live="polite">
        <img class="card__icon" src="/apps/sinyal/icon-256.webp" width="72" height="72" alt="">
        <p class="card__brand">Sinyal</p>
        <div id="view">
          <div class="spinner" role="status"><span class="sr-only">…</span></div>
          <noscript><p class="lead">Please turn on JavaScript to open this link. / Bu bağlantıyı açmak için JavaScript'i aç.</p></noscript>
        </div>
      </section>
      <p class="foot">${studio.name} · <a id="support" href="mailto:${studio.email}">${studio.email}</a></p>
    </main>
  </body>
</html>
`,
};
