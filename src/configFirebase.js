import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTlexlVzR__R-pN_avwvAMMRK7qeEWuLE",
  authDomain: "webshop-project-63a39.firebaseapp.com",
  databaseURL: "https://webshop-project-63a39-default-rtdb.firebaseio.com",
  projectId: "webshop-project-63a39",
  storageBucket: "webshop-project-63a39.appspot.com",
  messagingSenderId: "792967570901",
  appId: "1:792967570901:web:51d90c180baaa14179895c",
  measurementId: "G-PV001C7NVX"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
