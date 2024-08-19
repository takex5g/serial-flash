import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //docsのディレクトリを指定
  build: {
    outDir: 'docs',
  },
  //3000番
  server: {},
});
