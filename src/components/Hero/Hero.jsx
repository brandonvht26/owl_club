// src/components/Hero/Hero.jsx - VERSIÓN CORREGIDA Y FINAL

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { useTranslation } from 'react-i18next';
import "./Hero.css";
import logo from "../../assets/images/logo1.png";

const Hero = () => {
  const textRef = useRef(null);
  const typedInstance = useRef(null); // Referencia para guardar la instancia de Typed.js
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Opciones de configuración para Typed.js
    const options = {
      strings: [t('hero.title')], // Usamos t() para obtener el texto traducido
      typeSpeed: 40,
      showCursor: false,
      backSpeed: 20,
      backDelay: 1000,
      loop: false,
    };

    // Destruimos la instancia anterior si existe, para evitar duplicados al cambiar de idioma
    if (typedInstance.current) {
      typedInstance.current.destroy();
    }
    
    // Creamos la nueva instancia de Typed.js y la guardamos en la referencia
    typedInstance.current = new Typed(textRef.current, options);

    // Función de limpieza que se ejecuta cuando el componente se desmonta o actualiza
    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [t, i18n.language]); // El efecto se volverá a ejecutar cada vez que cambie el idioma

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-image">
          <img src={logo} alt="Logo Owl Club" className="hero-logo" />
        </div>

        <div className="hero-content">
          {/* El span ahora usa textRef para que Typed.js pueda controlarlo */}
          <span ref={textRef} className="hero-text"></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;