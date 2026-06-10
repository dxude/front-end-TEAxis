import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaUsers, FaComments, FaChartBar, FaFileAlt, FaSignOutAlt, FaArrowRight, FaStar, FaClock } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardProfissional.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos, carregarMensagens } from '../utils/dataSync';

const parseDate = (value) => {
  if (!value) return new Date();
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function DashboardProfissional() {
  const navigate = useNavigate();
  
  const [professionalName, setProfessionalName] = useState('Profissional'); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [proximosAgendamentos, setProximosAgendamentos] = useState([]);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState(0);
  const [avaliacaoMedia, setAvaliacaoMedia] = useState('Novo');

  useEffect(() => {
    const syncDashboard = () => {
      // 1. Puxar Nome Real de quem está logado agora
      const savedName = localStorage.getItem('user_name') || 'Profissional';
      setProfessionalName(savedName);

      const agendaCompleta = carregarAgendamentos();

      // 2. O FILTRO DE OURO: Pega SÓ os agendamentos que pertencem ao nome exato deste profissional!
      const profAgenda = agendaCompleta.filter(item => 
        item.toRole === 'profissional' && item.profissional === savedName
      );

      // 3. Calcula Clientes Únicos só da agenda DELE
      const clientesUnicos = new Set(profAgenda.map(ag => ag.cliente)).size;
      setClientesAtivos(clientesUnicos);

      // 4. Próximos Agendamentos só DELE
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const futuros = profAgenda
        .filter(ag => {
          const dataAg = parseDate(ag.data);
          return dataAg >= hoje && ag.status === 'Confirmado';
        })
        .sort((a, b) => {
          const dateA = parseDate(a.data);
          const dateB = parseDate(b.data);
          if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
          return a.hora.localeCompare(b.hora); 
        })
        .slice(0, 3); 
        
      setProximosAgendamentos(futuros);

      // 5. Avaliação Dinâmica só da performance DELE
      const totalConsultas = profAgenda.length;
      if (totalConsultas > 0) {
        const concluidas = profAgenda.filter(ag => ag.status === 'Concluído').length;
        const taxaSucesso = concluidas / totalConsultas;
        const notaCalculada = (4.0 + (taxaSucesso * 1.0)).toFixed(1);
        setAvaliacaoMedia(notaCalculada);
      } else {
        setAvaliacaoMedia('Novo');
      }

      // 6. Mensagens Não Lidas (Você pode aplicar a mesma lógica do nome aqui se o campo existir no dataSync)
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
    const interval = setInterval(syncDashboard, 1500);

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

      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        
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
              <FaStar className={`stat-icon ${avaliacaoMedia !== 'Novo' ? 'highlight' : ''}`} />
              <div>
                <span className="stat-value">{avaliacaoMedia}</span>
                <span className="stat-label">Sua Avaliação</span>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid-prof">
          
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
                      <span className="status-pill confirmado">{agendamento.status || 'Atendimento'}</span>
                    </div>
                    <Link to="/minha-agenda" className="btn-icon-premium" title="Ir para a agenda">
                      <FaArrowRight />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">Nenhum agendamento confirmado para os próximos dias. Aproveite para organizar seus relatórios!</div>
              )}
            </div>
          </section>

          <div className="side-column-prof">
            <section className="glass-panel-dashboard fade-in delay-2 action-card">
              <div className={`icon-wrapper ${mensagensNaoLidas > 0 ? 'alert' : ''}`}><FaComments /></div>
              <h3>Mensagens Recentes</h3>
              {mensagensNaoLidas > 0 ? (
                <p>Você tem <strong>{mensagensNaoLidas} novas mensagens</strong> aguardando resposta na sua caixa de entrada.</p>
              ) : (
                <p>Sua caixa de entrada está limpa. Nenhuma mensagem pendente no momento.</p>
              )}
              <Link to="/mensagens" className="btn-action-premium primary full-width">Acessar Mensagens</Link>
            </section>

            <section className="glass-panel-dashboard fade-in delay-3 action-card">
              <div className="icon-wrapper"><FaFileAlt /></div>
              <h3>Gestão de Prontuários</h3>
              <p>Acesse o histórico, anotações e evolução de todos os seus <strong>{clientesAtivos} pacientes ativos</strong>.</p>
              <Link to="/meus-clientes" className="btn-action-premium secondary full-width">Ver Pacientes</Link>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}