import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// O getAnalytics é opcional para a funcionalidade de login, mas mantido se for usado
import { getAnalytics } from "firebase/analytics"; 

// Sua configuração real do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBiztuOiweQqp3zhO29pbidEA_biLYstSU",
  authDomain: "teaxis.firebaseapp.com",
  projectId: "teaxis",
  storageBucket: "teaxis.firebasestorage.app",
  messagingSenderId: "220465530060",
  appId: "1:220465530060:web:26d15d0167d779a15bee69",
  measurementId: "G-M737SM8YN6"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o serviço de autenticação e o exporta para uso no Login.jsx
export const auth = getAuth(app); 

// O Analytics é inicializado, mas não é estritamente necessário para o login
// const analytics = getAnalytics(app); 

export default app;