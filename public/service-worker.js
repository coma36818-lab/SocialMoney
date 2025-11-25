self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("likeflow-cache").then(cache => {
            return cache.addAll([
                "feed.html",
                "upload.html",
                "top.html",
                "styles.css",
                "likeflow.js",
                "purchase.html"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => 
            response || fetch(e.request)
        )
    );
});
