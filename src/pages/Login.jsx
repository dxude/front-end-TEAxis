import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

// Endpoints da sua API de Registro.
const API_LOGIN_SOCIAL = "https://back-end-plataforma-teaxis.onrender.com/api/v1/auth/google";
const API_LOGIN_EMAIL = "https://back-end-plataforma-teaxis.onrender.com/api/v1/auth/login";

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
            </p>
            <button type="button" className="btn btn-social mb-4" onClick={() => handleGoogleLoginAPI(`simulated_token_${Date.now()}`)} style={{ marginTop: "0.5rem" }}>
              <FaGoogle /> Continuar com o Google
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
          <div style={{ width: '100%', textAlign: 'center', fontWeight: 600, color: '#202124' }}>
            Redirecionando..
          </div>
        </div>
      )}
    </div>
  );
};


export default Login;
