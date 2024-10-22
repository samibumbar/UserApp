// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTM-zuCxK4lvqU35iafNKw8txYtW6rV0g",
  authDomain: "talknest-a9019.firebaseapp.com",
  projectId: "talknest-a9019",
  storageBucket: "talknest-a9019.appspot.com",
  messagingSenderId: "462819588276",
  appId: "1:462819588276:web:e2cf86d1149dcb76637fe1",
  measurementId: "G-9TD90EZFLB",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
