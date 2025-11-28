import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaSearch, FaTimesCircle, FaCheckCircle, FaInfoCircle, FaStar } from 'react-icons/fa';
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
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAgendamentos(agendamentos.map(ag =>
        ag.id === idAgendamento ? { ...ag, status: 'Cancelado' } : ag
      ));
      alert('Agendamento cancelado com sucesso!');
    }
  };

  const handleReschedule = (idAgendamento) => {
    alert(`Redirecionando para remarcar agendamento ${idAgendamento}`);
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  const agendamentosFuturos = agendamentos.filter(ag => ag.status === 'Confirmado');
  const agendamentosPassados = agendamentos.filter(ag => ag.status === 'Concluído' || ag.status === 'Cancelado');

  return (
    <div className="meus-agendamentos-container">
      <header className="agendamentos-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
          <Link to="/buscar-profissionais" className="nav-link">
            <FaSearch className="nav-icon" /> Buscar Profissionais
          </Link>
          <Link to="/meus-agendamentos" className="nav-link active">
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

      <main className="agendamentos-main-content">
        <h1>Meus Agendamentos</h1>
        <p className="subtitle">Gerencie suas consultas futuras e revise as passadas.</p>

        <section className="agendamentos-section">
          <h2>Próximos Agendamentos</h2>
          {agendamentosFuturos.length > 0 ? (
            <div className="agendamentos-list">
              {agendamentosFuturos.map(ag => (
                <div key={ag.id} className="agendamento-card">
                  <div className="card-info">
                    <h3>{ag.profissional} ({ag.especializacao})</h3>
                    <p><strong>Data:</strong> {ag.data} às {ag.hora}</p>
                    <p className={`status ${ag.status.toLowerCase()}`}>{ag.status}</p>
                  </div>
                  <div className="card-actions">
                    <button className="btn-join-room" onClick={() => window.open(ag.linkSala, '_blank')}>
                      <FaInfoCircle /> Entrar na Sala
                    </button>
                    <button className="btn-secondary" onClick={() => handleReschedule(ag.id)}>
                      <FaCalendarAlt /> Remarcar
                    </button>
                    <button className="btn-danger" onClick={() => handleCancelamento(ag.id)}>
                      <FaTimesCircle /> Cancelar
                    </button>
                    <Link to={`/perfil-profissional/${ag.idProfissional}`} className="btn-view-prof">
                      <FaUserCircle /> Ver Profissional
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-agendamentos-message">Você não tem agendamentos futuros. <Link to="/buscar-profissionais">Agende sua primeira consulta!</Link></p>
          )}
        </section>

        <section className="agendamentos-section">
          <h2>Agendamentos Anteriores</h2>
          {agendamentosPassados.length > 0 ? (
            <div className="agendamentos-list">
              {agendamentosPassados.map(ag => (
                <div key={ag.id} className="agendamento-card passado">
                  <div className="card-info">
                    <h3>{ag.profissional} ({ag.especializacao})</h3>
                    <p><strong>Data:</strong> {ag.data} às {ag.hora}</p>
                    <p className={`status ${ag.status.toLowerCase()}`}>{ag.status}</p>
                  </div>
                  <div className="card-actions">
                    {ag.status === 'Concluído' && (
                      <button className="btn-primary" onClick={() => alert(`Avaliar ${ag.profissional}`)}>
                        <FaStar /> Avaliar {/* Onde FaStar é usado */}
                      </button>
                    )}
                     <Link to={`/perfil-profissional/${ag.idProfissional}`} className="btn-view-prof">
                      <FaUserCircle /> Ver Profissional
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-agendamentos-message">Nenhum agendamento anterior para exibir.</p>
          )}
        </section>
      </main>
    </div>
  );
}