const VERSION = "polyframe-v1";
const SHELL = ["/en/editor", "/uk/editor", "/en", "/uk"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function put(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(VERSION).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => put(request, res))
        .catch(async () => (await caches.match(request)) || (await caches.match(url.pathname.startsWith("/uk") ? "/uk/editor" : "/en/editor"))),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || /\.(png|jpg|gif|svg|woff2?|ttf)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res))));
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => put(request, res))
        .catch(() => hit);
      return hit || network;
    }),
  );
});
