// src/App.js (Ejemplo)
import React from 'react';
import Galeria from './components/Galeria/Galeria'; // Importa el componente Galeria
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services'
import Download from './components/Download/Download'; // Importa el componente Download
// Importa otros componentes si los tienes, como HeroSection, MemberCard, ContactForm, etc.

function App() {
  return (
    <div className="App">
      <Hero />
      <Services/>
      <Galeria />
      <Download />
    </div>
  );
}

export default App;
