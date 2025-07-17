// src/components/PrivateRoute/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const PrivateRoute = () => {
  const { currentUser } = useAuth(); // Get current user from AuthContext

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;