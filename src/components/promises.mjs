import { html } from '../lib/html.mjs';

// Line icons for the studio's promises, drawn like the fern mark (one stroke
// colour, round caps) so they can draw themselves in on load.
const ICONS = {
  // A megaphone, crossed out.
  noAds: ['M4 10v4h3l6 4V6l-6 4H4', 'M16.5 9.5a3.5 3.5 0 0 1 0 5', 'M3 3l18 18'],
  // A price tag, crossed out.
  notForSale: ['M3 12V4h8l9 9-7 7-10-8', 'M7.5 7.5h.01', 'M3 3l18 18'],
  // A target with a single dart in the bullseye.
  oneJob: ['M12 3a9 9 0 1 0 9 9', 'M12 8a4 4 0 1 0 4 4', 'M12 12l8-8', 'M17 4h3v3'],
};

const icon = (name) => html`
  <svg class="promise__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    ${ICONS[name].map((d) => html`<path d="${d}" pathLength="1" />`)}
  </svg>`;

/** The three promises under the hero (icon, claim, one-liner) and the joke fine print. */
export const promises = (items, finePrint) => html`
  <ul class="promises">
    ${items.map(({ icon: name, title, text }) => html`
    <li class="promise">
      ${icon(name)}
      <span class="promise__title">${title}</span>
      <span class="promise__text">${text}</span>
    </li>`)}
  </ul>
  <p class="fine-print">${finePrint}</p>`;
