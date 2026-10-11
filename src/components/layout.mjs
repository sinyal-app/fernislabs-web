import { html } from '../lib/html.mjs';
import { LOCALES, DEFAULT_LOCALE, href, absolute } from '../lib/routes.mjs';
import { studio, ui } from '../site.mjs';
import { apps } from '../apps/index.mjs';
import { fernMark } from './brand.mjs';

const BUILD_YEAR = new Date().getFullYear();
// GitHub Pages cannot set response headers, so the policy ships in a meta tag.
// Inline styles are allowed for the per-app theme colours on app tiles; scripts
// only from our own origin (the home page's garden game).
const CSP = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'";

const head = ({ locale, title, description, path, alternates, theme, noindex }) => html`
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="${CSP}">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    ${noindex ? html`<meta name="robots" content="noindex">` : ''}
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${absolute(path)}">
    ${LOCALES.map((l) => html`<link rel="alternate" hreflang="${l}" href="${absolute(alternates[l])}">`)}
    <link rel="alternate" hreflang="x-default" href="${absolute(alternates[DEFAULT_LOCALE])}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${studio.name}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${absolute(path)}">
    <meta property="og:locale" content="${locale === 'tr' ? 'tr_TR' : 'en_US'}">
    <meta name="theme-color" content="${theme ?? '#F1F4EF'}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preload" href="/fonts/figtree-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/styles.css">
  </head>`;

const header = ({ locale, alternates }) => {
  const t = ui[locale];
  const other = LOCALES.find((l) => l !== locale);
  return html`
  <header class="site-header">
    <a class="wordmark" href="${href(locale)}">${fernMark({ size: 28 })}<span>${studio.name}</span></a>
    <nav class="site-nav" aria-label="${studio.name}">
      <a href="${href(locale)}#apps">${t.appsTitle}</a>
      <a href="${href(locale)}#contact">${t.contactTitle}</a>
      <a class="lang" href="${alternates[other]}" hreflang="${other}" lang="${other}">${t.switchTo}</a>
    </nav>
  </header>`;
};

const footer = ({ locale }) => {
  const t = ui[locale];
  return html`
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__studio">
        <a class="wordmark" href="${href(locale)}">${fernMark({ size: 24 })}<span>${studio.name}</span></a>
        <p>${studio.city[locale]}<br><a href="mailto:${studio.email}">${studio.email}</a></p>
      </div>
      ${apps.map((app) => html`
      <nav class="site-footer__col" aria-label="${app.name}">
        <h2>${app.name}</h2>
        <a href="${href(locale, app.slug)}">${t.appPage}</a>
        <a href="${href(locale, app.slug, 'support')}">${t.support}</a>
        <a href="${href(locale, app.slug, 'privacy')}">${t.privacy}</a>
        <a href="${href(locale, app.slug, 'terms')}">${t.terms}</a>
        <a href="${href(locale, app.slug, 'delete-account')}">${t.deleteAccount}</a>
      </nav>`)}
      <nav class="site-footer__col" aria-label="${studio.name}">
        <h2>${studio.name}</h2>
        <a href="${href(locale, 'privacy')}">${t.sitePrivacy}</a>
        <a href="${href(locale)}#contact">${t.contactTitle}</a>
      </nav>
    </div>
    <p class="site-footer__legal">© ${BUILD_YEAR} ${studio.name} (${studio.owner}). ${t.rights}</p>
  </footer>`;
};

/** Wraps a page body in the shared document shell. */
export const layout = ({ locale, title, description, path, alternates, body, theme, noindex = false }) => html`<!doctype html>
<html lang="${locale}">
  ${head({ locale, title, description, path, alternates, theme, noindex })}
  <body>
    <a class="skip" href="#main">${ui[locale].skip}</a>
    ${header({ locale, alternates })}
    <main id="main">${body}</main>
    ${footer({ locale })}
  </body>
</html>
`;
