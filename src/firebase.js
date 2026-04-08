import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configurar escopos adicionais para o Google
provider.addScope('profile');
provider.addScope('email');

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    return { user, token };
  } catch (error) {
    console.error("Erro detalhado no login com Google:", {
      code: error.code,
      message: error.message,
      error: error
    });
    throw error;
  }
};

export { auth, signInWithGoogle };