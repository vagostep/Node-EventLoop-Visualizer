/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: import.meta.env?.VITE_BASE_URL || '/',
  plugins: [react(), tsconfigPaths()],
});
