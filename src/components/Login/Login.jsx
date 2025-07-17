import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from "firebase/auth";
import { authFirebase } from '../../firebase';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    
    const handleLogin = async (data) => {
        const { email, password } = data;
        try {
            await signInWithEmailAndPassword(authFirebase, email, password);
            navigate('/home'); 
        } catch (error) {
            console.error("Error al iniciar sesión:", error.code);
            
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                alert("Correo electrónico o contraseña incorrectos.");
            } else {
                alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Bienvenido de Nuevo</h1>
                <p className="login-subtitle">Inicia sesión en tu cuenta de Owl Club</p>

                {/* El formulario ahora está controlado por react-hook-form */}
                <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="tu.correo@ejemplo.com"
                            {...register("email", { required: "El correo electrónico es obligatorio" })}
                        />
                        {/* Mensaje de error para el email */}
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Ingresa tu contraseña"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                        {/* Mensaje de error para la contraseña */}
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="login-button">Iniciar Sesión</button>
                </form>

                <div className="register-link-container">
                    <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Crea una aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;