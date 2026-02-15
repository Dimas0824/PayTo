const CACHE_NAME = 'payto-pwa-v2';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = ['/', '/manifest.json', OFFLINE_URL];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') {
        return;
    }

    const acceptHeader = request.headers.get('accept') || '';
    const isHtmlRequest = acceptHeader.includes('text/html');

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => response)
                .catch(async () => {
                    return caches.match(OFFLINE_URL);
                })
        );

        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then((response) => {
                    if (isHtmlRequest) {
                        return response;
                    }

                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));

                    return response;
                });
        })
    );
});

self.addEventListener('push', (event) => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch {
        payload = {
            title: 'Notifikasi PayTo',
            body: event.data ? event.data.text() : 'Anda memiliki notifikasi baru.',
        };
    }

    const title = payload.title || 'Notifikasi PayTo';
    const options = {
        body: payload.body || 'Anda memiliki notifikasi baru.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: {
            url: payload.url || '/kasir',
        },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/kasir';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }

            return undefined;
        })
    );
});
