import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1-dnxGdEMypSj3J2iMrcHuvDCRN4v9F4",
  authDomain: "karigarai-da2c5.firebaseapp.com",
  projectId: "karigarai-da2c5",
  storageBucket: "karigarai-da2c5.firebasestorage.app",
  messagingSenderId: "267311163096",
  appId: "1:267311163096:android:bafba96eb07f38383fd9ad",
};

// Prevent duplicate app initialization (important for hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
