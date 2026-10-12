import { html } from '../lib/html.mjs';

// A fern runner that underlines the second headline line. It draws itself in
// on load; garden.js adds a leaflet to it for every dew drop caught.
export const VINE_PATH = 'M4 26C70 8 120 38 190 22S320 6 390 22 520 36 596 16';

export const vine = () => html`
  <svg class="vine" data-vine viewBox="0 0 600 44" aria-hidden="true" focusable="false">
    <path class="vine__stem" d="${VINE_PATH}" pathLength="1" />
  </svg>`;
