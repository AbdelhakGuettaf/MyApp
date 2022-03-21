// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBj3_l3JvqKLK0O6YwAs_yYjp19LeFM-sw",
  authDomain: "kazi-dev.firebaseapp.com",
  projectId: "kazi-dev",
  storageBucket: "kazi-dev.appspot.com",
  messagingSenderId: "268036555202",
  appId: "1:268036555202:web:89282146a6c040094ad65b",
};

// Initialize Firebase
export const InitApp = initializeApp(firebaseConfig);
export const db = getFirestore();
/* 
 apiKey: "AIzaSyDGuh5ATqKyl7Oypmj_3vmzLg8U1fJ3tGE",
  authDomain: "api-kazitour.firebaseapp.com",
  databaseURL:
    "https://api-kazitour-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "api-kazitour",
  storageBucket: "api-kazitour.appspot.com",
  messagingSenderId: "16517803817",
  appId: "1:16517803817:web:8f7c40c40a76ce6fa89138",
  measurementId: "G-X19YV8V38D",
  */
