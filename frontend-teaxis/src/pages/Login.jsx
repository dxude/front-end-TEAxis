import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    console.log('Usuário logado:', usuario);
    navigate('/perfil');
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <img src="/img/login-illustration.svg" alt="Ilustração" className="w-full max-w-md" />
      </div>

      <div className="login-form-section">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-2xl font-bold text-center mb-1">Bem Vindo ao</h2>
          <h1 className="text-4xl font-extrabold text-center mb-6">TEAXIS!</h1>

          <p className="text-sm text-center mb-6">
            Você não tem uma conta ainda? <Link to="/cadastro" className="underline text-white font-semibold">Cadastre-se</Link>
          </p>

          <label>Nome de usuário</label>
          <input
            type="text"
            className="login-input"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            className="login-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="flex justify-between text-sm mb-6">
            <label>
              <input type="checkbox" className="mr-2" /> Manter-me conectado
            </label>
            <a href="#" className="underline text-white">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}
