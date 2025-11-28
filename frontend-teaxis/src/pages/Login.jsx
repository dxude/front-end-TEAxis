import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [captchaValido, setCaptchaValido] = useState(false);

  const handleCaptcha = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValido(!!value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!captchaValido) {
      alert("Por favor, confirme que você não é um robô antes de continuar.");
      return;
    }
    alert("Login realizado com sucesso!");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Bem-vindo(a) de volta! 👋</h2>

        <button className="btn btn-google">
          <FaGoogle /> Entrar com Google
        </button>

        <div className="divider">OU ENTRE COM EMAIL</div>

        <form onSubmit={handleLogin}>
          <label>
            <FaEnvelope /> Email:
          </label>
          <input type="email" placeholder="Seu email" required />

          <label>
            <FaLock /> Senha:
          </label>
          <input type="password" placeholder="Sua senha" required />

          {/* === reCAPTCHA === */}
          <div className="captcha-wrapper">
            <ReCAPTCHA
              sitekey="6Lfu2QssAAAAAO7L1Os1H12CYVrIxj0LH1Ck6c6E"
              onChange={handleCaptcha}
            />
          </div>

          <button type="submit" className="btn btn-green">
            ENTRAR
          </button>
        </form>

        <p className="register-link">
          Não tem conta? <a href="/cadastro">Crie sua conta aqui!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
