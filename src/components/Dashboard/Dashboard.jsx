// src/components/Dashboard/Dashboard.jsx (ACTUALIZADO)

import { authFirebase } from '../../firebase';
import { dbFirebase } from "../../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const predefinedCategories = [
    { id: 'matematicas', name: 'Matemáticas', icon: 'fa-square-root-alt' },
    { id: 'ciencias', name: 'Ciencias', icon: 'fa-flask' },
    { id: 'lenguaje', name: 'Lenguaje', icon: 'fa-book-open' },
    { id: 'historia', name: 'Historia', icon: 'fa-landmark' },
    { id: 'programacion', name: 'Programación', icon: 'fa-code' },
    { id: 'fisica', name: 'Física', icon: 'fa-atom' },
    { id: 'biologia', name: 'Biología', icon: 'fa-dna' },
    { id: 'arte', name: 'Arte', icon: 'fa-paint-brush' }
];

const Dashboard = () => {
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await authFirebase.signOut();
            window.location.href = "/";
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const loadRecentQuestions = async () => {
            try {
                setLoading(true);
                const questionsQuery = query(
                    collection(dbFirebase, "foros"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const questionsSnapshot = await getDocs(questionsQuery);
                const questionsData = questionsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentQuestions(questionsData);
            } catch (error) {
                console.log('Error al cargar preguntas:', error);
            } finally {
                setLoading(false);
            }
        };
        loadRecentQuestions();
    }, []);

    return (
        <main>
            <section className="header_dashboard">
                <h2>Dashboard</h2>
                <div className="header-actions">
                    <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                    <Link to="/home" className="home-btn">Volver al Inicio</Link>
                </div>
            </section>

            <section className="quick-nav">
                <div className="nav-card">
                    <i className="fas fa-comments"></i>
                    <h3>Mis Foros</h3>
                    <p>Crea y gestiona tus preguntas y respuestas.</p>
                    <Link to="/forum-dashboard" className="nav-link">
                        Ir a Mis Foros
                    </Link>
                </div>
                <div className="nav-card">
                    <i className="fas fa-users"></i>
                    <h3>Comunidad</h3>
                    <p>Explora y participa en las discusiones.</p>
                    <Link to="/foro" className="nav-link">
                        Ver Foro General
                    </Link>
                </div>
            </section>
            
            {/* --- SECCIÓN PRINCIPAL MODIFICADA --- */}
            <section className="container_dashboard single-column">
                <section className="list-section">
                    <h4>Preguntas recientes de la comunidad</h4>
                    
                    {loading ? (
                        <div className="loading-questions">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Cargando preguntas...</p>
                        </div>
                    ) : recentQuestions.length === 0 ? (
                        <div className="no-questions">
                            <i className="fas fa-comment-slash"></i>
                            <p>No existen preguntas registradas aún...</p>
                        </div>
                    ) : (
                        <div className="questions-list">
                            {recentQuestions.map(question => (
                                <div key={question.id} className="question-item">
                                    <div className="question-header">
                                        <div className="question-category">
                                            <i className={`fas ${predefinedCategories.find(cat => cat.id === question.categoria)?.icon || 'fa-question-circle'}`}></i>
                                            <span>{predefinedCategories.find(cat => cat.id === question.categoria)?.name || question.categoria}</span>
                                        </div>
                                        <div className="question-date">
                                            {question.createdAt?.toDate ? new Date(question.createdAt.toDate()).toLocaleDateString() : 'Fecha no disponible'}
                                        </div>
                                    </div>
                                    <h5 className="question-title">{question.titulo}</h5>
                                    <p className="question-preview">{question.descripcion?.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                                    <div className="question-stats">
                                        <span><i className="fas fa-comment"></i> {question.replies || 0} respuestas</span>
                                        <span><i className="fas fa-thumbs-up"></i> {question.likes || 0} me gusta</span>
                                        <span className="question-author">Por: {question.userName}</span>
                                    </div>
                                </div>
                            ))}
                            <Link to="/foro" className="view-all-link">
                                Ver todas las preguntas →
                            </Link>
                        </div>
                    )}
                </section>
            </section>

            <footer className="footer_dashboard">
                <p>"Conocimiento que nunca duerme" - Owl Club</p>
                <p>© 2024 Owl Club. Todos los derechos reservados.</p>
            </footer>
        </main>
    )
}

export default Dashboard;