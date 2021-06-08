import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "es2015" },
  esbuild: { target: "es2015" },
  css: { modules: { localsConvention: "camelCaseOnly" } },
});
