import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // esbuild options are not needed for most React+Vite setups,
  // but if you have custom requirements, keep this block.
  // Otherwise, you can remove it for simplicity.
  // esbuild: {
  //   loader: 'jsx',
  //   include: /\.(js|jsx|ts|tsx)$/,
  // },
})
