const staticResources = [

    'libs/localCache.js',
    'libs/iexplore.js',
    'manifest.json',

    'favicon.png',

    'audio/notf.base64',
    'audio/sent.base64',
    'img/add-on.png',
    'img/avatar.png',
    'img/cancel.png',
    'img/error-fix.png',
    'img/file.png',
    'img/groups.png',
    'img/loading.png',
    'img/logout.png',
    'img/microphone.png',
    'img/send.png',
    'img/install.png',
    'img/icons/192.png',
    'img/icons/512.png',

    'index.html?offline=true',
    'groups.html?offline=true',
    'login.html?offline=true',
    'register.html?offline=true',
    'marketplace.html?offline=true',
    'theme_docs.html?offline=true',
    'theme_upload.html?offline=true',
    'updates.html?offline=true',
    'update.html?offline=true',

    //3rd party:

    'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',

];

const CACHE_NAME = 'agemchat-cache';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(staticResources);
        })
    )
});

self.addEventListener('activate', function activator(event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys
                .filter(function (key) {
                    return key.indexOf(CACHE_NAME) !== 0;
                })
                .map(function (key) {
                    return caches.delete(key);
                })
            );
        })
    );
});

function tryFetch(req) {
    try {
        return fetch(req)
            .then(value => {
                return value;
            })
            .catch(why => {
                if (req.url.includes('.html') && !req.url.includes('?offline=true')) {
                    return Response.redirect(req.url + '?offline=true');
                }
                return Response.error();
            });
    }
    catch{
        return Response.error();
    }
}

self.addEventListener('fetch', function (event) {
    var req = event.request;
    event.respondWith(
        caches.match(req).then(function (cachedResponse) {
            return cachedResponse || tryFetch(req);
        })
    );
});