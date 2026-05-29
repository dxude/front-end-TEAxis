import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaBrain, FaComments, FaSearch, FaChartLine, FaArrowRight, FaCheckCircle, FaClock, FaBars, FaPuzzlePiece } from 'react-icons/fa';
import ChatAxis from '../components/ChatAxis';
import LogoutModal from '../components/LogoutModal';
import Sidebar from '../components/Sidebar';
import '../Styles/DashboardUsuario.css';
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

      <Sidebar 
        userName={userName}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="main-content">
        <section className="dashboard-hero fade-in">
          <div className="hero-copy">
            <span className="hero-eyebrow">Painel do Usuário</span>
            <h1>{userName}, seu centro de apoio está pronto.</h1>
            <p>Organize seus agendamentos, acompanhe trilhas e encontre apoio com um visual leve e intuitivo.</p>
            <div className="hero-buttons">
              <Link to="/buscar-profissionais" className="btn btn-primary">Encontrar Especialista</Link>
              <Link to="/minhas-trilhas" className="btn btn-secondary">Explorar Trilhas</Link>
            </div>
            <div className="hero-highlights">
              <div className="highlight-card">
                <FaCalendarAlt className="highlight-icon" />
                <div>
                  <strong>Agenda simplificada</strong>
                  <span>Controle seus próximos atendimentos com clareza.</span>
                </div>
              </div>
              <div className="highlight-card">
                <FaChartLine className="highlight-icon" />
                <div>
                  <strong>Progresso visível</strong>
                  <span>Veja metas e trilhas em um painel prático.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-tag">Seu Espaço</div>
              <h2>Desenvolvimento com acolhimento e praticidade.</h2>
              <p>Acesse rapidamente agendamentos, mensagens e recomendações em um ambiente seguro.</p>
              <Link to="/mensagens" className="btn btn-primary-sm">Ver Mensagens</Link>
            </div>
            <div className="hero-image-wrapper">
              <img src={axisImg} alt="Axis sorridente" className="axis-flutuando" />
            </div>
          </div>
        </section>

        <section className="dashboard-features fade-in">
          <div className="feature-card">
            <FaSearch className="feature-icon" />
            <h3>Busca inteligente</h3>
            <p>Encontre profissionais com experiência real em neurodiversidade.</p>
          </div>
          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Agenda rápida</h3>
            <p>Gerencie seus atendimentos com poucos cliques.</p>
          </div>
          <div className="feature-card">
            <FaComments className="feature-icon" />
            <h3>Comunicação acolhedora</h3>
            <p>Mensagens seguras e claras com profissionais.</p>
          </div>
        </section>

        <section className="welcome-section fade-in">
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

        <section className="robot-section fade-in">
          <div className={`robot-panel ${showChatInRobot ? 'with-chat' : ''}`}>
            <div className="robot-copy">
              <p className="robot-tag">Chat</p>
              <h2>O Axis está aqui para te ajudar</h2>
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
            {showChatInRobot && (
              <div className="robot-chat-section">
                <ChatAxis 
                  isOpenExternal={showChatInRobot} 
                  onCloseExternal={setShowChatInRobot}
                  isIntegrated={true}
                />
              </div>
            )}
          </div>
        </section>

        {/* Seção de Status Atual */}
        <section className="status-section fade-in">
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
        <section className="quick-resources fade-in">
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