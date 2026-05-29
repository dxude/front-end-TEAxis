import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaUserCircle, FaSignOutAlt, FaArrowLeft, FaGraduationCap } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/BuscarProfissionais.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

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
    setShowLogoutModal(false);
    navigate('/login');
  };

  const [profissionais, setProfissionais] = useState([
    {
      id: 1,
      nome: 'Dra. Helena Costa',
      especializacao: 'Psicologia (TDAH, Ansiedade)',
      avaliacao: 4.9,
      foto: 'https://randomuser.me/api/portraits/women/68.jpg', 
      metodos: ['Terapia Cognitivo-Comportamental', 'Mindfulness'],
      certificacoes: ['CRP 123456', 'Pós-graduação em Neuropsicologia'],
      bio: 'Especialista em TDAH e ansiedade, com foco em adolescentes e adultos. Atendimento online e presencial em São Paulo.',
      localidades: ['São Paulo - SP', 'Online']
    },
    {
      id: 2,
      nome: 'Dr. Lucas Ribeiro',
      especializacao: 'Terapia Ocupacional (TEA, Infantil)',
      avaliacao: 4.7,
      foto: 'https://randomuser.me/api/portraits/men/82.jpg',
      metodos: ['Integração Sensorial', 'ABA'],
      certificacoes: ['CREFITO 789012'],
      bio: 'Terapeuta ocupacional com vasta experiência em TEA e desenvolvimento infantil. Ajudo crianças a desenvolverem autonomia e habilidades essenciais.',
      localidades: ['Rio de Janeiro - RJ', 'Online']
    },
    {
      id: 3,
      nome: 'Dra. Mariana Santos',
      especializacao: 'Psicopedagogia (Dislexia)',
      avaliacao: 4.8,
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      metodos: ['Avaliação Psicopedagógica', 'Intervenção Neurocognitiva'],
      certificacoes: ['ABP 34567'],
      bio: 'Psicopedagoga especializada em dislexia e transtornos de aprendizagem. Trabalho com estratégias individualizadas para o sucesso escolar.',
      localidades: ['Belo Horizonte - MG', 'Online']
    },
    {
      id: 4,
      nome: 'Dr. Carlos Lima',
      especializacao: 'Fonoaudiologia (TEA, Linguagem)',
      avaliacao: 4.6,
      foto: 'https://randomuser.me/api/portraits/men/7.jpg',
      metodos: ['Terapia da Linguagem', 'Comunicação Alternativa'],
      certificacoes: ['CRFA 987654'],
      bio: 'Fonoaudiólogo com experiência em desenvolvimento da comunicação e linguagem em crianças com TEA. Atendimento humanizado e focado nas necessidades individuais.',
      localidades: ['Online']
    },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', { searchTerm, especializacao, localizacao, disponibilidade });

    const filtered = profissionais.filter(prof => {
      const matchesSearchTerm = searchTerm ? prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesEspecializacao = especializacao ? prof.especializacao.toLowerCase().includes(especializacao.toLowerCase()) : true;
      const matchesLocalizacao = localizacao ? prof.localidades.some(loc => loc.toLowerCase().includes(localizacao.toLowerCase())) : true;
      return matchesSearchTerm && matchesEspecializacao && matchesLocalizacao;
    });
    setProfissionais(filtered);
  };

  return (
    <div className="buscar-profissionais-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      {/* HEADER DE VIDRO */}
      <header className="buscar-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass active">
            <FaSearch className="nav-icon" /> Buscar
          </Link>
          <Link to="/meus-agendamentos" className="nav-link-glass">
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

      <main className="search-main-content">
        <div className="search-hero-text">
          <h1>Encontre o Especialista Certo</h1>
          <p className="subtitle">Utilize a busca inteligente para encontrar profissionais que entendam a sua jornada.</p>
        </div>

        {/* FORMULÁRIO DE BUSCA GLASSMORPHISM */}
        <form onSubmit={handleSearch} className="search-form-glass">
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
              <option value="tdah">Foco em TDAH</option>
              <option value="tea">Foco em TEA</option>
              <option value="ansiedade">Ansiedade</option>
              <option value="dislexia">Dislexia</option>
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
            <button type="submit" className="btn-moderno-primary search-btn-submit">
              Buscar
            </button>
          </div>
        </form>

        {/* LISTAGEM DE PROFISSIONAIS */}
        <section className="professional-listing">
          {profissionais.length > 0 ? (
            <div className="professional-grid">
              {profissionais.map(prof => (
                <div key={prof.id} className="professional-card-premium">
                  <div className="card-top">
                    <img src={prof.foto} alt={prof.nome} className="professional-photo-premium" />
                    <div className="rating-badge">
                      <FaStar className="star-icon" /> {prof.avaliacao}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3>{prof.nome}</h3>
                    <div className="specialty-tag">
                      <FaGraduationCap /> {prof.especializacao}
                    </div>
                    
                    <div className="locations-wrapper">
                      {prof.localidades.map((loc, idx) => (
                        <span key={idx} className="location-pill">
                          <FaMapMarkerAlt /> {loc}
                        </span>
                      ))}
                    </div>
                    
                    <p className="professional-bio-short">{prof.bio.substring(0, 100)}...</p>
                  </div>

                  <div className="card-footer">
                    <button className="btn-view-profile-premium" onClick={() => navigate(`/perfil-profissional/${prof.id}`)}>
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-glass">
              <p>Nenhum profissional encontrado com os critérios selecionados.</p>
              <button className="btn-secondary" onClick={() => { setSearchTerm(''); setEspecializacao(''); setLocalizacao(''); setDisponibilidade(''); setProfissionais(profissionais); }}>Limpar Filtros</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}