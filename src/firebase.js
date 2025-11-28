// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCq2h8t4zzaZzElweLOZcvNCcIzuzxDG6c",
  authDomain: "proyectonuam.firebaseapp.com",
  projectId: "proyectonuam",
  storageBucket: "proyectonuam.firebasestorage.app",
  messagingSenderId: "540568997468",
  appId: "1:540568997468:web:0e9299d14e268ff33da099"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
