var CACHE_NAME = "my-site-cache-v1";
var urlToCache = [
  "/",
  "/fallback.json",
  "/css/main.css",
  "/js/main.js",
  "/img/logo.png",
];

//instalasi
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("sedang install service worker... cache terbuka!");
      return cache.addAll(urlToCache);
    })
  );
  console.log("Service worker installed");
});

//fetching
self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);

  //pisahkan request API dan Internal
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return response || fetch(request);
      })
    );
  } else {
    event.respondWith(
      caches.open("product-cache").then(function (cache) {
        return fetch(request)
          .then(function (liveResponse) {
            cache.put(request, liveResponse.clone());
            return liveResponse;
          })
          .catch(function () {
            return caches.match(request).then(function (response) {
              if (response) return response;
              return caches.match("/fallback.json");
            });
          });
      })
    );
  }
});

//aktivasi
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(function (cachesNames) {
      return Promise.all(
        cachesNames
          .filter(function (cacheName) {
            return cacheName != CACHE_NAME;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );

  console.log("Service worker activated");
});
