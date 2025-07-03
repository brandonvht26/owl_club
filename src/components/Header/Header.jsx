import React from 'react';
import './Header.css'
import buhoLogo from '../../assets/images/buho.png';


function Header() {
    return (
        <>
            {/* Start - Section Header */}
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
                        <li><a href="#" className="btn-login">Log In</a></li>
                    </ul>
                </nav>
            </header>
            {/* End - Section Header */}
        </>
    );
}

export default Header;