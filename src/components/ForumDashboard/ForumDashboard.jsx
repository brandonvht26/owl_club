import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dbFirebase } from '../../firebase';
import {
    addDoc, collection, getDocs, query, where, orderBy,
    doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import MathEditor from '../MathEditor/MathEditor';
import './ForumDashboard.css';

// Categorías y Opciones de Iconos
const predefinedCategories = [
    { id: 'matematicas', name: 'Matemáticas', icon: 'fa-square-root-alt', color: '#9C5297' },
    { id: 'ciencias', name: 'Ciencias', icon: 'fa-flask', color: '#FFC70F' },
    { id: 'lenguaje', name: 'Lenguaje', icon: 'fa-book-open', color: '#d179ca' },
    { id: 'historia', name: 'Historia', icon: 'fa-landmark', color: '#63a375' },
    { id: 'programacion', name: 'Programación', icon: 'fa-code', color: '#3b82f6' },
    { id: 'fisica', name: 'Física', icon: 'fa-atom', color: '#ef4444' },
    { id: 'biologia', name: 'Biología', icon: 'fa-dna', color: '#10b981' },
    { id: 'arte', name: 'Arte', icon: 'fa-paint-brush', color: '#f59e0b' }
];

// --- Componente Principal ---
const ForumDashboard = () => {
    const { currentUser } = useAuth();
    // ----- LA CORRECCIÓN ESTÁ AQUÍ -----
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = useForm();

    // --- Estados ---
    const [forums, setForums] = useState([]);
    const [categories, setCategories] = useState(predefinedCategories);
    const [currentTab, setCurrentTab] = useState('active');
    const [currentCategory, setCurrentCategory] = useState('all');
    const [showNewForumModal, setShowNewForumModal] = useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingForum, setEditingForum] = useState(null);

    // --- Carga de Datos ---
    const loadUserForums = useCallback(async () => {
        if (!currentUser) return;
        try {
            setLoading(true);
            const forumsQuery = query(
                collection(dbFirebase, 'foros'),
                where('userId', '==', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
            const forumsSnapshot = await getDocs(forumsQuery);
            const forumsData = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setForums(forumsData);
        } catch (error) {
            console.error('Error al cargar foros:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadUserForums();
    }, [loadUserForums]);

    // --- Funciones CRUD ---
    const handleCreateForum = async (data) => {
        try {
            const forumData = {
                ...data,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: currentUser.displayName || currentUser.email.split('@')[0],
                userPhotoURL: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
                createdAt: new Date(), replies: 0, views: 0, likes: 0, solved: false, archived: false
            };
            await addDoc(collection(dbFirebase, 'foros'), forumData);
            setShowNewForumModal(false);
            reset();
            loadUserForums();
        } catch (error) { console.error('Error al crear foro:', error); }
    };

    const handleUpdateForum = async (data) => {
        if (!editingForum) return;
        try {
            const forumRef = doc(dbFirebase, 'foros', editingForum.id);
            await updateDoc(forumRef, {
                titulo: data.titulo,
                categoria: data.categoria,
                descripcion: data.descripcion
            });
            setEditingForum(null);
            reset();
            loadUserForums();
        } catch (error) { console.error('Error al actualizar el foro:', error); }
    };

    const handleDeleteForum = async (forumId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este foro?')) {
            try {
                await deleteDoc(doc(dbFirebase, 'foros', forumId));
                loadUserForums();
            } catch (error) { console.error('Error al eliminar el foro:', error); }
        }
    };
    
    // --- Manejadores de Modales ---
    const openCreateModal = () => {
        reset();
        setValue('descripcion', '');
        setShowNewForumModal(true);
    };

    const openEditModal = (forum) => {
        setEditingForum(forum);
        setValue('titulo', forum.titulo);
        setValue('categoria', forum.categoria);
        setValue('descripcion', forum.descripcion);
    };

    const handleCreateCategory = async (data) => {
        const newCategory = {
            id: data.categoryName.toLowerCase().replace(/\s+/g, '-'), name: data.categoryName,
            icon: data.categoryIcon, color: '#' + Math.floor(Math.random() * 16777215).toString(16), custom: true
        };
        setCategories(prev => [...prev, newCategory]);
        setShowNewCategoryModal(false);
    };

    // --- Lógica de Filtrado ---
    const getFilteredForums = () => {
        let filtered = forums.filter(forum => {
            if (currentTab === 'active') return !forum.solved && !forum.archived;
            if (currentTab === 'solved') return forum.solved && !forum.archived;
            if (currentTab === 'archived') return forum.archived;
            return true;
        });
        if (currentCategory !== 'all') {
            filtered = filtered.filter(forum => forum.categoria === currentCategory);
        }
        return filtered;
    };
    const filteredForums = getFilteredForums();

    // --- Renderizado ---
    return (
        <div className="forum-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h2 className="dashboard-title">Mis Foros</h2>
                    <button className="btn-new-forum" onClick={openCreateModal}>
                        <i className="fas fa-plus"></i> Nuevo Foro
                    </button>
                </div>
                <div className="tabs-container">
                    <button className={`tab ${currentTab === 'active' ? 'active' : ''}`} onClick={() => setCurrentTab('active')}>Activos</button>
                    <button className={`tab ${currentTab === 'solved' ? 'active' : ''}`} onClick={() => setCurrentTab('solved')}>Resueltos</button>
                    <button className={`tab ${currentTab === 'archived' ? 'active' : ''}`} onClick={() => setCurrentTab('archived')}>Archivados</button>
                </div>
            </div>

            <div className="dashboard-content">
                <aside className="categories-sidebar">
                    <h3>Categorías</h3>
                    <div className="categories-list">
                        <button className={`category-item ${currentCategory === 'all' ? 'active' : ''}`} onClick={() => setCurrentCategory('all')}>
                            <i className="fas fa-th-large"></i> <span>Todas</span>
                        </button>
                        {categories.map(category => (
                            <button key={category.id} className={`category-item ${currentCategory === category.id ? 'active' : ''}`} onClick={() => setCurrentCategory(category.id)}>
                                <i className={`fas ${category.icon}`} style={{ color: category.color }}></i> <span>{category.name}</span>
                            </button>
                        ))}
                        <button className="category-item new-category" onClick={() => setShowNewCategoryModal(true)}>
                            <i className="fas fa-plus"></i> <span>Nueva Categoría</span>
                        </button>
                    </div>
                </aside>

                <div className="forums-grid">
                    {loading ? <div className="loading-state"><i className="fas fa-spinner fa-spin"></i><p>Cargando...</p></div>
                     : filteredForums.length === 0 ? <div className="empty-state"><i className="fas fa-comment-slash"></i><h3>No hay foros</h3><button className="btn-create-forum" onClick={openCreateModal}><i className="fas fa-plus"></i> Crear uno</button></div>
                     : filteredForums.map(forum => (
                        <ForumCard key={forum.id} forum={forum} categories={categories} onEdit={() => openEditModal(forum)} onDelete={() => handleDeleteForum(forum.id)} />
                    ))}
                </div>
            </div>

            {showNewForumModal && (
                <ModalForm title="Crear Nuevo Foro" onClose={() => setShowNewForumModal(false)} onSubmit={handleSubmit(handleCreateForum)} register={register} errors={errors} categories={categories} setShowNewCategoryModal={setShowNewCategoryModal} control={control} />
            )}
            {editingForum && (
                <ModalForm title="Editar Foro" onClose={() => setEditingForum(null)} onSubmit={handleSubmit(handleUpdateForum)} register={register} errors={errors} categories={categories} setShowNewCategoryModal={setShowNewCategoryModal} isEditing={true} control={control} initialDescription={editingForum.descripcion} />
            )}
            {showNewCategoryModal && (
                <NewCategoryModal onClose={() => setShowNewCategoryModal(false)} onSubmit={handleCreateCategory} />
            )}
        </div>
    );
};

// --- Sub-componentes de Ayuda ---

const ForumCard = ({ forum, categories, onEdit, onDelete }) => {
    const category = categories.find(cat => cat.id === forum.categoria);
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="forum-card">
            <div className="card-header">
                <div className="category-badge"><i className={`fas ${category?.icon || 'fa-question-circle'}`}></i><span>{category?.name || forum.categoria}</span></div>
                <div className="status-badges">{forum.solved && <span className="badge solved">Resuelto</span>}{forum.archived && <span className="badge archived">Archivado</span>}</div>
            </div>
            <h3 className="forum-title">{forum.titulo}</h3>
            <p className="forum-content">{forum.descripcion.substring(0, 100).replace(/<[^>]*>/g, '')}{forum.descripcion.length > 100 && '...'}</p>
            <div className="forum-stats">
                <div className="stat"><i className="fas fa-comment"></i><span>{forum.replies || 0}</span></div>
                <div className="stat"><i className="fas fa-eye"></i><span>{forum.views || 0}</span></div>
                <div className="stat"><i className="fas fa-thumbs-up"></i><span>{forum.likes || 0}</span></div>
            </div>
            <div className="card-footer">
                <div className="user-info">
                    <img src={forum.userPhotoURL} alt={forum.userName} className="user-avatar-small" />
                    <span>{forum.userName}</span>
                </div>
                <div className="actions">
                    <button className="action-btn" onClick={() => setShowMenu(!showMenu)}><i className="fas fa-ellipsis-h"></i></button>
                    {showMenu && (
                        <div className="action-menu">
                            <button onClick={() => { onEdit(); setShowMenu(false); }}><i className="fas fa-edit"></i> Editar</button>
                            <button onClick={() => { onDelete(); setShowMenu(false); }} className="delete"><i className="fas fa-trash"></i> Eliminar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ModalForm = ({ title, onClose, onSubmit, register, errors, categories, setShowNewCategoryModal, isEditing = false, control, initialDescription = '' }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>{title}</h3><button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button></div>
                <form onSubmit={onSubmit} className="forum-form">
                    <div className="form-group">
                        <label>Título de la pregunta</label>
                        <input type="text" placeholder="Ej: ¿Cómo resolver ecuaciones cuadráticas?" {...register('titulo', { required: 'El título es requerido' })} />
                        {errors.titulo && <span className="error">{errors.titulo.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <div className="category-select-container">
                            <select {...register('categoria', { required: 'La categoría es requerida' })}>
                                {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                            </select>
                            <button type="button" className="btn-new-category" onClick={() => setShowNewCategoryModal(true)}><i className="fas fa-plus"></i> Nueva</button>
                        </div>
                        {errors.categoria && <span className="error">{errors.categoria.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Detalles de tu pregunta (con soporte para fórmulas)</label>
                        <Controller name="descripcion" control={control} defaultValue={initialDescription} rules={{ required: 'La descripción es requerida' }} render={({ field }) => (<MathEditor value={field.value} onChange={field.onChange} />)} />
                        {errors.descripcion && <span className="error">{errors.descripcion.message}</span>}
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Publicar Pregunta'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NewCategoryModal = ({ onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const iconOptions = [{ value: 'fa-atom', label: 'Física' }, { value: 'fa-dna', label: 'Biología' }, { value: 'fa-globe-americas', label: 'Geografía' }, { value: 'fa-paint-brush', label: 'Arte' }, { value: 'fa-music', label: 'Música' }, { value: 'fa-calculator', label: 'Calculadora' }, { value: 'fa-microscope', label: 'Microscopio' }, { value: 'fa-book', label: 'Libro' }];
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content small" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h3>Crear Nueva Categoría</h3><button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button></div>
                <form onSubmit={handleSubmit(onSubmit)} className="category-form">
                    <div className="form-group"><label>Nombre de la categoría</label><input type="text" placeholder="Ej: Física Cuántica" {...register('categoryName', { required: 'El nombre es requerido' })} />{errors.categoryName && <span className="error">{errors.categoryName.message}</span>}</div>
                    <div className="form-group"><label>Icono</label><select {...register('categoryIcon', { required: 'Selecciona un icono' })}>{iconOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{errors.categoryIcon && <span className="error">{errors.categoryIcon.message}</span>}</div>
                    <div className="form-actions"><button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button><button type="submit" className="btn-submit">Crear Categoría</button></div>
                </form>
            </div>
        </div>
    );
};

export default ForumDashboard;