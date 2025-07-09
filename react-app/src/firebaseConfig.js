import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC_5SGRzdlHeKC9kQLVAbMCPsc6w7tteCQ",
  authDomain: "namastedoctor-2c707.firebaseapp.com",
  databaseURL: "https://namastedoctor-2c707-default-rtdb.firebaseio.com",
  projectId: "namastedoctor-2c707",
  storageBucket: "namastedoctor-2c707.appspot.com",
  messagingSenderId: "494276934854",
  appId: "1:494276934854:web:ba9c89c2fbb1502d9eabc7"
};

const app = initializeApp(firebaseConfig);

export default app; 