// src/pages/UserProfilePage.jsx (NUEVO ARCHIVO)

import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import UserProfile from '../components/UserProfile/UserProfile';

const UserProfilePage = () => {
    return (
        <>
            <Header />
            <main>
                <UserProfile />
            </main>
            <Footer />
        </>
    );
};

export default UserProfilePage;