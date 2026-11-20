// Sends a phone straight to Sinyal's listing in its own store: iPhone/iPad → App Store,
// Android → Google Play. Everyone else stays on the page and picks a button.
// The store URLs are the buttons' own links (rendered from the app module at build time).
// Stores nothing and sends nothing anywhere except the visitor to the store.
(() => {
  const buttons = {
    appStore: document.querySelector('[data-store="appStore"]'),
    googlePlay: document.querySelector('[data-store="googlePlay"]'),
  };
  if (!buttons.appStore || !buttons.googlePlay) return;

  // Phone language: Turkish is in the markup, any other language gets English.
  const lang = (navigator.language || 'tr').toLowerCase();
  if (!lang.startsWith('tr')) {
    document.documentElement.lang = 'en';
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = el.dataset.en;
  }

  // Optional campaign label, e.g. ?k=instagram → Google Play install referrer.
  const label = (new URLSearchParams(location.search).get('k') || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40);
  if (label) {
    const play = new URL(buttons.googlePlay.href);
    play.searchParams.set('referrer', `utm_source=${label}&utm_medium=link`);
    buttons.googlePlay.href = play.toString();
  }

  const ua = navigator.userAgent || '';
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const target = isIOS ? buttons.appStore : isAndroid ? buttons.googlePlay : null;
  if (!target) return;

  // Show only this phone's store while it opens, in case the redirect is slow or blocked.
  document.getElementById('lead').hidden = true;
  document.getElementById('opening').hidden = false;
  (target === buttons.appStore ? buttons.googlePlay : buttons.appStore).hidden = true;
  location.replace(target.href);

  // Coming back from the store (back button restores this page): show both choices again.
  addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.getElementById('lead').hidden = false;
    document.getElementById('opening').hidden = true;
    buttons.appStore.hidden = false;
    buttons.googlePlay.hidden = false;
  });
})();
