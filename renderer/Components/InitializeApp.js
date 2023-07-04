// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtscDfxPxEXpEbC4zB2Mc0Lc0Iq_3ZvBo",
  authDomain: "lab-management-84566.firebaseapp.com",
  projectId: "lab-management-84566",
  storageBucket: "lab-management-84566.appspot.com",
  messagingSenderId: "839746196092",
  appId: "1:839746196092:web:14dc8faf8cf2699aa62ff9",
  measurementId: "G-7HFRT09T1R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const storageRef = ref;
