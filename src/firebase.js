import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

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

// Firestore helper functions (minimal, para MVP)
const db = getFirestore(app);

const createChildProfile = async (guardianId, childData) => {
  try {
    // grava na subcoleção users/{guardianId}/children
    const childRef = doc(collection(db, `users/${guardianId}/children`));
    const payload = {
      ...childData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(childRef, payload);
    return { id: childRef.id, ...payload };
  } catch (error) {
    console.error('Erro ao criar perfil de menor:', error);
    throw error;
  }
};

export { createChildProfile };

const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Erro ao criar utilizador com email:', error);
    throw error;
  }
};

const createUserDocument = async (uid, data) => {
  try {
    const userRef = doc(db, `users/${uid}`);
    const payload = {
      uid,
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, payload);
    return { id: uid, ...payload };
  } catch (error) {
    console.error('Erro ao criar documento de utilizador:', error);
    throw error;
  }
};

export { signUpWithEmail, createUserDocument };

const updateChildProfile = async (guardianId, childId, childData) => {
  try {
    const childRef = doc(db, `users/${guardianId}/children/${childId}`);
    const payload = {
      ...childData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(childRef, payload);
    return { id: childId, ...payload };
  } catch (error) {
    console.error('Erro ao atualizar perfil de menor:', error);
    throw error;
  }
};

const deleteChildProfile = async (guardianId, childId) => {
  try {
    const childRef = doc(db, `users/${guardianId}/children/${childId}`);
    await deleteDoc(childRef);
    return true;
  } catch (error) {
    console.error('Erro ao apagar perfil de menor:', error);
    throw error;
  }
};

export { updateChildProfile, deleteChildProfile };

const getChildrenProfiles = async (guardianId) => {
  try {
    const childrenCol = collection(db, `users/${guardianId}/children`);
    const q = query(childrenCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return items;
  } catch (error) {
    console.error('Erro ao buscar perfis de menores:', error);
    throw error;
  }
};

export { getChildrenProfiles };

const listenChildrenProfiles = (guardianId, onUpdate, onError) => {
  try {
    const childrenCol = collection(db, `users/${guardianId}/children`);
    const q = query(childrenCol, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(items);
    }, (err) => {
      console.error('Erro no onSnapshot dos perfis:', err);
      if (onError) onError(err);
    });

    return unsub;
  } catch (error) {
    console.error('Erro ao iniciar listenChildrenProfiles:', error);
    if (onError) onError(error);
    return () => {};
  }
};

export { listenChildrenProfiles };