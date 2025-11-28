import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBrain, FaPuzzlePiece, FaComments, FaSignOutAlt, FaSearch, FaChartLine, FaBullseye } from 'react-icons/fa';
import '../Styles/DashboardUsuario.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function DashboardUsuario() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Fulano de Tal');

  const [activeLink, setActiveLink] = useState('home');

  const proximosAgendamentos = [
    { id: 1, profissional: 'Dra. Ana Silva', data: '15/07/2025', hora: '10:00' },
    { id: 2, profissional: 'Dr. João Pereira', data: '20/07/2025', hora: '14:30' },
  ];

  const trilhasEmAndamento = [
    { id: 1, titulo: 'Foco e Concentração', progresso: 70 },
    { id: 2, titulo: 'Habilidades Sociais', progresso: 45 },
  ];

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoTeaxis} alt="Logo TEAxis" className="sidebar-logo" />
          <p className="user-welcome">Olá, {userName}!</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard-usuario" className={activeLink === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('home')}>
                <FaHome className="nav-icon" /> Início
              </Link>
            </li>
            <li>
              {/* Link PROEMINENTE para a página de busca de profissionais */}
              <Link to="/buscar-profissionais" className={activeLink === 'buscar' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('buscar')}>
                <FaSearch className="nav-icon" /> Buscar Especialista
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={activeLink === 'perfil' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('perfil')}>
                <FaUser className="nav-icon" /> Meu Perfil
              </Link>
            </li>
            <li>
              <Link to="/meus-agendamentos" className={activeLink === 'agendamentos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('agendamentos')}>
                <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
              </Link>
            </li>
            <li>
              {/* Adicionado link para Minhas Metas */}
              <Link to="/minhas-metas" className={activeLink === 'metas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('metas')}>
                <FaBullseye className="nav-icon" /> Minhas Metas
              </Link>
            </li>
            <li>
              <Link to="/minhas-trilhas" className={activeLink === 'trilhas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('trilhas')}>
                <FaBrain className="nav-icon" /> Minhas Trilhas
              </Link>
            </li>
            <li>
              <Link to="/jogos" className={activeLink === 'jogos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('jogos')}>
                <FaPuzzlePiece className="nav-icon" /> Jogos Educativos
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className={activeLink === 'mensagens' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('mensagens')}>
                <FaComments className="nav-icon" /> Mensagens
              </Link>
            </li>
            <li>
              <Link to="/progresso" className={activeLink === 'progresso' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('progresso')}>
                <FaChartLine className="nav-icon" /> Meu Progresso
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <FaSignOutAlt className="nav-icon" /> Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-content-header">
          <h1>Dashboard do Usuário</h1>
        </header>

        <section className="dashboard-overview">
          <div className="overview-card">
            <h3>Próximos Agendamentos</h3>
            {proximosAgendamentos.length > 0 ? (
              <ul>
                {proximosAgendamentos.map(agendamento => (
                  <li key={agendamento.id}>
                    {agendamento.profissional} - {agendamento.data} às {agendamento.hora}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum agendamento futuro.</p>
            )}
            <Link to="/meus-agendamentos" className="see-more-link">Ver todos</Link>
          </div>

          <div className="overview-card">
            <h3>Trilhas em Andamento</h3>
            {trilhasEmAndamento.length > 0 ? (
              <ul>
                {trilhasEmAndamento.map(trilha => (
                  <li key={trilha.id}>
                    {trilha.titulo} - Progresso: {trilha.progresso}%
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${trilha.progresso}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma trilha iniciada.</p>
            )}
            <Link to="/minhas-trilhas" className="see-more-link">Ver todas</Link>
          </div>

          <div className="overview-card">
            <h3>Recursos para a Família</h3>
            <p>Acesse materiais educativos para apoiar o desenvolvimento contínuo.</p>
            <Link to="/recursos-familia" className="btn-secondary">Acessar Recursos</Link>
          </div>
        </section>

        <section className="dashboard-section">
            <h2>Mensagens Recentes</h2>
            <div className="messages-preview">
                <p>Você tem <strong>2</strong> novas mensagens.</p>
                <Link to="/mensagens" className="btn-primary">Ver Mensagens</Link>
            </div>
        </section>
      </main>
    </div>
  );
}