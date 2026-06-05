import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expõe na rede Wi-Fi (acesso pelo celular)
    open: true,
    // Encaminha as chamadas de dados para o servidor SQLite local.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
