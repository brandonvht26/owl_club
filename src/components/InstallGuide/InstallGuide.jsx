// src/components/InstallGuide/InstallGuide.jsx - ACTUALIZADO

import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next'; // 1. Importar hooks
import './InstallGuide.css';
import buhoLogo from '../../assets/images/buho.png';

const InstallGuide = () => {
    const { t } = useTranslation(); // 2. Usar el hook
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [os, setOs] = useState('desktop');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            setOs('android');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setOs('ios');
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
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
                        <h2>{t('install_guide.almost_ready')}</h2>
                        <p>{t('install_guide.android_text')}</p>
                        {deferredPrompt ? (
                            <button className="install-button" onClick={handleInstallClick}>
                                <i className="fas fa-download"></i> {t('install_guide.install_button')}
                            </button>
                        ) : (
                             <p className="fallback-text">{t('install_guide.fallback_text')}</p>
                        )}
                    </>
                );
            case 'ios':
                return (
                    <>
                        <h2>{t('install_guide.almost_ready')}</h2>
                        <p>{t('install_guide.ios_text')}</p>
                        <ol className="steps-list">
                            {/* Usamos Trans para renderizar el HTML de las traducciones */}
                            <li><Trans i18nKey="install_guide.ios_step1" components={{ strong: <strong />, i: <i /> }} /></li>
                            <li><Trans i18nKey="install_guide.ios_step2" components={{ strong: <strong />}} /></li>
                        </ol>
                    </>
                );
            default:
                return (
                    <>
                        <h2>{t('install_guide.almost_ready')}</h2>
                        <p>{t('install_guide.desktop_text')}</p>
                        {deferredPrompt ? (
                            <button className="install-button" onClick={handleInstallClick}>
                                <i className="fas fa-desktop"></i> {t('install_guide.desktop_button')}
                            </button>
                        ) : (
                             <p className="fallback-text">{t('install_guide.fallback_text')}</p>
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