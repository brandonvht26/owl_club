import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Crearemos este archivo para los estilos

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Oops! La página que buscas no existe.</p>
            <p className="not-found-submessage">Parece que te has perdido en el universo del conocimiento.</p>
            <Link to="/home" className="not-found-link">
                Volver a la página principal
            </Link>
        </div>
    );
};

export default NotFound;