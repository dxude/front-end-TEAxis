import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // No alias: rely on normal node resolution for react-router/@remix-run/router
    // If Vercel still fails, we'll add targeted optimizeDeps or a safe alias.
  },
  server: {
    middlewareMode: true,
    middleware: [
      (req, res, next) => {
        // Mock /api/chat endpoint locally for development
        if (req.url === "/api/chat" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const { message, history = [] } = JSON.parse(body);

              // Local response generator (same as in api/chat.js)
              const generateLocalReply = (msg) => {
                const text = msg.toLowerCase();

                const suggestions = [
                  { keys: ["ansiedade", "ansioso", "ansiosa", "ataque de pânico", "pânico"], prof: "psicólogo(a) ou psiquiatra" },
                  { keys: ["depress", "triste", "tristeza", "desanim", "sem vontade"], prof: "psicólogo(a) e avaliação médica" },
                  { keys: ["tdah", "atenção", "distraído", "hiperatividade"], prof: "psicólogo(a) com experiência em TDAH" },
                  { keys: ["autis", "autismo", "asperger"], prof: "neurologista infantil/psiquiatra e terapeuta ocupacional" },
                  { keys: ["insônia", "sono", "dormir", "acordar cedo"], prof: "psiquiatra do sono ou clínico geral" },
                  { keys: ["estresse", "sobrecarregado", "burnout"], prof: "psicólogo(a) ou coach especializado" },
                  { keys: ["memória", "lembrar", "esqueci"], prof: "neurologista/psicólogo" },
                ];

                for (const s of suggestions) {
                  for (const k of s.keys) {
                    if (text.includes(k)) {
                      return `Você mencionou "${k}" — pode ser útil procurar ${s.prof}. Posso também compartilhar dicas práticas agora, ou indicar recursos.`;
                    }
                  }
                }

                const intents = [
                  { re: /(ajuda|o que faço|não sei|como lidar|preciso de ajuda)/i, reply: "Entendo — estou aqui para ouvir. Quer me contar o que aconteceu ou prefere sugestões práticas agora?" },
                  { re: /(suicid|morrer|acabar com a vida)/i, reply: "Sinto que você está passando por algo muito difícil. Se estiver em risco imediato, procure ajuda de emergência (SAMU 192 no Brasil) ou um serviço local. Quer que eu mostre contatos e recursos agora?" },
                  { re: /(bom|obrigad|valeu|show|obg)/i, reply: "Que bom — fico feliz em ajudar. Se quiser, posso sugerir próximos passos ou profissionais para contato." },
                  { re: /(sintoma|sinto|sintindo|sinto que)/i, reply: "Obrigado por compartilhar. Pode me dizer quando isso começou? Posso ajudar com sugestões de autocuidado e profissionais." },
                ];

                for (const it of intents) {
                  if (it.re.test(msg)) return it.reply;
                }

                if (history && history.length > 0) {
                  const lastUser = history.slice().reverse().find((m) => m.sender === "user");
                  if (lastUser && lastUser.text && lastUser.text.length > 20) {
                    return `Obrigado por detalhar. Pelo que entendi: "${lastUser.text.slice(0, 80)}..." — quer aprofundar esse ponto ou prefere sugestões práticas?`;
                  }
                }

                return "Obrigado por compartilhar. Pode me contar um pouco mais sobre a situação? Posso dar dicas práticas e sugerir que tipo de profissional procurar.";
              };

              const reply = generateLocalReply(message);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ reply }));
            } catch (error) {
              console.error("Mock API error:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Erro no servidor ao processar mensagem." }));
            }
          });
        } else {
          next();
        }
      },
    ],
  }
});
