
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbFirebase as db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from "firebase/auth";

import './PerfilPage.css';


const DetailItem = ({ icon, label, value, children }) => (
    <div className="detail-item">
        <i className={icon}></i>
        <div>
            <strong>{label}</strong>
            {children || <p>{value || 'No especificado'}</p>}
        </div>
    </div>
);

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estado unificado para todos los datos del perfil
    const [profileData, setProfileData] = useState({
        displayName: '',
        bio: '',
        age: '',
        nationality: '',
        hobby: '',
        photoURL: '' 
    });

    // Carga los datos del perfil desde Firestore
    const fetchProfileData = useCallback(async () => {
        if (!currentUser?.uid) return;
        
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        const defaultData = {
            displayName: currentUser.displayName || (currentUser.email?.split('@')[0] || 'Usuario'),
            bio: 'Añade una pequeña biografía para que los demás te conozcan.',
            age: '',
            nationality: '',
            hobby: '',
            photoURL: currentUser.photoURL || '' // Carga la URL desde Auth si existe
        };

        if (docSnap.exists()) {
            setProfileData({ ...defaultData, ...docSnap.data() });
        } else {
            setProfileData(defaultData);
        }
        setLoading(false);
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [currentUser, fetchProfileData]);

    // Maneja los cambios en cualquier input del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [name]: value }));
    };

    // Guarda los cambios en Firestore y en el perfil de Auth
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!currentUser || !profileData) return;

        setLoading(true);
        const dataToSave = { ...profileData, email: currentUser.email };
        
        try {
            await setDoc(doc(db, "users", currentUser.uid), dataToSave, { merge: true });
            
            // Actualiza el perfil de autenticación de Firebase
            if (currentUser.displayName !== dataToSave.displayName || currentUser.photoURL !== dataToSave.photoURL) {
                await updateProfile(currentUser, { 
                    displayName: dataToSave.displayName, 
                    photoURL: dataToSave.photoURL 
                });
            }
            
            alert("¡Perfil actualizado con éxito!");
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            alert("Ocurrió un error al guardar los cambios.");
        } finally {
            setIsEditing(false);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="profile-page-container"><div className="loader">Cargando Perfil...</div></div>;
    }

    return (
        <div className="profile-page-container">
            <Link to="/home" className="back-to-home-button">
                <i className="fas fa-arrow-left"></i> Volver al Inicio
            </Link>
            <div className="profile-card-large">
                <header className="profile-header">
                    <div className="profile-cover-photo"></div>
                    <div className="profile-avatar-large">
                        {profileData.photoURL ? (
                            <img src={profileData.photoURL} alt="Foto de perfil" onError={(e) => { e.target.onerror = null; e.target.src="URL_IMAGEN_POR_DEFECTO_SI_FALLA"; }} />
                        ) : (
                            <span>{profileData.displayName?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </header>

                {!isEditing && (
                    <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
                        <i className="fas fa-pencil-alt"></i> Editar Perfil
                    </button>
                )}

                <main className="profile-body">
                    <h1 className="profile-display-name">{profileData.displayName}</h1>
                    <p className="profile-email">{currentUser?.email}</p>

                    <div className="profile-section">
                        <h2>Acerca de mí</h2>
                        {isEditing ? (
                            <textarea className="profile-input textarea" name="bio" value={profileData.bio} onChange={handleInputChange} placeholder="Tu biografía..." />
                        ) : (
                            <p className="profile-bio">{profileData.bio || 'Añade una pequeña biografía para que los demás te conozcan.'}</p>
                        )}
                    </div>

                    <div className="profile-section">
                        <h2>Detalles</h2>
                        <div className="details-grid">
                            <DetailItem icon="fas fa-user" label="Nombre a mostrar" value={profileData.displayName}>
                                {isEditing && <input type="text" name="displayName" className="profile-input" value={profileData.displayName} onChange={handleInputChange} />}
                            </DetailItem>
                            <DetailItem icon="fas fa-birthday-cake" label="Edad" value={profileData.age}>
                                {isEditing && <input type="number" name="age" className="profile-input" value={profileData.age} onChange={handleInputChange} placeholder="Ej: 25" />}
                            </DetailItem>
                            <DetailItem icon="fas fa-flag" label="Nacionalidad" value={profileData.nationality}>
                                {isEditing && <input type="text" name="nationality" className="profile-input" value={profileData.nationality} onChange={handleInputChange} placeholder="Ej: Ecuatoriana" />}
                            </DetailItem>
                            <DetailItem icon="fas fa-gamepad" label="Hobby Favorito" value={profileData.hobby}>
                                {isEditing && <input type="text" name="hobby" className="profile-input" value={profileData.hobby} onChange={handleInputChange} placeholder="Ej: Jugar videojuegos" />}
                            </DetailItem>
                        </div>
                    </div>

                
                    {isEditing && (
                        <div className="profile-section">
                            <h2>Foto de Perfil (URL)</h2>
                            <input
                                type="text"
                                name="photoURL"
                                className="profile-input"
                                value={profileData.photoURL}
                                onChange={handleInputChange}
                                placeholder="Pega la URL de una imagen aquí"
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="profile-actions">
                            <button className="profile-button secondary" onClick={() => { setIsEditing(false); fetchProfileData(); }}>Cancelar</button>
                            <button className="profile-button" onClick={handleSaveProfile} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;