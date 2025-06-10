import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaStar, FaBrain, FaPuzzlePiece, FaComments, FaBullseye } from 'react-icons/fa';
import '../Styles/MeuProgresso.css'; // Novo CSS
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MeuProgresso() {
  const navigate = useNavigate();

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
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="meu-progresso-container">
      <header className="progresso-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
          <Link to="/buscar-profissionais" className="nav-link">
            <FaSearch className="nav-icon" /> Buscar Profissionais
          </Link>
          <Link to="/meus-agendamentos" className="nav-link">
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

      <main className="progresso-main-content">
        <h1>Meu Progresso Geral</h1>
        <p className="subtitle">Acompanhe sua evolução e conquistas na plataforma.</p>

        <section className="progresso-overview-section">
          <div className="progresso-geral-card">
            <h2>Progresso Geral</h2>
            <div className="progress-circle-container">
              <div className="progress-circle" style={{ backgroundImage: `conic-gradient(#20C997 ${progressoGeral}%, #e0e0e0 ${progressoGeral}%)` }}>
                <span className="progress-value">{progressoGeral}%</span>
              </div>
            </div>
            <p>Seu progresso total nas atividades do TEAxis.</p>
          </div>

          <div className="progresso-por-area-card">
            <h2>Progresso por Área</h2>
            <div className="areas-list">
              {progressoPorArea.map(item => (
                <div key={item.id} className="area-item">
                  <div className="area-icon">{item.icone}</div>
                  <div className="area-info">
                    <h3>{item.area}</h3>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${item.pontuacao}%`, backgroundColor: '#7B3FF2' }}></div>
                    </div>
                    <span>{item.pontuacao} Pontos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="progresso-section">
          <h2>Avaliações e Conquistas Recentes</h2>
          {avaliacoesRecentes.length > 0 ? (
            <div className="avaliacoes-list">
              {avaliacoesRecentes.map(item => (
                <div key={item.id} className="avaliacao-card">
                  <h3>{item.profissional}</h3>
                  <p>Tipo: {item.tipo}</p>
                  <div className="card-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < item.nota ? 'star-conquista filled' : 'star-conquista'} />
                    ))}
                    <span>({item.nota})</span>
                  </div>
                  <p className="avaliacao-data">{item.data}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-progresso-message">Nenhuma avaliação ou conquista recente.</p>
          )}
        </section>

        <section className="progresso-section">
          <h2>Metas e Trilhas Concluídas</h2>
          <p>Visite <Link to="/minhas-metas">Minhas Metas</Link> e <Link to="/minhas-trilhas">Minhas Trilhas</Link> para mais detalhes sobre seus objetivos e percursos.</p>
          <div className="progresso-links">
            <Link to="/minhas-metas" className="btn-secondary"><FaBullseye /> Minhas Metas</Link>
            <Link to="/minhas-trilhas" className="btn-secondary"><FaBrain /> Minhas Trilhas</Link>
          </div>
        </section>
      </main>
    </div>
  );
}