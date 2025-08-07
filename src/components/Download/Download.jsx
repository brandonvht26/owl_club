// src/components/Download/Download.jsx - ACTUALIZADO

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Importar hook
import "./Download.css";
import owlClubLogo from "../../assets/images/logo1.png";

const Download = () => {
    const { t } = useTranslation(); // 2. Usar el hook

    return (
        // El id ya estaba aquí, lo cual es perfecto
        <div className="section-wrapper" id="download"> 
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        {/* 3. Reemplazar textos con la función t() */}
                        <h2 className="cta-title">{t('downloads.title')}</h2>
                        <p className="cta-description">
                            {t('downloads.description')}
                        </p>
                        <div className="cta-buttons">
                            <Link to="/instalar" className="install-app-button">
                                <i className="fas fa-download"></i> {t('downloads.button')}
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