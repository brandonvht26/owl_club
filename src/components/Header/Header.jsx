// src/components/Header/Header.jsx (ACTUALIZADO PARA i18n)
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORTAR HOOK
import './Header.css';
import buhoLogo from '../../assets/images/buho.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    return [theme, toggleTheme];
};

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, toggleTheme] = useTheme();
    const { t, i18n } = useTranslation(); // <-- 2. USAR EL HOOK

    // --- NUEVO: Función para cambiar el idioma ---
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLinkClick = () => setIsMenuOpen(false);

    const handleLogout = async () => {
        handleLinkClick();
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
        }
    };

    const scrollToSection = (sectionId) => {
        handleLinkClick();
        if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
            navigate('/home');
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header>
            <nav className="navbar">
                <Link to="/home" className="navbar-brand" onClick={handleLinkClick}>
                    <img src={buhoLogo} alt="Logo OWL-CLUB" />
                    <span className="brand-text">OWL CLUB</span>
                </Link>

                <div className="nav-controls">
                    {/* Botón de cambio de idioma */}
                    <button onClick={() => changeLanguage(i18n.language === 'es' ? 'en' : 'es')} className="language-toggle-btn">
                        {i18n.language.toUpperCase()}
                    </button>

                    <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
                        <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
                    </button>

                    <button className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                    </button>
                </div>

                <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                    {/* --- 3. REEMPLAZAR TEXTO CON LA FUNCIÓN t() --- */}
                    <li><button onClick={() => scrollToSection('galeria')}>{t('header.gallery', 'Galería')}</button></li>
                    <li><button onClick={() => scrollToSection('services')}>{t('header.services', 'Servicios')}</button></li>
                    <li><button onClick={() => scrollToSection('download')}>{t('header.downloads', 'Descargas')}</button></li>
                    <li><Link to="/foro" onClick={handleLinkClick}>{t('header.forum', 'Foro')}</Link></li>

                    {!currentUser ? (
                        <>
                            <li><Link to="/register" className="btn-register" onClick={handleLinkClick}>{t('header.register', 'Regístrate')}</Link></li>
                            <li><Link to="/login" className="btn-login" onClick={handleLinkClick}>{t('header.login', 'Log In')}</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/dashboard" onClick={handleLinkClick}>{t('header.dashboard', 'Dashboard')}</Link></li>
                            <li><Link to="/perfil" onClick={handleLinkClick}>{t('header.profile', 'Perfil')}</Link></li>
                            <li>
                                <button onClick={handleLogout} className="btn-login" style={{ cursor: 'pointer' }}>
                                    {t('header.logout', 'Cerrar Sesión')}
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
