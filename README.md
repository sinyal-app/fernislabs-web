# fernislabs.com

The Fernis Labs studio site: a home page, one page per app, and each app's support
and legal pages (privacy policy, terms of use, account deletion) in Turkish and English.
Plain static HTML built by a small Node script with no dependencies.

```sh
npm run dev     # build, then serve dist/ at http://localhost:4321
npm run build   # build into dist/
npm run check   # build, then fail on broken links/anchors or draft markers
```

## URLs

Turkish lives at the root and English under `/en/`. Every app gets the same set:

| Page | Turkish | English |
|---|---|---|
| Studio home | `/` | `/en/` |
| App page | `/sinyal/` | `/en/sinyal/` |
| Support (App Store "Support URL") | `/sinyal/support/` | `/en/sinyal/support/` |
| Privacy Policy | `/sinyal/privacy/` | `/en/sinyal/privacy/` |
| Terms of Use / EULA | `/sinyal/terms/` | `/en/sinyal/terms/` |
| Account deletion (Google Play) | `/sinyal/delete-account/` | `/en/sinyal/delete-account/` |
| Privacy of this website | `/privacy/` | `/en/privacy/` |

These URLs are public promises: the apps and the store listings link to them.
Do not rename them.

## Layout

```
build.mjs              renders every page × locale into dist/, plus sitemap.xml and robots.txt
serve.mjs              local preview server
scripts/check-links.mjs
src/site.mjs           studio facts and interface strings (tr, en)
src/apps/              one module per app + the registry (index.mjs)
src/components/        layout, breadcrumbs, app tile/store buttons, the fern mark
src/pages/             home, app, support, legal (app docs + site privacy), 404
src/lib/               html template helper (escapes by default), URL helpers
content/<app>/         legal texts as HTML fragments: <doc>.<locale>.html
content/site/          the website's own privacy notice
public/                copied as-is: styles.css, fonts, favicon, app icons, _headers
```

## Adding an app

1. Copy `src/apps/sinyal.mjs` to `src/apps/<slug>.mjs` and fill in its copy, theme colours and store links.
2. Add it to `src/apps/index.mjs`.
3. Put its icon at `public/apps/<slug>/icon-256.webp`.
4. Write `content/<slug>/{privacy,terms,delete-account}.{tr,en}.html`.
5. `npm run check`.

## Editing a legal text

Edit the fragment in `content/<app>/`, then bump `legalUpdated` in the app module
(or `updated` in `src/pages/legal.mjs` for the site privacy notice). The date on
the page comes from there. Keep the Turkish and English texts in step.

## Store links

When a listing goes live, set `stores.appStore` / `stores.googlePlay` in the app
module. Until then the buttons read "coming soon".

## Hosting (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`: `npm run check`, then deploy
`dist/` to GitHub Pages. Settings → Pages → Source must be "GitHub Actions".

- `public/CNAME` holds the custom domain `fernislabs.com`.
- Repo: github.com/sinyal-app/fernislabs-web. Settings → Pages: custom domain
  `fernislabs.com`, "Enforce HTTPS" on.
- DNS at Hostinger (hPanel → Domains → fernislabs.com → DNS): four `A` records for `@`
  (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and
  `CNAME www` → `sinyal-app.github.io`. Leave the email records (MX, TXT, DKIM
  CNAMEs, autodiscover, autoconfig) alone. See `docs/dns-hostinger.md`.
- GitHub Pages cannot send custom headers, so the Content-Security-Policy is a meta
  tag in `src/components/layout.mjs`.
- The site has no JavaScript, cookies, analytics or third-party requests, and the
  website privacy notice says so. Keep it that way, or update `content/site/privacy.*.html`.
  If the host changes, update the hosting paragraph there too.
