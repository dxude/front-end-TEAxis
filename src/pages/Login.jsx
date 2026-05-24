import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { signInWithGoogle } from "../firebase";

const API_LOGIN_EMAIL = "https://back-end-plataforma-teaxis.onrender.com/api/v1/auth/login";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const loginType = searchParams.get('type');

  const handleCaptcha = (value) => setCaptchaValido(!!value);

  const handleGoogleLogin = async () => {
    if (!captchaValido) {
      alert("Por favor, confirme que você não é um robô antes de continuar.");
      return;
    }

    try {
      setLoadingGoogle(true);
      const { user, token } = await signInWithGoogle();

      // Salvar token no localStorage para autenticação
      localStorage.setItem("teaxis_auth_token", token);
      localStorage.setItem("login_method", "google");
      localStorage.setItem("user_email", user.email);

      alert("✅ Login com Google realizado com sucesso!");
      navigate("/dashboard-usuario");
    } catch (error) {
      console.error("Detalhes do erro de login com Google:", error);
      console.error("Código do erro:", error.code);
      console.error("Mensagem do erro:", error.message);
      
      let mensagemErro = "Erro ao fazer login com Google. Por favor, tente novamente.";
      
      if (error.code === "auth/popup-blocked") {
        mensagemErro = "O popup foi bloqueado. Verifique as configurações do seu navegador.";
      } else if (error.code === "auth/cancelled-popup-request") {
        mensagemErro = "Login cancelado.";
      } else if (error.code === "auth/operation-not-supported-in-this-environment") {
        mensagemErro = "Login com Google não disponível neste ambiente.";
      } else if (error.code === "auth/unauthorized-domain") {
        mensagemErro = "Domínio não autorizado. Contate o suporte.";
      }
      
      alert(mensagemErro);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleLoginEmail = async (e) => {
    e.preventDefault();

    console.log('handleLoginEmail called', { email, senha, captchaValido });

    if (!captchaValido) {
      alert("Por favor, confirme que você não é um robô antes de continuar.");
      return;
    }

    setLoadingEmail(true);
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
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="cadastro-page-container">
      <div className="login-form-card">
        <h2>Bem-vindo(a) de volta! 👋</h2>
        {loginType && (
          <p style={{ marginTop: '0.5rem', color: '#4a5568' }}>
            Entrar como {loginType === 'responsavel' ? 'Responsável' : loginType === 'profissional' ? 'Profissional' : 'Usuário'}.
          </p>
        )}

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            type="button"
            className="btn btn-social mb-4"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            style={{ marginTop: "0.5rem" }}
          >
            <FaGoogle /> {loadingGoogle ? "Entrando..." : "Continuar com o Google"}
          </button>
        </div>

        <div className="divider">OU ENTRE COM EMAIL</div>

        <form onSubmit={handleLoginEmail}>
          <div className="input-group">
            <label>
              <FaEnvelope /> Email:
            </label>
            <input
              type="email"
              placeholder="Seu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>
              <FaLock /> Senha:
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="captcha-wrapper">
            <ReCAPTCHA sitekey="6Lfu2QssAAAAAO7L1Os1H12CYVrIxj0LH1Ck6c6E" onChange={handleCaptcha} />
          </div>

          <button type="submit" className="btn btn-primary-green btn-full" disabled={loadingEmail}>
            {loadingEmail ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>

        <p className="login-link mt-4 text-center">
          Não tem conta? <a href="/cadastro">Crie sua conta aqui!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;