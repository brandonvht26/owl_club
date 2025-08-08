// src/App.jsx (ACTUALIZADO)

import Header from './components/Header/Header';
import Galeria from './components/Galeria/Galeria';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Download from './components/Download/Download';
import Footer from './components/Footer/Footer';
import Login from './pages/LoginPage';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import NotFound from './components/NotFound/NotFound';
import Register from './components/Register/Register';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import MemesPage from './pages/MemesPage';
import ForumPage from './pages/ForumPage';
import ForumDashboardPage from './pages/ForumDashboardPage';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import LoginPage from './pages/LoginPage';

// Import AuthProvider and PrivateRoute
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import InstallGuidePage from './pages/InstallGuidePage'; // <-- 1. AÑADE ESTA LÍNEA
import ProfilePage from './components/PerfilPage/PerfilPage';


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/instalar" element={<InstallGuidePage />} /> {/* <-- 2. AÑADE ESTA LÍNEA */}

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forum-dashboard" element={<ForumDashboardPage />} />
            <Route path="/memes" element={<MemesPage />} />
            <Route path="/foro" element={<ForumPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;