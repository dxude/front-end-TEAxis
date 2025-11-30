import { useState, useRef, useEffect } from "react";
import "../Styles/ChatAxis.css";

export default function ChatAxis() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // para notificação
  const bottomRef = useRef(null);
  const STORAGE_KEY = "chataxis_history_v1";

  async function sendMessage(e) {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((m) => [...m, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: [...messages, userMessage] }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Erro na requisição");
    }

    const data = await res.json();
    const botMessage = { sender: "bot", text: data.reply };
    setMessages((m) => [...m, botMessage]);

    // Se o chat estiver fechado, exibe notificação visual
    if (!isOpen) setHasNewMessage(true);
  } catch (err) {
    setMessages((m) => [
      ...m,
      { sender: "bot", text: "Erro ao conectar. Tenta de novo!" },
    ]);
  }

  setLoading(false);
}

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Carrega histórico do localStorage ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persiste histórico sempre que as mensagens mudam
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Ao abrir o chat, limpa notificação
  function openChat() {
    setIsOpen(true);
    setHasNewMessage(false);
  }

  function clearHistory() {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function sendQuick(text) {
    setInput(text);
    // enviar imediatamente
    setTimeout(() => {
      // find a way to submit: create synthetic event by calling sendMessage with a fake event
      // we'll call the same logic by programmatically creating a form submit-like flow
      const ev = { preventDefault: () => {} };
      // set input and call sendMessage
      setInput(text);
      sendMessage(ev);
    }, 100);
  }

  return (
    <div className="chat-axis-container">
      {/* Widget flutuante */}
      {!isOpen && (
        <div className="chat-axis-button" onClick={openChat}>
          <span className="chat-icon">💬</span>
          <span className="chat-text">Fale com o ChatAxis</span>
          {hasNewMessage && <span className="chat-notification"></span>}
        </div>
      )}

      {/* Chat popup */}
      <div className={`chat-axis-popup ${isOpen ? "open" : "closed"}`}>
        <div className="chat-axis-header">
          <img
            src="https://i.imgur.com/MO6rE2F.png"
            alt="TEAxis"
            className="chat-axis-logo"
          />
          <span>ChatAxis</span>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button className="chataxis-clear" onClick={clearHistory} title="Limpar histórico">Limpar</button>
            <button
              className="chat-axis-close"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>

        <div className="chat-axis-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-axis-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="typing">
              <span></span><span></span><span></span>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className="chat-axis-quick-replies">
          <button onClick={() => sendQuick("Estou ansioso")}>Estou ansioso</button>
          <button onClick={() => sendQuick("Não consigo dormir")}>Não consigo dormir</button>
          <button onClick={() => sendQuick("Quero ajuda com TDAH")}>TDAH</button>
        </div>

        <form className="chat-axis-input-area" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
