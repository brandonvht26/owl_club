// src/components/Register/Register.jsx - ACTUALIZADO

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import './AuthForm.css';
import owlLogo from '../../assets/images/buho.png';

const Register = () => {
    const navigate = useNavigate();
    const { registerUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password");
    const { t } = useTranslation(); // 2. Usar el hook

    const handleRegister = async (data) => {
        try {
            await registerUser(data.email, data.password);
            alert("¡Registro exitoso! Serás redirigido para iniciar sesión.");
            navigate('/login');
        } catch (error) {
            console.error("Error al registrarse:", error.code);
            if (error.code === 'auth/email-already-in-use') {
                alert("Este correo electrónico ya está en uso.");
            } else {
                alert("Ocurrió un error al registrar la cuenta.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={owlLogo} alt="Owl Club Logo" className="auth-logo" />
                {/* 3. Reemplazar textos con la función t() */}
                <h1 className="auth-title">{t('register.create_account')}</h1>
                <p className="auth-subtitle">{t('register.subtitle')}</p>

                <form className="auth-form" onSubmit={handleSubmit(handleRegister)} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">{t('login.email_label')}</label> {/* Reutilizamos clave de login */}
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email" id="email" placeholder={t('login.email_placeholder')} 
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
                                })}
                            />
                        </div>
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">{t('login.password_label')}</label> {/* Reutilizamos clave de login */}
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password" id="password" placeholder="Mínimo 6 caracteres"
                                {...register("password", { 
                                    required: "La contraseña es obligatoria",
                                    minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
                                })}
                            />
                        </div>
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">{t('register.confirm_password_label')}</label>
                        <div className="input-wrapper">
                            <i className="fas fa-check-circle input-icon"></i>
                            <input
                                type="password" id="confirmPassword" placeholder={t('register.confirm_password_placeholder')}
                                {...register("confirmPassword", { 
                                    required: "Confirma tu contraseña",
                                    validate: value => value === password || "Las contraseñas no coinciden"
                                })}
                            />
                        </div>
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    </div>

                    <button type="submit" className="auth-button">{t('register.button')}</button>
                </form>

                <div className="auth-link-container">
                    <p>{t('register.have_account')} <Link to="/login" className="auth-link">{t('register.login_link')}</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;