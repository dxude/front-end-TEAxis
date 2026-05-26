import { useState, useRef, useEffect } from "react";
import "../Styles/ChatAxis.css";
import logoTeaxis from "../assets/imagens/fundoLogo.png";

const quickReplies = [
  { label: "Estou ansioso", value: "Estou ansioso" },
  { label: "Não consigo dormir", value: "Não consigo dormir" },
  { label: "Ajuda com TDAH", value: "Quero ajuda com TDAH" },
  { label: "Dificuldade de concentração", value: "Tenho dificuldade de concentração" },
  { label: "Sensibilidade sensorial", value: "Tenho sensibilidade sensorial" },
  { label: "Como funciona o TEAxis", value: "Como funciona o TEAxis?" },
];

export default function ChatAxis({ isOpenExternal = null, onCloseExternal = null, isIntegrated = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // para notificação
  const bottomRef = useRef(null);
  const STORAGE_KEY = "chataxis_history_v1";
  
  // Determina se usa o estado externo ou interno
  const shouldUseExternalState = isOpenExternal !== null;
  const isOpenState = shouldUseExternalState ? isOpenExternal : isOpen;
  const setIsOpenState = (value) => {
    if (shouldUseExternalState && onCloseExternal) {
      onCloseExternal(value);
    } else {
      setIsOpen(value);
    }
  };

  async function sendMessage(e) {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: updatedMessages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Erro na requisição");
    }

    const data = await res.json();
    const botMessage = { sender: "bot", text: data.reply };
    setMessages((m) => [...m, botMessage]);

    // Se o chat estiver fechado, exibe notificação visual
    if (!isOpenState) setHasNewMessage(true);
  } catch (err) {
    console.error("Chat error:", err);
    setMessages((m) => [
      ...m,
      { sender: "bot", text: "Erro ao conectar. Tenta de novo!" },
    ]);
  }

  setLoading(false);
}

  useEffect(() => {
    if (!isOpenState) return;
    const messagesContainer = bottomRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, isOpenState]);

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
    setIsOpenState(true);
    setHasNewMessage(false);
  }

  function clearHistory() {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function sendQuick(text) {
    // criar uma mensagem e enviar logo
    const userMessage = { sender: "user", text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: updatedMessages }),
        });

        if (!res.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await res.json();
        const botMessage = { sender: "bot", text: data.reply };
        setMessages((m) => [...m, botMessage]);

        if (!isOpenState) setHasNewMessage(true);
      } catch (err) {
        console.error("Quick reply error:", err);
        setMessages((m) => [
          ...m,
          { sender: "bot", text: "Erro ao conectar. Tenta de novo!" },
        ]);
      }

      setLoading(false);
    })();
  }

  return (
    <div className={`chat-axis-container ${isIntegrated ? 'integrated' : ''}`}>
      {/* Widget flutuante */}
      {!isOpenState && !isIntegrated && (
        <div className="chat-axis-button" onClick={openChat}>
          <span className="chat-icon">💬</span>
          <span className="chat-text">Fale com o ChatAxis</span>
          {hasNewMessage && <span className="chat-notification"></span>}
        </div>
      )}

      {/* Chat popup */}
      <div className={`chat-axis-popup ${isOpenState ? "open" : "closed"} ${isIntegrated ? 'integrated' : ''}`}>
        <div className="chat-axis-header">
          <img
            src={logoTeaxis}
            alt="Logo TEAxis"
            className="chat-axis-logo"
          />
          <div className="chat-axis-title-group">
            <span className="chat-axis-brand">TEAxis</span>
            <small className="chat-axis-subtitle">Pergunte sobre neurodivergência, sintomas e como a plataforma funciona.</small>
          </div>
          <div className="chat-axis-header-actions">
            <button className="chataxis-clear" onClick={clearHistory} title="Limpar histórico">Limpar</button>
            <button
              className="chat-axis-close"
              onClick={() => setIsOpenState(false)}
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
          {quickReplies.map((reply) => (
            <button key={reply.label} onClick={() => sendQuick(reply.value)}>
              {reply.label}
            </button>
          ))}
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
