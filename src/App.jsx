import React from 'react';
import Header from './components/Header/Header';
import Galeria from './components/Galeria/Galeria'; 
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Download from './components/Download/Download';
import Footer from './components/Footer/Footer'; 
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <Header />
              <Hero />
              <Services />
              <Galeria />
              <Download />
              <Footer />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;