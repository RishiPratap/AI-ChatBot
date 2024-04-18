// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA97WZ_FUO0bSpREsP7S4oJMVdZQNsXrB0",
  authDomain: "ai-chatbot-auth.firebaseapp.com",
  projectId: "ai-chatbot-auth",
  storageBucket: "ai-chatbot-auth.appspot.com",
  messagingSenderId: "439851236428",
  appId: "1:439851236428:web:cd4169c5088e155e0e48e9",
  measurementId: "G-ZEY9SPNP1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {auth, provider, signInWithPopup, db};