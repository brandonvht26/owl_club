import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, runTransaction, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './QuestionDetail.css'; // Asegúrate que este archivo CSS contenga los estilos necesarios.

// --- SUB-COMPONENTE PARA MOSTRAR CADA RESPUESTA ---
// Este componente se toma de tu primera versión para una mejor organización.
const AnswerCard = ({ answer, onVote, onMarkBest, questionAuthorId }) => {
    const { currentUser } = useAuth();
    const isQuestionAuthor = currentUser?.uid === questionAuthorId;

    // Determina si el usuario actual ha votado esta respuesta
    const userVote = currentUser ? {
        up: answer.upvotedBy?.includes(currentUser.uid),
        down: answer.downvotedBy?.includes(currentUser.uid),
    } : {};

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(timestamp.toDate());
    };

    return (
        <div className={`answer-card ${answer.isBest ? 'best-answer' : ''}`}>
            <div className="answer-card-content">
                <div className="answer-card-header">
                    <div className="author-info">
                        <img src={answer.userPhotoURL} alt="Autor" className="author-avatar" />
                        <div>
                            <h3 className="author-name">{answer.userName}</h3>
                            <p className="answer-date">Respondido {formatDate(answer.createdAt)}</p>
                        </div>
                    </div>
                    {answer.isBest && (
                        <div className="best-answer-badge">
                            <i className="fas fa-star"></i> MEJOR RESPUESTA
                        </div>
                    )}
                </div>
                {/* Usamos dangerouslySetInnerHTML para renderizar el contenido HTML de la respuesta */}
                <div className="prose" dangerouslySetInnerHTML={{ __html: answer.content }}></div>
                <div className="answer-card-footer">
                    <div className="vote-controls">
                        <button onClick={() => onVote(answer.id, 'up')} className={`vote-btn ${userVote.up ? 'voted' : ''}`} disabled={!currentUser}>
                            <i className="fas fa-chevron-up vote-icon"></i>
                        </button>
                        <span className="vote-score">{answer.score || 0}</span>
                        <button onClick={() => onVote(answer.id, 'down')} className={`vote-btn ${userVote.down ? 'voted' : ''}`} disabled={!currentUser}>
                             <i className="fas fa-chevron-down vote-icon"></i>
                        </button>
                    </div>
                    {isQuestionAuthor && !answer.isBest && !answer.isBest && (
                         <button onClick={() => onMarkBest(answer.id, answer.userId)} className="mark-best-btn">
                            <i className="fas fa-check-circle"></i> Marcar como la mejor
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
const QuestionDetail = () => {
    const { questionId } = useParams();
    const { currentUser } = useAuth();

    // --- Hooks de Estado ---
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [isLiking, setIsLiking] = useState(false); // Estado para controlar el botón de "Me Gusta"
    
    // --- Hook de Referencia ---
    const questionContentRef = useRef(null);

    // --- Carga de datos de la pregunta y respuestas ---
    const fetchQuestionAndAnswers = useCallback(async () => {
        setLoading(true);
        try {
            // Cargar la pregunta
            const questionRef = doc(dbFirebase, 'foros', questionId);
            const questionSnap = await getDoc(questionRef);

            if (questionSnap.exists()) {
                const questionData = { id: questionSnap.id, ...questionSnap.data() };
                // Incrementar vistas si es necesario
                if (currentUser && questionData.userId !== currentUser.uid && !sessionStorage.getItem(`viewed_${questionId}`)) {
                    await updateDoc(questionRef, { views: (questionData.views || 0) + 1 });
                    sessionStorage.setItem(`viewed_${questionId}`, 'true');
                }
                setQuestion(questionData);
            } else {
                setError('La pregunta no fue encontrada.');
                return;
            }

            // Cargar las respuestas, ordenadas por puntuación
            const answersQuery = query(collection(dbFirebase, 'foros', questionId, 'respuestas'), orderBy('score', 'desc'));
            const answersSnapshot = await getDocs(answersQuery);
            setAnswers(answersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError('Hubo un error al cargar la página.');
        } finally {
            setLoading(false);
        }
    }, [questionId, currentUser]);

    // --- Lógica de Votación para Respuestas (de la versión con AnswerCard) ---
    const handleVote = async (answerId, voteType) => {
        if (!currentUser) {
            alert("Debes iniciar sesión para votar.");
            return;
        }
        const answerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', answerId);
        try {
            await runTransaction(dbFirebase, async (transaction) => {
                const answerDoc = await transaction.get(answerRef);
                if (!answerDoc.exists()) throw "La respuesta no existe.";

                let data = answerDoc.data();
                data.upvotedBy = data.upvotedBy || [];
                data.downvotedBy = data.downvotedBy || [];
                const upvoteIndex = data.upvotedBy.indexOf(currentUser.uid);
                const downvoteIndex = data.downvotedBy.indexOf(currentUser.uid);

                if (voteType === 'up') {
                    if (upvoteIndex >= 0) {
                        data.upvotedBy.splice(upvoteIndex, 1); // Quitar upvote
                    } else {
                        data.upvotedBy.push(currentUser.uid); // Añadir upvote
                        if (downvoteIndex >= 0) data.downvotedBy.splice(downvoteIndex, 1); // Quitar downvote si existe
                    }
                } else if (voteType === 'down') {
                    if (downvoteIndex >= 0) {
                        data.downvotedBy.splice(downvoteIndex, 1); // Quitar downvote
                    } else {
                        data.downvotedBy.push(currentUser.uid); // Añadir downvote
                        if (upvoteIndex >= 0) data.upvotedBy.splice(upvoteIndex, 1); // Quitar upvote si existe
                    }
                }
                
                data.score = data.upvotedBy.length - data.downvotedBy.length;
                transaction.update(answerRef, {
                    upvotedBy: data.upvotedBy,
                    downvotedBy: data.downvotedBy,
                    score: data.score
                });
            });
            fetchQuestionAndAnswers(); // Recargar para mostrar el nuevo score y estado del voto
        } catch (error) {
            console.error("Error en la transacción de voto:", error);
        }
    };

    // --- Lógica de "Me Gusta" y Mejor Respuesta (de la versión actualizada) ---
    const handleLike = async () => {
        if (!currentUser || isLiking) return;
        setIsLiking(true);

        const questionRef = doc(dbFirebase, 'foros', questionId);
        try {
            await runTransaction(dbFirebase, async (transaction) => {
                const questionDoc = await transaction.get(questionRef);
                if (!questionDoc.exists()) throw "La pregunta ya no existe.";

                const data = questionDoc.data();
                const likedBy = data.likedBy || [];
                const userIndex = likedBy.indexOf(currentUser.uid);

                if (userIndex === -1) {
                    likedBy.push(currentUser.uid); // Dar Like
                } else {
                    likedBy.splice(userIndex, 1); // Quitar Like
                }
                
                transaction.update(questionRef, { likes: likedBy.length, likedBy: likedBy });
                setQuestion(prev => ({ ...prev, likes: likedBy.length, likedBy: likedBy })); // Actualización optimista
            });
        } catch (e) {
            console.error("Error en la transacción de like: ", e);
        } finally {
            setIsLiking(false);
        }
    };
    
    const handleMarkBestAnswer = async (answerId, answerAuthorId) => {
        if (question.userId !== currentUser?.uid) {
            alert("Solo el autor de la pregunta puede marcar la mejor respuesta.");
            return;
        }

        try {
            await runTransaction(dbFirebase, async (transaction) => {
                const questionRef = doc(dbFirebase, 'foros', questionId);
                const answerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', answerId);
                const answerAuthorRef = doc(dbFirebase, 'users', answerAuthorId);

                // Desmarcar cualquier otra respuesta que fuera 'isBest'
                answers.forEach(ans => {
                    if (ans.isBest && ans.id !== answerId) {
                        const oldBestAnswerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', ans.id);
                        transaction.update(oldBestAnswerRef, { isBest: false });
                    }
                });

                // Marcar la nueva mejor respuesta
                transaction.update(answerRef, { isBest: true });
                transaction.update(questionRef, { solved: true });

                // Otorgar puntos
                const authorDoc = await transaction.get(answerAuthorRef);
                const currentPoints = authorDoc.data()?.points || 0;
                transaction.update(answerAuthorRef, { points: currentPoints + 15 });
            });
            
            fetchQuestionAndAnswers();
            alert("¡Respuesta marcada como la mejor! El autor de la respuesta ha ganado 15 puntos.");
        } catch (error) {
            console.error("Error al marcar la mejor respuesta:", error);
            alert("Hubo un error al procesar tu solicitud.");
        }
    };

    // --- Lógica para enviar nuevas respuestas ---
    const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !currentUser) return;
    try {
        // 1. Prepara los datos de la nueva respuesta
        const answerData = {
            content: newAnswer, userId: currentUser.uid, userName: currentUser.displayName || currentUser.email,
            userPhotoURL: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
            createdAt: new Date(), isBest: false, score: 0, upvotedBy: [], downvotedBy: []
        };
        
        // 2. Añade la respuesta a la subcolección
        await addDoc(collection(dbFirebase, 'foros', questionId, 'respuestas'), answerData);

        // --- 3. ¡LA PARTE NUEVA! Actualiza el contador en el documento del foro ---
        const questionRef = doc(dbFirebase, 'foros', questionId);
        await updateDoc(questionRef, {
            replies: increment(1) // increment(1) suma 1 al valor actual de forma segura
        });

        // 4. Limpia el formulario y recarga los datos
        setNewAnswer('');
        fetchQuestionAndAnswers();

    } catch (error) { 
        console.error("Error al publicar respuesta:", error); 
        alert("No se pudo publicar tu respuesta. Inténtalo de nuevo.");
    }
};


    // --- Hooks de Efecto ---
    useEffect(() => {
        fetchQuestionAndAnswers();
    }, [fetchQuestionAndAnswers]);

    useEffect(() => {
        // Renderizar fórmulas LaTeX con KaTeX después de cargar la pregunta
        if (questionContentRef.current) {
            const formulas = questionContentRef.current.querySelectorAll('.ql-formula');
            formulas.forEach(formula => {
                const value = formula.getAttribute('data-value');
                if (value) {
                    try {
                        katex.render(value, formula, { throwOnError: false });
                    } catch (e) {
                        formula.innerHTML = value; // Fallback si hay error
                    }
                }
            });
        }
    }, [question]); // Se ejecuta cuando la pregunta cambia

    // --- Renderizado del Componente ---
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Fecha desconocida';
        return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(timestamp.toDate());
    };

    if (loading) return <div className="detail-loader">Cargando...</div>;
    if (error) return <div className="detail-error">{error}</div>;
    if (!question) return null;

    const userHasLiked = question.likedBy?.includes(currentUser?.uid);
    const bestAnswer = answers.find(a => a.isBest);
    const otherAnswers = answers.filter(a => !a.isBest);

    return (
        <div className="detail-page-container">
            <main className="detail-main-content">
                <div className="detail-back-link-wrapper">
                    <Link to="/foro" className="detail-back-link">
                        <i className="fas fa-arrow-left"></i> Volver al foro
                    </Link>
                </div>
                
                {/* Tarjeta de la Pregunta (de la versión actualizada) */}
                <section className="question-main-card">
                    <div className="question-header">
                        <Link to={`/perfil/${question.userId}`} className="author-info">
                            <img src={question.userPhotoURL || `https://i.pravatar.cc/150?u=${question.userId}`} alt={question.userName} className="author-avatar" />
                            <div>
                                <span className="author-name">{question.userName}</span>
                                <span className="post-date">Publicado {formatDate(question.createdAt)}</span>
                            </div>
                        </Link>
                        <div className="question-category">{question.categoria}</div>
                    </div>
                    <div className="question-body">
                        <h1 className="question-title">{question.titulo}</h1>
                        <div
                            ref={questionContentRef}
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: question.descripcion }}
                        />
                    </div>
                    <div className="question-footer">
                        <div className="stats">
                            <span>{answers.length} Respuestas</span>
                            <span>{question.views || 0} Vistas</span>
                        </div>
                        <div className="actions">
                            <button onClick={handleLike} className={`like-button ${userHasLiked ? 'liked' : ''}`} disabled={isLiking || !currentUser}>
                                <i className="fas fa-thumbs-up"></i>
                                <span>{question.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sección de Respuestas (usando AnswerCard) */}
                <section className="answers-section">
                    <h2 className="answers-title">Respuestas ({answers.length})</h2>
                    
                    {bestAnswer && (
                        <AnswerCard key={bestAnswer.id} answer={bestAnswer} onVote={handleVote} onMarkBest={handleMarkBestAnswer} questionAuthorId={question.userId} />
                    )}
                    
                    <div className="answers-list">
                        {otherAnswers.map(ans => (
                            <AnswerCard key={ans.id} answer={ans} onVote={handleVote} onMarkBest={handleMarkBestAnswer} questionAuthorId={question.userId} />
                        ))}
                    </div>
                </section>

                {/* Formulario para Responder */}
                {currentUser && (
                    <section className="answer-form-card">
                        <div className="answer-form-content">
                            <h2 className="answer-form-title">Tu respuesta</h2>
                            <form onSubmit={handleAnswerSubmit}>
                                <div className="textarea-wrapper">
                                    <textarea
                                        placeholder="Escribe tu respuesta aquí..."
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="answer-form-actions">
                                    <button type="submit" className="submit-answer-btn">
                                        Publicar respuesta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default QuestionDetail;