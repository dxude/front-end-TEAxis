import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

// Endpoints da sua API de Registro. SUBSTITUA PELA SUA URL
const API_LOGIN_SOCIAL = "SUA_URL_DA_API/api/v1/auth/google";
const API_LOGIN_EMAIL = "SUA_URL_DA_API/api/v1/auth/login";

// ⚠️ MODO SIMULADO: defina como true para testar sem Google Cloud Console
const SIMULATED_GOOGLE_LOGIN = true;

const Login = () => {
  const navigate = useNavigate();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Popup state for simulated login
  const [showSimPopup, setShowSimPopup] = useState(false);
  const [simPopupMessage, setSimPopupMessage] = useState("");

  const handleCaptcha = (value) => setCaptchaValido(!!value);

  const handleGoogleLoginAPI = async (token) => {
    try {
      console.log("🔐 Token do Google recebido:", token ? token.slice(0, 50) + "..." : token);

      // MODO SIMULADO: salva token fictício e redireciona
      if (SIMULATED_GOOGLE_LOGIN) {
        localStorage.setItem("teaxis_auth_token", token || `google_token_${Date.now()}`);
        localStorage.setItem("login_method", "google");
        localStorage.setItem("user_email", "usuario.simulado@example.com");
        setSimPopupMessage("✅ Login Simulado bem-sucedido! Redirecionando para o Dashboard.");
        setShowSimPopup(true);
        setTimeout(() => {
          setShowSimPopup(false);
          navigate("/dashboard-usuario");
        }, 1500);
        return;
      }

      // Se a API não estiver configurada, faz fallback para teste
      if (API_LOGIN_SOCIAL.includes("SUA_URL_DA_API")) {
        localStorage.setItem("teaxis_auth_token", token);
        localStorage.setItem("login_method", "google");
        alert("✅ Login Social bem-sucedido (TESTE)! Redirecionando para o Dashboard.");
        navigate("/dashboard-usuario");
        return;
      }

      // Fluxo real: enviar token para backend (se houver)
      const response = await fetch(API_LOGIN_SOCIAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha na autenticação com Google na API.");
      }

      const data = await response.json();
      const teaxisToken = data.token;

      if (teaxisToken) {
        localStorage.setItem("teaxis_auth_token", teaxisToken);
        localStorage.setItem("login_method", "google");
        setSimPopupMessage("✅ Login Social bem-sucedido! Redirecionando para o Dashboard.");
        setShowSimPopup(true);
        setTimeout(() => {
          setShowSimPopup(false);
          navigate("/dashboard-usuario");
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Erro no login social:", error);
      alert(error.message || String(error));
    }
  };

  useEffect(() => {
    console.log("✅ Login.jsx carregado (modo social removido, apenas simulado disponível)");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaValido) {
      alert("Por favor, confirme que você não é um robô antes de continuar.");
      return;
    }

    try {
      const response = await fetch(API_LOGIN_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha no login. Verifique seu email e senha.");
      }

      const data = await response.json();
      const teaxisToken = data.token;

      localStorage.setItem("teaxis_auth_token", teaxisToken);
      alert("✅ Login realizado com sucesso! Redirecionando...");
      navigate("/dashboard-usuario");
    } catch (error) {
      alert(error.message || String(error));
    }
  };

  return (
    <div className="cadastro-page-container">
      <div className="login-form-card">
        <h2>Bem-vindo(a) de volta! 👋</h2>

        <div className="mb-4" style={{ display: "flex", justifyContent: "center" }}>
          {/* Botão real removido - apenas simulado abaixo */}
        </div>

        {SIMULATED_GOOGLE_LOGIN && (
          <div style={{ textAlign: "center", marginBottom: "1rem", fontSize: "0.85rem", color: "#666" }}>
            <p>
              📱 <strong>Modo Simulado Ativo</strong> — usando token simulado para testes
            </p>
            <button type="button" className="btn btn-social mb-4" onClick={() => handleGoogleLoginAPI(`simulated_token_${Date.now()}`)} style={{ marginTop: "0.5rem" }}>
              <FaGoogle /> Login Simulado com Google
            </button>
          </div>
        )}

        <div className="divider">OU ENTRE COM EMAIL</div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>
              <FaEnvelope /> Email:
            </label>
            <input type="email" placeholder="Seu email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label>
              <FaLock /> Senha:
            </label>
            <input type="password" placeholder="Sua senha" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>

          <div className="captcha-wrapper">
            <ReCAPTCHA sitekey="6Lfu2QssAAAAAO7L1Os1H12CYVrIxj0LH1Ck6c6E" onChange={handleCaptcha} />
          </div>

          <button type="submit" className="btn btn-primary-green btn-full">
            ENTRAR
          </button>
        </form>

        <p className="login-link mt-4 text-center">
          Não tem conta? <a href="/cadastro">Crie sua conta aqui!</a>
        </p>
      </div>

      {showSimPopup && (
        <div className="sim-popup" role="dialog" aria-live="polite">
          <div className="sim-popup-left">
            <svg width="36" height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M24 9.5c3.2 0 5.9 1.2 7.9 3.1l5.9-5.9C34.6 3.2 29.6 1.5 24 1.5 14.6 1.5 6.9 6.9 3.1 14.8l6.9 5.3C11.2 14.2 17 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.9 24.5c0-1-.1-1.8-.3-2.6H24v6.1h12.8c-.5 2.6-2.3 4.7-4.8 6.1l7.6 5.9C44.8 36.2 46.9 30.9 46.9 24.5z" />
              <path fill="#FBBC05" d="M10 28.6c-.6-1.8-1-3.7-1-5.6s.4-3.8 1-5.6L3.1 12.1C1.1 15.7 0 19.8 0 24c0 4.2 1.1 8.3 3.1 11.9L10 28.6z" />
              <path fill="#EA4335" d="M24 46.5c5.6 0 10.6-1.7 14.4-4.7l-7.6-5.9c-2 1.3-4.5 2.1-6.8 2.1-7 0-12.8-4.7-14-11.3L3.1 28.1C6.9 36 14.6 41.5 24 41.5z" />
            </svg>
          </div>
          <div className="sim-popup-body">
            <div className="sim-popup-title">front-end-TEAxis</div>
            <div className="sim-popup-sub">usuario.simulado@example.com</div>
            <div className="sim-popup-message">{simPopupMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Login;
