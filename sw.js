/* Lexi service worker.
 *
 * Strategi:
 *  - App-skalet (HTML/CSS/JS/ikoner) cachas vid install så appen kan startas
 *    offline från hemskärmen.
 *  - För navigation och statiska assets används network-first med cache som
 *    fallback, så uppdateringar slår igenom så fort man har nät.
 *  - lessons.md (och andra .md) hämtas alltid network-first med cache-fallback,
 *    så nya övningar dyker upp direkt online men funkar offline med senaste
 *    versionen.
 */

const VERSION = 'lexi-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './exercises/registry.js',
  './exercises/mc.js',
  './exercises/assemble.js',
  './exercises/pairs.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok && fresh.type === 'basic') {
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (err) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    throw err;
  }
}
