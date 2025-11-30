export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem não enviada" });
    }

    // Monta o histórico da conversa para enviar ao modelo
    let conversationContext = "";
    if (history.length > 0) {
      conversationContext = history
        .map(
          (msg) =>
            `${msg.sender === "user" ? "Usuário" : "ChatAxis"}: ${msg.text}`
        )
        .join("\n");
    }

    // Prompt inteligente: direcionado para usuários neurodivergentes
    const prompt = `
Você é ChatAxis, assistente especializado em neurodivergência.
Converse de forma empática, clara e acessível.
Dê dicas práticas, sugira profissionais adequados para cada situação, mas nunca faça diagnósticos.
Use exemplos simples e linguagem inclusiva.
Histórico da conversa:
${conversationContext}
Última mensagem do usuário: "${message}"
Responda de forma clara, amigável e com recomendações úteis.
`;

    // Se a chave da API do Gemini não estiver configurada, use um gerador local simples
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      // Resposta local humanizada com diversidade e contexto
      const generateLocalReply = (msg, history) => {
        const text = msg.toLowerCase().trim();
        
        // Banco de variações de respostas para maior diversidade
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
          encouragement: [
            "Você é mais forte do que pensa. A gente consegue! 💪",
            "Isso é importante que você tenha percebido. Tá no caminho certo!",
            "Parabéns por buscar ajuda — isso já é um grande passo!",
          ],
          professional_suggestion: [
            "Para isso, acho que seria bom você conversar com um profissional. Quer saber mais sobre qual área procurar?",
            "Essa é uma questão que um profissional pode ajudar muito melhor que eu. Posso sugerir por onde começar?",
            "Isso é coisa pra especialista mesmo. Deixa eu te apontar quem você deveria procurar.",
          ],
        };

        // Sugestões de profissionais com contexto
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

        // 1. Detectar intenção e gerar resposta contextual
        if (/^(oi|olá|opa|hey|e aí|tudo bem|opa|oi[!.]|olá[!.])/i.test(text)) {
          return pickRandom(responseVariants.greeting);
        }

        if (/(obrigad|valeu|thanks|obg|muito bom|legal)/i.test(text)) {
          return pickRandom(responseVariants.thanks);
        }

        if (/(ansiedade|ansioso|ansiosa|ataque de pânico|pânico|nervoso|nervosa|com medo)/i.test(text)) {
          const prof = professions.ansiedade;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Ansiedade é bem comum, sabia? Muita gente passa por isso. ${tip}. E aí, ${q}`;
        }

        if (/(depress|triste|tristeza|desanim|sem vontade|tudo cinza|vontade de morrer)/i.test(text)) {
          if (/vontade de morrer|suicid|acabar/.test(text)) {
            return "Sinto que você está em um lugar muito escuro agora. Mas quero que saiba que não está sozinho. Se está em risco, por favor procure ajuda IMEDIATA: SAMU 192 (Brasil), Disque 188, ou vá ao PS mais próximo. Tem também o CVV (1140-155-000) — pode ligar. Você merece ajuda profissional agora. Posso te indicar recursos?";
          }
          const prof = professions.depressao;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Depressão é real e tratável. Você não está sozinho nisso. ${tip}. Diga-me, ${q}`;
        }

        if (/(tdah|atenção|distraído|hiperatividade|não consigo me concentrar|desorganizado)/i.test(text)) {
          const prof = professions.tdah;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `TDAH afeta muita gente — e tem tratamento! ${tip}. Me ajuda a entender: ${q}`;
        }

        if (/(autis|autismo|asperger|espectro)/i.test(text)) {
          const prof = professions.autismo;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Neurodiversidade é beleza! ${tip}. Por curiosidade, ${q}`;
        }

        if (/(insônia|sono|dormir|acordar|cansaço|insone)/i.test(text)) {
          const prof = professions.sono;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Sono ruim afeta tudo mesmo. ${tip}. Deixa eu entender melhor: ${q}`;
        }

        if (/(estresse|sobrecarregado|burnout|cansado|saturado|muita pressão)/i.test(text)) {
          const prof = professions.estresse;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Estresse é normal, mas não pode tomar conta. ${tip}. Fala comigo: ${q}`;
        }

        if (/(ajuda|o que faço|não sei|como lidar|dica|conselho|preciso de ajuda|me ajuda)/i.test(text)) {
          if (hasHistoryContext) {
            const lastUserMsg = history.slice().reverse().find((m) => m.sender === "user")?.text || "";
            return `Entendi. Deixa eu resumir: você falou de "${lastUserMsg.slice(0, 60)}..." e quer saber como lidar com isso, certo? Depende de alguns detalhes — pode me contar mais?`;
          }
          return "Fico feliz que me procurou! Pra eu te dar a melhor ajuda, me conta um pouco mais sobre o que tá acontecendo?";
        }

        if (/(sim|é verdade|exato|com certeza|de fato)/i.test(text)) {
          return "Ótimo, então temos um ponto em comum aqui. Como isso tá afetando você?";
        }

        if (/(não|nope|acho que não|de jeito nenhum)/i.test(text)) {
          return "Tá, entendi. Que tal explorar uma outra angle então?";
        }

        if (/(qual.*profissional|onde.*procurar|como.*encontrar|recomendação|tipo de.*médico)/i.test(text)) {
          return "Depende bastante do que você tá sentindo. Se falou algo que reconheci antes, já tenho uma ideia. Senão, me conta melhor aonde dói — e eu te aponto pra frente certa!";
        }

        // 2. Se tem histórico, tentar usar contexto anterior para dar continuidade natural
        if (hasHistoryContext && history.length >= 4) {
          const botReplies = history.filter((m) => m.sender === "bot").map((m) => m.text);
          const userMsgs = history.filter((m) => m.sender === "user").map((m) => m.text.toLowerCase());

          // Verificar se o usuário está pedindo para explorar mais
          if (/mais|continue|explica|conta de novo|repete/i.test(text)) {
            return "Claro! Quer que eu aprofunde em algum ponto específico? Diz qual parte te interessou mais.";
          }

          // Contextualizar baseado em tópicos anteriores
          if (userMsgs.some((m) => /ansiedade|estresse|depres|sono/.test(m))) {
            return `Sinto que você tá lidando com bastante coisa. Você já pensou em procurar um profissional? Posso indicar por onde começar.`;
          }
        }

        // 3. Respostas genéricas humanizadas como fallback
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
      return res.status(200).json({ reply });
    }

    // Chamada para o Gemini Pro (Google AI)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        geminiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, eu não consegui gerar uma resposta agora 😵";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("ERRO NO SERVER:", error);
    return res
      .status(500)
      .json({ error: "Erro no servidor ao processar mensagem." });
  }
}
