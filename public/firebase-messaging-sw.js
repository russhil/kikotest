 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
 // Initialize the Firebase app in the service worker by passing the generated config
 
 const firebaseConfig = {
    apiKey: "AIzaSyC1cjUa1bTSh7ld9sWqUwXSm_uk700u5ic",
    authDomain: "kiko-live.firebaseapp.com",
    projectId: "kiko-live",
    storageBucket: "kiko-live.appspot.com",
    messagingSenderId: "561523162252",
    appId: "1:561523162252:web:4b2cc0b05abfded2b0cfa9",
    measurementId: "G-JTC330GN9C"
 };

 firebase.initializeApp(firebaseConfig);
 const messaging = firebase.messaging();

//  messaging.onBackgroundMessage(function(payload) {
//    const data = payload;
//    console.log("payload",payload);
//    payload.notification = null;
//    const notificationTitle = data?.notification?.title;
//    const notificationOptions = {
//      body: data?.notification?.body,
//      icon: "https://kikonewapi.s3.ap-south-1.amazonaws.com/uploads/user_images/mjda5rJuh.png",
//      sound: "default"
//    };

//    self.registration.showNotification(notificationTitle, notificationOptions);
//  });