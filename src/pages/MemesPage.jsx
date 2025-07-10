// src/pages/MemesPage.jsx
import React from 'react';
import Header from '../components/Header/Header'; // Si quieres que el header aparezca aquí
import MemeGallery from '../components/MemeGallery/MemeGallery'; // Importa tu componente de galería de memes
import Footer from '../components/Footer/Footer'; // Si quieres que el footer aparezca aquí

function MemesPage() {
  return (
    <>
      <Header /> {/* Muestra el Header de tu app */}
      <main style={{ padding: '20px' }}> {/* Contenedor principal de la página, opcional */}
        <MemeGallery /> {/* Aquí se renderiza la galería de memes */}
      </main>
      <Footer /> {/* Muestra el Footer de tu app */}
    </>
  );
}

export default MemesPage;