// src/components/Footer/Footer.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import owlClubLogo from '../../assets/images/buho.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer" data-aos="fade-in">
      <div className="footer-container">
        
        <div className="footer-logo-socials" data-aos="fade-right" data-aos-delay="100">
          <img src={owlClubLogo} alt="Owl Club Logo" className="footer-logo" />
          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            {/* --- ESTA ES LA LÍNEA MODIFICADA --- */}
            <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer" aria-label="Reddit"><i className="fab fa-reddit"></i></a>
          </div>
        </div>

        <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
          <h4>{t('footer.sections')}</h4>
          <ul>
            <li><a href="#">{t('footer.home')}</a></li>
            <li><a href="#">{t('header.services')}</a></li>
            <li><a href="#">{t('header.gallery')}</a></li>
            <li><a href="#">{t('header.downloads')}</a></li>
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