// src/components/Forum/Forum.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import './Forum.css';

const timeSince = (date) => {
    if (!date) return 'Fecha desconocida';
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return `hace ${Math.floor(seconds)} segundos`;
};

const predefinedCategories = [
    { id: 'matematicas', name: 'Matemáticas', color: '#9C5297' },
    { id: 'ciencias', name: 'Ciencias', color: '#FFC70F' },
    { id: 'lenguaje', name: 'Lenguaje', color: '#d179ca' },
    { id: 'historia', name: 'Historia', color: '#63a375' },
    { id: 'programacion', name: 'Programación', color: '#3b82f6' },
    { id: 'fisica', name: 'Física', color: '#ef4444' },
    { id: 'biologia', name: 'Biología', color: '#10b981' },
    { id: 'arte', name: 'Arte', color: '#f59e0b' }
];

const QuestionCard = ({ question, t }) => {
    const categoryColor = predefinedCategories.find(c => c.id === question.categoria)?.color || 'var(--color-primary)';

    return (
        <Link to={`/foro/${question.id}`} className="card-link">
            <div className="card question-card">
                <div className="question-header">
                    <Link to={`/perfil/${question.userId}`} className="question-author" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={question.userPhotoURL || `https://i.pravatar.cc/150?u=${question.userId}`}
                            alt={question.userName}
                            className="author-avatar"
                        />
                        <div>
                            <p className="author-name">{question.userName}</p>
                            <p className="author-time">{timeSince(question.createdAt)}</p>
                        </div>
                    </Link>
                    <span className="question-tag" style={{ backgroundColor: categoryColor, color: 'white' }}>
                        {predefinedCategories.find(c => c.id === question.categoria)?.name || question.categoria}
                    </span>
                </div>
                <h3 className="question-title">{question.titulo}</h3>
                <p className="question-body">
                    {question.descripcion.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150)}
                    {question.descripcion.length > 150 && '...'}
                    </p>
                <div className="question-footer">
                    <div className="question-stats">
                        <button><i className="far fa-comment-dots"></i> {question.replies || 0}</button>
                        <button><i className="far fa-thumbs-up"></i> {question.likes || 0}</button>
                        <button><i className="far fa-eye"></i> {question.views || 0}</button>
                    </div>
                    <span className="btn-primary">{t('forum.view_question_button')}</span>
                </div>
            </div>
        </Link>
    );
};


const Forum = () => {
    const { t } = useTranslation();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topUsers, setTopUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                setLoading(true);
                const q = query(collection(dbFirebase, "foros"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuestions(questionsData);
                
                const usersQuery = query(collection(dbFirebase, "users"), orderBy("points", "desc"), limit(5));
                const usersSnapshot = await getDocs(usersQuery);
                const topUsersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTopUsers(topUsersData);

                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(t('forum.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchForumData();
    }, [t]);

    // Lógica de filtrado por búsqueda
    const filteredQuestions = questions
        .filter(question => {
            // Primer filtro: por categoría seleccionada
            if (selectedCategory === 'all') {
                return true; // Si es "all", no se filtra por categoría
            }
            return question.categoria === selectedCategory;
        })
        .filter(question => {
            // Segundo filtro: por término de búsqueda (funciona sobre la lista ya filtrada)
            if (!searchTerm) {
                return true; // Si no hay búsqueda, no se filtra por texto
            }
            const searchTermLower = searchTerm.toLowerCase();
            const categoryName = predefinedCategories.find(c => c.id === question.categoria)?.name || '';

            const titleMatch = question.titulo.toLowerCase().includes(searchTermLower);
            const categoryMatch = categoryName.toLowerCase().includes(searchTermLower);

            return titleMatch || categoryMatch;
    });

    return (
        <div className="forum-page">
            <section className="forum-hero">
                <h2 className="forum-hero-title">{t('forum.welcome_title')}</h2>
                <p className="forum-hero-subtitle">{t('forum.welcome_subtitle')}</p>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder={t('forum.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <button className="btn-secondary">
                        <i className="fas fa-search" style={{ marginRight: '0.25rem' }}></i> {t('forum.search_button')}
                    </button>
                </div>
            </section>

            <main className="forum-container">
                <aside className="sidebar sticky-sidebar">
                    <div className="card">
                        <h3 className="card-title">{t('forum.categories')}</h3>
                        <ul className="categories-list">
                            <li>
                                <button
                                    className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    <span className="dot" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                                    Todas
                                </button>
                            </li>
                            {predefinedCategories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={`category-button ${selectedCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        <span className="dot" style={{ backgroundColor: cat.color }}></span>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <h3 className="card-title">{t('forum.top_sages')}</h3>
                        <div className="top-users">
                            {topUsers.map((user, index) => (
                                <Link to={`/perfil/${user.id}`} key={user.id} className="user">
                                    <div className={`rank ${index === 0 ? 'gold' : ''}`}>{index + 1}</div>
                                    <div>
                                        <p className="user-name">{user.displayName}</p>
                                        <p className="user-points">{user.points || 0} {t('forum.points')}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="main-content">
                    <div className="question-feed-header">
                        <h2>{t('forum.recent_questions')}</h2>
                        <div className="question-feed-filters" style={{ display: 'flex', gap: '0.5rem' }}>
                            <button>{t('forum.filter_recent')}</button>
                            <button>{t('forum.filter_unanswered')}</button>
                        </div>
                    </div>
                    <div className="question-feed">
                        {loading && <div className="forum-loader"><i className="fas fa-spinner fa-spin"></i> {t('forum.loading')}</div>}
                        {error && <div className="forum-error">{error}</div>}
                        {!loading && !error && questions.length === 0 && (
                            <div className="forum-empty">
                                <i className="fas fa-comment-slash"></i>
                                <p>{t('forum.empty_title')} {t('forum.empty_subtitle')}</p>
                                <Link to="/forum-dashboard" className="btn-primary">{t('forum.create_question_button')}</Link>
                            </div>
                        )}
                        {!loading && !error && filteredQuestions.map(q => <QuestionCard key={q.id} question={q} t={t} />)}
                    </div>
                </div>

                <aside className="sidebar sticky-sidebar">
                </aside>
            </main>

            <Link to="/forum-dashboard" className="floating-action-button">
                <i className="fas fa-plus"></i>
            </Link>
        </div>
    );
};

export default Forum;