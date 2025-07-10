import React, { useState, useEffect } from "react";
import "./MemeGallery.css"; // Crea este archivo si no existe para tus estilos de memes

function MemeGallery() {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemes = async () => {
        try {
            const response = await fetch("https://api.imgflip.com/get_memes");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
            setMemes(data.data.memes);
        } else {
            throw new Error(data.error_message || "Failed to fetch memes");
        }
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    };

    fetchMemes();
    }, []);

    if (loading) {
    return (
        <div className="meme-gallery-container">
        Cargando plantillas de memes...
        </div>
    );
    }

    if (error) {
        return <div className="meme-gallery-container">Error: {error.message}</div>;
    }

    return (
    <div className="meme-gallery-container">
        <h1>Plantillas de Memes de Imgflip</h1>
        <div className="meme-grid">
        {memes.map((meme) => (
            <div key={meme.id} className="meme-card">
            <img src={meme.url} alt={meme.name} className="meme-image" />
            <p className="meme-name">{meme.name}</p>
            </div>
        ))}
        </div>
    </div>
    );
}

export default MemeGallery;
