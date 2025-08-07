// src/components/Login/Login.jsx - ACTUALIZADO

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import './AuthForm.css';
import owlLogo from '../../assets/images/buho.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { t } = useTranslation(); // 2. Usar el hook

    const handleLogin = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/home');
        } catch (error) {
            console.error("Error al iniciar sesión:", error.code);
            alert("Correo electrónico o contraseña incorrectos.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={owlLogo} alt="Owl Club Logo" className="auth-logo" />
                {/* 3. Reemplazar textos con la función t() */}
                <h1 className="auth-title">{t('login.welcome')}</h1>
                <p className="auth-subtitle">{t('login.subtitle')}</p>

                <form className="auth-form" onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">{t('login.email_label')}</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('login.email_placeholder')}
                                {...register("email", { 
                                    required: "El correo electrónico es obligatorio", // Los mensajes de error de validación pueden quedar en un solo idioma si se prefiere
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
                        <label htmlFor="password">{t('login.password_label')}</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                id="password"
                                placeholder={t('login.password_placeholder')}
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                        </div>
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="auth-button">{t('login.button')}</button>
                </form>

                <div className="auth-link-container">
                    <p>{t('login.no_account')} <Link to="/register" className="auth-link">{t('login.register_link')}</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;