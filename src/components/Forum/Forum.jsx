// src/components/Forum/Forum.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
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

const QuestionCard = ({ question, t, navigate }) => {
  const categoryColor = predefinedCategories.find(c => c.id === question.categoria)?.color || 'var(--color-primary)';

  // El DIV exterior ahora maneja el clic, no un <Link>
  return (
    <div className="card question-card" onClick={() => navigate(`/foro/${question.id}`)}>
      <div className="question-header">
        {/* Este enlace interior funciona porque detenemos la propagación */}
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
        {question.descripcion.replace(/<[^>]*>/g, '').substring(0, 150)}
        {question.descripcion.replace(/<[^>]*>/g, '').length > 150 && '...'}
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
  );
};


const Forum = () => {
    const { t } = useTranslation();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topUsers, setTopUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('recent');
    const navigate = useNavigate();
    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                setLoading(true);
                // 1. Empezamos con la referencia a la colección base
                let q = query(collection(dbFirebase, "foros"));

                // 2. Aplicamos el filtro de categoría SI EXISTE (si no es null)
                if (selectedCategory) {
                    q = query(q, where("categoria", "==", selectedCategory));
                }

                // 3. Aplicamos el filtro de "Sin responder" SI ESTÁ ACTIVO
                // (y no estamos ya filtrando por categoría)
                if (filter === 'unanswered' && !selectedCategory) {
                    q = query(q, where("replies", "==", 0));
                }

                // 4. SIEMPRE ordenamos por fecha de creación al final
                q = query(q, orderBy("createdAt", "desc"));

                // El resto de la función ejecuta la consulta
                const querySnapshot = await getDocs(q);
                const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuestions(questionsData);

                // La carga de Top Users no cambia
                const usersQuery = query(collection(dbFirebase, "users"), orderBy("points", "desc"), limit(5));
                const usersSnapshot = await getDocs(usersQuery);
                const topUsersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTopUsers(topUsersData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Hubo un error al cargar los foros. Revisa la consola.");
            } finally {
                setLoading(false);
            }
        };

        fetchForumData();
    }, [filter, selectedCategory]);

    // Lógica de filtrado por búsqueda
    const filteredQuestions = questions.filter(question => {
        if (!searchTerm) {
            return true; // Si la barra de búsqueda está vacía, muestra todo
        }
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = question.titulo.toLowerCase().includes(searchTermLower);
        const categoryName = predefinedCategories.find(c => c.id === question.categoria)?.name || '';
        const categoryMatch = categoryName.toLowerCase().includes(searchTermLower);
        return titleMatch || categoryMatch;
    });

    // --- AÑADE TODA ESTA LÓGICA DE PAGINACIÓN ---
    // Calculamos el número total de páginas necesarias
    const pageCount = Math.ceil(filteredQuestions.length / POSTS_PER_PAGE);

    // Calculamos el índice del primer y último post de la página actual
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;

    // "Rebanamos" el array para obtener solo los posts de la página actual
    const paginatedQuestions = filteredQuestions.slice(indexOfFirstPost, indexOfLastPost);

    // Función para cambiar de página
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Opcional: Desplaza la vista al inicio de la lista de preguntas
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };
    // --- FIN DE LA LÓGICA AÑADIDA ---

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
                                    onClick={() => { setSelectedCategory(null); setFilter('recent'); }}
                                    className={!selectedCategory ? 'active' : ''}
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
                            
                            <button 
                                // Asegúrate que el onClick establezca la categoría en NULL
                                onClick={() => { setFilter('recent'); setSelectedCategory(null); }}
                                className={filter === 'recent' && !selectedCategory ? 'active' : ''}
                            >
                                Más recientes
                            </button>
                            <button 
                                // Asegúrate que el onClick establezca la categoría en NULL
                                onClick={() => { setFilter('unanswered'); setSelectedCategory(null); }}
                                className={filter === 'unanswered' && !selectedCategory ? 'active' : ''}
                            >
                                Sin responder
                            </button>
                            

                            {/* <button>{t('forum.filter_recent')}</button> */}
                            {/* <button>{t('forum.filter_unanswered')}</button> */}
                        
                        
                        </div>
                    </div>
                    <div className="question-feed">
                        
                        {pageCount > 1 && (
                            <div className="pagination">
                                {/* Botón para ir a la página anterior */}
                                <button
                                    onClick={() => handlePageClick(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button>

                                {/* Generamos los botones de número de página */}
                                {[...Array(pageCount).keys()].map(number => (
                                    <button
                                        key={number + 1}
                                        onClick={() => handlePageClick(number + 1)}
                                        className={currentPage === number + 1 ? 'active' : ''}
                                    >
                                        {number + 1}
                                    </button>
                                ))}

                                {/* Botón para ir a la página siguiente */}
                                <button
                                    onClick={() => handlePageClick(currentPage + 1)}
                                    disabled={currentPage === pageCount}
                                >
                                    &raquo;
                                </button>
                            </div>
                        )}

                        {loading && <div className="forum-loader"><i className="fas fa-spinner fa-spin"></i> {t('forum.loading')}</div>}
                        {error && <div className="forum-error">{error}</div>}
                        {!loading && !error && questions.length === 0 && (
                            <div className="forum-empty">
                                <i className="fas fa-comment-slash"></i>
                                <p>{t('forum.empty_title')} {t('forum.empty_subtitle')}</p>
                                <Link to="/forum-dashboard" className="btn-primary">{t('forum.create_question_button')}</Link>
                            </div>
                        )}
                        {!loading && !error && paginatedQuestions.map(q => <QuestionCard key={q.id} question={q} t={t} navigate={navigate} />)}
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