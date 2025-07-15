// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdnFS0xSP37vE-MxZi5uERXFTxpi6GSZ8",
  authDomain: "marketplace-demo-eb5a5.firebaseapp.com",
  projectId: "marketplace-demo-eb5a5",
  storageBucket: "marketplace-demo-eb5a5.firebasestorage.app",
  messagingSenderId: "1094769924781",
  appId: "1:1094769924781:web:c58c2592ef848d7d04c424",
  measurementId: "G-HWXJE1Q0G9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
