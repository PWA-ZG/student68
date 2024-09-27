const cacheables = ["/", "/index.html", "/main.css", "/main.js"];

const cache_name = "cache_v3";

self.addEventListener("install", (ev) => {
  ev.waitUntil(() => {
    caches.open(cache_name).then((cache) => {
      return cache.addAll(cacheables);
    });
  });
});

const readCache = (request) =>
  caches
    .open(cache_name)
    .then((cache) => cache.match(request).then((res) => res));

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    fetch(evt.request)
      .then((res) => res)
      .catch(() => readCache(evt.request))
  );
});

self.addEventListener("sync", (ev) => {
  if (ev.tag == "countries-fetch")
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage("countries-fetch"));
    });
});
