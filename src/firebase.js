// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4PeHCmdLGF5tMNquXBALIb-WL7t_NeCU",
    authDomain: "owlclub-691e7.firebaseapp.com",
    projectId: "owlclub-691e7",
    storageBucket: "owlclub-691e7.firebasestorage.app",
    messagingSenderId: "820892260858",
    appId: "1:820892260858:web:54f086d5c7c675e6f36c43"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export const authFirebase=getAuth();
export const dbFirebase=getFirestore(appFirebase);

export default appFirebase;