import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './normalize.css' // Normalize fue llamado por el comando npm install normalize.css y se importa aquí
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
