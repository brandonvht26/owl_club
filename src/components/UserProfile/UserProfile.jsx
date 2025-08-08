// src/components/UserProfile/UserProfile.jsx (NUEVO ARCHIVO)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './UserProfile.css'; // Crearemos este archivo a continuación

const UserProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const userRef = doc(dbFirebase, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            } else {
                setError("Este usuario no existe.");
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("No se pudo cargar el perfil del usuario.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return <div className="profile-loader">Cargando perfil...</div>;
    }

    if (error) {
        return <div className="profile-error">{error}</div>;
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="profile-page-container public-view">
            <Link to="/foro" className="back-to-home-button">
                <i className="fas fa-arrow-left"></i> Volver al Foro
            </Link>
            <div className="profile-card-large">
                <header className="profile-header">
                    <div className="profile-cover-photo"></div>
                    <div className="profile-avatar-large">
                        <img
                            src={userData.photoURL || `https://i.pravatar.cc/150?u=${userId}`}
                            alt={`Foto de ${userData.displayName}`}
                        />
                    </div>
                </header>

                <main className="profile-body">
                    <h1 className="profile-display-name">{userData.displayName || 'Usuario de Owl Club'}</h1>
                    <p className="profile-email">{userData.email}</p>

                    <div className="profile-section">
                        <h2>Acerca de mí</h2>
                        <p className="profile-bio">{userData.bio || 'Este usuario aún no ha añadido una biografía.'}</p>
                    </div>

                    <div className="profile-section">
                        <h2>Detalles</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <i className="fas fa-birthday-cake"></i>
                                <div><strong>Edad:</strong><p>{userData.age || 'No especificado'}</p></div>
                            </div>
                            <div className="detail-item">
                                <i className="fas fa-flag"></i>
                                <div><strong>Nacionalidad:</strong><p>{userData.nationality || 'No especificado'}</p></div>
                            </div>
                            <div className="detail-item">
                                <i className="fas fa-gamepad"></i>
                                <div><strong>Hobby:</strong><p>{userData.hobby || 'No especificado'}</p></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;