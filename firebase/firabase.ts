// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5zEJdNsLi8K3QPGJaKR3iIdsv6eI3B6c",
  authDomain: "marketplace-coaching.firebaseapp.com",
  projectId: "marketplace-coaching",
  storageBucket: "marketplace-coaching.firebasestorage.app",
  messagingSenderId: "260111080527",
  appId: "1:260111080527:web:943bc87dc37ce6085dde3a",
  measurementId: "G-P5DXZEJ27X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
