// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBbNfeDvS4km8p1r0bso3xgncAKGwmZ_c",
  authDomain: "financely-212cf.firebaseapp.com",
  projectId: "financely-212cf",
  storageBucket: "financely-212cf.appspot.com",
  messagingSenderId: "801805706659",
  appId: "1:801805706659:web:4432d425e248653e10a616",
  measurementId: "G-ZLYDL71CJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };