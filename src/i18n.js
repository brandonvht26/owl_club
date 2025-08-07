// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  // Carga las traducciones desde la carpeta /public/locales
  .use(HttpApi)
  // Pasa la instancia de i18n a react-i18next.
  .use(initReactI18next)
  // Configuración inicial
  .init({
    // Idioma por defecto
    fallbackLng: 'es',
    // Desactiva el modo debug en producción
    debug: import.meta.env.DEV,

    // Opciones para react-i18next
    interpolation: {
      escapeValue: false, // No es necesario para React, ya que escapa los valores por defecto
    },
    
    // Configuración para el backend que carga los archivos
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;