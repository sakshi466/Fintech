import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  measurementId: "G-L3S9N4NLDG",
  apiKey: "AIzaSyAKOcWwLFe_LNUWI2mcW9bMhtE1c2AoqXQ",
  authDomain: "fintech-af349.firebaseapp.com",
  databaseURL: "https://fintech-af349-default-rtdb.firebaseio.com",
  projectId: "fintech-af349",
  storageBucket: "fintech-af349.firebasestorage.app",
  messagingSenderId: "379681100588",
  appId: "1:379681100588:web:369cca721db7f3bc265289"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app); // Realtime database reference

export default app;
