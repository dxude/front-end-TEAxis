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

              // Local response generator (humanized, with TEAxis knowledge)
              const generateLocalReply = (msg, history) => {
                const text = msg.toLowerCase().trim();
                
                const professions = {
                  ansiedade: {
                    tips: ["Técnicas de respiração podem ajudar agora", "Exercício físico é ótimo para ansiedade", "Limitar cafeína também ajuda"],
                    questions: ["Quando começou essa ansiedade?", "Tem algo específico que dispara isso?", "Isso afeta seu sono ou dia a dia?"],
                    teaxis_msg: "No TEAxis você encontra profissionais especializados em ansiedade que oferecem técnicas eficazes!",
                  },
                  depressao: {
                    tips: ["Buscar apoio de pessoas próximas é importante", "Pequenas atividades ajudam", "Não ache ruim buscar medicação se precisar"],
                    questions: ["Há quanto tempo sente isso?", "Está afetando sua rotina?", "Tem alguém de confiança para conversar?"],
                    teaxis_msg: "Com o TEAxis você pode agendar consultas regularmente e acompanhar sua evolução com um profissional confiável.",
                  },
                  tdah: {
                    tips: ["Rotinas estruturadas ajudam muito", "Listas de tarefas visuais são aliadas", "Terapia comportamental funciona bem"],
                    questions: ["Tem dificuldade pra se concentrar?", "Desde criança ou só agora?", "Isso afeta o trabalho/estudo?"],
                    teaxis_msg: "No TEAxis você conecta com especialistas em TDAH que entendem os desafios reais!",
                  },
                  autismo: {
                    tips: ["Cada pessoa no espectro é única", "Aceitar suas características é importante", "Rotinas e previsibilidade ajudam"],
                    questions: ["Quando percebeu essas características?", "Quer avaliar ou só entender melhor?", "Tem alguém ajudando você?"],
                    teaxis_msg: "No TEAxis você encontra profissionais que celebram a neurodiversidade!",
                  },
                  sono: {
                    tips: ["Reduzir tela antes de dormir ajuda", "Horário regular de sono é importante", "Um quarto escuro e frio é ideal"],
                    questions: ["Há quanto tempo tem dificuldade de dormir?", "Acorda no meio da noite?", "Estresse pode estar envolvido?"],
                    teaxis_msg: "Com o TEAxis você agenda consultas rápidas e resuelve problemas de sono com segurança!",
                  },
                  estresse: {
                    tips: ["Pausas durante o dia fazem diferença", "Meditação ou yoga podem ajudar", "Estabelecer limites é essencial"],
                    questions: ["O que tá causando esse estresse?", "Como tá sua vida profissional/pessoal?", "Tem tempo pra relaxar?"],
                    teaxis_msg: "No TEAxis você encontra profissionais especializados em controle de estresse e bem-estar!",
                  },
                };

                const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
                const hasHistoryContext = history && history.length > 0;

                // Saudações
                if (/^(oi|olá|opa|hey|e aí|tudo bem)/i.test(text)) {
                  const greetings = [
                    "Oi! Fico feliz em conversar com você. Como posso ajudar?",
                    "Olá! Bem-vindo ao ChatAxis. Estou aqui para ouvir e ajudar. O que tá acontecendo?",
                    "E aí! Tudo bem? Pode contar comigo — estou aqui para ajudar.",
                  ];
                  return pickRandom(greetings);
                }

                // Perguntas sobre TEAxis
                if (/(teaxis|como funciona|o que é|vantagens|agendamento|profissionais|plataforma|site)/i.test(text)) {
                  const teaxis_responses = [
                    "O TEAxis é uma plataforma que conecta pessoas neurodivergentes como você a profissionais especializados! Você consegue buscar, agendar consultas e acompanhar sua evolução — tudo de forma segura e com respeito. Quer saber mais?",
                    "No TEAxis você encontra profissionais de vários tipos (psicólogos, terapeutas, pedagogos), agenda consultas online com facilidade, e tudo fica seguro e organizado. A melhor parte? Um matching inteligente que te recomenda profissionais que combinam com você!",
                    "TEAxis oferece: busca de profissionais, agendamento fácil, segurança de dados, acompanhamento de metas, e um espaço acolhedor. É feito especialmente para neurodivergentes! Tem algo específico que você gostaria de saber?",
                  ];
                  return pickRandom(teaxis_responses);
                }

                // Agradecimentos
                if (/(obrigad|valeu|thanks|obg|muito bom|legal)/i.test(text)) {
                  return "Que bom! Se precisar de mais dicas ou de um profissional, é só chamar. No TEAxis você encontra muitas opções!";
                }

                // Ansiedade
                if (/(ansiedade|ansioso|ansiosa|ataque de pânico|pânico|nervoso|nervosa|com medo)/i.test(text)) {
                  const p = professions.ansiedade;
                  return `Ansiedade é bem comum, saiba que você não está sozinho. ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // Depressão/suicídio
                if (/(depress|triste|tristeza|desanim|sem vontade|vontade de morrer)/i.test(text)) {
                  if (/morrer|suicid|acabar/.test(text)) {
                    return "Sinto que você está em um lugar muito escuro. Você NÃO está sozinho. Procure ajuda IMEDIATA: SAMU 192, Disque 188, CVV (1140-155-000) ou vá ao PS. No TEAxis você pode conectar com profissionais qualificados. Você merece ajuda agora.";
                  }
                  const p = professions.depressao;
                  return `Depressão é real e tratável. Você não está sozinho. ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // TDAH
                if (/(tdah|atenção|distraído|hiperatividade|não consigo me concentrar|desorganizado)/i.test(text)) {
                  const p = professions.tdah;
                  return `TDAH afeta muita gente — tem tratamento! ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // Autismo
                if (/(autis|autismo|asperger|espectro)/i.test(text)) {
                  const p = professions.autismo;
                  return `Neurodiversidade é beleza! ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // Sono
                if (/(insônia|sono|dormir|acordar|cansaço|insone)/i.test(text)) {
                  const p = professions.sono;
                  return `Sono ruim afeta tudo mesmo. ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // Estresse
                if (/(estresse|sobrecarregado|burnout|cansado|saturado|muita pressão)/i.test(text)) {
                  const p = professions.estresse;
                  return `Estresse é normal, mas não pode controlar sua vida. ${pickRandom(p.tips)}. ${pickRandom(p.questions)} ${p.teaxis_msg}`;
                }

                // Ajuda/recomendação
                if (/(ajuda|o que faço|não sei|como lidar|dica|conselho|preciso|me ajuda)/i.test(text)) {
                  return "Fico feliz que me procurou! Me conta mais sobre o que tá acontecendo, e depois posso recomendar um profissional no TEAxis que pode te ajudar!";
                }

                // Cadastro
                if (/(cadastro|me registrar|como entrar|criar conta|sign up|login)/i.test(text)) {
                  return "Para começar no TEAxis, acesse a página de cadastro. Escolha se você é usuário (buscando apoio) ou profissional. Preencha suas informações, e em poucos passos você já consegue encontrar profissionais!";
                }

                // Segurança
                if (/(segurança|privacidade|dados|confiança|seguro)/i.test(text)) {
                  return "Segurança é essencial! No TEAxis seus dados estão protegidos, privacidade garantida, com criptografia e conformidade com leis. Você pode confiar plenamente! 🔒";
                }

                // Agendamento
                if (/(agendamento|consulta|sessão|marcar|horário|online)/i.test(text)) {
                  return "No TEAxis agendar é muito simples! Escolha o profissional, veja a disponibilidade, marca dia e hora. As sessões são online, seguras e você acompanha tudo na plataforma!";
                }

                // Profissional
                if (/(qual.*profissional|onde.*procurar|como.*encontrar|recomendação|tipo de.*médico)/i.test(text)) {
                  return "Ótimo que quer procurar ajuda profissional! Me conta mais sobre o que você tá sentindo, e depois você busca no TEAxis, que tem uma ótima seleção de profissionais qualificados!";
                }

                // Genérico
                const genericResponses = [
                  "Entendo. Pode me contar um pouquinho mais? Quero realmente entender sua situação.",
                  "Bacana. E como você tá se sentindo com tudo isso agora?",
                  "Interessante. Isso é algo que vem de há tempo ou é mais recente?",
                  "Tá certo. Qual é a parte que mais tá te incomodando?",
                  "Faz sentido. Tem algo específico que dispara isso?",
                  "Ah, entendi. E você já conversou com alguém — amigos, família, ou profissional?",
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
