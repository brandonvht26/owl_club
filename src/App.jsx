// src/App.jsx

import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// Importación de Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InstallGuidePage from './pages/InstallGuidePage';
import DashboardPage from './pages/DashboardPage';
import ForumDashboardPage from './pages/ForumDashboardPage';
import MemesPage from './pages/MemesPage';
import ForumPage from './pages/ForumPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './components/PerfilPage/PerfilPage';

// Importación de Contexto y Rutas Privadas
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    // Suspense se usa para mostrar un 'fallback' mientras se cargan componentes dinámicamente
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

            {/* Rutas Protegidas (requieren inicio de sesión) */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/forum-dashboard" element={<ForumDashboardPage />} />
              <Route path="/memes" element={<MemesPage />} />
              <Route path="/foro" element={<ForumPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
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
