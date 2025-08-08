// src/App.jsx (ACTUALIZADO Y CORREGIDO)

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// Contexto y Rutas
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage'; // Asegúrate de que este import sea correcto
import DashboardPage from './pages/DashboardPage';
import ForumDashboardPage from './pages/ForumDashboardPage';
import ForumPage from './pages/ForumPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProfilePage from './components/PerfilPage/PerfilPage'; // La página de perfil propio
import UserProfilePage from './pages/UserProfilePage'; // La página de perfil público de otros
import InstallGuidePage from './pages/InstallGuidePage';
import MemesPage from './pages/MemesPage';


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
          {/* --- RUTAS PÚBLICAS (Cualquiera puede acceder) --- */}
          <Route index element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/instalar" element={<InstallGuidePage />} />

          {/* --- RUTAS DEL FORO (Ahora son públicas para leer) --- */}
          <Route path="/foro" element={<ForumPage />} />
          <Route path="/foro/:questionId" element={<QuestionDetailPage />} />
          
          {/* La página de perfil público también debe ser accesible */}
          <Route path="/perfil/:userId" element={<UserProfilePage />} />


          {/* --- RUTAS PROTEGIDAS (Requieren iniciar sesión) --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forum-dashboard" element={<ForumDashboardPage />} />
            <Route path="/memes" element={<MemesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            {/* Las rutas que estaban aquí y se hicieron públicas ya no necesitan estar aquí */}
          </Route>

          {/* --- RUTA PARA PÁGINAS NO ENCONTRADAS --- */}
          {/* Es importante que NotFoundPage use el componente correcto, en tu caso parece ser NotFound */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;