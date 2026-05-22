import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 8 (rolldown) requires manualChunks as a function
function manualChunks(id) {
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) return 'react-vendor';
  if (id.includes('node_modules/firebase/')) return 'firebase';
  if (id.includes('node_modules/framer-motion/')) return 'motion';
  if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) return 'charts';
  if (id.includes('node_modules/mammoth/')) return 'doc-parse';
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
  },
})
