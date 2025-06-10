import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Cadastro.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';


export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmacao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmacao) {
      alert('As senhas não coincidem.');
      return;
    }

    const userData = {
      nome,
      email,
    };

    console.log('Dados de cadastro:', userData);
    alert('Cadastro realizado com sucesso!');
    navigate('/login');
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-ilustracao">
        <img src={logoTeaxis} alt="Logo TEAxis" className="logo" />
      </div>

      <div className="cadastro-form-section">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h1>Crie a sua conta</h1>
          <p>
            Já tem uma conta? <Link to="/login">Entre aqui</Link>
          </p>

          <label>Por favor, insira o seu nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Por favor, insira o seu email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Aqui você cria sua senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label>Repita a confirmação da senha criada</label>
          <input
            type="password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />

          <button type="submit">CADASTRAR</button>
        </form>
      </div>
    </div>
  );
}