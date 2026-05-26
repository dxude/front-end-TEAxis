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
Você é ChatAxis, assistente especializado em neurodivergência e representante da plataforma TEAxis.
Sua missão é:
1. Ouvir e apoiar pessoas neurodivergentes com empatia e acolhimento
2. Explicar sintomas e condições (TDAH, Autismo, Ansiedade, Depressão, Sensibilidade Sensorial, Insônia, Problemas de Atenção, sobrecarga sensorial, etc.)
3. Educar sobre o TEAxis - plataforma que conecta neurodivergentes a profissionais qualificados
4. Explicar vantagens: agendamentos com profissionais reais, matching inteligente, segurança, privacidade e ambiente respeitoso
5. Oferecer exemplos práticos e próximos passos sem dar diagnóstico

TEAxis oferece:
- Conexão com profissionais especializados em neurodivergência
- Agendamento fácil de consultas online e acompanhamento de progresso
- Matching inteligente para ajudar a encontrar o profissional ideal
- Segurança de dados e privacidade garantida
- Espaço de respeito, empatia e tecnologia inclusiva
- Recomendações sobre sintomas e estratégias de autocuidado

Converse de forma empática, clara, acessível e orientada por ações.
Dê dicas práticas e sugira profissionais adequados sempre que possível.
Nunca faça diagnósticos, mas explique como o TEAxis pode ajudar o usuário a buscar apoio.

Histórico da conversa:
${conversationContext}
Última mensagem do usuário: "${message}"
Responda de forma clara, amigável e com recomendações úteis.
`;

    // Se a chave da API do Gemini não estiver configurada, use um gerador local
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      // Resposta local humanizada com conhecimento sobre TEAxis
      const generateLocalReply = (msg, history) => {
        const text = msg.toLowerCase().trim();
        
        const responseVariants = {
          greeting: [
            "Oi! Fico feliz em conversar com você. Como posso ajudar?",
            "Olá! Bem-vindo ao ChatAxis. Estou aqui para ouvir e ajudar. O que tá acontecendo?",
            "E aí! Tudo bem? Pode contar comigo — estou aqui para ajudar.",
          ],
          thanks: [
            "Fico feliz em ajudar! Quer explorar mais alguma coisa?",
            "Que bom! Se precisar de mais dicas ou de um profissional, é só chamar.",
            "Que legal que gostou! No TEAxis você encontra profissionais para aprofundar isso!",
          ],
        };

        const professions = {
          ansiedade: {
            prof: "psicólogo(a) ou psiquiatra",
            tips: ["Técnicas de respiração podem ajudar agora", "Exercício físico é ótimo para ansiedade", "Limitar cafeína também ajuda"],
            questions: ["Quando começou essa ansiedade?", "Tem algo específico que dispara isso?", "Isso afeta seu sono ou dia a dia?"],
            teaxis_msg: "No TEAxis você encontra profissionais especializados em ansiedade que oferecem técnicas eficazes!",
          },
          depressao: {
            prof: "psicólogo(a) especializado em depressão",
            tips: ["Buscar apoio de pessoas próximas é importante", "Pequenas atividades ajudam", "Não ache ruim buscar medicação se precisar"],
            questions: ["Há quanto tempo sente isso?", "Está afetando sua rotina?", "Tem alguém de confiança para conversar?"],
            teaxis_msg: "Com o TEAxis você pode agendar consultas regularmente e acompanhar sua evolução com um profissional confiável.",
          },
          tdah: {
            prof: "psicólogo(a) ou neuropsicólogo com experiência em TDAH",
            tips: ["Rotinas estruturadas ajudam muito", "Listas de tarefas visuais são aliadas", "Terapia comportamental funciona bem"],
            questions: ["Tem dificuldade pra se concentrar?", "Desde criança ou só agora?", "Isso afeta o trabalho/estudo?"],
            teaxis_msg: "No TEAxis você conecta com especialistas em TDAH que entendem os desafios reais!",
          },
          autismo: {
            prof: "neurologista ou psiquiatra infantil",
            tips: ["Cada pessoa no espectro é única", "Aceitar suas características é importante", "Rotinas e previsibilidade ajudam"],
            questions: ["Quando percebeu essas características?", "Quer avaliar ou só entender melhor?", "Tem alguém ajudando você?"],
            teaxis_msg: "No TEAxis você encontra profissionais que celebram a neurodiversidade!",
          },
          sono: {
            prof: "psiquiatra do sono ou clínico geral",
            tips: ["Reduzir tela antes de dormir ajuda", "Horário regular de sono é importante", "Um quarto escuro e frio é ideal"],
            questions: ["Há quanto tempo tem dificuldade de dormir?", "Acorda no meio da noite?", "Estresse pode estar envolvido?"],
            teaxis_msg: "Com o TEAxis você agenda consultas rápidas e resuelve problemas de sono com segurança!",
          },
          estresse: {
            prof: "psicólogo(a) ou coach de bem-estar",
            tips: ["Pausas durante o dia fazem diferença", "Meditação ou yoga podem ajudar", "Estabelecer limites é essencial"],
            questions: ["O que tá causando esse estresse?", "Como tá sua vida profissional/pessoal?", "Tem tempo pra relaxar?"],
            teaxis_msg: "No TEAxis você encontra profissionais especializados em controle de estresse e bem-estar!",
          },
        };

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const hasHistoryContext = history && history.length > 0;

        // 1. Saudações
        if (/^(oi|olá|opa|hey|e aí|tudo bem|opa|oi[!.]|olá[!.])/i.test(text)) {
          return pickRandom(responseVariants.greeting);
        }

        // 2. Perguntas sobre TEAxis
        if (/(teaxis|como funciona|o que é|vantagens|agendamento|profissionais|plataforma|site)/i.test(text)) {
          const responses = [
            "O TEAxis é uma plataforma que conecta pessoas neurodivergentes como você a profissionais especializados! Você consegue buscar, agendar consultas e acompanhar sua evolução — tudo de forma segura e com respeito. Quer saber mais sobre algo específico?",
            "No TEAxis você encontra profissionais de vários tipos (psicólogos, terapeutas, pedagogos), agenda consultas online com facilidade, e tudo fica seguro e organizado na plataforma. A melhor parte? Um matching inteligente que te recomenda profissionais que combinam com você!",
            "TEAxis oferece: busca de profissionais, agendamento fácil, segurança de dados, acompanhamento de metas, e um espaço acolhedor. É feito especialmente para neurodivergentes! Tem algo específico que você gostaria de saber?",
          ];
          return pickRandom(responses);
        }

        // 3. Agradecimentos
        if (/(obrigad|valeu|thanks|obg|muito bom|legal)/i.test(text)) {
          return pickRandom(responseVariants.thanks);
        }

        // 4. Detecção de condições com mensagem do TEAxis
        if (/(ansiedade|ansioso|ansiosa|ataque de pânico|pânico|nervoso|nervosa|com medo)/i.test(text)) {
          const prof = professions.ansiedade;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Ansiedade é bem comum, saiba que você não está sozinho. ${tip}. E aí, ${q} ${prof.teaxis_msg}`;
        }

        if (/(depress|triste|tristeza|desanim|sem vontade|tudo cinza|vontade de morrer)/i.test(text)) {
          if (/vontade de morrer|suicid|acabar|morrer/.test(text)) {
            return "Sinto que você está em um lugar muito escuro. Você NÃO está sozinho. Procure ajuda IMEDIATA: SAMU 192, Disque 188, CVV (1140-155-000) ou vá ao PS. No TEAxis você pode conectar com profissionais qualificados rapidamente após essa situação se estabilizar. Você merece ajuda profissional agora.";
          }
          const prof = professions.depressao;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Depressão é real e tratável. Você não está sozinho. ${tip}. ${q} ${prof.teaxis_msg}`;
        }

        if (/(tdah|atenção|distraído|hiperatividade|não consigo me concentrar|desorganizado)/i.test(text)) {
          const prof = professions.tdah;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `TDAH afeta muita gente — tem tratamento e você consegue lidar! ${tip}. ${q} ${prof.teaxis_msg}`;
        }

        if (/(autis|autismo|asperger|espectro)/i.test(text)) {
          const prof = professions.autismo;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Neurodiversidade é beleza! ${tip}. ${q} ${prof.teaxis_msg}`;
        }

        if (/(insônia|sono|dormir|acordar|cansaço|insone)/i.test(text)) {
          const prof = professions.sono;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Sono ruim afeta tudo mesmo. ${tip}. ${q} ${prof.teaxis_msg}`;
        }

        if (/(estresse|sobrecarregado|burnout|cansado|saturado|muita pressão)/i.test(text)) {
          const prof = professions.estresse;
          const tip = pickRandom(prof.tips);
          const q = pickRandom(prof.questions);
          return `Estresse é normal, mas não pode controlar sua vida. ${tip}. ${q} ${prof.teaxis_msg}`;
        }

        // 5. Pedidos de ajuda
        if (/(ajuda|o que faço|não sei|como lidar|dica|conselho|preciso de ajuda|me ajuda)/i.test(text)) {
          if (hasHistoryContext) {
            const lastUserMsg = history.slice().reverse().find((m) => m.sender === "user")?.text || "";
            return `Entendi sua situação. No TEAxis você encontra um profissional que pode ajudar especificamente com isso. Quer que eu te mostre como buscar?`;
          }
          return "Fico feliz que me procurou! Me conta mais sobre o que tá acontecendo, e depois posso recomendar um profissional no TEAxis que pode te ajudar!";
        }

        // 6. Cadastro/Acesso
        if (/(cadastro|me registrar|como entrar|criar conta|sign up|login)/i.test(text)) {
          return "Para começar no TEAxis, acesse a página de cadastro e escolha se você é um usuário (buscando apoio) ou um profissional. Preencha suas informações, e em poucos passos você já consegue encontrar profissionais ou oferecer seus serviços!";
        }

        // 7. Preço/Valor
        if (/(preço|custa|valor|gratuito|quanto custa|pagamento)/i.test(text)) {
          return "Os valores variam conforme o profissional escolhido. No TEAxis você vê os preços e disponibilidades antes de agendar. Transparência total! Cada profissional define seu próprio valor.";
        }

        // 8. Segurança/Privacidade
        if (/(segurança|privacidade|dados|confiança|seguro)/i.test(text)) {
          return "Segurança é essencial! No TEAxis seus dados estão protegidos, privacidade garantida, com criptografia e conformidade com leis de proteção de dados. Você pode confiar plenamente! 🔒";
        }

        // 9. Agendamento/Sessões
        if (/(agendamento|consulta|sessão|marcar|horário|online)/i.test(text)) {
          return "No TEAxis agendar é muito simples! Escolha o profissional, veja a disponibilidade, marca dia e hora que funciona pra você. As sessões são online, seguras e você acompanha tudo na plataforma!";
        }

        // 10. Afirmações/Negações
        if (/(sim|é verdade|exato|com certeza|de fato)/i.test(text)) {
          return "Ótimo! Então temos um ponto em comum. Como isso tá afetando você? No TEAxis você encontra profissionais especializados nisso!";
        }

        if (/(não|nope|acho que não|de jeito nenhum)/i.test(text)) {
          return "Tá certo. Que tal explorar outra coisa então? No TEAxis tem profissionais para vários tipos de apoio!";
        }

        // 11. Procura de profissional
        if (/(qual.*profissional|onde.*procurar|como.*encontrar|recomendação|tipo de.*médico|preciso de profissional)/i.test(text)) {
          return "Ótimo que quer procurar ajuda profissional! Depende do que você tá sentindo. Me conta mais e recomendo — depois você busca no TEAxis, que tem uma ótima seleção de profissionais qualificados!";
        }

        // 12. Contexto de conversa anterior
        if (hasHistoryContext && history.length >= 4) {
          const userMsgs = history.filter((m) => m.sender === "user").map((m) => m.text.toLowerCase());

          if (/mais|continue|explica|conta de novo|repete/i.test(text)) {
            return "Claro! Quer que eu aprofunde em algo específico? Diz qual parte te interessou!";
          }

          if (userMsgs.some((m) => /ansiedade|estresse|depres|sono|tdah|autis/.test(m))) {
            return `Sinto que você tá lidando com bastante coisa. No TEAxis você encontra profissionais para cada uma dessas questões. Quer saber como começar?`;
          }
        }

        // 13. Respostas genéricas humanizadas
        const genericResponses = [
          "Entendo. Pode me contar um pouquinho mais? Quero realmente entender sua situação.",
          "Bacana. E como você tá se sentindo com tudo isso agora?",
          "Interessante. Isso é algo que vem de há tempo ou é mais recente?",
          "Tá certo. Qual é a parte que mais tá te incomodando?",
          "Faz sentido. Tem algo específico que dispara isso?",
          "Ah, entendi. E você já conversou com alguém — amigos, família, ou profissional?",
          "Bacana! Você deveria conversar com um profissional sobre isso. No TEAxis tem muita gente qualificada!",
        ];

        return pickRandom(genericResponses);
      };

      const reply = generateLocalReply(message, history);
      return res.status(200).json({ reply });
    }

    // Chamada para o Gemini Pro (Google AI) - se GEMINI_API_KEY estiver definida
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
