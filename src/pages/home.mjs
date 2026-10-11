import { html } from '../lib/html.mjs';
import { href } from '../lib/routes.mjs';
import { studio, ui } from '../site.mjs';
import { apps } from '../apps/index.mjs';
import { fernMark } from '../components/brand.mjs';
import { appTile } from '../components/app.mjs';

export const homePage = {
  path: (locale) => href(locale),
  render: (locale) => {
    const t = ui[locale];
    return {
      title: t.homeTitle,
      description: t.homeDescription,
      body: html`
      <section class="hero">
        <div class="garden" data-garden data-label="${t.gardenLabel}" data-done="${t.gardenDone}">
          <div class="garden__plant">${fernMark({ size: 220, className: 'hero__mark', drawn: true })}</div>
          <p class="garden__hint"><span class="garden__text" aria-live="polite">${t.gardenHint}</span> <span class="garden__count" aria-hidden="true"></span></p>
          <button class="garden__replant" type="button" hidden>${t.gardenReplant}</button>
        </div>
        <div class="hero__text">
          <h1>${t.heroTitle.map((line) => html`<span class="hero__line">${line}</span>`)}</h1>
          <p class="lead">${t.heroLead}</p>
          <ul class="promises">${t.heroPromises.map((item) => html`<li>${item}</li>`)}</ul>
        </div>
      </section>

      <section class="section" id="apps" aria-labelledby="apps-title">
        <h2 id="apps-title">${t.appsTitle}</h2>
        <div class="app-grid">
          ${apps.map((app) => appTile(app, locale))}
          <div class="app-tile app-tile--next">${fernMark({ size: 40 })}<p>${t.nextApp}</p></div>
        </div>
      </section>

      <section class="section contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">${t.contactTitle}</h2>
        <p>${t.contactLead}</p>
        <p class="contact__email"><a href="mailto:${studio.email}">${studio.email}</a></p>
        <p class="contact__where">${studio.name}, ${studio.city[locale]}</p>
      </section>
      <script type="module" src="/garden.js"></script>`,
    };
  },
};
