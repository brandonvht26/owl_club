import React from 'react';
import './Galeria.css'; 

import buho from '../../assets/images/buho.png'; 
import buho_biblioteca from '../../assets/images/buho_biblioteca.png';
import buho_lector from '../../assets/images/buho_lector.png';
import buho_soleado from '../../assets/images/buho_soleado.png'; 
import buholaptop from '../../assets/images/buholaptop.png';
import buhotablet from '../../assets/images/buhotablet.png';

const Galeria = () => {
  const images = [
    { src: buho, alt: 'Imagen de un búho' },
    { src: buho_biblioteca, alt: 'Búho en una biblioteca' },
    { src: buho_lector, alt: 'Búho leyendo' },
    { src: buho_soleado, alt: 'Búho al sol' },
    { src: buholaptop, alt: 'Búho con laptop' },
    { src: buhotablet, alt: 'Búho con tablet' },
  ];

  return (
    <section className="gallery__section">
      <div className="gallery__container">
        <div className="titulo__gallery">
          <h2>Galería</h2>
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