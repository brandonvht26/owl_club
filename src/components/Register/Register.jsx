// src/components/Register/Register.jsx (MODIFICADO)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import './AuthForm.css'; // <-- USAMOS EL MISMO CSS
import owlLogo from '../../assets/images/buho.png';

const Register = () => {
    const navigate = useNavigate();
    const { registerUser } = useAuth(); // Usamos la función del contexto
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password");

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
                <h1 className="auth-title">Crea tu Cuenta</h1>
                <p className="auth-subtitle">Únete a la comunidad del saber</p>

                <form className="auth-form" onSubmit={handleSubmit(handleRegister)} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email" id="email" placeholder="tu.correo@ejemplo.com"
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
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
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <div className="input-wrapper">
                            <i className="fas fa-check-circle input-icon"></i>
                            <input
                                type="password" id="confirmPassword" placeholder="Repite la contraseña"
                                {...register("confirmPassword", { 
                                    required: "Confirma tu contraseña",
                                    validate: value => value === password || "Las contraseñas no coinciden"
                                })}
                            />
                        </div>
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    </div>

                    <button type="submit" className="auth-button">Crear Cuenta</button>
                </form>

                <div className="auth-link-container">
                    <p>¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Inicia Sesión</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;