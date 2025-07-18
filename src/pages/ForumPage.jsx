// src/pages/ForumPage.jsx

import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Forum from '../components/Forum/Forum'; // <-- Importamos nuestro nuevo componente

const ForumPage = () => {
    return (
        <>
        <Header />
        <main>
            <Forum />
        </main>
        <Footer />
        </>
    );
};

export default ForumPage;