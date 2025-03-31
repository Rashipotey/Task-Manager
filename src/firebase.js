import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCoAd_cfeCrmiJw5Zz-8kNuSKjjBq4XqgY",
  authDomain: "task-manager-a4542.firebaseapp.com",
  projectId: "task-manager-a4542",
  storageBucket: "task-manager-a4542.firebasestorage.app",
  messagingSenderId: "105069020342",
  appId: "1:105069020342:web:b83ac78138055ed0dc9217",
  measurementId: "G-PYGDXGD4XN"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)