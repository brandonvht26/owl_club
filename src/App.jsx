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
// src/App.jsx - ACTUALIZADO CON SUSPENSE

import React, { useEffect, Suspense } from 'react'; // 1. Importa Suspense
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// ... (todas tus importaciones de páginas se mantienen igual)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InstallGuidePage from './pages/InstallGuidePage';
import DashboardPage from './pages/DashboardPage';
import ForumDashboardPage from './pages/ForumDashboardPage';
import MemesPage from './pages/MemesPage';
import ForumPage from './pages/ForumPage';
import ForumDashboardPage from './pages/ForumDashboardPage';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import LoginPage from './pages/LoginPage';

// Import AuthProvider and PrivateRoute
import NotFoundPage from './pages/NotFoundPage';

// ... (el resto de tus importaciones se mantienen igual)
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
    // 2. Envuelve TODO el contenido dentro de BrowserRouter con Suspense
    <Suspense fallback={<div>Cargando...</div>}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas Públicas */}
            <Route index element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/instalar" element={<InstallGuidePage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forum-dashboard" element={<ForumDashboardPage />} />
            <Route path="/memes" element={<MemesPage />} />
            <Route path="/foro" element={<ForumPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
            {/* Rutas Protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/forum-dashboard" element={<ForumDashboardPage />} />
              <Route path="/memes" element={<MemesPage />} />
              <Route path="/foro" element={<ForumPage />} />
            </Route>

            {/* Ruta para página no encontrada */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;