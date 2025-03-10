const CACHE_NAME = 'lds-cache-v1';
const urlsToCache = [
    '/',
    '/css/index.css',
    '/js/index.js',
    '/img/banner.webp',
    '/img/favicons/icon-round.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 