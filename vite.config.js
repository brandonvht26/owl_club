/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
En caso de error, lo comentado es lo original*/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // <-- 1. Importa el plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Añade y configura el plugin
    VitePWA({
      registerType: 'autoUpdate',
      // Opcional: inyecta el manifest en el <head>
      injectRegister: 'auto',
      // Configuración del manifest de la PWA
      manifest: {
        name: 'Owl Club',
        short_name: 'OwlClub',
        description: 'La comunidad donde los sabios como tú comparten conocimiento y resuelven dudas.',
        theme_color: '#9C5297', // <-- Tu color primario
        background_color: '#F4F5F7', // <-- Tu color de fondo
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png', // <-- Nombre del ícono
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // <-- Nombre del ícono
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // <-- Ícono "enmascarable"
          }
        ]
      }
    })
  ],
})