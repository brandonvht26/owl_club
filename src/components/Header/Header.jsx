import React, { useState } from 'react';
import './Header.css';
import buhoLogo from '../../assets/images/buho.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    // --- NUEVO: Estado para controlar el menú móvil ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- NUEVO: Función para abrir/cerrar el menú ---
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // --- NUEVO: Función para cerrar el menú al hacer clic en un enlace ---
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        handleLinkClick(); // Cierra el menú también al hacer logout
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
        }
    };

    // --- NUEVO: Función para navegar a secciones de la landing page ---
    const scrollToSection = (sectionId) => {
        handleLinkClick();
        // Si no estamos en la home, primero navegamos y luego esperamos para hacer scroll
        if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
            navigate('/home');
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else {
            // Si ya estamos en la home, solo hacemos scroll
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header>
            {/* --- MODIFICADO: className dinámico y onClick para el menú --- */}
            <nav className="navbar">
                <Link to="/home" className="navbar-brand" onClick={handleLinkClick}>
                    <img src={buhoLogo} alt="Logo OWL-CLUB" />
                    <span className="brand-text">OWL CLUB</span>
                </Link>

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

                {/* --- MODIFICADO: className dinámico para mostrar/ocultar el menú --- */}
                <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                    {/* --- MODIFICADO: Enlaces ahora usan onClick para navegar a secciones --- */}
                    <li><button onClick={() => scrollToSection('galeria')}>Galería</button></li>
                    <li><button onClick={() => scrollToSection('services')}>Servicios</button></li>
                    <li><button onClick={() => scrollToSection('download')}>Descargas</button></li>
                    
                    {/* --- MODIFICADO: Enlaces a otras páginas usan <Link> y cierran el menú --- */}
                    <li><Link to="/foro" onClick={handleLinkClick}>Foro</Link></li>
                    
                    {!currentUser ? (
                        <>
                            {/* --- CORREGIDO: Estructura de li para botones de Auth --- */}
                            <li><Link to="/register" className="btn-register" onClick={handleLinkClick}>Regístrate</Link></li>
                            <li><Link to="/login" className="btn-login" onClick={handleLinkClick}>Log In</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
                            <li><Link to="/perfil" onClick={handleLinkClick}>Perfil</Link></li>
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

// Reemplazamos el <li> con <a> por <li> con <button> para los enlaces de scroll,
// ya que es más semántico para acciones que ejecutan JavaScript.
// El CSS para `navbar-nav li a` debería aplicarse también a `navbar-nav li button`.
// Si no es así, puedes añadir esta regla en Header.css:
/*
.navbar-nav li button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--colorCuatro); // O el color que corresponda
    font-size: 1.1em;
    font-family: var(--fuentePrincipal);
    cursor: pointer;
    position: relative;
    // ...copia los estilos de .navbar-nav li a para que se vean iguales
}

.navbar-nav li button:hover {
    // ...
}

.navbar-nav li button::after {
    // ...
}

.navbar-nav li button:hover::after {
    // ...
}
*/

export default Header;