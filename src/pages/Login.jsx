import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock, FaHeart } from "react-icons/fa";
import { signInWithGoogle } from "../firebase";
import logoTeaxis from '../assets/imagens/fundoLogo.png';

const API_LOGIN_EMAIL = "https://back-end-plataforma-teaxis.onrender.com/api/v1/auth/login";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [captchaValido, setCaptchaValido] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showCaptchaPopup, setShowCaptchaPopup] = useState(false);
  const loginType = searchParams.get('type');

  const handleCaptcha = (value) => setCaptchaValido(!!value);

  const handleCaptchaWarning = () => {
    setShowCaptchaPopup(true);
    setTimeout(() => setShowCaptchaPopup(false), 4200);
  };

  const handleGoogleLogin = async () => {
    if (!captchaValido) {
      handleCaptchaWarning();
      return;
    }

    try {
      setLoadingGoogle(true);
      console.log('🔐 Iniciando login com Google...');
      const { user, token } = await signInWithGoogle();

      console.log('✅ Google auth sucesso:', user.email);
      // Salvar token, papel, email e nome no localStorage
      localStorage.setItem("teaxis_auth_token", token);
      localStorage.setItem("login_method", "google");
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_name", user.displayName || user.email);
      localStorage.setItem("user_photo", user.photoURL || '');
      localStorage.setItem("teaxis_role", loginType || 'usuario');

      // Notificar outras partes da app que o auth mudou
      window.dispatchEvent(new Event('teaxis:auth_changed'));

      // Mostrar pop-up estilizado por pelo menos 7 segundos antes de redirecionar
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
        if (loginType === 'profissional') {
          navigate('/dashboard-profissional');
        } else {
          navigate('/dashboard-usuario');
        }
      }, 7000);
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
      handleCaptchaWarning();
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

      // Tenta extrair nome e foto retornados pela API (vários formatos possíveis)
      const extractedName = data.user?.name || data.user?.displayName || data.name || data.nome || email;
      const extractedPhoto = data.user?.photo || data.user?.photoURL || data.photoURL || data.foto || '';

      localStorage.setItem("teaxis_auth_token", teaxisToken);
      localStorage.setItem("teaxis_role", loginType || 'usuario');
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_name", extractedName);
      localStorage.setItem("user_photo", extractedPhoto);

      // Notificar outras partes da app que o auth mudou
      window.dispatchEvent(new Event('teaxis:auth_changed'));

      // Mostrar pop-up estilizado por pelo menos 7 segundos antes de redirecionar
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
        if (loginType === 'profissional') {
          navigate('/dashboard-profissional');
        } else {
          navigate('/dashboard-usuario');
        }
      }, 7000);
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
              Entrar como {loginType === 'profissional' ? 'Profissional' : 'Usuário'}.
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
              <label htmlFor="loginEmail">
                <FaEnvelope /> Email:
              </label>
              <input
                id="loginEmail"
                name="email"
                type="email"
                placeholder="Seu email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="loginSenha">
                <FaLock /> Senha:
              </label>
              <input
                id="loginSenha"
                name="senha"
                type="password"
                placeholder="Sua senha"
                autoComplete="current-password"
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
        
        {showLoginPopup && (
          <div className="login-popup-backdrop" role="dialog" aria-modal="true">
            <div className="login-popup-card">
              <img src={logoTeaxis} alt="TEAxis" className="login-popup-logo" />
              <h3>Bem-vindo(a) ao TEAxis</h3>
              <p>Após o login não esqueça de atualizar seus dados e informações em seu "Perfil".</p>
            </div>
          </div>
        )}

        {showCaptchaPopup && (
          <div className="login-popup-backdrop" role="alert" aria-live="assertive">
            <div className="login-popup-card login-popup-warning">
              <img src={logoTeaxis} alt="TEAxis" className="login-popup-logo" />
              <h3>Verificação necessária</h3>
              <p>Antes de seguir, marque o reCAPTCHA para provar que você não é um robô.</p>
            </div>
          </div>
        )}

        <style>{`
          .login-popup-backdrop {
            position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
            background: rgba(2,6,23,0.45); z-index: 9999;
          }
          .login-popup-card {
            background: linear-gradient(180deg, rgba(219,234,254,0.98), rgba(191,219,254,0.98));
            border-radius: 18px; padding: 28px; width: 360px; max-width: 92%; text-align:center;
            box-shadow: 0 14px 50px rgba(15,23,42,0.25); font-family: 'Inter', system-ui, sans-serif;
            color: #0f172a;
            border: 1px solid rgba(59,130,246,0.18);
          }
          .login-popup-card.login-popup-warning {
            background: linear-gradient(180deg, rgba(191,219,254,0.96), rgba(165,180,252,0.96));
            border: 1px solid rgba(37,99,235,0.35);
          }
          .login-popup-logo { width: 86px; height: auto; margin-bottom: 12px; }
          .login-popup-card h3 { margin: 8px 0 6px; font-size: 1.1rem; color: #1d4ed8; }
          .login-popup-card p { margin: 0; color: #0f172a; font-size: 0.95rem; }
        `}</style>
      </div>
    </div>
  );
};

export default Login;