import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBrain, FaPuzzlePiece, FaComments, FaSignOutAlt, FaSearch, FaChartLine, FaBullseye, FaArrowRight, FaCheckCircle, FaClock, FaStar, FaBars, FaTimes } from 'react-icons/fa';
import ChatAxis from '../components/ChatAxis';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardUsuario.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import axisImg from '../assets/imagens/axis-sorridente.png';

export default function DashboardUsuario() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Seja bem vindo(a)');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChatInRobot, setShowChatInRobot] = useState(false);
  const [showRobotTooltip, setShowRobotTooltip] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const proximosAgendamentos = [
    { id: 1, profissional: 'Dra. Ana Silva', data: '15/07/2025', hora: '10:00' },
    { id: 2, profissional: 'Dr. João Pereira', data: '20/07/2025', hora: '14:30' },
  ];

  const trilhasEmAndamento = [
    { id: 1, titulo: 'Foco e Concentração', progresso: 70 },
    { id: 2, titulo: 'Habilidades Sociais', progresso: 45 },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* Botão Hamburger (As três linhas) */}
      <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
        <FaBars />
      </button>

      {/* Overlay escurecido */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
          <FaTimes />
        </button>

        <div className="sidebar-header">
          <img src={logoTeaxis} alt="Logo" className="sidebar-logo" />
          <p className="user-welcome">Olá, {userName}!</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard-usuario" className={activeLink === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('home')}>
                <FaHome className="nav-icon" /> Meu Espaço
              </Link>
            </li>
            <li>
              <Link to="/buscar-profissionais" className={activeLink === 'buscar' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('buscar')}>
                <FaSearch className="nav-icon" /> Buscar Especialista
              </Link>
            </li>
            <li>
              <Link to="/meus-agendamentos" className={activeLink === 'agendamentos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('agendamentos')}>
                <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
              </Link>
            </li>
            <li>
              <Link to="/minhas-trilhas" className={activeLink === 'trilhas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('trilhas')}>
                <FaBrain className="nav-icon" /> Minhas Trilhas
              </Link>
            </li>
            <li>
              <Link to="/minhas-metas" className={activeLink === 'metas' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('metas')}>
                <FaBullseye className="nav-icon" /> Minhas Metas
              </Link>
            </li>
            <li>
              <Link to="/jogos-educativos" className={activeLink === 'jogos' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('jogos')}>
                <FaPuzzlePiece className="nav-icon" /> Jogos Educativos
              </Link>
            </li>
            <li>
              <Link to="/meu-progresso" className={activeLink === 'progresso' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('progresso')}>
                <FaChartLine className="nav-icon" /> Meu Progresso
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className={activeLink === 'mensagens' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('mensagens')}>
                <FaComments className="nav-icon" /> Mensagens
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={activeLink === 'perfil' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('perfil')}>
                <FaUser className="nav-icon" /> Meu Perfil
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
          <div className="header-content">
            <h1>Meu Espaço</h1>
            <p className="header-subtitle">Seu centro de apoio e desenvolvimento</p>
          </div>
        </header>

        {/* Seção de Boas-vindas e Próximos Passos */}
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>🎉 Bem-vindo ao seu espaço!</h2>
              <p>Estamos aqui para apoiar você e sua família nessa jornada. Vamos começar com os primeiros passos?</p>
            </div>
            <div className="welcome-actions">
              <Link to="/buscar-profissionais" className="action-button primary">
                <FaSearch />
                <span>Encontrar Especialista</span>
                <FaArrowRight />
              </Link>
              <Link to="/minhas-trilhas" className="action-button secondary">
                <FaBrain />
                <span>Explorar Trilhas</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="robot-section">
          <div className="robot-panel">
            <div className="robot-copy">
              <p className="robot-tag">Chat</p>
              <h2>O robô está aqui para te ajudar</h2>
              <p>Ele pode sugerir profissionais, explicar sua jornada e responder dúvidas rápidas. Passe o mouse sobre o robô ou clique no botão para começar a conversar.</p>
              <div className="robot-links">
                <Link to="/buscar-profissionais" className="btn-primary robot-action">Buscar Especialista</Link>
                <Link to="/mensagens" className="btn-secondary robot-action">Ver Mensagens</Link>
              </div>
            </div>
            <div 
              className="robot-visual"
              onMouseEnter={() => setShowRobotTooltip(true)}
              onMouseLeave={() => setShowRobotTooltip(false)}
            >
              <button 
                className="robot-chat-button axis-flutuando" 
                onClick={() => setShowChatInRobot(!showChatInRobot)}
                title="Abrir chat"
              >
                💬
              </button>
              
              {showRobotTooltip && (
                <div className="robot-tooltip">
                  Converse agora
                </div>
              )}

              <img 
                src={axisImg} 
                alt="Robô" 
                className="robot-image axis-flutuando"
                title="Clique no botão acima ou passe o mouse para abrir o chat"
              />
            </div>
          </div>
          {showChatInRobot && (
            <div className="robot-chat-section">
              <ChatAxis 
                isOpenExternal={showChatInRobot} 
                onCloseExternal={setShowChatInRobot}
                isIntegrated={true}
              />
            </div>
          )}
        </section>

        {/* Seção de Status Atual */}
        <section className="status-section">
          <h2>📊 Seu Progresso Atual</h2>
          <div className="status-grid">
            <div className="status-card">
              <div className="status-icon">
                <FaCalendarAlt />
              </div>
              <div className="status-content">
                <h3>Próximos Agendamentos</h3>
                {proximosAgendamentos.length > 0 ? (
                  <div className="status-items">
                    {proximosAgendamentos.slice(0, 2).map(agendamento => (
                      <div key={agendamento.id} className="status-item">
                        <FaClock className="item-icon" />
                        <span>{agendamento.profissional} - {agendamento.data}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-items">Nenhum agendamento futuro</p>
                )}
                <Link to="/meus-agendamentos" className="status-link">
                  Ver todos os agendamentos <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon">
                <FaBrain />
              </div>
              <div className="status-content">
                <h3>Trilhas Ativas</h3>
                {trilhasEmAndamento.length > 0 ? (
                  <div className="status-items">
                    {trilhasEmAndamento.slice(0, 2).map(trilha => (
                      <div key={trilha.id} className="status-item">
                        <div className="progress-indicator">
                          <div className="progress-circle" style={{'--progress': `${trilha.progresso}%`}}>
                            <span>{trilha.progresso}%</span>
                          </div>
                        </div>
                        <span>{trilha.titulo}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-items">Nenhuma trilha ativa</p>
                )}
                <Link to="/minhas-trilhas" className="status-link">
                  Explorar trilhas <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon">
                <FaCheckCircle />
              </div>
              <div className="status-content">
                <h3>Metas Concluídas</h3>
                <div className="achievement-counter">
                  <span className="counter">3</span>
                  <span className="counter-label">metas alcançadas este mês</span>
                </div>
                <Link to="/minhas-metas" className="status-link">
                  Ver minhas metas <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Recursos Rápidos */}
        <section className="quick-resources">
          <h2>🚀 Recursos Rápidos</h2>
          <div className="resources-grid">
            <Link to="/jogos-educativos" className="resource-card">
              <FaPuzzlePiece className="resource-icon" />
              <h3>Jogos Educativos</h3>
              <p>Atividades divertidas para desenvolvimento</p>
            </Link>
            <Link to="/meu-progresso" className="resource-card">
              <FaChartLine className="resource-icon" />
              <h3>Meu Progresso</h3>
              <p>Acompanhe sua evolução</p>
            </Link>
            <Link to="/mensagens" className="resource-card">
              <FaComments className="resource-icon" />
              <h3>Mensagens</h3>
              <p>2 novas mensagens</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}