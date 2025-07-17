import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // Import useForm
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth method
import { authFirebase } from '../../firebase'; // Import auth instance
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    // Initialize react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    // Watch the password field for confirmation validation
    const password = watch("password");

    const handleRegister = async (data) => {
        const { email, password } = data;
        try {
            await createUserWithEmailAndPassword(authFirebase, email, password);
            alert("¡Registro exitoso! Ahora puedes iniciar sesión."); // User feedback
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Error al registrarse:", error.code, error.message);
            let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";

            // Provide user-friendly error messages based on Firebase error codes
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Este correo electrónico ya está registrado.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "El formato del correo electrónico es inválido.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña debe tener al menos 6 caracteres.";
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Crear una Cuenta</h1>
                <p className="register-subtitle">¡Únete a la comunidad de Owl Club!</p>

                {/* Form controlled by react-hook-form */}
                <form className="register-form" onSubmit={handleSubmit(handleRegister)}>
                    <div className="input-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Elige un nombre de usuario"
                            {...register("username", { required: "El nombre de usuario es obligatorio" })}
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="tu.correo@ejemplo.com"
                            {...register("email", {
                                required: "El correo electrónico es obligatorio",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Ingresa un correo electrónico válido"
                                }
                            })}
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Crea una contraseña segura"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres"
                                }
                            })}
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Vuelve a escribir la contraseña"
                            {...register("confirmPassword", {
                                required: "Confirma tu contraseña",
                                validate: value =>
                                    value === password || "Las contraseñas no coinciden"
                            })}
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
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