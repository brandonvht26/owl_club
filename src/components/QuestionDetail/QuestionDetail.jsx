import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, runTransaction, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import katex from 'katex';
import MathEditor from '../MathEditor/MathEditor';
import 'react-quill-new/dist/quill.snow.css';  
import 'katex/dist/katex.min.css';
import './QuestionDetail.css';

// Componente para comentarios individuales
const CommentItem = ({ comment, onReply }) => {
    const { currentUser } = useAuth();
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const commentContentRef = useRef(null);

    useEffect(() => {
        if (commentContentRef.current) {
            const formulas = commentContentRef.current.querySelectorAll('.ql-formula');
            formulas.forEach(formula => {
                const value = formula.getAttribute('data-value');
                if (value) {
                    try {
                        katex.render(value, formula, { throwOnError: false });
                    } catch (e) {
                        formula.innerHTML = value;
                    }
                }
            });
        }
    }, [comment]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Intl.DateTimeFormat('es', { 
            dateStyle: 'short', 
            timeStyle: 'short' 
        }).format(timestamp.toDate());
    };

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        onReply(comment.id, replyText);
        setReplyText('');
        setShowReplyBox(false);
    };

    return (
        <div className="comment-item">
            <div className="comment-header">
                <img 
                    src={comment.userPhotoURL || `https://randomuser.me/api/portraits/men/32.jpg`} 
                    alt="Usuario" 
                    className="comment-avatar" 
                />
                <div className="comment-author-info">
                    <span className="comment-author-name">{comment.userName}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
            </div>
            <div 
                ref={commentContentRef}
                className="comment-content prose" 
                dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            <div className="comment-actions">
                <button 
                    className="reply-btn"
                    onClick={() => setShowReplyBox(!showReplyBox)}
                >
                    Responder
                </button>
            </div>
            
            {showReplyBox && (
                <div className="reply-box">
                    <MathEditor
                        value={replyText}
                        onChange={setReplyText}
                        placeholder="Escribe tu respuesta..."
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                ['formula'],
                                ['link']
                            ]
                        }}
                    />
                    <div className="reply-actions">
                        <button 
                            onClick={handleReplySubmit}
                            disabled={!replyText.trim()}
                            className="reply-submit-btn"
                        >
                            Responder
                        </button>
                        <button 
                            onClick={() => setShowReplyBox(false)}
                            className="reply-cancel-btn"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            
            {/* Respuestas anidadas */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="nested-replies">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Componente para foros relacionados
const RelatedForums = ({ currentQuestionId, category, subcategory }) => {
    const [relatedQuestions, setRelatedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRelatedQuestions = async () => {
            setLoading(true);
            try {
                let relatedQuery;
                if (subcategory) {
                    relatedQuery = query(
                        collection(dbFirebase, 'foros'),
                        where('subcategoria', '==', subcategory),
                        orderBy('createdAt', 'desc')
                    );
                } else {
                    relatedQuery = query(
                        collection(dbFirebase, 'foros'),
                        where('categoria', '==', category),
                        orderBy('createdAt', 'desc')
                    );
                }
                
                const snapshot = await getDocs(relatedQuery);
                const questions = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(q => q.id !== currentQuestionId)
                    .slice(0, 5);
                
                setRelatedQuestions(questions);
            } catch (error) {
                console.error("Error al cargar preguntas relacionadas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelatedQuestions();
        }
    }, [currentQuestionId, category, subcategory]);

    if (loading) {
        return (
            <div className="related-forums">
                <h3>Preguntas relacionadas</h3>
                <div className="related-loader">Cargando...</div>
            </div>
        );
    }

    if (relatedQuestions.length === 0) return null;

    return (
        <div className="related-forums">
            <h3>Preguntas relacionadas</h3>
            <div className="related-questions-list">
                {relatedQuestions.map(question => (
                    <Link 
                        key={question.id} 
                        to={`/foro/${question.id}`}
                        className="related-question-item"
                    >
                        <div className="related-question-content">
                            <h4>{question.titulo}</h4>
                            <div className="related-question-meta">
                                <span>{question.replies || 0} respuestas</span>
                                <span>•</span>
                                <span>{question.views || 0} vistas</span>
                            </div>
                        </div>
                        <div className="related-question-status">
                            {question.solved && (
                                <span className="solved-indicator">✓</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const AnswerCard = ({ answer, onVote, onMarkBest, questionAuthorId, t }) => {
    const { currentUser } = useAuth();
    const isQuestionAuthor = currentUser?.uid === questionAuthorId;

    const [showCommentBox, setShowCommentBox] = useState(false);
    const [showComments, setShowComments] = useState(true); 
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const userVote = currentUser ? {
        up: answer.upvotedBy?.includes(currentUser.uid),
        down: answer.downvotedBy?.includes(currentUser.uid),
    } : {};

    // Cargar comentarios cuando se abre la sección
    const loadComments = async () => {
        if (loadingComments) return;
        setLoadingComments(true);
        
        try {
            const commentsQuery = query(
                collection(dbFirebase, 'foros', answer.questionId, 'respuestas', answer.id, 'comentarios'),
                orderBy('createdAt', 'asc')
            );
            const commentsSnapshot = await getDocs(commentsQuery);
            setComments(commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
    // Auto-cargar comentarios cuando se monta el componente
        loadComments();
    }, [answer.id]); // Se ejecuta cuando cambia el answer.id

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || !currentUser) return;
        
        try {
            const commentData = {
                content: commentText,
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                userPhotoURL: currentUser.photoURL,
                createdAt: new Date(),
                replies: []
            };
            
            await addDoc(
                collection(dbFirebase, 'foros', answer.questionId, 'respuestas', answer.id, 'comentarios'), 
                commentData
            );

            // Actualizar contador de comentarios
            const answerRef = doc(dbFirebase, 'foros', answer.questionId, 'respuestas', answer.id);
            await updateDoc(answerRef, {
                commentsCount: increment(1)
            });

            setCommentText('');
            loadComments(); // Recargar comentarios
        } catch (error) {
            console.error("Error al publicar comentario:", error);
            alert('Error al publicar el comentario');
        }
    };

    const handleReplyToComment = async (commentId, replyText) => {
        if (!replyText.trim() || !currentUser) return;
        
        try {
            const replyData = {
                content: replyText,
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                userPhotoURL: currentUser.photoURL,
                createdAt: new Date(),
                parentCommentId: commentId
            };
            
            await addDoc(
                collection(dbFirebase, 'foros', answer.questionId, 'respuestas', answer.id, 'comentarios'), 
                replyData
            );

            loadComments(); // Recargar comentarios
        } catch (error) {
            console.error("Error al responder comentario:", error);
            alert('Error al responder el comentario');
        }
    };

    const toggleComments = () => {
        setShowCommentBox(!showCommentBox); // Solo togglea el formulario
        if (comments.length === 0) {
            loadComments();
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Intl.DateTimeFormat(t.language, { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        }).format(timestamp.toDate());
    };

    return (
        <div className={`answer-card ${answer.isBest ? 'best-answer' : ''}`}>
            <div className="answer-card-content">
                <div className="answer-card-header">
                    <div className="author-info">
                        <img 
                            src={answer.userPhotoURL || `https://randomuser.me/api/portraits/women/65.jpg`} 
                            alt="Autor" 
                            className="author-avatar" 
                        />
                        <div className="author-details">
                            <h3 className="author-name">
                                {answer.userName}
                                {answer.isVerified && <span className="verified-badge"></span>}
                            </h3>
                            <p className="author-role">Estudiante</p>
                        </div>
                    </div>
                    {answer.isBest && (
                        <div className="best-answer-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" className="badge-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            MEJOR RESPUESTA
                        </div>
                    )}
                </div>
                
                <div className="answer-content">
                    <div className="prose" dangerouslySetInnerHTML={{ __html: answer.content }}></div>
                </div>
                
                <div className="answer-card-footer">
                    <div className="answer-actions">
                        <div className="vote-controls">
                            <button 
                                onClick={() => onVote(answer.id, 'up')} 
                                className={`vote-btn ${userVote.up ? 'voted' : ''}`} 
                                disabled={!currentUser}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="vote-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <span className="vote-score">{answer.score || 0}</span>
                            <button 
                                onClick={() => onVote(answer.id, 'down')} 
                                className={`vote-btn ${userVote.down ? 'voted' : ''}`} 
                                disabled={!currentUser}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="vote-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <button className="comment-btn" onClick={toggleComments}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="comment-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            {showCommentBox ? 'Ocultar' : 'Comentar'}, (comentarios ({answer.commentsCount || 0}))
                        </button>
                    </div>
                    
                    <div className="answer-meta">
                        <span className="answer-date">Respondido {formatDate(answer.createdAt)}</span>
                        
                        {isQuestionAuthor && !answer.isBest && (
                            <button
                                onClick={() => onMarkBest(answer.id, answer.userId)}
                                className="mark-best-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mark-best-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Marcar como mejor
                            </button>
                        )}
                    </div>
                </div>
            </div>
        
            {/* Sección de comentarios mejorada */}
            {(showComments || showCommentBox) && (
                    <div className="comments-section">
                    {/* Formulario para nuevo comentario */}
                    {showCommentBox && (
                        <div className="new-comment-form">
                            <h4>Agregar comentario</h4>
                            <MathEditor
                                value={commentText}
                                onChange={setCommentText}
                                placeholder="Escribe tu comentario..."
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic'],
                                        ['formula'],
                                        ['code-block']
                                    ]
                                }}
                            />
                            <div className="comment-form-actions">
                                <button 
                                    onClick={handleCommentSubmit}
                                    disabled={!commentText.trim()}
                                    className="comment-submit-btn"
                                >
                                    Publicar comentario
                                </button>
                                <button 
                                    onClick={() => setShowCommentBox(false)}
                                    className="comment-cancel-btn"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lista de comentarios existentes */}
                    <div className="comments-list">
                        {loadingComments ? (
                            <div className="comments-loader">Cargando comentarios...</div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <CommentItem 
                                    key={comment.id} 
                                    comment={comment} 
                                    onReply={handleReplyToComment}
                                />
                            ))
                        ) : (
                            <div className="no-comments">No hay comentarios aún</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const QuestionDetail = () => {
    const { t } = useTranslation();
    const { questionId } = useParams();
    const { currentUser } = useAuth();

    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [sortBy, setSortBy] = useState('score');
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    const answerFormRef = useRef(null);
    const [questionAuthor, setQuestionAuthor] = useState(null);
    const questionContentRef = useRef(null);

    const fetchQuestionAndAnswers = useCallback(async () => {
        setLoading(true);
        try {
            const questionRef = doc(dbFirebase, 'foros', questionId);
            const questionSnap = await getDoc(questionRef);

            if (questionSnap.exists()) {
                const questionData = { id: questionSnap.id, ...questionSnap.data() };
                if (currentUser && questionData.userId !== currentUser.uid && !sessionStorage.getItem(`viewed_${questionId}`)) {
                    await updateDoc(questionRef, { views: (questionData.views || 0) + 1 });
                    sessionStorage.setItem(`viewed_${questionId}`, 'true');
                }
                setQuestion(questionData);
            
                if (questionData.userId) {
                    const authorRef = doc(dbFirebase, 'users', questionData.userId);
                    const authorSnap = await getDoc(authorRef);
                    if (authorSnap.exists()) {
                        setQuestionAuthor(authorSnap.data());
                    } else {
                        console.warn(`Perfil de autor no encontrado para el ID: ${questionData.userId}`);
                    }
                }
            } else {
                setError(t('question_detail.not_found_error') || 'Pregunta no encontrada');
                return;
            }

            const orderByField = sortBy === 'recent' ? 'createdAt' : 'score';
            const answersQuery = query(
                collection(dbFirebase, 'foros', questionId, 'respuestas'), 
                orderBy(orderByField, 'desc')
            );
            const answersSnapshot = await getDocs(answersQuery);
            const answersData = answersSnapshot.docs.map(doc => ({ 
                id: doc.id, 
                questionId: questionId, // Agregar questionId para comentarios
                ...doc.data() 
            }));
            setAnswers(answersData);

        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError(t('question_detail.load_error') || 'Error al cargar la pregunta');
        } finally {
            setLoading(false);
        }
    }, [questionId, currentUser, t, sortBy]);

    const handleVote = async (answerId, voteType) => {
        if (!currentUser) {
            alert(t('question_detail.login_to_vote') || 'Debes iniciar sesión para votar');
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
                        data.upvotedBy.splice(upvoteIndex, 1);
                    } else {
                        data.upvotedBy.push(currentUser.uid);
                        if (downvoteIndex >= 0) data.downvotedBy.splice(downvoteIndex, 1);
                    }
                } else if (voteType === 'down') {
                    if (downvoteIndex >= 0) {
                        data.downvotedBy.splice(downvoteIndex, 1);
                    } else {
                        data.downvotedBy.push(currentUser.uid);
                        if (upvoteIndex >= 0) data.upvotedBy.splice(upvoteIndex, 1);
                    }
                }
                
                data.score = data.upvotedBy.length - data.downvotedBy.length;
                transaction.update(answerRef, {
                    upvotedBy: data.upvotedBy,
                    downvotedBy: data.downvotedBy,
                    score: data.score
                });
            });
            fetchQuestionAndAnswers();
        } catch (error) {
            console.error("Error en la transacción de voto:", error);
        }
    };

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
                    likedBy.push(currentUser.uid);
                } else {
                    likedBy.splice(userIndex, 1);
                }
                
                transaction.update(questionRef, { likes: likedBy.length, likedBy: likedBy });
                setQuestion(prev => ({ ...prev, likes: likedBy.length, likedBy: likedBy }));
            });
        } catch (e) {
            console.error("Error en la transacción de like: ", e);
        } finally {
            setIsLiking(false);
        }
    };
    
    const handleMarkBestAnswer = async (answerId, answerAuthorId) => {
        console.log("Iniciando con el método 'Write Batch'...", { questionId, answerId, answerAuthorId });

        if (question.userId !== currentUser?.uid) {
            alert('Solo el autor puede marcar la mejor respuesta');
            return;
        }

        if (!questionId || !answerId || !answerAuthorId) {
            alert("Error: Faltan datos para completar la operación.");
            return;
        }

        try {
            const authorRef = doc(dbFirebase, 'users', answerAuthorId);
            const authorDoc = await getDoc(authorRef);

            if (!authorDoc.exists()) {
                throw new Error(`El documento del autor con ID ${answerAuthorId} no existe.`);
            }
            const currentPoints = authorDoc.data().points || 0;

            const bestAnswerQuery = query(collection(dbFirebase, 'foros', questionId, 'respuestas'), where('isBest', '==', true));
            const currentBestAnswerSnap = await getDocs(bestAnswerQuery);

            const batch = writeBatch(dbFirebase);

            currentBestAnswerSnap.forEach(doc => {
                batch.update(doc.ref, { isBest: false });
            });

            const newBestAnswerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', answerId);
            batch.update(newBestAnswerRef, { isBest: true });
            
            const questionRef = doc(dbFirebase, 'foros', questionId);
            batch.update(questionRef, { solved: true });

            batch.update(authorRef, { points: currentPoints + 15 });

            await batch.commit();
            
            fetchQuestionAndAnswers();
            alert('¡Respuesta marcada como la mejor y +15 puntos para el sabio!');

        } catch (error) {
            console.error("Error DETALLADO con el método 'Write Batch':", error);
            alert(`Ocurrió un error: ${error.message}`);
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim() || !currentUser) return;
        
        try {
            const answerData = {
                content: newAnswer,
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                userPhotoURL: currentUser.photoURL || `https://randomuser.me/api/portraits/men/75.jpg`,
                createdAt: new Date(),
                isBest: false,
                score: 0,
                upvotedBy: [],
                downvotedBy: [],
                commentsCount: 0
            };
            
            await addDoc(collection(dbFirebase, 'foros', questionId, 'respuestas'), answerData);

            const questionRef = doc(dbFirebase, 'foros', questionId);
            await updateDoc(questionRef, {
                replies: increment(1)
            });

            setNewAnswer('');
            fetchQuestionAndAnswers();

        } catch (error) { 
            console.error("Error al publicar respuesta:", error); 
            alert(t('question_detail.publish_answer_error') || 'Error al publicar la respuesta');
        }
    };

    // Cerrar menú de opciones al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOptionsMenu && !event.target.closest('.options-container')) {
                setShowOptionsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptionsMenu]);

    useEffect(() => {
        fetchQuestionAndAnswers();
    }, [fetchQuestionAndAnswers]);

    useEffect(() => {
        if (questionContentRef.current) {
            const formulas = questionContentRef.current.querySelectorAll('.ql-formula');
            formulas.forEach(formula => {
                const value = formula.getAttribute('data-value');
                if (value) {
                    try {
                        katex.render(value, formula, { throwOnError: false });
                    } catch (e) {
                        formula.innerHTML = value;
                    }
                }
            });
        }
    }, [question]);


    const formatDate = (timestamp) => {
        if (!timestamp) return 'Fecha desconocida';
        return new Intl.DateTimeFormat('es', { 
            dateStyle: 'long', 
            timeStyle: 'short' 
        }).format(timestamp.toDate());
    };

    if (loading) {
        return (
            <div className="detail-loader">
                <div className="loader-spinner"></div>
                <p>Cargando pregunta...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="detail-error">
                <h2>Error</h2>
                <p>{error}</p>
                <Link to="/foro" className="back-to-forum-btn">Volver al foro</Link>
            </div>
        );
    }
    
    if (!question) return null;

    const userHasLiked = question.likedBy?.includes(currentUser?.uid);
    const bestAnswer = answers.find(a => a.isBest);
    const otherAnswers = answers.filter(a => !a.isBest);

    return (
        <div className="question-detail-container">
            {/* Sidebar con preguntas relacionadas */}
            <aside className="sidebar">
                <RelatedForums 
                    currentQuestionId={questionId}
                    category={question.categoria}
                    subcategory={question.subcategoria}
                />
            </aside>

            <main className="question-detail-main">
                {/* Back Navigation */}
                <div className="back-navigation">
                    <Link to="/foro" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Volver a preguntas
                    </Link>
                </div>

                {/* Question Section */}
                <section className="question-section">
                    <div className="question-header">
                        <div className="question-author-info">
                            <img 
                                src={question.userPhotoURL || `https://randomuser.me/api/portraits/men/32.jpg`} 
                                alt="Autor" 
                                className="question-author-avatar" 
                            />
                            <div className="question-author-details">
                                <h3 className="question-author-name">{question.userName}</h3>
                                <p className="question-author-role">{questionAuthor?.role || 'Miembro del Club'}</p>
                            </div>
                        </div>
                        <div className="question-tags">
                            <span className="question-category">{question.categoria}</span>
                            {question.subcategoria && <span className="question-subcategory">{question.subcategoria}</span>}
                        </div>
                    </div>

                    <div className="question-body">
                        <h1 className="question-title">{question.titulo}</h1>
                        <div className="question-meta">
                            <span>Publicado {formatDate(question.createdAt)}</span>
                            <span>•</span>
                            <span>{answers.length} respuestas</span>
                            <span>•</span>
                            <span>{question.views || 0} visualizaciones</span>
                        </div>
                    </div>

                    <div className="question-content">
                        <div 
                            ref={questionContentRef}
                            className="prose" 
                            dangerouslySetInnerHTML={{ __html: question.descripcion }}
                        />
                    </div>

                    <div className="question-footer">
                        <div className="question-actions">
                            <button 
                                onClick={handleLike}
                                className={`like-btn ${userHasLiked ? 'liked' : ''}`}
                                disabled={isLiking || !currentUser}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="like-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                {question.likes || 0}
                            </button>
                            
                            <button className="comment-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" className="comment-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                Comentar
                            </button>
                        </div>

                        <div className="question-options">
                            <div className="options-container">
                                <button className="options-btn" onClick={() => setShowOptionsMenu(!showOptionsMenu)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="options-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                    Opciones
                                </button>

                                {showOptionsMenu && (
                                    <div className="options-menu">
                                        {currentUser?.uid === question.userId && (
                                            <button onClick={() => alert('Próximamente: Editar pregunta')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                Editar pregunta
                                            </button>
                                        )}
                                        <button onClick={() => alert('Próximamente: Reportar pregunta')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Reportar pregunta
                                        </button>
                                        <button onClick={() => navigator.share ? navigator.share({title: question.titulo, url: window.location.href}) : navigator.clipboard.writeText(window.location.href)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="menu-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                            </svg>
                                            Compartir
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {currentUser && (
                                <button
                                    className="respond-btn"
                                    onClick={() => answerFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="respond-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    Responder
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Answers Section */}
                <section className="answers-section">
                    <div className="answers-header">
                        <h2 className="answers-title">Respuestas ({answers.length})</h2>
                        <div className="answers-sort">
                            <span>Ordenar por:</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="score">Mejor valoradas</option>
                                <option value="recent">Más recientes</option>
                                <option value="verified">Verificadas</option>
                            </select>
                        </div>
                    </div>

                    {/* Best Answer */}
                    {bestAnswer && (
                        <AnswerCard 
                            key={bestAnswer.id} 
                            answer={bestAnswer} 
                            onVote={handleVote} 
                            onMarkBest={handleMarkBestAnswer} 
                            questionAuthorId={question.userId} 
                            t={t} 
                        />
                    )}

                    {/* Other Answers */}
                    <div className="answers-list">
                        {otherAnswers.map(answer => (
                            <AnswerCard 
                                key={answer.id} 
                                answer={answer} 
                                onVote={handleVote} 
                                onMarkBest={handleMarkBestAnswer} 
                                questionAuthorId={question.userId} 
                                t={t} 
                            />
                        ))}
                    </div>

                    {answers.length > 5 && (
                        <div className="load-more">
                            <button className="load-more-btn">
                                Cargar más respuestas
                            </button>
                        </div>
                    )}
                </section>

                {/* Answer Form */}
                {currentUser && (
                    <section ref={answerFormRef} className="answer-form-section">
                        <div className="answer-form-card">
                            <h2 className="answer-form-title">Tu respuesta</h2>
                            <form onSubmit={handleAnswerSubmit}>
                                <div className="editor-container">
                                    <MathEditor
                                        value={newAnswer}
                                        onChange={setNewAnswer}
                                    />
                                </div>
                                <div className="form-actions">
                                    <div className="formatting-tools">
                                        <button type="button" className="format-btn" title="Agregar fórmula">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="format-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                        <button type="button" className="format-btn" title="Agregar imagen">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="format-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <button type="button" className="format-btn" title="Agregar tabla">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="format-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={!newAnswer.trim()}>
                                        Publicar respuesta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </main>

            {/* Floating Action Button */}
            <button className="floating-action-btn" title="Nueva pregunta">
                <svg xmlns="http://www.w3.org/2000/svg" className="fab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
};

export default QuestionDetail;