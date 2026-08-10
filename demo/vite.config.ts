import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "story-slides": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
