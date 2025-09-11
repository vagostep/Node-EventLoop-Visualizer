import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: "https://nodeloops.com",
  plugins: [react(), tsconfigPaths()],
})
