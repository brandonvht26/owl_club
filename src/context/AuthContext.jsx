// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authFirebase } from '../firebase'; // Import your Firebase auth instance
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; // <-- AÑADE ESTA LÍNEA
import { dbFirebase } from '../firebase'; // 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(authFirebase, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(authFirebase);
  };

  // Register function (optional, you can keep it in Register.jsx if you prefer)
  const registerUser = async (email, password) => {
      try {
          // 1. Crea el usuario en Firebase Authentication (esto no cambia)
          const userCredential = await createUserWithEmailAndPassword(authFirebase, email, password);
          const newUser = userCredential.user;

          // 2. ¡NUEVO! Crea el documento para ese usuario en la colección "users"
          const userDocRef = doc(dbFirebase, "users", newUser.uid);
          await setDoc(userDocRef, {
              uid: newUser.uid,
              email: newUser.email,
              displayName: newUser.email.split('@')[0], // Un nombre por defecto
              photoURL: '', // URL de foto vacía por defecto
              points: 0,    // Empieza con 0 puntos
              createdAt: new Date(),
              // Otros campos que quieras inicializar
              bio: '',
              age: '',
              nationality: '',
              hobby: ''
          });

          return userCredential; // Devuelve las credenciales como antes

      } catch (error) {
          console.error("Error en el proceso de registro completo:", error);
          // Re-lanza el error para que el componente Register pueda manejarlo
          throw error;
      }
  };

  const value = {
    currentUser,
    login,
    logout,
    registerUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when auth state is loaded */}
    </AuthContext.Provider>
  );
};