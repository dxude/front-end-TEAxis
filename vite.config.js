import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import chatHandler from "./api/chat.js";

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

            req.on("end", async () => {
              try {
                req.body = JSON.parse(body || "{}");
                res.status = (code) => {
                  res.statusCode = code;
                  return res;
                };
                res.json = (data) => {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                };
                await chatHandler(req, res);
              } catch (error) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: error.message || "Erro interno" }));
              }
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