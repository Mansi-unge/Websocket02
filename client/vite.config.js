import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Set your Wi-Fi IP address here
    port: 3000, // You can choose a different port if 3000 is occupied
    open: true, // This will open the browser automatically when the server starts
  },
  plugins: [react(),
    tailwindcss(),
  ],
})
