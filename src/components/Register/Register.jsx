import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css'; // Estilos para el registro

const Register = () => {
    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Crear una Cuenta</h1>
                <p className="register-subtitle">¡Únete a la comunidad de Owl Club!</p>
                <form className="register-form">
                    <div className="input-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input type="text" id="username" placeholder="Elige un nombre de usuario" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="tu.correo@ejemplo.com" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Crea una contraseña segura" required />
                    </div>
                     <div className="input-group">
                        <label htmlFor="confirm-password">Confirmar Contraseña</label>
                        <input type="password" id="confirm-password" placeholder="Vuelve a escribir la contraseña" required />
                    </div>
                    <button type="submit" className="register-button">Registrarse</button>
                </form>
                <div className="login-link-container">
                    <p>¿Ya tienes una cuenta? <Link to="/login" className="login-link">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;