// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authFirebase } from '../firebase'; // Import your Firebase auth instance
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(authFirebase, email, password);
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