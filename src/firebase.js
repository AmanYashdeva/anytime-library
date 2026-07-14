import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFXX7t292B-MQ6VCtNpCKC9Atvwa1gn2k",
  authDomain: "anytime-library-46713.firebaseapp.com",
  projectId: "anytime-library-46713",
  storageBucket: "anytime-library-46713.firebasestorage.app",
  messagingSenderId: "347064824424",
  appId: "1:347064824424:web:3e9303020c7ff2abe2c1dd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);