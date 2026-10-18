// Sinyal's account-link page. Firebase Auth sends people here from its emails with
// ?mode=…&oobCode=…&apiKey=…&lang=…; this script finishes the action through Firebase
// Auth's public REST API (no SDK): verify an email, set a new password, or undo an
// email change. Nothing is stored; the one-time code never leaves for anywhere else.
import { RTL, STRINGS } from './strings.js';

const API = 'https://identitytoolkit.googleapis.com/v1/accounts';
const APP_LINK = 'sinyal://';

const params = new URLSearchParams(location.search);
const mode = params.get('mode');
const code = params.get('oobCode');
const apiKey = params.get('apiKey');

// ---------- Language ----------

/** The app's language from the link (Firebase passes it), else the browser's, else English. */
function pickLocale() {
  const wanted = [params.get('lang'), ...(navigator.languages ?? [navigator.language])].filter(Boolean);
  for (const tag of wanted) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('zh')) return /hant|tw|hk|mo/.test(lower) ? 'zh-Hant' : 'zh-Hans';
    const base = lower.split(/[-_]/)[0];
    if (STRINGS[base]) return base;
  }
  return 'en';
}

const locale = pickLocale();
const t = STRINGS[locale];
document.documentElement.lang = locale;
document.documentElement.dir = RTL.has(locale) ? 'rtl' : 'ltr';

// ---------- Rendering ----------

const view = () => document.getElementById('view');

/** Builds an element: el('p', { class: 'lead' }, 'text', child…). Text is never parsed as HTML. */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (name.startsWith('on')) node.addEventListener(name.slice(2), value);
    else node.setAttribute(name, value === true ? '' : value);
  }
  node.append(...children.flat().filter((child) => child != null && child !== false));
  return node;
}

/** A sentence with {email} shown in bold. */
function withEmail(template, email) {
  const [before, after = ''] = template.split('{email}');
  return email ? [before, el('strong', {}, email), after] : [template.replace('{email}', '').trim()];
}

function show(...nodes) {
  view().replaceChildren(...nodes);
  view().querySelector('h1')?.focus?.();
}

const heading = (text) => el('h1', { tabindex: '-1' }, text);
const badge = (ok) => el('div', { class: `badge badge--${ok ? 'ok' : 'bad'}`, 'aria-hidden': 'true' }, ok ? '✓' : '!');
const openAppButton = () => el('a', { class: 'button', href: APP_LINK }, t.openApp);

function showDone(title, body) {
  show(badge(true), heading(title), el('p', { class: 'lead' }, ...body), el('div', { class: 'actions' }, openAppButton()));
}

function showProblem(kind) {
  const [title, body] = {
    expired: [t.expiredTitle, t.expiredBody],
    badLink: [t.badLinkTitle, t.badLinkBody],
    error: [t.errorTitle, t.errorBody],
  }[kind];
  const actions = kind === 'error'
    // The code was taken out of the address bar, so retrying runs the action again instead of reloading.
    ? [el('button', { class: 'button', type: 'button', onclick: run }, t.retry)]
    : [openAppButton()];
  show(badge(false), heading(title), el('p', { class: 'lead' }, body), el('div', { class: 'actions' }, ...actions));
}

// ---------- Firebase Auth REST ----------

class AuthError extends Error {}

async function call(method, body) {
  let response;
  try {
    response = await fetch(`${API}:${method}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
    });
  } catch {
    throw new AuthError('NETWORK');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthError(String(data?.error?.message ?? 'UNKNOWN').split(' ')[0]);
  return data;
}

const LINK_GONE = new Set(['EXPIRED_OOB_CODE', 'INVALID_OOB_CODE', 'USER_NOT_FOUND', 'USER_DISABLED']);
const WEAK = new Set(['WEAK_PASSWORD', 'PASSWORD_DOES_NOT_MEET_REQUIREMENTS']);
const problemFor = (error) => (LINK_GONE.has(error.message) ? 'expired' : 'error');

// ---------- Actions ----------

async function verifyEmail() {
  try {
    await call('update', { oobCode: code });
    showDone(t.verifiedTitle, [t.verifiedBody]);
  } catch (error) {
    showProblem(problemFor(error));
  }
}

async function recoverEmail() {
  try {
    const info = await call('resetPassword', { oobCode: code });
    await call('update', { oobCode: code });
    showDone(t.recoverTitle, withEmail(t.recoverBody, info.email));
  } catch (error) {
    showProblem(problemFor(error));
  }
}

// Same rules as the app's sign-up checklist (src/features/auth/email/password-policy.ts), which
// match Firebase Auth's password policy: ASCII letters and digits, symbols from its own list.
const SYMBOLS = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`-';
const RULES = {
  length: (p) => p.length >= 8 && p.length <= 128,
  upper: (p) => /[A-Z]/.test(p),
  lower: (p) => /[a-z]/.test(p),
  number: (p) => /[0-9]/.test(p),
  special: (p) => [...p].some((char) => SYMBOLS.includes(char)),
};

function passwordField(id, label, autocomplete) {
  const input = el('input', { id, name: id, type: 'password', autocomplete, required: true, maxlength: '128', spellcheck: 'false', autocapitalize: 'off' });
  const toggle = el('button', { class: 'toggle', type: 'button', 'aria-controls': id, 'aria-pressed': 'false' }, t.show);
  toggle.addEventListener('click', () => {
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    toggle.textContent = visible ? t.hide : t.show;
    toggle.setAttribute('aria-pressed', String(visible));
  });
  return { input, node: el('div', { class: 'field' }, el('label', { for: id }, label), input, toggle) };
}

async function resetPassword() {
  let email;
  try {
    email = (await call('resetPassword', { oobCode: code })).email;
  } catch (error) {
    showProblem(problemFor(error));
    return;
  }

  const fresh = passwordField('new-password', t.newPassword, 'new-password');
  const again = passwordField('confirm-password', t.confirmPassword, 'new-password');
  const items = Object.fromEntries(Object.keys(RULES).map((rule) => [rule, el('li', {}, t.rules[rule])]));
  const message = el('p', { class: 'error', role: 'alert', hidden: true });
  const save = el('button', { class: 'button', type: 'submit', disabled: true }, t.save);
  // A hidden username lets password managers save the new password for the right account.
  const username = el('input', { type: 'email', name: 'username', autocomplete: 'username', value: email ?? '', hidden: true, readonly: true });

  const strong = () => Object.values(RULES).every((test) => test(fresh.input.value));
  const update = () => {
    for (const [rule, test] of Object.entries(RULES)) {
      const met = test(fresh.input.value);
      items[rule].classList.toggle('met', met);
      items[rule].setAttribute('aria-label', `${t.rules[rule]}: ${met ? '✓' : '—'}`);
    }
    save.disabled = !strong() || again.input.value.length === 0;
    message.hidden = true;
  };
  fresh.input.addEventListener('input', update);
  again.input.addEventListener('input', update);

  const form = el('form', { novalidate: true }, username, fresh.node, el('ul', { class: 'rules' }, Object.values(items)), again.node, message, el('div', { class: 'actions' }, save));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!strong()) return;
    if (fresh.input.value !== again.input.value) {
      message.textContent = t.mismatch;
      message.hidden = false;
      return;
    }
    save.disabled = true;
    save.textContent = t.saving;
    try {
      await call('resetPassword', { oobCode: code, newPassword: fresh.input.value });
      showDone(t.resetDoneTitle, [t.resetDoneBody]);
    } catch (error) {
      if (LINK_GONE.has(error.message)) {
        showProblem('expired');
        return;
      }
      message.textContent = WEAK.has(error.message) ? t.weak : t.errorBody;
      message.hidden = false;
      save.textContent = t.save;
      save.disabled = false;
    }
  });

  show(heading(t.resetTitle), el('p', { class: 'lead' }, ...withEmail(t.resetFor, email)), form);
  fresh.input.focus();
}

// ---------- Start ----------

function start() {
  document.title = 'Sinyal';
  const status = view().querySelector('.sr-only');
  if (status) status.textContent = t.checking;
  if (!code || !apiKey) {
    showProblem('badLink');
    return;
  }
  // Keep the code out of the address bar (and history) once it has been read.
  history.replaceState(null, '', location.pathname);
  run();
}

function run() {
  if (mode === 'verifyEmail' || mode === 'verifyAndChangeEmail') void verifyEmail();
  else if (mode === 'resetPassword') void resetPassword();
  else if (mode === 'recoverEmail') void recoverEmail();
  else showProblem('badLink');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
