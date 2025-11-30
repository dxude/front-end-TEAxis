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
      // Resposta local simples para permitir testes e demo sem chave externa
      const generateLocalReply = (msg, history) => {
        const text = msg.toLowerCase();

        // sugestões de profissionais por palavra-chave (pares de palavras-chave + sugestão compacta)
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
              return `Você mencionou \"${k}\" — pode ser útil procurar ${s.prof}. Posso também compartilhar dicas práticas agora, ou indicar recursos.`;
            }
          }
        }

        // intenções / padrões comuns
        const intents = [
          { re: /(ajuda|o que faço|não sei|como lidar|preciso de ajuda)/i, reply: "Entendo — estou aqui para ouvir. Quer me contar o que aconteceu ou prefere sugestões práticas agora?" },
          { re: /(suicid|morrer|acabar com a vida)/i, reply: "Sinto que você está passando por algo muito difícil. Se estiver em risco imediato, procure ajuda de emergência (SAMU 192 no Brasil) ou um serviço local. Quer que eu mostre contatos e recursos agora?" },
          { re: /(bom|obrigad|valeu|show|obg)/i, reply: "Que bom — fico feliz em ajudar. Se quiser, posso sugerir próximos passos ou profissionais para contato." },
          { re: /(sintoma|sinto|sintindo|sinto que)/i, reply: "Obrigado por compartilhar. Pode me dizer quando isso começou? Posso ajudar com sugestões de autocuidado e profissionais." },
        ];

        for (const it of intents) {
          if (it.re.test(msg)) return it.reply;
        }

        // tentar usar histórico para dar contexto simples
        if (history && history.length > 0) {
          const lastUser = history.slice().reverse().find((m) => m.sender === "user");
          if (lastUser && lastUser.text && lastUser.text.length > 20) {
            return `Obrigado por detalhar. Pelo que entendi: "${lastUser.text.slice(0,80)}..." — quer aprofundar esse ponto ou prefere sugestões práticas?`;
          }
        }

        // fallback neutro
        return "Obrigado por compartilhar. Pode me contar um pouco mais sobre a situação? Posso dar dicas práticas e sugerir que tipo de profissional procurar.";
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
