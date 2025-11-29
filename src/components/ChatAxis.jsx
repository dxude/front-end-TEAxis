import { useState, useRef, useEffect } from "react";
import "../Styles/ChatAxis.css";

export default function ChatAxis() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // para notificação
  const bottomRef = useRef(null);

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
      body: JSON.stringify({ message: input, history: messages }), // <--- aqui
    });

    const data = await res.json();
    const botMessage = { sender: "bot", text: data.reply };
    setMessages((m) => [...m, botMessage]);
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

  // Ao abrir o chat, limpa notificação
  function openChat() {
    setIsOpen(true);
    setHasNewMessage(false);
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
          <button
            className="chat-axis-close"
            onClick={() => setIsOpen(false)}
          >
            ✖
          </button>
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
