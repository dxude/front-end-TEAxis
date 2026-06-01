import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

// AS CHAVES VERDADEIRAS DO SEU PROJETO ESTÃO AQUI AGORA 💅✨
const firebaseConfig = {
  apiKey: "AIzaSyBGq3DXM3g0X8TlwoWfLgY0I0jw-3vNxv4",
  authDomain: "teaxis-64a5e.firebaseapp.com",
  projectId: "teaxis-64a5e",
  storageBucket: "teaxis-64a5e.firebasestorage.app",
  messagingSenderId: "918465244954",
  appId: "1:918465244954:web:3f7ae21a674063096a06a3",
  measurementId: "G-TVPFGTR35E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configurar escopos adicionais para o Google
provider.addScope('profile');
provider.addScope('email');

const signInWithGoogle = async () => {
  try {
    console.log('Iniciando signInWithGoogle...');
    console.log('Auth instance:', auth);
    console.log('Provider instance:', provider);
    
    const result = await signInWithPopup(auth, provider);
    console.log('SignInWithPopup sucesso:', result);
    
    const user = result.user;
    const token = await user.getIdToken();
    
    console.log('Token obtido:', token);
    return { user, token };
  } catch (error) {
    console.error("❌ ERRO DETALHADO NO LOGIN COM GOOGLE:", {
      code: error.code,
      message: error.message,
      customData: error.customData,
      fullError: error
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