import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaUserCircle, FaSignOutAlt, FaArrowLeft, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/BuscarProfissionais.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png';

const API_PROFISSIONAIS = 'https://back-end-plataforma-teaxis.onrender.com/api/v1/profissionais';

export default function BuscarProfissionais() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Estados preenchidos estritamente pela API do banco Neon
  const [profissionais, setProfissionais] = useState([]);
  const [todosProfissionais, setTodosProfissionais] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState(false);

  const buscarProfissionaisDoBanco = async () => {
    try {
      setLoading(true);
      setErroApi(false);
      const response = await fetch(API_PROFISSIONAIS);
      
      if (response.ok) {
        const dados = await response.json();
        
        // Mapeia e trata os dados vindos puramente do banco Neon
        const listaTratada = dados.map(prof => {
          // Extrai a primeira especialidade caso venha como array, ou trata como string
          let espObtida = 'Especialista';
          if (Array.isArray(prof.especializacoes) && prof.especializacoes.length > 0) {
            espObtida = prof.especializacoes[0];
          } else if (prof.especializacao) {
            espObtida = prof.especializacao;
          }

          // Formata os focos/métodos de atendimento
          let subObtido = 'Métodos integrativos';
          if (Array.isArray(prof.metodosUtilizados) && prof.metodosUtilizados.length > 0) {
            subObtido = prof.metodosUtilizados.join(', ');
          } else if (prof.subEspecializacao) {
            subObtido = prof.subEspecializacao;
          }

          return {
            id: prof.id,
            nome: prof.nome || 'Profissional Cadastrado',
            especializacao: espObtida,
            sub: subObtido,
            avaliacao: prof.avaliacao || 5.0,
            // Fallback apenas para a imagem caso o registro não possua fotoUrl cadastrada
            foto: prof.fotoUrl || `https://randomuser.me/api/portraits/lego/${prof.id % 9}.jpg`,
            bio: prof.certificacoes || prof.bio || 'Profissional com registro ativo na plataforma TEAxis.',
            localidades: [
              prof.cidade && prof.estado ? `${prof.cidade} - ${prof.estado}` : 'Recife - PE',
              'Online'
            ]
          };
        });

        setProfissionais(listaTratada);
        setTodosProfissionais(listaTratada);
      } else {
        setErroApi(true);
      }
    } catch (error) {
      console.error('❌ Erro de conexão com a API Java:', error);
      setErroApi(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProfissionaisDoBanco();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = todosProfissionais.filter(prof => {
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

      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        <div className="search-hero-text fade-in">
          <h1>Encontre o Especialista Certo</h1>
          <p className="subtitle">Utilize a busca inteligente para encontrar profissionais que entendam a sua jornada.</p>
        </div>

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

        <section className="professional-listing fade-in delay-2">
          {loading ? (
            <div className="empty-state-glass">
              <p>Carregando especialistas cadastrados no banco...</p>
            </div>
          ) : erroApi ? (
            <div className="empty-state-glass">
              <p>Erro ao conectar com o servidor. Verifique se o back-end está ativo.</p>
            </div>
          ) : profissionais.length > 0 ? (
            <div className="professional-grid-premium">
              {profissionais.map(prof => (
                <div key={prof.id} className="professional-card-glass">
                  
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
                    
                    <p className="professional-bio-short">
                      {prof.bio && prof.bio.length > 90 ? `${prof.bio.substring(0, 90)}...` : prof.bio}
                    </p>
                  </div>

                  <div className="card-footer">
                    {/* Envia os dados completos pelo state para o perfil carregar sem precisar de requisições lentas */}
                    <button 
                      type="button" 
                      className="btn-action-premium secondary full-width" 
                      onClick={() => navigate(`/perfil-profissional/${prof.id}`, { state: { profissional: prof } })}
                    >
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-glass">
              <p>Nenhum profissional cadastrado encontrado no banco Neon.</p>
              <button type="button" className="btn-action-premium secondary mt-3" onClick={() => { setSearchTerm(''); setEspecializacao(''); setLocalizacao(''); setDisponibilidade(''); setProfissionais(todosProfissionais); }}>Limpar Filtros</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}