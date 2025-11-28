import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaUsers, FaComments, FaSignOutAlt, FaChartBar, FaFileAlt } from 'react-icons/fa';
import '../Styles/DashboardProfissional.css'; 
import logoTeaxis from '../assets/imagens/fundoLogo.png'; 

export default function DashboardProfissional() {
  const navigate = useNavigate();
  const [professionalName, setProfessionalName] = useState('Dra. Ana Silva'); 

  const [activeLink, setActiveLink] = useState('home');

  const proximosAgendamentos = [
    { id: 1, cliente: 'João M.', data: '10/07/2025', hora: '09:00' },
    { id: 2, cliente: 'Maria S.', data: '10/07/2025', hora: '11:00' },
    { id: 3, cliente: 'Pedro A.', data: '11/07/2025', hora: '15:00' },
  ];

  const clientesAtivos = 25;
  const avaliacaoMedia = 4.8;

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
          <p className="user-welcome">Olá, {professionalName}!</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" className={activeLink === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('home')}>
                <FaHome className="nav-icon" /> Início
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={activeLink === 'perfil' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('perfil')}>
                <FaUser className="nav-icon" /> Meu Perfil
              </Link>
            </li>
            <li>
              <Link to="/minha-agenda" className={activeLink === 'agenda' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('agenda')}>
                <FaCalendarAlt className="nav-icon" /> Minha Agenda
              </Link>
            </li>
            <li>
              <Link to="/meus-clientes" className={activeLink === 'clientes' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('clientes')}>
                <FaUsers className="nav-icon" /> Meus Clientes
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className={activeLink === 'mensagens' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('mensagens')}>
                <FaComments className="nav-icon" /> Mensagens
              </Link>
            </li>
            <li>
              <Link to="/relatorios" className={activeLink === 'relatorios' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('relatorios')}>
                <FaChartBar className="nav-icon" /> Relatórios
              </Link>
            </li>
            <li>
              <Link to="/recursos-colaboracao" className={activeLink === 'colaboracao' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveLink('colaboracao')}>
                <FaFileAlt className="nav-icon" /> Colaboração
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
          <h1>Dashboard do Profissional</h1>
        </header>

        <section className="dashboard-overview">
          <div className="overview-card">
            <h3>Próximos Agendamentos</h3>
            {proximosAgendamentos.length > 0 ? (
              <ul>
                {proximosAgendamentos.map(agendamento => (
                  <li key={agendamento.id}>
                    {agendamento.cliente} - {agendamento.data} às {agendamento.hora}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum agendamento futuro.</p>
            )}
            <Link to="/minha-agenda" className="see-more-link">Ver agenda completa</Link>
          </div>

          <div className="overview-card">
            <h3>Métricas Rápidas</h3>
            <p>Clientes Ativos: <strong>{clientesAtivos}</strong></p>
            <p>Avaliação Média: <strong>{avaliacaoMedia} / 5</strong></p>
            <Link to="/relatorios" className="see-more-link">Ver relatórios</Link>
          </div>

          <div className="overview-card">
            <h3>Mensagens Recentes</h3>
            <p>Você tem <strong>3</strong> novas mensagens de clientes.</p>
            <Link to="/mensagens" className="btn-primary">Ver Mensagens</Link>
          </div>
        </section>

        <section className="dashboard-section">
            <h2>Gerenciar Clientes</h2>
            <div className="clientes-management">
                <p>Acesse a lista completa dos seus clientes e seus perfis.</p>
                <Link to="/meus-clientes" className="btn-secondary">Meus Clientes</Link>
            </div>
        </section>
      </main>
    </div>
  );
}