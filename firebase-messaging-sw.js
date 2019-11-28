// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');
importScripts('libs/fbconfig.js');
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp(config);

const messaging = firebase.messaging();

