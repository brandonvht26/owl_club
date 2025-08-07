// src/components/Galeria/Galeria.jsx - ACTUALIZADO

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import './Galeria.css'; 

// ... (importaciones de imágenes sin cambios)
import buho from '../../assets/images/buho.png'; 
import buho_biblioteca from '../../assets/images/buho_biblioteca.png';
import buho_lector from '../../assets/images/buho_lector.png';
import buho_soleado from '../../assets/images/buho_soleado.png'; 
import buholaptop from '../../assets/images/buholaptop.png';
import buhotablet from '../../assets/images/buhotablet.png';


const Galeria = () => {
  const { t } = useTranslation(); // 2. Usar el hook
  
  const images = [
    { src: buho, alt: 'Imagen de un búho' },
    { src: buho_biblioteca, alt: 'Búho en una biblioteca' },
    { src: buho_lector, alt: 'Búho leyendo' },
    { src: buho_soleado, alt: 'Búho al sol' },
    { src: buholaptop, alt: 'Búho con laptop' },
    { src: buhotablet, alt: 'Búho con tablet' },
  ];

  return (
    // La sección ahora tiene un id para que el scroll del header funcione
    <section className="gallery__section" id="galeria"> 
      <div className="gallery__container">
        <div className="titulo__gallery">
          {/* 3. Reemplazar texto fijo con la función t() */}
          <h2>{t('gallery.title')}</h2>
        </div>
        
        <div className="gallery">
          {images.map((image, index) => (
            <img 
              key={index} 
              src={image.src} 
              alt={image.alt} 
              data-aos="fade-up" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Galeria;