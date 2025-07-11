// src/components/Footer/Footer.jsx

import React from 'react';
import './Footer.css';
import owlClubLogo from '../../assets/images/buho.png';

const Footer = () => {
  return (
    // El contenedor principal también puede tener una animación base
    <footer className="footer" data-aos="fade-in">
      <div className="footer-container">
        
        {/* Columna 1: Logo y Redes Sociales (Aparece desde la izquierda) */}
        <div className="footer-logo-socials" data-aos="fade-right" data-aos-delay="100">
          <img src={owlClubLogo} alt="Owl Club Logo" className="footer-logo" />
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Columna 2: Links (Aparece hacia arriba con retraso) */}
        <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
          <h4>Secciones</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Galería</a></li>
            <li><a href="#">Descargas</a></li>
          </ul>
        </div>

        {/* Columna 3: Contacto (Aparece hacia arriba con más retraso) */}
        <div className="footer-contact" data-aos="fade-up" data-aos-delay="300">
          <h4>Contacto</h4>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Quito, Ecuador</li>
            <li><i className="fas fa-phone"></i> +593 98 671 6146</li>
            <li><i className="fas fa-envelope"></i> info@owlclub.com</li>
          </ul>
        </div>

        {/* Columna 4: Slogan (Aparece desde la derecha) */}
        <div className="footer-slogan" data-aos="fade-left" data-aos-delay="400">
          <h4>Slogan</h4>
          <p>"Conocimiento que nunca duerme"</p>
        </div>
      </div>
      
      {/* Parte inferior del footer (Aparece al final) */}
      <div className="footer-bottom" data-aos="fade-up" data-aos-delay="500">
        <p>&copy; 2024 Owl Club. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;