import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock, FaHeart } from "react-icons/fa";
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
      console.log('🔐 Iniciando login com Google...');
      const { user, token } = await signInWithGoogle();

      console.log('✅ Google auth sucesso:', user.email);
      // Salvar token e papel no localStorage
      localStorage.setItem("teaxis_auth_token", token);
      localStorage.setItem("login_method", "google");
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("teaxis_role", loginType || 'usuario');

      alert("✅ Login com Google realizado com sucesso!");
      if (loginType === 'profissional') {
        navigate('/dashboard-profissional');
      } else {
        navigate('/dashboard-usuario');
      }
    } catch (error) {
      console.error("❌ ERRO de login com Google:", error);
      console.error("Código:", error.code);
      console.error("Mensagem:", error.message);
      
      let mensagemErro = "Erro ao fazer login com Google.";
      
      if (error.code === "auth/popup-blocked") {
        mensagemErro = "❌ Popup bloqueado. Permita popups no navegador.";
      } else if (error.code === "auth/cancelled-popup-request") {
        mensagemErro = "❌ Login cancelado pelo usuário.";
      } else if (error.code === "auth/operation-not-supported-in-this-environment") {
        mensagemErro = "❌ Google Auth não disponível. Verifique console.";
      } else if (error.code === "auth/unauthorized-domain") {
        mensagemErro = "❌ Domínio não autorizado no Firebase. Veja console.";
      } else if (error.code === "auth/network-request-failed") {
        mensagemErro = "❌ Erro de conexão. Verifique internet.";
      }
      
      console.log('Mensagem final:', mensagemErro);
      alert(mensagemErro + "\n\nVeja o console (F12) para detalhes.");
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
      localStorage.setItem("teaxis_role", loginType || 'usuario');
      alert("✅ Login realizado com sucesso! Redirecionando...");
      if (loginType === 'profissional') {
        navigate('/dashboard-profissional');
      } else {
        navigate('/dashboard-usuario');
      }
    } catch (error) {
      alert(error.message || String(error));
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="cadastro-page-container login-page-container">
      <div className="auth-page-shell">
        <aside className="auth-side-panel">
          <span className="eyebrow">Acesso Seguro</span>
          <h1>Volte para o TEAxis</h1>
          <p>Entre com rapidez e continue acompanhando suas sessões, seus profissionais e suas mensagens.</p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <FaHeart className="feature-icon" />
              <div>
                <strong>Segurança</strong>
                <p>Dados protegidos e login confiável.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <FaLock className="feature-icon" />
              <div>
                <strong>Privacidade</strong>
                <p>Autenticação pensada para famílias e profissionais.</p>
              </div>
            </div>
          </div>

          <div className="auth-panel-footer">
            <p className="panel-footer-label">Ainda não é membro?</p>
            <Link to="/cadastro" className="text-link">Crie sua conta</Link>
          </div>
        </aside>

        <div className="login-form-card auth-card">
          <h2>Bem-vindo(a) de volta! 👋</h2>
          {loginType && (
            <p className="login-type-text">
              Entrar como {loginType === 'responsavel' ? 'Responsável' : loginType === 'profissional' ? 'Profissional' : 'Usuário'}.
            </p>
          )}

          <div className="social-login-wrapper">
            <button
              type="button"
              className="btn btn-social mb-4"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
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

            <button type="submit" className="btn btn-primary-green btn-login-action" disabled={loadingEmail}>
              {loadingEmail ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <p className="login-link mt-4 text-center">
            Não tem conta? <Link to="/cadastro">Crie sua conta aqui!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;