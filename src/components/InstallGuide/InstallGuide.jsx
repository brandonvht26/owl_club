import React, { useState, useEffect } from 'react';
import './InstallGuide.css';
import buhoLogo from '../../assets/images/buho.png';

const InstallGuide = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [os, setOs] = useState('desktop');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            setOs('android');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setOs('ios');
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
    };

    const renderContent = () => {
        switch (os) {
            case 'android':
                return (
                    <>
                        <h2>¡Casi listo!</h2>
                        <p>Toca el botón de abajo para instalar Owl Club en tu dispositivo.</p>
                        {deferredPrompt ? (
                            <button className="install-button" onClick={handleInstallClick}>
                                <i className="fas fa-download"></i> Instalar Aplicación
                            </button>
                        ) : (
                             <p className="fallback-text">Si no ves el botón, busca "Instalar aplicación" en el menú (⋮) de Chrome.</p>
                        )}
                    </>
                );
            case 'ios':
                return (
                    <>
                        <h2>Pasos para Instalar en tu iPhone</h2>
                        <p>Para instalar Owl Club, sigue estos 2 sencillos pasos:</p>
                        <ol className="steps-list">
                            <li>Toca el ícono de <strong>Compartir</strong> <i className="fas fa-share-square"></i> en Safari.</li>
                            <li>Selecciona <strong>"Agregar a la pantalla de inicio"</strong>.</li>
                        </ol>
                    </>
                );
            default: // Esto ahora manejará la instalación en Escritorio
                return (
                    <>
                        <h2>Instala Owl Club en tu Computadora</h2>
                        <p>Haz clic en el botón de abajo para añadir la aplicación a tu escritorio y acceder a ella directamente.</p>
                        {deferredPrompt ? (
                            <button className="install-button" onClick={handleInstallClick}>
                                <i className="fas fa-desktop"></i> Instalar en Escritorio
                            </button>
                        ) : (
                             <p className="fallback-text">
                                 Tu navegador podría no ser compatible o la app ya está instalada. 
                                 Busca el ícono de instalación (<i className="fas fa-download"></i>) en la barra de direcciones.
                             </p>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="install-page">
            <div className="install-card">
                <img src={buhoLogo} alt="Owl Club Logo" className="install-logo" />
                <div className="install-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default InstallGuide;
