import React, { useState, useEffect } from 'react';
import './Header.css';
import buhoLogo from '../../assets/images/buho.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Hook para gestionar el tema 
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
    const [theme, toggleTheme] = useTheme(); // <-- Usamos nuestro nuevo hook

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

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

                <div className="nav-controls"> {/* Contenedor para botones de la derecha */}
                    {/* Botón de cambio de tema */}
                    <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
                        <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
                    </button>

                    <button
                        className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                    </button>
                </div>


                <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                    <li><button onClick={() => scrollToSection('galeria')}>Galería</button></li>
                    <li><button onClick={() => scrollToSection('services')}>Servicios</button></li>
                    <li><button onClick={() => scrollToSection('download')}>Descargas</button></li>
                    <li><Link to="/foro" onClick={handleLinkClick}>Foro</Link></li>

                    {!currentUser ? (
                        <>
                            <li><Link to="/register" className="btn-register" onClick={handleLinkClick}>Regístrate</Link></li>
                            <li><Link to="/login" className="btn-login" onClick={handleLinkClick}>Log In</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
                            <li>
                                <button onClick={handleLogout} className="btn-login" style={{ cursor: 'pointer' }}>
                                    Cerrar Sesión
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