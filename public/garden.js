// The home page's small game: catch dew drops and the fern grows.
// Progressive enhancement: without this script the hero keeps its static mark.
// Nothing is stored or sent anywhere.

export const STAGES = 12;
export const VIEWBOX = '0 0 120 120';
const MAX_LEAVES = 4 + 2 * STAGES;

/**
 * The frond at a (possibly fractional) growth stage, as SVG path data.
 * Stage 0 is a tight fiddlehead; each stage unrolls the tip a little,
 * lengthens the stem and adds a pair of leaflets.
 */
export function frond(stage) {
  const u = stage / STAGES;
  const length = 72 + 50 * u;
  const steps = 72;
  const ds = length / steps;
  let x = 50;
  let y = 116;
  let angle = -Math.PI / 2 - 0.2;
  const spine = [[x, y, angle]];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    angle += (0.004 + (1 - 0.9 * u) * 0.48 * t ** 4) * ds;
    x += Math.cos(angle) * ds;
    y += Math.sin(angle) * ds;
    spine.push([x, y, angle]);
  }
  const stem = `M${spine.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join('L')}`;

  // Leaflets sit on the unrolled part of the stem, longest near the base.
  const count = 4 + 2 * stage;
  const openEnd = 0.86 - 0.42 * (1 - u);
  const longest = 13 + 20 * u;
  const leaves = [];
  for (let i = 0; i < MAX_LEAVES; i++) {
    const grown = Math.min(1, Math.max(0, count - i));
    if (grown === 0) {
      leaves.push('');
      continue;
    }
    const q = (Math.floor(i / 2) + 0.5) / Math.ceil(count / 2);
    const t = 0.1 + (openEnd - 0.1) * q;
    const [sx, sy, a] = spine[Math.round(t * steps)];
    const side = i % 2 === 0 ? -1 : 1;
    const len = longest * (1 - q) ** 0.55 * Math.min(1, 0.45 + q * 3) * grown;
    const out = a + side * 1.05;
    const ex = sx + Math.cos(out) * len;
    const ey = sy + Math.sin(out) * len;
    // Bend each leaflet towards the tip.
    const cx = sx + Math.cos(out - side * 0.35) * len * 0.55;
    const cy = sy + Math.sin(out - side * 0.35) * len * 0.55;
    leaves.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }
  return { stem, leaves };
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-garden]');
  if (root) plantGarden(root);
}

function plantGarden(root) {
  const SVG = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plant = root.querySelector('.garden__plant');
  const svg = plant.querySelector('svg');
  const hint = root.querySelector('.garden__text');
  const counter = root.querySelector('.garden__count');
  const replant = root.querySelector('.garden__replant');
  const { label, done } = root.dataset;

  // Swap the static mark for the growable frond (same look, more leaves to come).
  svg.setAttribute('viewBox', VIEWBOX);
  svg.replaceChildren();
  const make = (cls) => {
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('class', cls);
    path.setAttribute('pathLength', '1');
    svg.append(path);
    return path;
  };
  const stemPath = make('mark__stem');
  const leafPaths = Array.from({ length: MAX_LEAVES }, () => make('mark__leaf'));

  let shown = 0; // the stage currently drawn, fractional while growing
  let stage = 0; // the stage reached
  let tween = 0;

  const draw = (s) => {
    const { stem, leaves } = frond(s);
    stemPath.setAttribute('d', stem);
    leaves.forEach((d, i) => leafPaths[i].setAttribute('d', d));
    shown = s;
  };

  const growTo = (target) => {
    cancelAnimationFrame(tween);
    if (reduceMotion) return draw(target);
    const from = shown;
    const start = performance.now();
    const duration = target > from ? 650 : 900;
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      draw(from + (target - from) * eased);
      if (p < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };

  const finished = () => stage >= STAGES;

  const grow = () => {
    if (finished()) return;
    stage += 1;
    growTo(stage);
    counter.textContent = `${stage} / ${STAGES}`;
    if (finished()) {
      stopRain();
      drops.forEach((dew) => dew.classList.add('dew--fading'));
      hint.textContent = done;
      replant.hidden = false;
      root.classList.add('garden--done');
    }
  };

  // Dew drops: one appears every second or so, and lingers for a moment.
  let rain = 0;
  const drops = new Set();

  const dropDew = () => {
    if (finished() || drops.size >= 2) return;
    const dew = document.createElement('button');
    dew.type = 'button';
    dew.className = 'dew';
    dew.tabIndex = -1;
    dew.setAttribute('aria-hidden', 'true');
    dew.style.left = `${8 + Math.random() * 78}%`;
    dew.style.top = `${4 + Math.random() * 70}%`;
    const fade = setTimeout(() => dew.classList.add('dew--fading'), 2300);
    const gone = setTimeout(() => remove(dew), 2700);
    const remove = (el) => {
      clearTimeout(fade);
      clearTimeout(gone);
      drops.delete(el);
      el.remove();
    };
    dew.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (dew.classList.contains('dew--caught')) return;
      dew.classList.add('dew--caught');
      grow();
      setTimeout(() => remove(dew), 300);
    });
    drops.add(dew);
    root.append(dew);
  };

  let firstRain = true;
  const startRain = () => {
    if (rain || finished()) return;
    const tick = () => {
      dropDew();
      rain = setTimeout(tick, 900 + Math.random() * 700);
    };
    // The first drop waits for the fern to finish drawing itself.
    rain = setTimeout(tick, firstRain ? 1800 : 400);
    firstRain = false;
  };
  function stopRain() {
    clearTimeout(rain);
    rain = 0;
  }

  // Keyboard players water the fern directly; a tap on the fern calls a drop.
  plant.tabIndex = 0;
  plant.setAttribute('role', 'button');
  plant.setAttribute('aria-label', label);
  plant.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    grow();
  });
  plant.addEventListener('click', dropDew);

  replant.addEventListener('click', () => {
    stage = 0;
    counter.textContent = '';
    hint.textContent = hint.dataset.start;
    replant.hidden = true;
    root.classList.remove('garden--done');
    growTo(0);
    startRain();
  });

  draw(0);
  hint.dataset.start = hint.textContent;
  root.classList.add('garden--ready');

  // Only rain while the garden is on screen and the tab is visible.
  let onScreen = false;
  const sync = () => (onScreen && !document.hidden ? startRain() : stopRain());
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }).observe(root);
  document.addEventListener('visibilitychange', sync);
}
