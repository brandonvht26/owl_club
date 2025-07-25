import React from "react";
import { Link } from "react-router-dom";
import "./Download.css";
import owlClubLogo from "../../assets/images/logo1.png";

const Download = () => {
    return (
        <div className="section-wrapper" id="download"> 
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Lleva Owl Club Contigo</h2>
                        <p className="cta-description">
                            Instala nuestra Aplicación Web (PWA) directamente en tu celular o computadora para un acceso rápido y sin conexión.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/instalar" className="install-app-button">
                                <i className="fas fa-download"></i> Instalar Aplicación Web
                            </Link>
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

export default Download;
