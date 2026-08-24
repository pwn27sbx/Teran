import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logoTeran.png'],
      manifest: {
        name: 'Hospital Veterinario Terán',
        short_name: 'Terán Vet',
        description: 'Emergencias 24h y cuidado médico para mascotas',
        theme_color: '#0277ab',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logoTeran.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
