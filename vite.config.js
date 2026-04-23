import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Configure the development server to proxy API requests to the backend
  server:{
    host: "127.0.0.1",
    proxy:{
      "/api":{
        target:"http://127.0.0.1:8081",
        changeOrigin:true,
      },
    },
  },
});
