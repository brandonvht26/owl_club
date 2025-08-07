import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import './NotFound.css'; 

const NotFound = () => {
    const { t } = useTranslation(); // 2. Usar el hook

    return (
        <div className="not-found-container">
            {/* 3. Reemplazar textos con la función t() */}
            <h1 className="not-found-title">{t('not_found.title')}</h1>
            <p className="not-found-message">{t('not_found.message')}</p>
            <p className="not-found-submessage">{t('not_found.submessage')}</p>
            <Link to="/home" className="not-found-link">
                {t('not_found.button')}
            </Link>
        </div>
    );
};

export default NotFound;