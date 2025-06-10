import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaUserCircle, FaSignOutAlt, FaHome, FaBullseye } from 'react-icons/fa';
import '../Styles/BuscarProfissionais.css'; 
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function BuscarProfissionais() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');

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
      especializacao: 'Terapia Ocupacional (TEA, Desenvolvimento Infantil)',
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
      especializacao: 'Psicopedagogia (Dislexia, Dificuldades de Aprendizagem)',
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
      // Disponibilidade exigiria mais lógica (data picker, horários), aqui é apenas um placeholder
      return matchesSearchTerm && matchesEspecializacao && matchesLocalizacao;
    });
    setProfissionais(filtered);
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="buscar-profissionais-container">
      {/* Top Bar de Navegação Interna */}
      <header className="buscar-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
          <Link to="/buscar-profissionais" className="nav-link active">
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

      <main className="search-main-content">
        <h1>Encontre o Especialista Certo para Você</h1>
        <p className="subtitle">Utilize a busca e os filtros para encontrar profissionais que entendam suas necessidades.</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Pesquisar por nome do profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filters-group">
            <select value={especializacao} onChange={(e) => setEspecializacao(e.target.value)} className="filter-select">
              <option value="">Especialização</option>
              <option value="psicologia">Psicologia</option>
              <option value="terapia ocupacional">Terapia Ocupacional</option>
              <option value="psicopedagogia">Psicopedagogia</option>
              <option value="fonoaudiologia">Fonoaudiologia</option>
              <option value="tdah">TDAH</option>
              <option value="tea">TEA</option>
              <option value="ansiedade">Ansiedade</option>
              <option value="dislexia">Dislexia</option>
            </select>
            <input
              type="text"
              placeholder="Localização (Cidade/Estado)"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="filter-input"
            />
            <select value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} className="filter-select">
              <option value="">Disponibilidade</option>
              <option value="hoje">Hoje</option>
              <option value="esta semana">Esta Semana</option>
              <option value="online">Online</option>
            </select>
            <button type="submit" className="search-button">
              <FaSearch /> Buscar
            </button>
          </div>
        </form>

        {/* Listagem de Profissionais */}
        <section className="professional-listing">
          {profissionais.length > 0 ? (
            <div className="professional-grid">
              {profissionais.map(prof => (
                <div key={prof.id} className="professional-card">
                  <div className="card-header">
                    <img src={prof.foto} alt={prof.nome} className="professional-photo" />
                    <div className="professional-info">
                      <h3>{prof.nome}</h3>
                      <p className="specialization">{prof.especializacao}</p>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(prof.avaliacao) ? 'star filled' : 'star'} />
                        ))}
                        <span>({prof.avaliacao})</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-view-profile" onClick={() => navigate(`/perfil-profissional/${prof.id}`)}>Ver Perfil</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results-message">Nenhum profissional encontrado com os critérios de busca.</p>
          )}
        </section>
      </main>
    </div>
  );
}