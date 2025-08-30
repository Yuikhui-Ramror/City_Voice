import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlkzNo6EQHdi6wlmMFPmbBLvET99cC1nQ",
  authDomain: "cityvoice-8f0d0.firebaseapp.com",
  projectId: "cityvoice-8f0d0",
  storageBucket: "cityvoice-8f0d0.firebasestorage.app",
  messagingSenderId: "747571714284",
  appId: "1:747571714284:web:1ded856da4926e195cedc9",
  measurementId: "G-Z26GEZDMEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();