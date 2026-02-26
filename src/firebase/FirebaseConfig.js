
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC1cjUa1bTSh7ld9sWqUwXSm_uk700u5ic",
  authDomain: "kiko-live.firebaseapp.com",
  projectId: "kiko-live",
  storageBucket: "kiko-live.appspot.com",
  messagingSenderId: "561523162252",
  appId: "1:561523162252:web:4b2cc0b05abfded2b0cfa9",
  measurementId: "G-JTC330GN9C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };