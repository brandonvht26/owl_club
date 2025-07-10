import React from "react";
import './Services.css'

const Services = () => {
    return (
        <section className="services">
            <div className="questions">
                <h1 className="title">¿Tienes una duda?</h1>
            </div>
            <div className="search">
                <h2 className="search_box">
                    <i className= "fas fa-search"></i> Escribe tu pregunta aquí...
                </h2>
            </div>
            <div className="topics_container">
                <h3 className="container_title">Temas recientes</h3>
            </div>
            <div className="topics_grid">{["Matemática", "Física", "Biología", "Artes", "Inglés", "ECA"].map((tema) => (
                <div className="topic_item" key={tema}>
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
                ))}
        </div>
        </section>
    )
}

export default Services;