// src/components/Forum/Forum.jsx

import React from 'react';
import './Forum.css';
import { Link } from 'react-router-dom'; // Para enlaces internos

// --- Datos de ejemplo (en una app real, vendrían de una API) ---
const questions = [
    { id: 1, author: 'MariaP', initials: 'MP', time: 'hace 2 horas', tag: 'Matemáticas', color: 'var(--color-secondary)', title: '¿Cómo se resuelve esta ecuación cuadrática: x² + 5x + 6 = 0?', body: 'Estoy teniendo problemas para factorizar esta ecuación. ¿Alguien podría explicarme paso a paso cómo resolverla?', replies: 5, votes: 12 },
    { id: 2, author: 'CarlosBio', initials: 'CB', time: 'hace 5 horas', tag: 'Ciencias', color: 'var(--color-primary)', title: '¿Cuál es la diferencia entre mitosis y meiosis?', body: 'Necesito una explicación clara con las principales diferencias entre estos dos procesos de división celular para mi examen.', replies: 3, votes: 8 },
    { id: 3, author: 'LuisHistoria', initials: 'LH', time: 'hace 1 día', tag: 'Historia', color: 'var(--color-accent)', title: '¿Cuáles fueron las principales causas de la Primera Guerra Mundial?', body: 'Estoy preparando un trabajo y necesito entender las causas subyacentes, no solo el detonante inmediato.', replies: 7, votes: 15 },
];

// --- Sub-componentes para mayor orden ---

// Componente para una tarjeta de pregunta
const QuestionCard = ({ question }) => (
    <div className="card question-card">
        <div className="question-header">
        <div className="question-author">
            <div className="author-avatar" style={{ backgroundColor: question.color }}>{question.initials}</div>
            <div>
            <p className="author-name">{question.author}</p>
            <p className="author-time">{question.time}</p>
            </div>
        </div>
        <span className="question-tag" style={{ backgroundColor: question.color, color: 'white' }}>{question.tag}</span>
        </div>
        <h3 className="question-title">{question.title}</h3>
        <p className="question-body">{question.body}</p>
        <div className="question-footer">
        <div className="question-stats" style={{ display: 'flex', gap: '1rem' }}>
            <button><i className="far fa-comment-dots"></i> {question.replies} respuestas</button>
            <button><i className="far fa-thumbs-up"></i> {question.votes} votos</button>
        </div>
        <button className="btn-primary">Responder</button>
        </div>
    </div>
);


const Forum = () => {
    return (
        <div className="forum-page">
        {/* --- Hero Section --- */}
        <section className="forum-hero">
            <h2 className="forum-hero-title">¡Bienvenido a Owl Club!</h2>
            <p className="forum-hero-subtitle">La comunidad donde los sabios como tú comparten conocimiento y resuelven dudas.</p>
            <div className="search-bar">
            <input type="text" placeholder="¿Qué quieres preguntar hoy?" />
            <button className="btn-secondary">
                <i className="fas fa-search" style={{ marginRight: '0.25rem' }}></i> Buscar
            </button>
            </div>
        </section>

        {/* --- Main Content --- */}
        <main className="forum-container">
            {/* --- Left Sidebar --- */}
            <aside className="sidebar sticky-sidebar">
            <div className="card">
                <h3 className="card-title">Categorías</h3>
                <ul className="categories-list">
                <li><Link to="#"><span className="dot" style={{backgroundColor: 'var(--color-primary)'}}></span> Matemáticas</Link></li>
                <li><Link to="#"><span className="dot" style={{backgroundColor: 'var(--color-secondary)'}}></span> Ciencias</Link></li>
                <li><Link to="#"><span className="dot" style={{backgroundColor: 'var(--color-accent)'}}></span> Historia</Link></li>
                <li><Link to="#"><span className="dot" style={{backgroundColor: '#63a375'}}></span> Lenguaje</Link></li>
                <li><Link to="#"><span className="dot" style={{backgroundColor: '#3b82f6'}}></span> Tecnología</Link></li>
                <li><Link to="#"><span className="dot" style={{backgroundColor: '#ef4444'}}></span> Arte</Link></li>
                </ul>
            </div>
            <div className="card">
                <h3 className="card-title">Top Sabios</h3>
                <div className="top-users">
                <div className="user"><div className="rank gold">1</div><div><p className="user-name">AnaPerez</p><p className="user-points">1,245 puntos</p></div></div>
                <div className="user"><div className="rank">2</div><div><p className="user-name">MateoG</p><p className="user-points">1,120 puntos</p></div></div>
                <div className="user"><div className="rank">3</div><div><p className="user-name">CarlaBio</p><p className="user-points">980 puntos</p></div></div>
                </div>
            </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="main-content">
            <div className="question-feed-header">
                <h2>Preguntas Recientes</h2>
                <div className="question-feed-filters" style={{display: 'flex', gap: '0.5rem'}}>
                <button>Más recientes</button>
                <button>Sin responder</button>
                </div>
            </div>
            <div className="question-feed">
                {questions.map(q => <QuestionCard key={q.id} question={q} />)}
            </div>
            </div>

            {/* --- Right Sidebar --- */}
            <aside className="sidebar sticky-sidebar">
            <div className="card">
                <h3 className="card-title">Tu Actividad</h3>
                <div style={{'--tw-space-y-reverse': 0, marginTop: `calc(1rem * calc(1 - var(--tw-space-y-reverse)))`, marginBottom: `calc(1rem * var(--tw-space-y-reverse))`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', lineHeight: '1.25rem', marginBottom: '0.25rem'}}>
                    <span>Progreso</span>
                    <span>50/100 pts</span>
                </div>
                <div style={{width: '100%', backgroundColor: '#F4F5F7', borderRadius: '9999px', height: '0.625rem'}}>
                    <div style={{background: 'linear-gradient(to right, var(--color-secondary), var(--color-primary))', height: '0.625rem', borderRadius: '9999px', width: '50%'}}></div>
                </div>
                </div>
            </div>
            <div className="card">
                <h3 className="card-title">Preguntas Destacadas</h3>
                {/* Aquí iría una lista de preguntas destacadas */}
            </div>
            </aside>
        </main>

        {/* --- Floating Action Button --- */}
        <button className="floating-action-button">
            <i className="fas fa-plus"></i>
        </button>
        </div>
    );
};

export default Forum;