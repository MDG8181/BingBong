// Bing Bong offline support.
// The page itself is fetched fresh whenever there is a connection, so a new deploy shows up on the next launch.
// Bump VERSION when you add, rename or change any of the other FILES, so phones re-download them.
const VERSION = 'bing-bong-v4';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './apple-touch-icon.png', './icon-192.png', './icon-512.png',
  './fonts/bungee-latin.woff2', './fonts/nunito-latin.woff2',
];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's HTTP cache so a new version never precaches stale files
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // the page's "is there a new version?" check always goes to the server
  if (url.searchParams.has('check')) return;

  // The page: network first (gives up after 3s on a bad connection), cached copy when offline.
  // 'no-cache' revalidates with the server instead of trusting the browser's 10-minute HTTP cache,
  // so tapping "Update" really loads the new version.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const cached = (await cache.match('./index.html')) || (await cache.match('./'));
      const net = fetch(new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' })).then(async res => {
        if (res.redirected) return Response.redirect(res.url, 302);
        if (!res.ok) return cached || res;
        await cache.put('./index.html', res.clone()).catch(() => {});
        return res;
      });
      if (!cached) return net;
      // the "Update" button (?update) waits for the new version however slow the connection is
      if (url.searchParams.has('update')) return net.catch(() => cached);
      e.waitUntil(net.catch(() => {}));
      return Promise.race([net.catch(() => cached), new Promise(r => setTimeout(r, 3000, cached))]);
    })());
    return;
  }

  // Everything else: serve from the cache right away, refresh the cache in the background.
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      if (cached) { e.waitUntil(fresh.then(() => {}, () => {})); return cached; }
      return fresh;
    })
  );
});
