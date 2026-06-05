import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaUserCircle, FaSignOutAlt, FaArrowLeft, FaGraduationCap, FaBookOpen, FaBullseye } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/BuscarProfissionais.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png';

export default function BuscarProfissionais() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.dispatchEvent(new Event('teaxis:auth_changed'));
    }
    setShowLogoutModal(false);
    navigate('/login');
  };

  const [profissionais, setProfissionais] = useState([
    {
      id: 1,
      nome: 'Dra. Helena Costa',
      especializacao: 'Psicologia',
      sub: 'TDAH, Ansiedade',
      avaliacao: 4.9,
      foto: 'https://randomuser.me/api/portraits/women/68.jpg', 
      bio: 'Especialista em TDAH e ansiedade, com foco em adolescentes e adultos. Atendimento online e presencial em São Paulo.',
      localidades: ['São Paulo - SP', 'Online']
    },
    {
      id: 2,
      nome: 'Dr. Lucas Ribeiro',
      especializacao: 'Terapia Ocupacional',
      sub: 'TEA, Infantil',
      avaliacao: 4.7,
      foto: 'https://randomuser.me/api/portraits/men/82.jpg',
      bio: 'Terapeuta ocupacional com vasta experiência em TEA e desenvolvimento infantil. Ajudo crianças a desenvolverem autonomia e habilidades.',
      localidades: ['Rio de Janeiro - RJ', 'Online']
    },
    {
      id: 3,
      nome: 'Dra. Mariana Santos',
      especializacao: 'Psicopedagogia',
      sub: 'Dislexia',
      avaliacao: 4.8,
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Psicopedagoga especializada em dislexia e transtornos de aprendizagem. Trabalho com estratégias individualizadas.',
      localidades: ['Belo Horizonte - MG', 'Online']
    },
    {
      id: 4,
      nome: 'Dr. Carlos Lima',
      especializacao: 'Fonoaudiologia',
      sub: 'TEA, Linguagem',
      avaliacao: 4.6,
      foto: 'https://randomuser.me/api/portraits/men/7.jpg',
      bio: 'Fonoaudiólogo com experiência em desenvolvimento da comunicação e linguagem em crianças com TEA.',
      localidades: ['Online']
    },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = profissionais.filter(prof => {
      const matchesSearchTerm = searchTerm ? prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesEspecializacao = especializacao ? prof.especializacao.toLowerCase().includes(especializacao.toLowerCase()) : true;
      const matchesLocalizacao = localizacao ? prof.localidades.some(loc => loc.toLowerCase().includes(localizacao.toLowerCase())) : true;
      return matchesSearchTerm && matchesEspecializacao && matchesLocalizacao;
    });
    setProfissionais(filtered);
  };

  return (
    <div className="buscar-page-premium">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* NAVBAR DE VIDRO PREMIUM */}
      <header className="header-glass-premium">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar
          </Link>
          <img src={logoPlataforma} alt="Logo" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass active"><FaSearch /> Buscar</Link>
          <Link to="/meus-agendamentos" className="nav-link-glass"><FaCalendarAlt /> Agendamentos</Link>
          <Link to="/minhas-trilhas" className="nav-link-glass"><FaBookOpen /> Trilhas</Link>
          <Link to="/perfil" className="nav-link-glass"><FaUserCircle /> Perfil</Link>
          <button onClick={handleLogout} className="nav-link-glass logout-btn"><FaSignOutAlt /> Sair</button>
        </nav>
      </header>

      {/* BACKGROUND DECORATIVO ANIMADO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        <div className="search-hero-text fade-in">
          <h1>Encontre o Especialista Certo</h1>
          <p className="subtitle">Utilize a busca inteligente para encontrar profissionais que entendam a sua jornada.</p>
        </div>

        {/* FORMULÁRIO DE BUSCA DE VIDRO */}
        <form onSubmit={handleSearch} className="glass-panel-dashboard fade-in delay-1 search-form-glass">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon-inside" />
            <input
              type="text"
              placeholder="Pesquisar por nome do profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-premium"
            />
          </div>
          <div className="filters-group">
            <select value={especializacao} onChange={(e) => setEspecializacao(e.target.value)} className="filter-select-premium">
              <option value="">Todas as Especialidades</option>
              <option value="psicologia">Psicologia</option>
              <option value="terapia ocupacional">Terapia Ocupacional</option>
              <option value="psicopedagogia">Psicopedagogia</option>
              <option value="fonoaudiologia">Fonoaudiologia</option>
            </select>
            <input
              type="text"
              placeholder="Localização (Cidade/Estado)"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="filter-input-premium"
            />
            <select value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} className="filter-select-premium">
              <option value="">Disponibilidade</option>
              <option value="hoje">Hoje</option>
              <option value="esta semana">Esta Semana</option>
              <option value="online">Atendimento Online</option>
            </select>
            <button type="submit" className="btn-action-premium primary">
              Buscar
            </button>
          </div>
        </form>

        {/* LISTAGEM DE PROFISSIONAIS (CARDS LIPOASPIRADOS E TRAVADOS) */}
        <section className="professional-listing fade-in delay-2">
          {profissionais.length > 0 ? (
            <div className="professional-grid-premium">
              {profissionais.map(prof => (
                <div key={prof.id} className="professional-card-glass">
                  
                  {/* FOTO FIXA SEM ESTICAR */}
                  <div className="card-photo-container">
                    <img src={prof.foto} alt={prof.nome} className="card-photo-premium" />
                    <div className="card-rating-badge">
                      <FaStar className="star-icon" /> {prof.avaliacao}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3>{prof.nome}</h3>
                    <span className="badge-specialization-small">
                      <FaGraduationCap /> {prof.especializacao}
                    </span>
                    <span className="sub-specialization">Foco em: {prof.sub}</span>
                    
                    <div className="locations-wrapper">
                      {prof.localidades.map((loc, idx) => (
                        <span key={idx} className="location-pill">
                          <FaMapMarkerAlt /> {loc}
                        </span>
                      ))}
                    </div>
                    
                    <p className="professional-bio-short">{prof.bio.substring(0, 90)}...</p>
                  </div>

                  <div className="card-footer">
                    <button className="btn-action-premium secondary full-width" onClick={() => navigate(`/perfil-profissional/${prof.id}`)}>
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-glass">
              <p>Nenhum profissional encontrado com os critérios selecionados.</p>
              <button className="btn-action-premium secondary mt-3" onClick={() => { setSearchTerm(''); setEspecializacao(''); setLocalizacao(''); setDisponibilidade(''); setProfissionais(profissionais); }}>Limpar Filtros</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}