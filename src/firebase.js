import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4Lz_RRCwOvsdxK3Q4xe2dePOGedbaFss",
  authDomain: "report2clean.firebaseapp.com",
  projectId: "report2clean",
  storageBucket: "report2clean.appspot.com", // ✅ FIXED HERE
  messagingSenderId: "1035199650465",
  appId: "1:1035199650465:web:d6280d0f92b9554e782ee0",
  measurementId: "G-8WJ8Y1DGC0"
};
 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
