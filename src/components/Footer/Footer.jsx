import React from 'react';
import './Footer.css';
import owlClubLogo from '../../assets/images/buho.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-socials">
          <img src={owlClubLogo} alt="Owl Club Logo" className="footer-logo" />
          <div className="social-icons">
            {/* Los enlaces de redes sociales permanecen igual */}
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Secciones</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Galería</a></li>
            <li><a href="#">Descargas</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contacto</h4>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Quito, Ecuador</li>
            <li><i className="fas fa-phone"></i> +593 98 671 6146</li>
            <li><i className="fas fa-envelope"></i> info@owlclub.com</li>
          </ul>
        </div>

        <div className="footer-slogan">
          <h4>Slogan</h4>
          <p>"Conocimiento que nunca duerme"</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Owl Club. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;