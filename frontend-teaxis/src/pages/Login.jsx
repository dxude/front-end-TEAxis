import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      alert('Por favor, preencha o nome de usuário e a senha.');
      return;
    }

    console.log('Tentativa de login com o usuário:', usuario);

    alert('Login bem-sucedido!');
    navigate('/perfil');
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <img src={logoTeaxis} alt="Logo TEAxis" className="logo" />

      </div>

      <div className="login-form-section">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Bem Vindo ao</h1>
          <h2>TEAXIS!</h2>

          <p>
            Você não tem uma conta ainda? <Link to="/cadastro">Cadastre-se</Link>
          </p>

          <label>Nome de usuário</label>
          <input
            type="text"
            className="login-input"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            className="login-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="checkbox-and-link-group">
            <label className="checkbox-label">
              <input type="checkbox" /> Manter-me conectado
            </label>
            <Link to="/esqueceu-senha">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}