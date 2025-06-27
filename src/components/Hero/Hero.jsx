import React from "react";
import "./Hero.css";
import logo from "../../assets/images/logo1.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-image">
          <img src={logo} alt="Logo Owl Club" className="hero-logo" />
        </div>

        <div className="hero-content">
          <p className="hero-text">
            <span className="yellow">Preguntar</span> es el primer paso para{" "}
            <span className="yellow">aprender</span>
          </p>
          <p className="hero-text2">
            <span className="purple">¡Estamos contigo!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;