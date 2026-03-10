import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiztuOiweQqp3zhO29pbidEA_biLYstSU",
  authDomain: "teaxis.firebaseapp.com",
  projectId: "teaxis",
  appId: "1:220465530060:web:26d15d0167d779a15bee69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    return { user, token };
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};

export { auth, signInWithGoogle };