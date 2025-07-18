// src/components/Login/Login.jsx (MODIFICADO)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import './AuthForm.css'; // <-- NUEVO CSS COMPARTIDO
import owlLogo from '../../assets/images/buho.png'; // Asegúrate que la ruta sea correcta

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Usamos la función de login del contexto
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/home');
        } catch (error) {
            console.error("Error al iniciar sesión:", error.code);
            // Aquí puedes agregar un estado para mostrar un mensaje de error más elegante
            alert("Correo electrónico o contraseña incorrectos.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={owlLogo} alt="Owl Club Logo" className="auth-logo" />
                <h1 className="auth-title">Bienvenido</h1>
                <p className="auth-subtitle">Inicia sesión para continuar</p>

                <form className="auth-form" onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                id="email"
                                placeholder="tu.correo@ejemplo.com"
                                {...register("email", { 
                                    required: "El correo electrónico es obligatorio",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Ingresa un correo válido"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                        </div>
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="auth-button">Iniciar Sesión</button>
                </form>

                <div className="auth-link-container">
                    <p>¿No tienes una cuenta? <Link to="/register" className="auth-link">Regístrate</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;