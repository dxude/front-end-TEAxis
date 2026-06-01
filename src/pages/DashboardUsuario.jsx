import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaBrain, FaComments, FaSearch, FaChartLine, FaArrowRight, FaCheckCircle, FaClock, FaBars, FaPuzzlePiece, FaFire, FaTrophy, FaLightbulb } from 'react-icons/fa';
import ChatAxis from '../components/ChatAxis';
import LogoutModal from '../components/LogoutModal';
import Sidebar from '../components/Sidebar';
import '../Styles/DashboardUsuario.css';
import axisImg from '../assets/imagens/axis-sorridente.png';
import { carregarAgendamentos, carregarMensagens } from '../utils/dataSync';

export default function DashboardUsuario() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Seja bem vindo(a)');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChatInRobot, setShowChatInRobot] = useState(false);
  const [showRobotTooltip, setShowRobotTooltip] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✨ Estados para sincronização em tempo real
  const [trilhasUsuario, setTrilhasUsuario] = useState([]);
  const [metasUsuario, setMetasUsuario] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    trilhasAtivas: 0,
    trilhasConcluidas: 0,
    metasConcluidas: 0,
    metasTotal: 0,
    xpTotal: 0,
    progressoMedio: 0,
  });
  const [animacaoUpdate, setAnimacaoUpdate] = useState(false);
  const [agendamentosUsuario, setAgendamentosUsuario] = useState([]);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);

  const defaultProximosAgendamentos = [
    { id: 1, profissional: 'Dra. Ana Silva', data: '15/07/2025', hora: '10:00' },
    { id: 2, profissional: 'Dr. João Pereira', data: '20/07/2025', hora: '14:30' },
  ];

  // 🔄 Sincronização com localStorage em tempo real
  useEffect(() => {
    const sincronizarDados = () => {
      // Carrega nome do usuário salvo no login
      const savedName = localStorage.getItem('user_name');
      if (savedName) setUserName(savedName);
      // Carrega trilhas do localStorage
      const trilhasStorage = localStorage.getItem('trilhas_usuario');
      const trilhas = trilhasStorage ? JSON.parse(trilhasStorage) : [];
      setTrilhasUsuario(trilhas);

      // Carrega metas do localStorage
      const metasStorage = localStorage.getItem('minhas_metas');
      const metas = metasStorage ? JSON.parse(metasStorage) : [];
      setMetasUsuario(metas);

      // Carrega agendamentos compartilhados
      const userEmail = localStorage.getItem('user_email');
      const agenda = carregarAgendamentos();
      const agendamentosFiltrados = userEmail
        ? agenda.filter(item => item.cliente === userEmail)
        : agenda.filter(item => item.toRole === 'usuario');
      setAgendamentosUsuario(agendamentosFiltrados.length > 0 ? agendamentosFiltrados : defaultProximosAgendamentos);

      // Carrega mensagens compartilhadas
      const mensagens = carregarMensagens();
      setMensagensNaoLidas(mensagens.filter(msg => msg.toRole === 'usuario' && !msg.lida).length);

      // Calcula estatísticas em tempo real
      calcularEstatisticas(trilhas, metas);

      // Ativa animação de atualização
      setAnimacaoUpdate(true);
      setTimeout(() => setAnimacaoUpdate(false), 600);
    };

    sincronizarDados();

    // Listener para detectar mudanças no localStorage (de outras abas)
    const handleStorageChange = () => sincronizarDados();
    window.addEventListener('storage', handleStorageChange);

    // Verificar mudanças a cada 500ms (sincronização local)
    const interval = setInterval(sincronizarDados, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 📊 Função para calcular estatísticas em tempo real
  const calcularEstatisticas = (trilhas, metas) => {
    const trilhasAtivas = trilhas.filter(t => t.status === 'em-andamento').length;
    const trilhasConcluidas = trilhas.filter(t => t.status === 'concluida').length;
    // Metas usa propriedade 'concluida' (boolean)
    const metasConcluidas = metas.filter(m => m.concluida === true).length;
    const metasTotal = metas.length;

    // Calcula XP total
    const xpTotal = trilhas.reduce((acc, trilha) => {
      const xpDaTrilha = (trilha.progresso * 2) + (trilha.status === 'concluida' ? 500 : 0);
      return acc + xpDaTrilha;
    }, 0);

    // Calcula progresso médio
    const progressoMedio = trilhas.length > 0 
      ? Math.round(trilhas.reduce((acc, t) => acc + (t.progresso || 0), 0) / trilhas.length)
      : 0;

    setEstatisticas({
      trilhasAtivas,
      trilhasConcluidas,
      metasConcluidas,
      metasTotal,
      xpTotal,
      progressoMedio,
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teaxis_auth_token');
      localStorage.removeItem('teaxis_role');
      localStorage.removeItem('login_method');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_photo');
      window.dispatchEvent(new Event('teaxis:auth_changed'));
    }
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
            <p className="hero-subnote">Você tem <strong>{agendamentosUsuario.length}</strong> agendamentos e <strong>{mensagensNaoLidas}</strong> mensagens não lidas.</p>
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

        {/* Seção de Status Atual - TOTALMENTE SINCRONIZADA */}
        <section className={`status-section fade-in ${animacaoUpdate ? 'status-animacao-update' : ''}`}>
          <div className="status-header">
            <h2>📊 Seu Progresso Atual</h2>
            <div className="status-stats-quick">
              <span className="stat-badge">
                <FaFire className="stat-icon" /> {estatisticas.xpTotal} XP
              </span>
              <span className="stat-badge">
                <FaTrophy className="stat-icon" /> {estatisticas.progressoMedio}% progresso
              </span>
            </div>
          </div>

          <div className="status-grid">
            {/* Card 1: Próximos Agendamentos */}
            <div className="status-card">
              <div className="status-icon">
                <FaCalendarAlt />
              </div>
              <div className="status-content">
                <h3>Próximos Agendamentos</h3>
                {agendamentosUsuario.length > 0 ? (
                  <div className="status-items">
                    {agendamentosUsuario.slice(0, 2).map(agendamento => (
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

            {/* Card 2: Trilhas Ativas - SINCRONIZADO */}
            <div className="status-card trilhas-card">
              <div className="status-icon trilhas-icon">
                <FaBrain />
              </div>
              <div className="status-content">
                <h3>Trilhas Ativas</h3>
                <div className="stats-mini">
                  <span className="mini-stat ativa"><strong>{estatisticas.trilhasAtivas}</strong> em andamento</span>
                  <span className="mini-stat concluida"><strong>{estatisticas.trilhasConcluidas}</strong> concluída(s)</span>
                </div>

                {trilhasUsuario.filter(t => t.status === 'em-andamento').length > 0 ? (
                  <div className="status-items trilhas-items">
                    {trilhasUsuario
                      .filter(t => t.status === 'em-andamento')
                      .slice(0, 2)
                      .map(trilha => (
                        <div key={trilha.id} className="status-item trilha-item">
                          <div className="progress-indicator">
                            <div 
                              className="progress-circle" 
                              style={{'--progress': `${trilha.progresso || 0}%`}}
                            >
                              <span className="progress-text">{trilha.progresso || 0}%</span>
                            </div>
                          </div>
                          <div className="trilha-info">
                            <span className="trilha-titulo">{trilha.titulo}</span>
                            <span className="trilha-meta">{trilha.progresso || 0}% concluído</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-items-container">
                    <FaLightbulb className="no-items-icon" />
                    <p className="no-items">Nenhuma trilha em andamento</p>
                    <p className="no-items-hint">Comece uma trilha para sua jornada!</p>
                  </div>
                )}

                <Link to="/minhas-trilhas" className="status-link">
                  Explorar trilhas <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Card 3: Metas Concluídas - SINCRONIZADO */}
            <div className="status-card metas-card">
              <div className="status-icon metas-icon">
                <FaCheckCircle />
              </div>
              <div className="status-content">
                <h3>Suas Metas</h3>
                <div className="achievement-counter-new">
                  <div className="counter-block concluidas">
                    <span className="counter-number">{estatisticas.metasConcluidas}</span>
                    <span className="counter-label">concluída(s)</span>
                  </div>
                  <div className="counter-divider"></div>
                  <div className="counter-block total">
                    <span className="counter-number">{Math.max(estatisticas.metasTotal, 0)}</span>
                    <span className="counter-label">total</span>
                  </div>
                </div>

                {estatisticas.metasTotal > 0 ? (
                  <div className="progress-meta-geral">
                    <div className="progress-bar-meta">
                      <div 
                        className="progress-fill-meta" 
                        style={{
                          width: `${(estatisticas.metasConcluidas / estatisticas.metasTotal) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="progress-meta-label">
                      {Math.round((estatisticas.metasConcluidas / estatisticas.metasTotal) * 100)}% da jornada
                    </span>
                  </div>
                ) : (
                  <div className="no-metas">
                    <p>Crie suas primeiras metas para começar!</p>
                  </div>
                )}

                <Link to="/minhas-metas" className="status-link">
                  Gerenciar metas <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Seção de Insights */}
          {(trilhasUsuario.length > 0 || metasUsuario.length > 0) && (
            <div className="status-insights">
              <div className="insight-card">
                <FaTrophy className="insight-icon" />
                <div className="insight-content">
                  <h4>Você está no caminho certo!</h4>
                  <p>
                    {trilhasUsuario.length > 0 
                      ? `Você tem ${trilhasUsuario.length} trilha${trilhasUsuario.length > 1 ? 's' : ''} e já completou ${Math.round(estatisticas.progressoMedio)}% em média.` 
                      : 'Comece uma trilha para desbloquear insights personalizados!'}
                  </p>
                </div>
              </div>
            </div>
          )}
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