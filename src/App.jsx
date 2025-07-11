import Header from './components/Header/Header';
import Galeria from './components/Galeria/Galeria'; 
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Download from './components/Download/Download';
import Footer from './components/Footer/Footer'; 
import Login from './pages/Login';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom"; // Corregido: "react-router-dom"
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import NotFound from './components/NotFound/NotFound';
import Register from './components/Register/Register';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import MemesPage from './pages/MemesPage'; 

import React, { useEffect } from 'react'; 
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 
import './App.css'; 


function App() {
  // useEffect para inicializar AOS cuando el componente App se monta
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
      once: false,   // Las animaciones se repiten cada vez que el elemento entra en el viewport
      // mirror: true, // Las animaciones se reproducen también al desplazarse hacia atrás
    });
    
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez al montar el componente

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/memes" element={<MemesPage />} /> 
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;