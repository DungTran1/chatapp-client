import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVNAz-rDEoQZ9Cu7AtYFT1a3gr_6cajUA",
  authDomain: "groupchat-25273.firebaseapp.com",
  databaseURL: "https://groupchat-25273-default-rtdb.firebaseio.com",
  projectId: "groupchat-25273",
  // ...
};

const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);

export const auth = getAuth(app);
