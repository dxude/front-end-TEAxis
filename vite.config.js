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

              // Local response generator (humanized, same as in api/chat.js)
              const generateLocalReply = (msg, history) => {
                const text = msg.toLowerCase().trim();
                
                const responseVariants = {
                  greeting: [
                    "Oi! Fico feliz em conversar com você. Como posso ajudar?",
                    "Olá! Bem-vindo ao ChatAxis. Estou aqui para ouvir e ajudar. O que tá acontecendo?",
                    "E aí! Tudo bem? Pode contar comigo — estou aqui para ajudar.",
                  ],
                  listening: [
                    "Entendo — obrigado por compartilhar isso comigo.",
                    "Tá certo, estou ouvindo. Continue, fico aqui pra te apoiar.",
                    "Sério? Isso deve ser difícil. Me conta mais sobre isso.",
                  ],
                  thanks: [
                    "Fico feliz em ajudar! Quer explorar mais alguma coisa?",
                    "Que bom! Espero ter contribuído. Tem mais algo em que eu possa ajudar?",
                    "Que legal que gostou! Se precisar de mais dicas ou de um profissional, é só chamar.",
                  ],
                };

                const professions = {
                  ansiedade: {
                    prof: "psicólogo(a) ou psiquiatra",
                    tips: ["Técnicas de respiração podem ajudar agora", "Exercício físico é ótimo para ansiedade", "Limitar cafeína também ajuda"],
                    questions: ["Quando começou essa ansiedade?", "Tem algo específico que dispara isso?", "Isso afeta seu sono ou dia a dia?"],
                  },
                  depressao: {
                    prof: "psicólogo(a) especializado em depressão",
                    tips: ["Buscar apoio de pessoas próximas é importante", "Pequenas atividades ajudam", "Não ache ruim buscar medicação se precisar"],
                    questions: ["Há quanto tempo sente isso?", "Está afetando sua rotina?", "Tem alguém de confiança para conversar?"],
                  },
                  tdah: {
                    prof: "psicólogo(a) ou neuropsicólogo com experiência em TDAH",
                    tips: ["Rotinas estruturadas ajudam muito", "Listas de tarefas visuais são aliadas", "Terapia comportamental funciona bem"],
                    questions: ["Tem dificuldade pra se concentrar?", "Desde criança ou só agora?", "Isso afeta o trabalho/estudo?"],
                  },
                  autismo: {
                    prof: "neurologista ou psiquiatra infantil",
                    tips: ["Cada pessoa no espectro é única", "Aceitar suas características é importante", "Rotinas e previsibilidade ajudam"],
                    questions: ["Quando percebeu essas características?", "Quer avaliar ou só entender melhor?", "Tem alguém ajudando você nesse processo?"],
                  },
                  sono: {
                    prof: "psiquiatra do sono ou clínico geral",
                    tips: ["Reduzir tela antes de dormir ajuda", "Horário regular de sono é importante", "Um quarto escuro e frio é ideal"],
                    questions: ["Há quanto tempo tem dificuldade de dormir?", "Acorda no meio da noite?", "Estresse pode estar envolvido?"],
                  },
                  estresse: {
                    prof: "psicólogo(a) ou coach de bem-estar",
                    tips: ["Pausas durante o dia fazem diferença", "Meditação ou yoga podem ajudar", "Estabelecer limites é essencial"],
                    questions: ["O que tá causando esse estresse?", "Como tá sua vida profissional/pessoal?", "Tem tempo pra relaxar?"],
                  },
                };

                const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
                const hasHistoryContext = history && history.length > 0;

                // 1. Greeting
                if (/^(oi|olá|opa|hey|e aí|tudo bem|opa|oi[!.]|olá[!.])/i.test(text)) {
                  return pickRandom(responseVariants.greeting);
                }

                // 2. Thanks
                if (/(obrigad|valeu|thanks|obg|muito bom|legal)/i.test(text)) {
                  return pickRandom(responseVariants.thanks);
                }

                // 3. Anxiety/stress
                if (/(ansiedade|ansioso|ansiosa|ataque de pânico|pânico|nervoso|nervosa|com medo)/i.test(text)) {
                  const prof = professions.ansiedade;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `Ansiedade é bem comum, sabia? Muita gente passa por isso. ${tip}. E aí, ${q}`;
                }

                // 4. Depression
                if (/(depress|triste|tristeza|desanim|sem vontade|tudo cinza|vontade de morrer)/i.test(text)) {
                  if (/vontade de morrer|suicid|acabar/.test(text)) {
                    return "Sinto que você está em um lugar muito escuro agora. Mas quero que saiba que não está sozinho. Se está em risco, por favor procure ajuda IMEDIATA: SAMU 192 (Brasil), Disque 188, ou vá ao PS mais próximo. Tem também o CVV (1140-155-000). Você merece ajuda profissional agora.";
                  }
                  const prof = professions.depressao;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `Depressão é real e tratável. Você não está sozinho nisso. ${tip}. Diga-me, ${q}`;
                }

                // 5. ADHD
                if (/(tdah|atenção|distraído|hiperatividade|não consigo me concentrar|desorganizado)/i.test(text)) {
                  const prof = professions.tdah;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `TDAH afeta muita gente — e tem tratamento! ${tip}. Me ajuda a entender: ${q}`;
                }

                // 6. Autism
                if (/(autis|autismo|asperger|espectro)/i.test(text)) {
                  const prof = professions.autismo;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `Neurodiversidade é beleza! ${tip}. Por curiosidade, ${q}`;
                }

                // 7. Sleep
                if (/(insônia|sono|dormir|acordar|cansaço|insone)/i.test(text)) {
                  const prof = professions.sono;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `Sono ruim afeta tudo mesmo. ${tip}. Deixa eu entender melhor: ${q}`;
                }

                // 8. Stress
                if (/(estresse|sobrecarregado|burnout|cansado|saturado|muita pressão)/i.test(text)) {
                  const prof = professions.estresse;
                  const tip = pickRandom(prof.tips);
                  const q = pickRandom(prof.questions);
                  return `Estresse é normal, mas não pode tomar conta. ${tip}. Fala comigo: ${q}`;
                }

                // 9. Help request
                if (/(ajuda|o que faço|não sei|como lidar|dica|conselho|preciso de ajuda|me ajuda)/i.test(text)) {
                  if (hasHistoryContext) {
                    const lastUserMsg = history.slice().reverse().find((m) => m.sender === "user")?.text || "";
                    return `Entendi. Deixa eu resumir: você falou de "${lastUserMsg.slice(0, 60)}..." e quer saber como lidar com isso, certo? Depende de alguns detalhes — pode me contar mais?`;
                  }
                  return "Fico feliz que me procurou! Pra eu te dar a melhor ajuda, me conta um pouco mais sobre o que tá acontecendo?";
                }

                // 10. Affirmation
                if (/(sim|é verdade|exato|com certeza|de fato)/i.test(text)) {
                  return "Ótimo, então temos um ponto em comum aqui. Como isso tá afetando você?";
                }

                // 11. Negation
                if (/(não|nope|acho que não|de jeito nenhum)/i.test(text)) {
                  return "Tá, entendi. Que tal explorar uma outra angle então?";
                }

                // 12. Professional inquiry
                if (/(qual.*profissional|onde.*procurar|como.*encontrar|recomendação|tipo de.*médico)/i.test(text)) {
                  return "Depende bastante do que você tá sentindo. Se falou algo que reconheci antes, já tenho uma ideia. Senão, me conta melhor aonde dói — e eu te aponto pra frente certa!";
                }

                // 13. Generic contextual responses
                const genericResponses = [
                  "Entendo. Pode me contar um pouquinho mais sobre isso? Quero realmente entender sua situação.",
                  "Bacana. E como você tá se sentindo com tudo isso agora?",
                  "Interessante. Isso é algo que vem de há tempo ou é mais recente?",
                  "Tá certo. Qual é a parte que mais tá te incomodando?",
                  "Faz sentido. Tem algo específico que dispara isso ou é mais uma coisa constante?",
                  "Ah, entendi. E você já conversou com alguém sobre isso — amigos, família, profissional?",
                  "Bacana demais. Acha que consegue me dar mais detalhes?",
                ];

                return pickRandom(genericResponses);
              };

              const reply = generateLocalReply(message, history);
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
