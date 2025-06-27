// src/App.js (Ejemplo)
import React from 'react';
import Galeria from './components/Galeria/Galeria'; 
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services'
import Download from './components/Download/Download';
import Header from './components/Header/Header';
// Importa otros componentes si los tienes, como HeroSection, MemberCard, ContactForm, etc.

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Services/>
      <Galeria />
      <Download />
    </div>
  );
}

export default App;
