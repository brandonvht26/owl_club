// src/pages/MemesPage.jsx
import React from 'react';
import Header from '../components/Header/Header'; // Si quieres que el header aparezca aquí
import MemeGallery from '../components/MemeGallery/MemeGallery'; // Importa tu componente de galería de memes
import Footer from '../components/Footer/Footer'; // Si quieres que el footer aparezca aquí

function MemesPage() {
  return (
    <>
      <Header /> 
      <main style={{ padding: '20px' }}> 
        <MemeGallery /> 
      </main>
      <Footer /> 
    </>
  );
}

export default MemesPage;