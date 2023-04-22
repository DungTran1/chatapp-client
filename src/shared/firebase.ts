import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVNAz-rDEoQZ9Cu7AtYFT1a3gr_6cajUA",
  authDomain: "groupchat-25273.firebaseapp.com",
  projectId: "groupchat-25273",
  storageBucket: "groupchat-25273.appspot.com",
  messagingSenderId: "1035269548849",
  appId: "1:1035269548849:web:b3e503894c025fbc035e10",
  measurementId: "G-CTJ8WMCQJ1",
};

const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);

export const auth = getAuth(app);
