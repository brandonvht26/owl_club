import { StrictMode, Suspense } from 'react'; // 1. Importa Suspense
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';
import App from './App.jsx';
import './i18n'; // Asegúrate de que este archivo se importa

// 2. Un mensaje de carga simple mientras se obtienen los idiomas
const loadingMarkup = (
  <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h3>Cargando...</h3>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Envuelve toda tu aplicación en Suspense */}
    <Suspense fallback={loadingMarkup}>
      <App />
    </Suspense>
  </StrictMode>
);