import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaStar, FaBrain, FaPuzzlePiece, FaComments, FaBullseye, FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/MeuProgresso.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MeuProgresso() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [progressoGeral, setProgressoGeral] = useState(65); 
  const [progressoPorArea, setProgressoPorArea] = useState([
    { id: 1, area: 'Foco e Concentração', pontuacao: 80, icone: <FaBrain /> },
    { id: 2, area: 'Habilidades Sociais', pontuacao: 60, icone: <FaComments /> },
    { id: 3, area: 'Organização', pontuacao: 75, icone: <FaPuzzlePiece /> },
    { id: 4, area: 'Inteligência Emocional', pontuacao: 45, icone: <FaStar /> },
  ]);

  const [avaliacoesRecentes, setAvaliacoesRecentes] = useState([
    { id: 1, profissional: 'Dra. Helena Costa', data: '2025-06-28', nota: 5, tipo: 'Consulta' },
    { id: 2, profissional: 'Trilha de Habilidades Sociais', data: '2025-06-20', nota: 4, tipo: 'Trilha' },
  ]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="meu-progresso-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* HEADER DE VIDRO PREMIUM */}
      <header className="progresso-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoTeaxis} alt="Logo Plataforma" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass">
            <FaSearch className="nav-icon" /> Buscar
          </Link>
          <Link to="/meus-agendamentos" className="nav-link-glass">
            <FaCalendarAlt className="nav-icon" /> Agendamentos
          </Link>
          <Link to="/minhas-trilhas" className="nav-link-glass">
            <FaBookOpen className="nav-icon" /> Trilhas
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

      <main className="progresso-main-content">
        <div className="progresso-hero-text">
          <h1>Meu Progresso Geral</h1>
          <p className="subtitle">Acompanhe sua evolução, conquistas e desenvolvimento contínuo na plataforma.</p>
        </div>

        <section className="progresso-overview-grid">
          {/* Card de Progresso Geral */}
          <div className="glass-panel-premium progresso-geral-card">
            <h2>Evolução Global</h2>
            <div className="progress-circle-container">
              <div className="progress-circle" style={{ backgroundImage: `conic-gradient(#7B3FF2 ${progressoGeral}%, transparent ${progressoGeral}%)` }}>
                <div className="progress-circle-inner">
                  <span className="progress-value">{progressoGeral}%</span>
                </div>
              </div>
            </div>
            <p>Seu avanço total somando trilhas, metas e interações.</p>
          </div>

          {/* Card de Progresso por Área */}
          <div className="glass-panel-premium progresso-por-area-card">
            <h2>Desempenho por Categoria</h2>
            <div className="areas-list">
              {progressoPorArea.map(item => (
                <div key={item.id} className="area-item-glass">
                  <div className="area-icon">{item.icone}</div>
                  <div className="area-info">
                    <div className="area-info-top">
                      <h3>{item.area}</h3>
                      <span>{item.pontuacao} pts</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${item.pontuacao}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avaliações e Conquistas */}
        <section className="glass-panel-premium full-width">
          <h2 className="section-title">Avaliações e Conquistas Recentes</h2>
          {avaliacoesRecentes.length > 0 ? (
            <div className="avaliacoes-grid">
              {avaliacoesRecentes.map(item => (
                <div key={item.id} className="avaliacao-card-glass">
                  <div className="avaliacao-header">
                    <h3>{item.profissional}</h3>
                    <span className="badge-tipo">{item.tipo}</span>
                  </div>
                  <div className="card-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < item.nota ? 'star-icon filled' : 'star-icon'} />
                    ))}
                    <span className="rating-number">({item.nota}.0)</span>
                  </div>
                  <p className="avaliacao-data"><FaCalendarAlt /> {item.data}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-glass">
              <p>Nenhuma avaliação ou conquista recente para exibir.</p>
            </div>
          )}
        </section>

        {/* Links Rápidos */}
        <section className="glass-panel-premium full-width text-center">
          <h2 className="section-title">Continue Evoluindo</h2>
          <p className="links-descricao">Visite suas Metas e Trilhas para manter seu desenvolvimento ativo e alcançar novos marcos.</p>
          <div className="progresso-links-actions">
            <Link to="/minhas-metas" className="btn-action-premium primary">
              <FaBullseye /> Acessar Minhas Metas
            </Link>
            <Link to="/minhas-trilhas" className="btn-action-premium secondary">
              <FaBrain /> Continuar Trilhas
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}