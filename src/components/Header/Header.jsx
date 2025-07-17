import React from 'react';
import './Header.css';
import buhoLogo from '../../assets/images/buho.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

function Header() {
    const { currentUser, logout } = useAuth(); // Get currentUser and logout function from context
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
        }
    };

    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="navbar-brand">
                        <img src={buhoLogo} alt="Logo OWL-CLUB" />
                        <span className="brand-text">OWL CLUB</span>
                    </div>
                    <button className="navbar-toggler" id="navbarToggler" aria-label="Toggle navigation">
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                        <span className="toggler-icon"></span>
                    </button>
                    <ul className="navbar-nav" id="navbarNav">
                        <li><a href="#">Galeria</a></li>
                        <li><a href="#">Foro</a></li>
                        <li><a href="#">Descargas</a></li>
                        <li><Link to="/memes">Memes API</Link></li>
                        {currentUser && ( // Show Dashboard link only if logged in
                            <li><Link to="/dashboard" className='btn-dashboard'>Dashboard</Link></li>
                        )}
                        {!currentUser ? ( // Show Register/Login if not logged in
                            <>
                                <li><Link to="/register" className="btn-register">Regístrate</Link></li>
                                <li><Link to="/login" className="btn-login">Log In</Link></li>
                            </>
                        ) : ( // Show Logout button if logged in
                            <li>
                                <button onClick={handleLogout} className="btn-login" style={{ cursor: 'pointer' }}>
                                    Cerrar Sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;