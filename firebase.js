// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7OUG6HtVsbT3mCbObg2DtaOJugjMtm8k",
  authDomain: "inventorytracker-ab1e2.firebaseapp.com",
  projectId: "inventorytracker-ab1e2",
  storageBucket: "inventorytracker-ab1e2.appspot.com",
  messagingSenderId: "118665710451",
  appId: "1:118665710451:web:cfa46dacfee25ad32d9306",
  measurementId: "G-6MG6MNW4K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
