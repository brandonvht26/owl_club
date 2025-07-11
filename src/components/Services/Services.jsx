import React, { useEffect } from "react";
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
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <section className="services">
            <div className="questions">
                <h1 className="title">¿Tienes una duda?</h1>
            </div>
            <div className="search">
                <h2 className="search_box">
                    <i className="fas fa-search"></i> Escribe tu pregunta aquí...
                </h2>
            </div>
            <div className="topics_container">
                <h3 className="container_title">Temas recientes</h3>
            </div>
            {/* Swiper Carrusel */}
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