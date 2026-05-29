import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaSearch, FaTimesCircle, FaCheckCircle, FaInfoCircle, FaStar, FaArrowLeft, FaVideo } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/MeusAgendamentos.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MeusAgendamentos() {
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      profissional: 'Dra. Helena Costa',
      especializacao: 'Psicologia',
      data: '15/07/2025',
      hora: '10:00',
      status: 'Confirmado',
      linkSala: '#',
      idProfissional: 1
    },
    {
      id: 2,
      profissional: 'Dr. Lucas Ribeiro',
      especializacao: 'Terapia Ocupacional',
      data: '20/07/2025',
      hora: '14:30',
      status: 'Confirmado',
      linkSala: '#',
      idProfissional: 2
    },
    {
      id: 3,
      profissional: 'Dra. Mariana Santos',
      especializacao: 'Psicopedagogia',
      data: '10/06/2025',
      hora: '09:00',
      status: 'Concluído',
      idProfissional: 3
    },
  ]);

  const handleCancelamento = (idAgendamento) => {
    navigate(`/cancelar/${idAgendamento}`);
  };

  const handleReschedule = (idAgendamento) => {
    navigate(`/remarcar/${idAgendamento}`);
  };

  const handleJoinRoom = (idAgendamento) => {
    navigate(`/sala/${idAgendamento}`);
  };

  const handleAvaliar = (idProfissional) => {
    navigate(`/avaliar/${idProfissional}`);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  const agendamentosFuturos = agendamentos.filter(ag => ag.status === 'Confirmado');
  const agendamentosPassados = agendamentos.filter(ag => ag.status === 'Concluído' || ag.status === 'Cancelado');

  return (
    <div className="meus-agendamentos-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* HEADER GLASSMORPHISM */}
      <header className="agendamentos-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass">
            <FaSearch className="nav-icon" /> Buscar
          </Link>
          <Link to="/meus-agendamentos" className="nav-link-glass active">
            <FaCalendarAlt className="nav-icon" /> Agendamentos
          </Link>
          <Link to="/perfil" className="nav-link-glass">
            <FaUserCircle className="nav-icon" /> Perfil
          </Link>
          <button onClick={handleLogout} className="nav-link-glass logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      {/* BACKGROUND DECORATIVO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="agendamentos-main-content">
        <div className="agendamentos-hero-text">
          <h1>Meus Agendamentos</h1>
          <p className="subtitle">Gerencie suas consultas futuras e revise o seu histórico.</p>
        </div>

        <section className="agendamentos-section-glass">
          <div className="section-title-wrapper">
            <h2>Próximos Agendamentos</h2>
          </div>
          
          {agendamentosFuturos.length > 0 ? (
            <div className="agendamentos-list">
              {agendamentosFuturos.map(ag => (
                <div key={ag.id} className="agendamento-card-premium">
                  <div className="card-info">
                    <div className="info-header">
                      <h3>{ag.profissional}</h3>
                      <span className="badge-especializacao">{ag.especializacao}</span>
                    </div>
                    <div className="info-details">
                      <p className="date-time"><FaCalendarAlt /> {ag.data} às {ag.hora}</p>
                      <span className="status-badge confirmado"><FaCheckCircle /> {ag.status}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-action-primary" onClick={() => handleJoinRoom(ag.id)}>
                      <FaVideo /> Entrar na Sala
                    </button>
                    <button className="btn-action-secondary" onClick={() => handleReschedule(ag.id)}>
                      <FaCalendarAlt /> Remarcar
                    </button>
                    <button className="btn-action-danger" onClick={() => handleCancelamento(ag.id)}>
                      <FaTimesCircle /> Cancelar
                    </button>
                    <Link to={`/perfil-profissional/${ag.idProfissional}`} className="btn-action-outline">
                      <FaUserCircle /> Ver Perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-agendamentos-glass">
              <p>Você não tem agendamentos futuros.</p>
              <Link to="/buscar-profissionais" className="btn-moderno-primary">Encontrar um Profissional</Link>
            </div>
          )}
        </section>

        <section className="agendamentos-section-glass">
          <div className="section-title-wrapper">
            <h2>Histórico de Consultas</h2>
          </div>

          {agendamentosPassados.length > 0 ? (
            <div className="agendamentos-list">
              {agendamentosPassados.map(ag => (
                <div key={ag.id} className="agendamento-card-premium passado">
                  <div className="card-info">
                    <div className="info-header">
                      <h3>{ag.profissional}</h3>
                      <span className="badge-especializacao">{ag.especializacao}</span>
                    </div>
                    <div className="info-details">
                      <p className="date-time"><FaCalendarAlt /> {ag.data} às {ag.hora}</p>
                      <span className={`status-badge ${ag.status.toLowerCase()}`}>
                        {ag.status === 'Concluído' ? <FaCheckCircle /> : <FaTimesCircle />} {ag.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    {ag.status === 'Concluído' && (
                      <button className="btn-action-star" onClick={() => handleAvaliar(ag.idProfissional)}>
                        <FaStar /> Avaliar Consulta
                      </button>
                    )}
                    <Link to={`/perfil-profissional/${ag.idProfissional}`} className="btn-action-outline">
                      <FaUserCircle /> Ver Perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-agendamentos-glass">
              <p>Nenhum agendamento anterior para exibir.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}