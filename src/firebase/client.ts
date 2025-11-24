
// firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",
  authDomain: "studio-8742723834-1421e.firebaseapp.com",
  projectId: "studio-8742723834-1421e",
  storageBucket: "studio-8742723834-1421e.appspot.com",
  messagingSenderId: "665625375719",
  appId: "1:665625375719:web:d680c46b80cd64e3578342"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
