// src/components/Services/Services.jsx (Reemplaza el archivo completo)
import React, { useState, useEffect } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import { dbFirebase } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import './Services.css';

const Services = () => {
    // NUEVO: Estado para los foros destacados
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const fetchFeatured = async () => {
            try {
                // Traemos los 3 foros con más "me gusta"
                const q = query(collection(dbFirebase, "foros"), orderBy("likes", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
                const featuredData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFeatured(featuredData);
            } catch (error) {
                console.error("Error al cargar foros destacados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <section className="services" id="services">
            <div className="questions">
                <h1 className="title" data-aos="fade-up">¿Tienes una duda?</h1>
            </div>
            <div className="search" data-aos="fade-up" data-aos-delay="100">
                <Link to="/foro" className="search_box">
                    <i className="fas fa-search"></i> Escribe tu pregunta aquí...
                </Link>
            </div>
            <div className="topics_container" data-aos="fade-up" data-aos-delay="200">
                <h3 className="container_title">🔥 Foros Populares</h3>
            </div>
            
            <div className="featured-forums-grid" data-aos="fade-up" data-aos-delay="300">
                {loading ? <p>Cargando foros...</p> : featured.map(forum => (
                    <Link to={`/foro/${forum.id}`} key={forum.id} className="featured-card">
                        <div className="featured-card-header">
                            <span className="featured-category">{forum.categoria}</span>
                            <div className="featured-likes">
                                <i className="fas fa-thumbs-up"></i> {forum.likes || 0}
                            </div>
                        </div>
                        <h4 className="featured-title">{forum.titulo}</h4>
                        <p className="featured-author">por {forum.userName}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Services;