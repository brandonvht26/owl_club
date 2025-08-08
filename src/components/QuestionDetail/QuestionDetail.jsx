import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbFirebase } from '../../firebase';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, runTransaction, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './QuestionDetail.css';

// --- (El sub-componente AnswerCard no necesita cambios, se mantiene igual) ---
const AnswerCard = ({ answer, onVote, onMarkBest, questionAuthorId, t }) => {
    const { currentUser } = useAuth();
    const isQuestionAuthor = currentUser?.uid === questionAuthorId;

    const userVote = currentUser ? {
        up: answer.upvotedBy?.includes(currentUser.uid),
        down: answer.downvotedBy?.includes(currentUser.uid),
    } : {};

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Intl.DateTimeFormat(t.language, { dateStyle: 'long', timeStyle: 'short' }).format(timestamp.toDate());
    };

    return (
        <div className={`answer-card ${answer.isBest ? 'best-answer' : ''}`}>
            <div className="answer-card-content">
                <div className="answer-card-header">
                    <div className="author-info">
                        <img src={answer.userPhotoURL} alt="Autor" className="author-avatar" />
                        <div>
                            <h3 className="author-name">{answer.userName}</h3>
                            <p className="answer-date">{t('question_detail.answered_at')} {formatDate(answer.createdAt)}</p>
                        </div>
                    </div>
                    {answer.isBest && (
                        <div className="best-answer-badge">
                            <i className="fas fa-star"></i> {t('question_detail.best_answer_badge')}
                        </div>
                    )}
                </div>
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
                    {isQuestionAuthor && !answer.isBest && (
                         <button onClick={() => onMarkBest(answer.id, answer.userId)} className="mark-best-btn">
                            <i className="fas fa-check-circle"></i> {t('question_detail.mark_as_best_button')}
                        </button>
                    )}
                </div>
            </div>
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
    
    const questionContentRef = useRef(null);

    // --- (Todas las funciones como fetchQuestionAndAnswers, handleVote, etc. se mantienen igual) ---
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
            } else {
                setError(t('question_detail.not_found_error'));
                return;
            }

            const answersQuery = query(collection(dbFirebase, 'foros', questionId, 'respuestas'), orderBy('score', 'desc'));
            const answersSnapshot = await getDocs(answersQuery);
            setAnswers(answersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError(t('question_detail.load_error'));
        } finally {
            setLoading(false);
        }
    }, [questionId, currentUser, t]);

    const handleVote = async (answerId, voteType) => {
        if (!currentUser) {
            alert(t('question_detail.login_to_vote'));
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
        if (question.userId !== currentUser?.uid) {
            alert(t('question_detail.not_author_error'));
            return;
        }

        try {
            await runTransaction(dbFirebase, async (transaction) => {
                const questionRef = doc(dbFirebase, 'foros', questionId);
                const answerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', answerId);
                const answerAuthorRef = doc(dbFirebase, 'users', answerAuthorId);

                answers.forEach(ans => {
                    if (ans.isBest && ans.id !== answerId) {
                        const oldBestAnswerRef = doc(dbFirebase, 'foros', questionId, 'respuestas', ans.id);
                        transaction.update(oldBestAnswerRef, { isBest: false });
                    }
                });

                transaction.update(answerRef, { isBest: true });
                transaction.update(questionRef, { solved: true });

                const authorDoc = await transaction.get(answerAuthorRef);
                const currentPoints = authorDoc.data()?.points || 0;
                transaction.update(answerAuthorRef, { points: currentPoints + 15 });
            });
            
            fetchQuestionAndAnswers();
            alert(t('question_detail.best_answer_success'));
        } catch (error) {
            console.error("Error al marcar la mejor respuesta:", error);
            alert(t('question_detail.request_error'));
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim() || !currentUser) return;
        try {
            const answerData = {
                content: newAnswer, userId: currentUser.uid, userName: currentUser.displayName || currentUser.email,
                userPhotoURL: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
                createdAt: new Date(), isBest: false, score: 0, upvotedBy: [], downvotedBy: []
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
            alert(t('question_detail.publish_answer_error'));
        }
    };

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
        if (!timestamp) return t('question_detail.unknown_date');
        return new Intl.DateTimeFormat(t.language, { dateStyle: 'long', timeStyle: 'short' }).format(timestamp.toDate());
    };

    if (loading) return <div className="detail-loader">{t('question_detail.loading')}</div>;
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
                        <i className="fas fa-arrow-left"></i> {t('question_detail.back_to_forum')}
                    </Link>
                </div>
                
                <section className="question-main-card">
                    <div className="question-header">
                        <div className="author-info"> {/* Div principal para la info del autor */}
                            <img src={question.userPhotoURL || `https://i.pravatar.cc/150?u=${question.userId}`} alt={question.userName} className="author-avatar" />
                            <div>
                                {/* AHORA CADA UNO EN SU PROPIA LÍNEA */}
                                <Link to={`/perfil/${question.userId}`} className="author-name">{question.userName}</Link>
                                <span className="post-date">{t('question_detail.published_at')} {formatDate(question.createdAt)}</span>
                            </div>
                        </div>
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
                        {/* AHORA CADA ESTADÍSTICA EN SU PROPIA LÍNEA */}
                        <div className="stats">
                            <div>{answers.length} {t('question_detail.replies')}</div>
                            <div>{question.views || 0} {t('question_detail.views')}</div>
                        </div>
                        <div className="actions">
                            <button onClick={handleLike} className={`like-button ${userHasLiked ? 'liked' : ''}`} disabled={isLiking || !currentUser}>
                                <i className="fas fa-thumbs-up"></i>
                                <span>{question.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="answers-section">
                    <h2 className="answers-title">{t('question_detail.answers_title', { count: answers.length })}</h2>
                    
                    {bestAnswer && (
                        <AnswerCard key={bestAnswer.id} answer={bestAnswer} onVote={handleVote} onMarkBest={handleMarkBestAnswer} questionAuthorId={question.userId} t={t} />
                    )}
                    
                    <div className="answers-list">
                        {otherAnswers.map(ans => (
                            <AnswerCard key={ans.id} answer={ans} onVote={handleVote} onMarkBest={handleMarkBestAnswer} questionAuthorId={question.userId} t={t} />
                        ))}
                    </div>
                </section>

                {currentUser && (
                    <section className="answer-form-card">
                        <div className="answer-form-content">
                            <h2 className="answer-form-title">{t('question_detail.your_answer_title')}</h2>
                            <form onSubmit={handleAnswerSubmit}>
                                <div className="textarea-wrapper">
                                    <textarea
                                        placeholder={t('question_detail.answer_placeholder')}
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="answer-form-actions">
                                    <button type="submit" className="submit-answer-btn">
                                        {t('question_detail.publish_button')}
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