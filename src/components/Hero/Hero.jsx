import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import "./Hero.css";
import logo from "../../assets/images/logo1.png";

const Hero = () => {
  const text = useRef(null);

  useEffect(() => {
    const typed = new Typed(text.current, {
      strings: [
        '<span class="yellow">Preguntar</span> es el primer paso para <span class="yellow">aprender</span>. <span class="purple">¡Estamos contigo!</span>'
      ],
      typeSpeed: 40,
      showCursor: false,
      backSpeed: 20,
      backDelay: 1000,
      loop: false,
    });

    // Limpiar Typed cuando el componente se desmonte
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-image">
          <img src={logo} alt="Logo Owl Club" className="hero-logo" />
        </div>

        <div className="hero-content">
          <span ref={text} className="hero-text"></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;