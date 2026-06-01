// NOTA: Este arquivo não é mais usado. Use firebase.js em vez disso.
// Mantido apenas para compatibilidade retroativa.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiztuOiweQqp3zhO29pbidEA_biLYstSU",
  authDomain: "teaxis.firebaseapp.com",
  projectId: "teaxis",
  storageBucket: "teaxis.firebasestorage.app",
  messagingSenderId: "220465530060",
  appId: "1:220465530060:web:26d15d0167d779a15bee69",
  measurementId: "G-M737SM8YN6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;