// src/components/Footer/Footer.jsx - ACTUALIZADO

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import './Footer.css';
import owlClubLogo from '../../assets/images/buho.png';

const Footer = () => {
  const { t } = useTranslation(); // 2. Usar el hook

  return (
    // 3. Reemplazar todos los textos fijos con la función t()
    <footer className="footer" data-aos="fade-in">
      <div className="footer-container">
        
        <div className="footer-logo-socials" data-aos="fade-right" data-aos-delay="100">
          <img src={owlClubLogo} alt="Owl Club Logo" className="footer-logo" />
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
          <h4>{t('footer.sections')}</h4>
          <ul>
            <li><a href="#">{t('footer.home')}</a></li>
            <li><a href="#">{t('header.services')}</a></li> {/* Reutilizamos la clave del header */}
            <li><a href="#">{t('header.gallery')}</a></li> {/* Reutilizamos la clave del header */}
            <li><a href="#">{t('header.downloads')}</a></li> {/* Reutilizamos la clave del header */}
          </ul>
        </div>

        <div className="footer-contact" data-aos="fade-up" data-aos-delay="300">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Quito, Ecuador</li>
            <li><i className="fas fa-phone"></i> +593 98 671 6146</li>
            <li><i className="fas fa-envelope"></i> info@owlclub.com</li>
          </ul>
        </div>

        <div className="footer-slogan" data-aos="fade-left" data-aos-delay="400">
          <h4>{t('footer.slogan_title')}</h4>
          <p>{t('footer.slogan_text')}</p>
        </div>
      </div>
      
      <div className="footer-bottom" data-aos="fade-up" data-aos-delay="500">
        <p dangerouslySetInnerHTML={{ __html: t('footer.copyright') }} />
      </div>
    </footer>
  );
};

export default Footer;