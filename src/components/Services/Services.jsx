// src/components/Services/Services.jsx - ACTUALIZADO

import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import AOS from "aos";
import './Services.css';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const temas = ["Matemática", "Física", "Biología", "Artes", "Inglés", "ECA"];

const Services = () => {
    const { t } = useTranslation(); // 2. Usar el hook

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        // Añadimos el id para que el scroll del header funcione
        <section className="services" id="services">
            <div className="questions">
                {/* 3. Reemplazar texto */}
                <h1 className="title">{t('services.title')}</h1>
            </div>
            <div className="search">
                <h2 className="search_box">
                    <i className="fas fa-search"></i> {t('services.search_placeholder')}
                </h2>
            </div>
            <div className="topics_container">
                <h3 className="container_title">{t('services.recent_topics')}</h3>
            </div>
            {/* Swiper Carrusel (el contenido dentro del carrusel es de ejemplo, lo dejamos como está) */}
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="topics_swiper"
            >
                {temas.map((tema, idx) => (
                    <SwiperSlide key={tema}>
                        <div
                            className="topic_item"
                            data-aos="zoom-in"
                            data-aos-delay={100 * idx}
                        >
                            <div className="topic_box">
                                <div className="header">
                                    <h4 className="title_box">
                                        <i className="fas fa-circle"></i>
                                        <div className="header_text">
                                            <span className="header_title">Header</span>
                                            <span className="header_subtitle">Subhead</span>
                                        </div>
                                    </h4>
                                    <div className="label_menu_box">
                                        <div className="box_label">
                                            <i className="far fa-hand-pointer icon-hand"></i> {tema}
                                        </div>
                                        <i className="fas fa-ellipsis-v options_icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="content_box">
                                <div className="topic_content">
                                    <h5 className="content_title">TEMA</h5>
                                    <h6 className="content_subtitle">Subtema</h6>
                                    <p className="content">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export default Services;