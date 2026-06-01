import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaUsers, FaComments, FaChartBar, FaFileAlt, FaSignOutAlt, FaArrowRight, FaStar, FaClock } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardProfissional.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos, carregarMensagens } from '../utils/dataSync';

export default function DashboardProfissional() {
  const navigate = useNavigate();
  const [professionalName, setProfessionalName] = useState('Dra. Ana Silva'); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [proximosAgendamentos, setProximosAgendamentos] = useState([
    { id: 1, cliente: 'João M.', data: '10/07/2025', hora: '09:00', tipo: 'Primeira Consulta', toRole: 'profissional' },
    { id: 2, cliente: 'Maria S.', data: '10/07/2025', hora: '11:00', tipo: 'Acompanhamento', toRole: 'profissional' },
    { id: 3, cliente: 'Pedro A.', data: '11/07/2025', hora: '15:00', tipo: 'Acompanhamento', toRole: 'profissional' },
  ]);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(3);

  const clientesAtivos = new Set(proximosAgendamentos.map(ag => ag.cliente)).size || 25;
  const avaliacaoMedia = 4.8;

  useEffect(() => {
    const syncDashboard = () => {
      // Ler nome do profissional salvo no login, se existir
      const savedName = localStorage.getItem('user_name');
      if (savedName) setProfessionalName(savedName);
      const agenda = carregarAgendamentos();
      const profAgenda = agenda.filter(item => item.toRole === 'profissional');
      if (profAgenda.length > 0) {
        setProximosAgendamentos(profAgenda);
      }

      const mensagens = carregarMensagens();
      setMensagensNaoLidas(mensagens.filter(msg => msg.toRole === 'profissional' && !msg.lida).length);
    };

    syncDashboard();
    const handleStorage = (event) => {
      if (!event.key || event.key === 'teaxis_agendamentos' || event.key === 'teaxis_mensagens') {
        syncDashboard();
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(syncDashboard, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

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
    <div className="dash-prof-page-premium">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* NAVBAR DE VIDRO PREMIUM */}
      <header className="header-glass-premium">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo" className="header-logo-small" />
          <span className="professional-badge">Portal do Profissional</span>
        </div>
        <nav className="header-nav-glass">
          <Link to="/" className="nav-link-glass active"><FaHome /> Início</Link>
          <Link to="/perfil" className="nav-link-glass"><FaUser /> Perfil</Link>
          <Link to="/minha-agenda" className="nav-link-glass"><FaCalendarAlt /> Agenda</Link>
          <Link to="/meus-clientes" className="nav-link-glass"><FaUsers /> Clientes</Link>
          <Link to="/mensagens" className="nav-link-glass"><FaComments /> Mensagens</Link>
          <Link to="/relatorios" className="nav-link-glass"><FaChartBar /> Relatórios</Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">
            <FaSignOutAlt /> Sair
          </button>
        </nav>
      </header>

      {/* BACKGROUND ANIMADO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        
        {/* HERO SECTION DO PROFISSIONAL */}
        <section className="glass-panel-dashboard fade-in hero-prof">
          <div className="hero-prof-content">
            <h1>Olá, {professionalName}! 👋</h1>
            <p>Este é o seu resumo de hoje. Você tem <strong>{proximosAgendamentos.length} atendimentos</strong> programados e <strong>{mensagensNaoLidas} mensagens não lidas</strong>.</p>
          </div>
          <div className="hero-prof-stats">
            <div className="stat-badge">
              <FaUsers className="stat-icon" />
              <div>
                <span className="stat-value">{clientesAtivos}</span>
                <span className="stat-label">Clientes Ativos</span>
              </div>
            </div>
            <div className="stat-badge">
              <FaStar className="stat-icon highlight" />
              <div>
                <span className="stat-value">{avaliacaoMedia}</span>
                <span className="stat-label">Sua Avaliação</span>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid-prof">
          
          {/* PRÓXIMOS AGENDAMENTOS */}
          <section className="glass-panel-dashboard fade-in delay-1 agenda-card">
            <div className="section-header">
              <h2><FaCalendarAlt className="title-icon" /> Próximos Atendimentos</h2>
              <Link to="/minha-agenda" className="link-discreto">Ver agenda completa</Link>
            </div>
            
            <div className="agendamentos-list">
              {proximosAgendamentos.length > 0 ? (
                proximosAgendamentos.map(agendamento => (
                  <div key={agendamento.id} className="agendamento-item-premium">
                    <div className="agendamento-time">
                      <span className="time">{agendamento.hora}</span>
                      <span className="date">{agendamento.data}</span>
                    </div>
                    <div className="agendamento-details">
                      <strong>{agendamento.cliente}</strong>
                      <span>{agendamento.tipo}</span>
                    </div>
                    <button className="btn-icon-premium" title="Iniciar Atendimento">
                      <FaArrowRight />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">Nenhum agendamento para hoje.</div>
              )}
            </div>
          </section>

          <div className="side-column-prof">
            {/* MENSAGENS RÁPIDAS */}
            <section className="glass-panel-dashboard fade-in delay-2 action-card">
              <div className="icon-wrapper alert"><FaComments /></div>
              <h3>Mensagens Recentes</h3>
              <p>Você tem <strong>3 novas mensagens</strong> aguardando resposta na sua caixa de entrada.</p>
              <Link to="/mensagens" className="btn-action-premium primary full-width">Acessar Mensagens</Link>
            </section>

            {/* GESTÃO DE CLIENTES */}
            <section className="glass-panel-dashboard fade-in delay-3 action-card">
              <div className="icon-wrapper"><FaFileAlt /></div>
              <h3>Gestão de Prontuários</h3>
              <p>Acesse o histórico, anotações e evolução de todos os seus pacientes ativos.</p>
              <Link to="/meus-clientes" className="btn-action-premium secondary full-width">Ver Pacientes</Link>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}