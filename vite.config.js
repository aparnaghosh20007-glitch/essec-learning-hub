import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// All project files sit in one folder, so imports such as
// './components/Navbar.jsx' are pointed at './Navbar.jsx'.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^\.{1,2}\/(components|pages|state|data)\//, replacement: './' }],
  },
})
