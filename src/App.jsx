// src/App.js (Ejemplo)
import React from 'react';
import Header from './components/Header/Header';
import Galeria from './components/Galeria/Galeria'; 
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services'
import Download from './components/Download/Download'; // Importa el componente Download
import Footer from './components/Footer/Footer'; 
// Importa otros componentes si los tienes, como HeroSection, MemberCard, ContactForm, etc.

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Services/>
      <Galeria />
      <Download />
      <Footer />
    </div>
  );
}

export default App;