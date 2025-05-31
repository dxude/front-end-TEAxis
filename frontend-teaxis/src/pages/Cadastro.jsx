import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmacao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmacao) {
      alert('As senhas não coincidem.');
      return;
    }

    console.log('Usuário cadastrado:', { nome, email });
    navigate('/login');
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-ilustracao">
        <img src="/img/logo-teaxis.svg" alt="Logo" className="logo" />
        <img src="/img/cadastro-illustration.svg" alt="Ilustração" className="illustration" />
      </div>

      <div className="cadastro-form-section">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h1>Crie a sua conta</h1>
          <p>
            Já tem uma conta? <Link to="/login">Entre aqui</Link>
          </p>

          <label>Por favor, insira o seu nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

          <label>Por favor, insira o seu email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Aqui você cria sua senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

          <label>Repita a confirmação da senha criada</label>
          <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />

          <button type="submit">CADASTRAR</button>
        </form>
      </div>
    </div>
  );
}
