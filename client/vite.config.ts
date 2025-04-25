import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: "https://vagostep.github.io/Node-EventLoop-Visualizer",
  plugins: [react(), tsconfigPaths()],
});
