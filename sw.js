const CACHE_NAME = 'CurioCartes_v1';

// Les fichiers locaux indispensables pour que l'app fonctionne hors-ligne
const ASSETS_TO_CACHE = [
  './index.html',
  './cards.json',
  './manifest.json',
  './icon.png'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Nettoyage des anciens caches lors d'une mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});


// Interception des requêtes : on sert le cache s'il existe, sinon on va sur le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Si on est hors ligne et que la ressource n'est pas en cache
      // on peut éventuellement renvoyer une ressource par défaut ici
    })
  );
});