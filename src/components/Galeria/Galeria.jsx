
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Galeria.css'; 

/*
import buho from '../../assets/images/buho.png'; 
import buho_biblioteca from '../../assets/images/buho_biblioteca.png';
import buho_lector from '../../assets/images/buho_lector.png';
import buho_soleado from '../../assets/images/buho_soleado.png'; 
import buhotablet from '../../assets/images/buhotablet.png';
*/
import buholaptop from '../../assets/images/buholaptop.png';


import debate from '../../assets/images/debate.webp'
import estudiante from '../../assets/images/estudiante.webp'
import foro from '../../assets/images/foro.webp'
import libro from '../../assets/images/libro.webp'


const Galeria = () => {
  const { t } = useTranslation(); // 2. Usar el hook
  
  const images = [
    { src: debate, alt: 'Imagen de un búho' },
    { src: estudiante, alt: 'Búho en una biblioteca' },
    { src: foro, alt: 'Búho leyendo' },
    { src: libro, alt: 'Búho al sol' },
    { src: buholaptop, alt: 'Búho con laptop' },
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