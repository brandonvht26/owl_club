import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import Galeria from '../components/Galeria/Galeria';
import Download from '../components/Download/Download';
import Footer from '../components/Footer/Footer';

const LandingPage = () => (
    <div className="LandingPage">
        <Header />
        <Hero />
        <Services />
        <Galeria />
        <Download />
        <Footer />
    </div>
);

export default LandingPage;