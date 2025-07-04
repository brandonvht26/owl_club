import React from 'react';
import Header from './components/Header/Header';
import Galeria from './components/Galeria/Galeria'; 
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Download from './components/Download/Download';
import Footer from './components/Footer/Footer'; 
import Login from './pages/Login';
import { BrowserRouter, Route, Routes, Link } from "react-router";
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;