import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ForumDashboard from '../components/ForumDashboard/ForumDashboard';

const ForumDashboardPage = () => {
    return (
        <>
            <Header />
            <main>
                <ForumDashboard />
            </main>
            <Footer />
        </>
    );
};

export default ForumDashboardPage;