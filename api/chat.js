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

    // Chamada para o Gemini Pro (Google AI)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
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
