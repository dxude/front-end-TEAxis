import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGamepad, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaStar, FaArrowLeft, FaBookOpen, FaBullseye, FaFilter } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import confetti from 'canvas-confetti'; // O luxo importado aqui!
import '../Styles/JogosEducativos.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png';

export default function JogosEducativos() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const [jogos, setJogos] = useState([
    {
      id: 1,
      titulo: 'Labirinto do Foco',
      descricao: 'Ajuda a melhorar a concentração e o raciocínio rápido.',
      categoria: 'Foco',
      imagem: 'https://via.placeholder.com/150/A5B4FC/FFFFFF?text=Labirinto',
      linkJogo: '#',
      nivel: 'Iniciante'
    },
    {
      id: 2,
      titulo: 'Caça-Palavras da Memória',
      descricao: 'Exercita a memória de curto prazo e o vocabulário.',
      categoria: 'Memória',
      imagem: 'https://via.placeholder.com/150/7B3FF2/FFFFFF?text=CacaPalavras',
      linkJogo: '#',
      nivel: 'Intermediário'
    },
    {
      id: 3,
      titulo: 'Quebra-Cabeça das Emoções',
      descricao: 'Auxilia no reconhecimento e gestão das emoções.',
      categoria: 'Emocional',
      imagem: 'https://via.placeholder.com/150/20C997/FFFFFF?text=Emocoes',
      linkJogo: '#',
      nivel: 'Avançado'
    },
    {
      id: 4,
      titulo: 'Caminho da Organização',
      descricao: 'Desenvolve habilidades de organização e planejamento.',
      categoria: 'Organização',
      imagem: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Organiza',
      linkJogo: '#',
      nivel: 'Iniciante'
    },
  ]);

  // JS BABADEIRO 1: Filtro dinâmico
  const categorias = ['Todos', ...new Set(jogos.map(j => j.categoria))];
  const jogosFiltrados = filtroAtivo === 'Todos' ? jogos : jogos.filter(j => j.categoria === filtroAtivo);

  // JS BABADEIRO 2: Confetes e Gamificação
  const handleJogar = (linkJogo, titulo) => {
    // Dispara a chuva de confetes
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#7B3FF2', '#20C997', '#FFD700', '#A5B4FC']
    });

    // Um pequeno delay para o usuário ver o confete antes de redirecionar
    setTimeout(() => {
      window.open(linkJogo, '_blank');
    }, 1500);
  };

  // JS BABADEIRO 3: Efeito 3D Hover nos Cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="jogos-page-premium">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      <header className="header-glass-premium">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoPlataforma} alt="Logo Plataforma" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass"><FaSearch /> Buscar</Link>
          <Link to="/meus-agendamentos" className="nav-link-glass"><FaCalendarAlt /> Agendamentos</Link>
          <Link to="/minhas-trilhas" className="nav-link-glass"><FaBookOpen /> Trilhas</Link>
          <Link to="/minhas-metas" className="nav-link-glass"><FaBullseye /> Metas</Link>
          <Link to="/perfil" className="nav-link-glass"><FaUserCircle /> Perfil</Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn"><FaSignOutAlt /> Sair</button>
        </nav>
      </header>

      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        <div className="jogos-hero-text fade-in">
          <h1>Jogos Educativos</h1>
          <p className="subtitle">Desbloqueie novas habilidades e ganhe XP enquanto se diverte!</p>
        </div>

        {/* SECTION DE FILTROS ANIMADOS */}
        <section className="filtros-section fade-in">
          <div className="filtros-container-glass">
            <FaFilter className="filter-icon" />
            {categorias.map(cat => (
              <button 
                key={cat} 
                className={`btn-filtro-premium ${filtroAtivo === cat ? 'ativo' : ''}`}
                onClick={() => setFiltroAtivo(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="jogos-grid-section fade-in delay-1">
          {jogosFiltrados.length > 0 ? (
            <div className="jogos-grid-premium">
              {jogosFiltrados.map(jogo => (
                <div 
                  key={jogo.id} 
                  className="jogo-card-glass 3d-hover"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="jogo-image-wrapper">
                    <img src={jogo.imagem} alt={jogo.titulo} className="jogo-imagem-premium" />
                    <span className={`badge-nivel nivel-${jogo.nivel.toLowerCase().replace('é', 'e').replace('á', 'a')}`}>
                      {jogo.nivel}
                    </span>
                  </div>
                  
                  <div className="jogo-card-body">
                    <h3>{jogo.titulo}</h3>
                    <p className="jogo-descricao-premium">{jogo.descricao}</p>
                    
                    <div className="jogo-categoria">
                      <FaStar className="star-icon" /> {jogo.categoria}
                    </div>
                  </div>

                  <div className="jogo-card-footer">
                    <button className="btn-action-premium primary full-width btn-jogar" onClick={() => handleJogar(jogo.linkJogo, jogo.titulo)}>
                      <FaGamepad /> Iniciar Missão
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-glass">
              <p>Nenhum jogo encontrado nessa categoria. Continue explorando! ✨</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}