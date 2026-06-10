import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaStar, FaBrain, FaPuzzlePiece, FaComments, FaBullseye, FaArrowLeft, FaBookOpen, FaFire, FaTrophy } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useProgresso } from '../contexts/ProgressoContext';
import '../Styles/MeuProgresso.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function MeuProgresso() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Estado para o novo filtro de conquistas
  const [filtroConquista, setFiltroConquista] = useState('todas'); // 'todas', 'trilhas', 'metas'

  const { dados } = useProgresso();
  const progressoGeral = dados?.progressoGeral || 0;
  const metas = dados?.metas || [];
  const trilhas = dados?.trilhas || [];

  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressoGeral / 100) * circumference;

  const calcularPontuacaoPorCategoria = (nomeCategoria) => {
    const metasDaCategoria = metas.filter(m => m.categoria === nomeCategoria);
    if (metasDaCategoria.length === 0) return 0;

    const concluidas = metasDaCategoria.filter(m => m.concluida).length;
    return Math.round((concluidas / metasDaCategoria.length) * 100);
  };

  const progressoPorArea = [
    { id: 1, area: 'Rotina', pontuacao: calcularPontuacaoPorCategoria('Rotina'), icone: <FaPuzzlePiece /> },
    { id: 2, area: 'Saúde', pontuacao: calcularPontuacaoPorCategoria('Saúde'), icone: <FaStar /> },
    { id: 3, area: 'Estudos', pontuacao: calcularPontuacaoPorCategoria('Estudos'), icone: <FaBrain /> },
    { id: 4, area: 'Lazer', pontuacao: calcularPontuacaoPorCategoria('Lazer'), icone: <FaComments /> },
  ];

  const conquistasTrilhas = trilhas
    .filter(t => t.progresso === 100 || t.status === 'concluida')
    .map(t => ({
      id: `trilha-${t.id}`,
      profissional: t.titulo, 
      data: new Date().toISOString().split('T')[0], 
      nota: 5,
      tipo: 'Trilha Finalizada'
    }));

  const conquistasMetas = metas
    .filter(m => m.concluida)
    .map(m => ({
      id: `meta-${m.id}`,
      profissional: m.descricao,
      data: m.dataLimite,
      nota: 5,
      tipo: 'Meta Alcançada'
    }));

  const avaliacoesRecentes = [...conquistasTrilhas, ...conquistasMetas];

  // Aplica o filtro na lista de conquistas
  const conquistasFiltradas = avaliacoesRecentes.filter(item => {
    if (filtroConquista === 'todas') return true;
    if (filtroConquista === 'trilhas') return item.tipo === 'Trilha Finalizada';
    if (filtroConquista === 'metas') return item.tipo === 'Meta Alcançada';
    return true;
  });

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
    <div className="meu-progresso-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
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
          <div className="glass-panel-premium progresso-geral-card text-center flex flex-col items-center">
            <div className="card-header-glow">
              <h2 style={{fontSize: '1.6rem', color: '#1e293b', fontWeight: '800', margin: 0}}>Evolução Global</h2>
              {progressoGeral >= 50 && <FaFire className="flame-icon-pulse" />}
            </div>

            <div className="progress-svg-container fade-in-up">
              <svg className="progress-svg" width="220" height="220" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} className="progress-svg-track" />
                <circle 
                  cx="100" cy="100" r={radius} 
                  className="progress-svg-fill"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              
              <div className="progress-svg-content">
                <span className="progress-svg-value">{progressoGeral}%</span>
                <span className="progress-svg-label">Concluído</span>
              </div>
            </div>

            <p style={{color: '#64748b', fontSize: '1.05rem', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto'}}>
              Seu avanço total somando trilhas, metas e interações na plataforma.
            </p>
            
            {progressoGeral > 0 && (
              <div className={`milestone-badge ${progressoGeral >= 100 ? 'badge-max' : 'badge-normal'}`}>
                <FaTrophy /> 
                {progressoGeral >= 100 ? 'Jornada Completa!' : progressoGeral >= 50 ? 'Mais da metade do caminho!' : 'Continue firme!'}
              </div>
            )}
          </div>

          <div className="glass-panel-premium progresso-por-area-card">
            <h2>Desempenho por Categoria</h2>
            <div className="areas-list">
              {progressoPorArea.map(item => (
                <div key={item.id} className="area-item-glass">
                  <div className="area-icon">{item.icone}</div>
                  <div className="area-info">
                    <div className="area-info-top">
                      <h3>{item.area}</h3>
                      <span>{item.pontuacao}%</span>
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

        {/* Avaliações e Conquistas Dinâmicas COM FILTRO */}
        <section className="glass-panel-premium full-width">
          <div className="section-header-filter">
            <h2 className="section-title" style={{marginBottom: 0}}>Avaliações e Conquistas</h2>
            
            {/* O Filtro Elegante */}
            <div className="conquistas-filter">
              <button 
                className={`filter-tab ${filtroConquista === 'todas' ? 'active' : ''}`} 
                onClick={() => setFiltroConquista('todas')}
              >
                Todas
              </button>
              <button 
                className={`filter-tab ${filtroConquista === 'trilhas' ? 'active' : ''}`} 
                onClick={() => setFiltroConquista('trilhas')}
              >
                <FaBookOpen style={{marginRight: '6px', display: 'inline'}}/> Trilhas
              </button>
              <button 
                className={`filter-tab ${filtroConquista === 'metas' ? 'active' : ''}`} 
                onClick={() => setFiltroConquista('metas')}
              >
                <FaBullseye style={{marginRight: '6px', display: 'inline'}}/> Metas
              </button>
            </div>
          </div>

          {conquistasFiltradas.length > 0 ? (
            <div className="avaliacoes-grid fade-in-conquistas">
              {conquistasFiltradas.map((item, index) => (
                <div key={`${item.id}-${index}`} className="avaliacao-card-glass">
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
            <div className="empty-state-glass fade-in-conquistas">
              <p>
                {filtroConquista === 'trilhas' 
                  ? 'Você ainda não finalizou nenhuma trilha. Que tal começar uma agora?' 
                  : filtroConquista === 'metas' 
                  ? 'Nenhuma meta foi alcançada ainda. Estabeleça um objetivo!' 
                  : 'Nenhuma avaliação ou conquista recente para exibir. Complete Trilhas e Metas para ganhar conquistas!'}
              </p>
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

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Animação rápida pro filtro não parecer travado */
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        .fade-in-conquistas {
            animation: fadeInScale 0.3s ease-out forwards;
        }

        .card-header-glow { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 12px; 
          margin-bottom: 25px; 
        }
        
        @keyframes pulseFlame { 
          0% { transform: scale(1); opacity: 0.8; } 
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.6)); } 
          100% { transform: scale(1); opacity: 0.8; } 
        }
        .flame-icon-pulse { 
          color: #f59e0b; 
          font-size: 1.6rem; 
          animation: pulseFlame 2s infinite ease-in-out; 
        }

        /* Container do SVG */
        .progress-svg-container { 
          position: relative; 
          width: 220px; 
          height: 220px; 
          margin: 0 auto 30px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        
        .progress-svg { 
          transform: rotate(-90deg); 
          width: 100%; 
          height: 100%; 
          filter: drop-shadow(0 10px 15px rgba(123, 63, 242, 0.35));
        }
        
        .progress-svg-track { 
          fill: none; 
          stroke: #f1f5f9; 
          stroke-width: 14; 
        }
        
        .progress-svg-fill { 
          fill: none; 
          stroke: #7B3FF2;
          stroke-width: 14; 
          stroke-linecap: round;
          transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        
        /* Texto no centro do círculo */
        .progress-svg-content { 
          position: absolute; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
        }
        
        .progress-svg-value { 
          font-size: 3.5rem; 
          font-weight: 900; 
          color: #1e293b; 
          line-height: 1; 
          letter-spacing: -1px;
        }
        
        .progress-svg-label { 
          font-size: 0.85rem; 
          color: #64748b; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 1.5px; 
          margin-top: 8px; 
        }

        /* Selinho de Motivação */
        .milestone-badge {
          margin-top: 25px;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 800;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .badge-normal {
          background: #f3e8ff; 
          color: #6d28d9; 
          border: 1px solid #d8b4fe;
        }

        .badge-max {
          background: #ecfdf5; 
          color: #047857; 
          border: 1px solid #6ee7b7;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
        }

        /* --- ESTILOS DO FILTRO DE CONQUISTAS --- */
        .section-header-filter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .conquistas-filter {
          display: flex;
          background: #f8fafc;
          padding: 5px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          gap: 5px;
        }
        
        .filter-tab {
          background: transparent;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          color: #64748b;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-tab:hover {
          color: #334155;
          background: #f1f5f9;
        }
        
        .filter-tab.active {
          background: #ffffff;
          color: #7B3FF2;
          box-shadow: 0 2px 5px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}