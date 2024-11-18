import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh_r22kE1Eg2gw_GvFPpJP-0KBkAmFL2E",
  authDomain: "kickhub-9ee37.firebaseapp.com",
  projectId: "kickhub-9ee37",
  storageBucket: "kickhub-9ee37.firebasestorage.app",
  messagingSenderId: "381566376511",
  appId: "1:381566376511:web:39fe757ec69425f61d768a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
