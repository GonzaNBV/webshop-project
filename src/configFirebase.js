import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCG8WjZREBO8Fqy5DMh6KFGcUjrQeFBap4",
  authDomain: "react-a4dbb.firebaseapp.com",
  projectId: "react-a4dbb",
  storageBucket: "react-a4dbb.appspot.com",
  messagingSenderId: "484153769649",
  appId: "1:484153769649:web:fd661cae3b1f71429b6c90",
  measurementId: "G-NYKS280DD1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };