import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGamepad, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaStar } from 'react-icons/fa';
import '../Styles/JogosEducativos.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function JogosEducativos() {
  const navigate = useNavigate();

  const [jogos, setJogos] = useState([
    {
      id: 1,
      titulo: 'Labirinto do Foco',
      descricao: 'Ajuda a melhorar a concentração e o raciocínio rápido.',
      categoria: 'Foco',
      imagem: 'https://via.placeholder.com/150/A5B4FC/FFFFFF?text=Labirinto',
      linkJogo: '#',
      nivel: 'Iniciante'
    },
    {
      id: 2,
      titulo: 'Caça-Palavras da Memória',
      descricao: 'Exercita a memória de curto prazo e o vocabulário.',
      categoria: 'Memória',
      imagem: 'https://via.placeholder.com/150/7B3FF2/FFFFFF?text=CacaPalavras',
      linkJogo: '#',
      nivel: 'Intermediário'
    },
    {
      id: 3,
      titulo: 'Quebra-Cabeça das Emoções',
      descricao: 'Auxilia no reconhecimento e gestão das emoções.',
      categoria: 'Inteligência Emocional',
      imagem: 'https://via.placeholder.com/150/20C997/FFFFFF?text=Emocoes',
      linkJogo: '#',
      nivel: 'Avançado'
    },
    {
      id: 4,
      titulo: 'Caminho da Organização',
      descricao: 'Desenvolve habilidades de organização e planejamento.',
      categoria: 'Organização',
      imagem: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Organiza',
      linkJogo: '#',
      nivel: 'Iniciante'
    },
  ]);

  const handleJogar = (linkJogo) => {
    alert('Redirecionando para o jogo!');
    window.open(linkJogo, '_blank');
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="jogos-educativos-container">
      <header className="jogos-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
          <Link to="/buscar-profissionais" className="nav-link">
            <FaSearch className="nav-icon" /> Buscar Profissionais
          </Link>
          <Link to="/meus-agendamentos" className="nav-link">
            <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
          </Link>
          <Link to="/perfil" className="nav-link">
            <FaUserCircle className="nav-icon" /> Meu Perfil
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      <main className="jogos-main-content">
        <h1>Jogos Educativos</h1>
        <p className="subtitle">Divirta-se enquanto desenvolve habilidades importantes para o seu dia a dia.</p>

        <section className="jogos-list-section">
          <div className="jogos-grid">
            {jogos.length > 0 ? (
              jogos.map(jogo => (
                <div key={jogo.id} className="jogo-card">
                  <img src={jogo.imagem} alt={jogo.titulo} className="jogo-imagem" />
                  <div className="card-content">
                    <h3>{jogo.titulo}</h3>
                    <p className="jogo-descricao">{jogo.descricao}</p>
                    <div className="jogo-info">
                      <span>Categoria: {jogo.categoria}</span>
                      <span>Nível: {jogo.nivel}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-primary" onClick={() => handleJogar(jogo.linkJogo)}>
                      <FaGamepad /> Jogar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-jogos-message">Nenhum jogo disponível ainda.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}