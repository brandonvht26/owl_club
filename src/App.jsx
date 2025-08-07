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
import NotFoundPage from './pages/NotFoundPage';

// ... (el resto de tus importaciones se mantienen igual)
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