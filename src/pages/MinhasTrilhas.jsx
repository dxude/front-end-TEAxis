import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaCheck, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaBullseye, FaArrowLeft, FaLightbulb, FaRocket } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/MinhasTrilhas.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MinhasTrilhas() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [trilhas] = useState([
    { id: 1, titulo: 'Foco e Concentração', descricao: 'Técnicas para minimizar distrações no seu dia a dia.', progresso: 70, modulos: 5, modulosConcluidos: 3, status: 'Em Andamento', cor: '#20C997' },
    { id: 2, titulo: 'Habilidades Sociais', descricao: 'Aprenda a interagir melhor em diferentes contextos.', progresso: 45, modulos: 4, modulosConcluidos: 2, status: 'Em Andamento', cor: '#7B3FF2' },
    { id: 3, titulo: 'Organização e Planejamento', descricao: 'Estratégias para otimizar sua rotina.', progresso: 100, modulos: 3, modulosConcluidos: 3, status: 'Concluída', cor: '#074f9b' },
    { id: 4, titulo: 'Inteligência Emocional', descricao: 'Construa relacionamentos saudáveis e entenda suas emoções.', progresso: 0, modulos: 6, modulosConcluidos: 0, status: 'Não Iniciada', cor: '#FFD700' },
  ]);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => { setShowLogoutModal(false); navigate('/login'); };

  return (
    <div className="minhas-trilhas-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      <header className="trilhas-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn"><FaArrowLeft /> Voltar</Link>
          <img src={logoTeaxis} alt="Logo" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass"><FaSearch /> Buscar</Link>
          <Link to="/minhas-trilhas" className="nav-link-glass active"><FaBookOpen /> Trilhas</Link>
          <Link to="/perfil" className="nav-link-glass"><FaUserCircle /> Perfil</Link>
        </nav>
      </header>

      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="trilhas-main-content">
        <div className="trilhas-hero-text">
          <h1>Minhas Trilhas Educativas</h1>
          <p>Seu caminho personalizado de desenvolvimento dentro da plataforma.</p>
        </div>

        {/* Card Explicativo e Conexão com Metas */}
        <section className="intro-interaction-glass">
          <div className="intro-card">
            <FaLightbulb className="intro-icon" />
            <div>
              <h3>Por que seguir uma trilha?</h3>
              <p>Cada módulo concluído aqui alimenta o seu progresso geral e desbloqueia novas conquistas nas suas <strong>Metas Pessoais</strong>.</p>
            </div>
            <Link to="/minhas-metas" className="btn-link-metas">Ver minhas metas <FaBullseye /></Link>
          </div>
        </section>

        <section className="trilhas-grid">
          {trilhas.map(trilha => (
            <div key={trilha.id} className={`trilha-card-premium ${trilha.status === 'Concluída' ? 'done' : ''}`}>
              <div className="card-top-bar" style={{ backgroundColor: trilha.cor }}></div>
              <div className="card-body">
                <h3>{trilha.titulo}</h3>
                <p>{trilha.descricao}</p>
                
                <div className="progress-metrics">
                  <div className="progress-info">
                    <span>{trilha.progresso}% concluído</span>
                    <span>{trilha.modulosConcluidos}/{trilha.modulos} módulos</span>
                  </div>
                  <div className="progress-bar-glass">
                    <div className="fill" style={{ width: `${trilha.progresso}%`, backgroundColor: trilha.cor }}></div>
                  </div>
                </div>
                <span className={`status-tag ${trilha.status.toLowerCase().replace(' ', '-')}`}>{trilha.status}</span>
              </div>
              <div className="card-footer">
                <button className="btn-action-premium" disabled={trilha.status === 'Concluída'}>
                  {trilha.status === 'Concluída' ? <><FaCheck /> Concluída</> : <><FaRocket /> {trilha.progresso > 0 ? 'Continuar' : 'Iniciar'}</>}
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}