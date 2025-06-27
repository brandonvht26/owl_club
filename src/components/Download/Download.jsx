import React from "react";
import "./Download.css";

import googlePlayBadge from "../../assets/images/GetitOnGooglePlay.png";
import appStoreBadge from "../../assets/black.svg";
import owlClubLogo from "../../assets/images/logo1.png";

const App = () => {
    return (
        // Usamos 'div' como contenedor principal para centrar la sección en la página.
        <div className="section-wrapper">
        <section className="cta-section">
            <div className="cta-container">
            
            <div className="cta-content">
                <h2 className="cta-title">Lleva Owl Club Contigo</h2>
                <p className="cta-description">
                Toda la ayuda que necesitas, ahora en tu bolsillo. Descarga la app y accede a un universo de conocimiento universitario donde sea que estés.
                </p>
                <div className="cta-buttons">
                <a href="#" className="cta-store-button">
                    <img src={googlePlayBadge} alt="Descargar en Google Play" />
                </a>
                <a href="#" className="cta-store-button">
                    <img src={appStoreBadge} alt="Descargar en App Store" />
                </a>
                </div>
            </div>
            
            <div className="cta-image-wrapper">
                <img src={owlClubLogo} alt="Vista previa de la App Owl Club" className="cta-image" />
            </div>

            </div>
        </section>
        </div>
    );
};

export default App;
