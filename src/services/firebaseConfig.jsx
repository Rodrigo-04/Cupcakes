import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAXA0ATofOd-YiLobmG5VGRAh4soWE0DyM",
  authDomain: "cupcake-857d5.firebaseapp.com",
  projectId: "cupcake-857d5",
  storageBucket: "cupcake-857d5.firebasestorage.app",
  messagingSenderId: "605998025728",
  appId: "1:605998025728:web:ecf97a5d623377d07c9ce5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);