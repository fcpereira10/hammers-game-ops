// Funciona sem rede: guarda a app em cache e serve-a quando não há ligação.
const CACHE = 'hgo-1.15.0';
const SHELL = ['./', 'index.html', 'video.html', 'style.css', 'app.js', 'firebase-config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-48.png', 'icons/logo.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cacheable = url.origin === location.origin ||
    url.href.startsWith('https://www.gstatic.com/firebasejs/') ||
    url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;
  // Rede primeiro (para receber atualizações); cache quando não há rede.
  // own files: always ask the server whether they changed (no stale copies after a deploy)
  const net = url.origin === location.origin ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req);
  e.respondWith(net.then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: url.origin === location.origin }).then(r => r || caches.match('index.html'))));
});
