import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "mock-api",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/chat" && req.method === "POST") {
            let body = "";

            req.on("data", (chunk) => {
              body += chunk.toString();
            });

            req.on("end", () => {
              const { message } = JSON.parse(body);

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ reply: "Resposta mock do ChatAxis" }));
            });

            return;
          }

          next();
        });
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
  },
});