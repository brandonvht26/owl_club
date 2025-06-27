// src/App.js (Ejemplo)
import React from 'react';
import Galeria from './components/Galeria/Galeria'; // Importa el componente Galeria
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services'
// Importa otros componentes si los tienes, como HeroSection, MemberCard, ContactForm, etc.

function App() {
  return (
    <div className="App">
      <Hero />
      <Services/>
      <Galeria />
    </div>
  );
}

export default App;
