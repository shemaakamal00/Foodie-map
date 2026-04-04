import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        startsida: resolve(__dirname, "startsida.html"),
        restaurangsida: resolve(__dirname, "restaurangsida.html"),
        favoritsida: resolve(__dirname, "favoritsida.html"),
        tipssida: resolve(__dirname, "tipssida.html"),
      },
    },
  },
});
