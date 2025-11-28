import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // ¡CRÍTICO! Esto asegura que las rutas de tus assets (CSS/JS) funcionen
  // correctamente cuando se sirven desde el dominio raíz de Firebase.
  base: './', 
  plugins: [react()],
});