import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaChartLine, FaCheck, FaTimes, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaBullseye, FaPuzzlePiece, FaComments } from 'react-icons/fa';
import '../Styles/MinhasTrilhas.css'; // Novo CSS
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MinhasTrilhas() {
  const navigate = useNavigate();

  const [trilhas, setTrilhas] = useState([
    {
      id: 1,
      titulo: 'Foco e Concentração',
      descricao: 'Desenvolva sua capacidade de manter o foco e minimizar distrações.',
      progresso: 70,
      modulos: 5,
      modulosConcluidos: 3,
      status: 'Em Andamento',
      cor: '#20C997' 
    },
    {
      id: 2,
      titulo: 'Habilidades Sociais',
      descricao: 'Aprenda a interagir melhor em diferentes ambientes sociais.',
      progresso: 45,
      modulos: 4,
      modulosConcluidos: 2,
      status: 'Em Andamento',
      cor: '#7B3FF2' 
    },
    {
      id: 3,
      titulo: 'Organização e Planejamento',
      descricao: 'Estratégias para otimizar sua rotina e alcançar objetivos.',
      progresso: 100,
      modulos: 3,
      modulosConcluidos: 3,
      status: 'Concluída',
      cor: '#074f9b' 
    },
    {
      id: 4,
      titulo: 'Inteligência Emocional',
      descricao: 'Gerencie suas emoções e construa relacionamentos saudáveis.',
      progresso: 0,
      modulos: 6,
      modulosConcluidos: 0,
      status: 'Não Iniciada',
      cor: '#FFD700' 
    },
  ]);

  const handleIniciarOuContinuar = (id) => {
    alert(`Redirecionando para a trilha ${id}!`);
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="minhas-trilhas-container">
      {/* Header de Navegação Interna */}
      <header className="trilhas-header">
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

      <main className="trilhas-main-content">
        <h1>Minhas Trilhas Educativas</h1>
        <p className="subtitle">Acompanhe seu progresso e explore novas trilhas para seu desenvolvimento.</p>

        <section className="trilhas-list-section">
          <div className="trilhas-grid">
            {trilhas.length > 0 ? (
              trilhas.map(trilha => (
                <div key={trilha.id} className="trilha-card">
                  <div className="card-status-indicator" style={{ backgroundColor: trilha.cor }}></div>
                  <div className="card-content">
                    <h3>{trilha.titulo}</h3>
                    <p className="descricao">{trilha.descricao}</p>
                    <div className="progress-info">
                      <span>Progresso: {trilha.progresso}%</span>
                      <span>Módulos: {trilha.modulosConcluidos}/{trilha.modulos}</span>
                    </div>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar" style={{ width: `${trilha.progresso}%`, backgroundColor: trilha.cor }}></div>
                    </div>
                    <p className={`status ${trilha.status.toLowerCase().replace(' ', '-')}`}>Status: {trilha.status}</p>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleIniciarOuContinuar(trilha.id)}
                      disabled={trilha.status === 'Concluída'}
                    >
                      {trilha.status === 'Concluída' ? <FaCheck /> : <FaBookOpen />}
                      {trilha.status === 'Concluída' ? ' Concluída' : (trilha.progresso > 0 ? ' Continuar' : ' Iniciar')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-trilhas-message">Você ainda não tem trilhas ativas. <Link to="/explorar-trilhas">Explore novas trilhas!</Link></p>
            )}
          </div>
        </section>

        <section className="explore-trilhas-section">
          <h2>Explore Novas Trilhas</h2>
          <p>Descubra mais caminhos para o seu desenvolvimento pessoal e profissional.</p>
          <Link to="/explorar-trilhas" className="btn-secondary">Ver Todas as Trilhas</Link>
        </section>
      </main>
    </div>
  );
}