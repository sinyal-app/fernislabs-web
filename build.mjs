// Builds the static site into dist/. No dependencies: `node build.mjs`.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, DEFAULT_LOCALE, absolute, outputFile } from './src/lib/routes.mjs';
import { layout } from './src/components/layout.mjs';
import { apps } from './src/apps/index.mjs';
import { homePage } from './src/pages/home.mjs';
import { appPage } from './src/pages/app.mjs';
import { supportPage } from './src/pages/support.mjs';
import { appDocPage, sitePrivacyPage } from './src/pages/legal.mjs';
import { notFoundPage } from './src/pages/not-found.mjs';
import { authActionPage } from './src/pages/auth-action.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

const pages = [
  homePage,
  sitePrivacyPage,
  ...apps.flatMap((app) => [
    appPage(app),
    supportPage(app),
    ...app.docs.map((doc) => appDocPage(app, doc)),
  ]),
];

const write = (file, contents) => {
  const target = join(DIST, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
};

rmSync(DIST, { recursive: true, force: true });
cpSync(join(ROOT, 'public'), DIST, { recursive: true });

const urls = [];
for (const page of pages) {
  const alternates = Object.fromEntries(LOCALES.map((l) => [l, page.path(l)]));
  for (const locale of LOCALES) {
    const path = alternates[locale];
    const view = page.render(locale);
    write(outputFile(path), String(layout({ ...view, locale, path, alternates })));
    urls.push(path);
  }
}

const notFound = notFoundPage.render(DEFAULT_LOCALE);
const homes = Object.fromEntries(LOCALES.map((l) => [l, homePage.path(l)]));
write(notFoundPage.file, String(layout({ ...notFound, locale: DEFAULT_LOCALE, path: '/', alternates: homes, noindex: true })));
// Where Sinyal's account emails link to: one page for every language, not in the sitemap.
write(authActionPage.file, String(authActionPage.render()));

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${absolute(u)}</loc></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`);

console.log(`Built ${urls.length + 1} pages into dist/`);
