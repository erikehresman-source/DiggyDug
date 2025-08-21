/* Cavern Quest SW */
const CACHE_NAME = 'cq-v13'; // bump when you deploy
const CORE = [
  './','./index.html','./css/styles.css','./manifest.webmanifest','./sw.js',
  './assets/sprites.png',
  './js/main.js',
  './js/engine/loader.js','./js/engine/storage.js','./js/engine/input.js','./js/engine/audio.js',
  './js/game/game.js','./js/game/grid.js','./js/game/player.js','./js/game/enemy.js',
  './js/game/rock.js','./js/game/treasure.js','./js/game/ai.js',
  './js/game/levels_classic.js','./js/game/levels_caves.js','./js/game/levels_ice.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// === THIS IS THE PART YOU CARE ABOUT (network-first for HTML) ===
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Network-first for HTML navigations to avoid stale pages
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
          return resp;
        })
        .catch(async () => {
          return (
            (await caches.match(e.request)) ||
            (await caches.match('./index.html'))
          );
        })
    );
    return;
  }

  // Cache-first for same-origin assets (JS/CSS/images/etc.)
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
          return resp;
        });
      })
    );
  }
});
