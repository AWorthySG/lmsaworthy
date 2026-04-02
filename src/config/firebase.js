import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded, set, onValue, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBzpx_k8G404dSuEUiNWatGCNutMlEyPMs",
  authDomain: "aworthy-lms.firebaseapp.com",
  databaseURL: "https://aworthy-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aworthy-lms",
  storageBucket: "aworthy-lms.firebasestorage.app",
  messagingSenderId: "980465378405",
  appId: "1:980465378405:web:394914749a87184e45d28c",
});

export const firebaseDb = getDatabase(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export { ref, push, onChildAdded, set, onValue, get } from "firebase/database";
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
export { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
