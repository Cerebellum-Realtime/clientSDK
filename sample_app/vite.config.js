import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/login": {
          target:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : process.env.VITE_LOAD_BALANCER_ENDPOINT,
          changeOrigin: true,
        },
      },
    },
  });
};
