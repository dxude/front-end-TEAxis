import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, 
  FaCertificate, FaToolbox, FaCalendarAlt, FaSearch, 
  FaUserCircle, FaSignOutAlt, FaComments, FaBullseye, FaArrowLeft 
} from 'react-icons/fa';
import '../Styles/PerfilProfissionalDetalhado.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png'; 

export default function PerfilProfissionalDetalhado() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null); 
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');

  useEffect(() => {
    const simulatedProfessionals = [
      {
        id: 1,
        nome: 'Dra. Helena Costa',
        especializacao: 'Psicologia',
        subEspecializacoes: ['TDAH', 'Ansiedade', 'Terapia Cognitivo-Comportamental'],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 78,
        foto: 'https://randomuser.me/api/portraits/women/68.jpg', 
        bio: 'Especialista em TDAH e ansiedade, com foco em adolescentes e adultos. Ajudo a desenvolver estratégias de enfrentamento e melhorar a qualidade de vida. Atendimento online e presencial em São Paulo.',
        contato: {
          telefone: '(11) 98765-4321',
          email: 'helena.costa@email.com',
          site: 'https://www.helenacosta.com.br'
        },
        localidades: ['São Paulo - SP', 'Online'],
        certificacoes: [
          'CRP 123456',
          'Pós-graduação em Neuropsicologia - USP',
          'Especialização em TCC - PUC'
        ],
        metodos: [
          'Terapia Cognitivo-Comportamental (TCC)',
          'Mindfulness',
          'Orientação Parental'
        ],
        avaliacoes: [
          { id: 101, usuario: 'Paciente A', nota: 5, comentario: 'Dra. Helena é incrível! Super atenciosa e me ajudou muito com a ansiedade.' },
          { id: 102, usuario: 'Paciente B', nota: 4, comentario: 'Profissional competente, mas os horários são um pouco difíceis.' },
          { id: 103, usuario: 'Paciente C', nota: 5, comentario: 'Minha filha se adaptou super bem. Recomendo!' },
        ]
      },
      {
        id: 2,
        nome: 'Dr. Lucas Ribeiro',
        especializacao: 'Terapia Ocupacional',
        subEspecializacoes: ['TEA', 'Desenvolvimento Infantil', 'Integração Sensorial'],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 55,
        foto: 'https://randomuser.me/api/portraits/men/82.jpg',
        bio: 'Terapeuta ocupacional com vasta experiência em TEA e desenvolvimento infantil. Ajudo crianças a desenvolverem autonomia e habilidades essenciais, utilizando abordagens lúdicas e eficazes.',
        contato: {
          telefone: '(21) 91234-5678',
          email: 'lucas.ribeiro@email.com',
          site: null
        },
        localidades: ['Rio de Janeiro - RJ', 'Online'],
        certificacoes: [
          'CREFITO 789012',
          'Mestrado em Terapia Ocupacional - UFRJ'
        ],
        metodos: [
          'Integração Sensorial',
          'Análise do Comportamento Aplicada (ABA)',
          'Brincadeiras Terapêuticas'
        ],
        avaliacoes: [
          { id: 201, usuario: 'Paciente D', nota: 5, comentario: 'Excelente profissional! Meu filho evoluiu muito.' },
          { id: 202, usuario: 'Paciente E', nota: 4, comentario: 'Bom terapeuta, pontual.' },
        ]
      },
    ];
    setProfessional(simulatedProfessionals.find(p => p.id === parseInt(id)));
  }, [id]); 

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!userRating || !userReviewText) {
      alert('Por favor, dê uma nota e escreva seu comentário.');
      return;
    }
    console.log('Avaliação submetida:', { profissionalId: professional.id, userRating, userReviewText });
    alert('Sua avaliação foi enviada com sucesso!');
    setUserRating(0);
    setUserReviewText('');
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  if (!professional) {
    return (
      <div className="perfil-profissional-container">
        <header className="perfil-profissional-header">
          <div className="header-left">
            <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
          </div>
          <nav className="header-nav">
            <Link to="/buscar-profissionais" className="nav-link"><FaSearch className="nav-icon" /> Buscar Profissionais</Link>
          </nav>
        </header>
        <main className="professional-detail-content loading-content">
          <div className="spinner"></div>
          <p>Carregando perfil do especialista...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="perfil-profissional-container">
      {/* Header Padronizado */}
      <header className="perfil-profissional-header">
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

      <main className="professional-detail-content">
        {/* Link Voltar sutil */}
        <button onClick={() => navigate(-1)} className="btn-back-navigation">
          <FaArrowLeft /> Voltar para a busca
        </button>

        <div className="profile-layout-grid">
          
          <aside className="profile-sidebar-card">
            <div className="avatar-frame">
              <img src={professional.foto} alt={professional.nome} className="sidebar-photo" />
            </div>
            
            <h1 className="sidebar-name">{professional.nome}</h1>
            <p className="sidebar-specialization">{professional.especializacao}</p>
            
            <div className="sidebar-rating-badge">
              <FaStar className="star-active" />
              <span className="rating-score">{professional.avaliacaoMedia}</span>
              <span className="rating-count">({professional.totalAvaliacoes} avaliações)</span>
            </div>

            <hr className="divider" />

            <div className="sidebar-contact-list">
              <h3>Informações de Contato</h3>
              {professional.contato.telefone && (
                <div className="contact-item"><FaPhone className="c-icon" /> <span>{professional.contato.telefone}</span></div>
              )}
              {professional.contato.email && (
                <div className="contact-item"><FaEnvelope className="c-icon" /> <span>{professional.contato.email}</span></div>
              )}
              {professional.contato.site && (
                <div className="contact-item">
                  <FaGlobe className="c-icon" /> 
                  <a href={professional.contato.site} target="_blank" rel="noopener noreferrer">
                    {professional.contato.site.replace('https://', '')}
                  </a>
                </div>
              )}
              <div className="contact-item">
                <FaMapMarkerAlt className="c-icon" /> 
                <span>{professional.localidades.join(' • ')}</span>
              </div>
            </div>

            <div className="sidebar-actions">
              <button className="btn-action-primary" onClick={() => alert('Agendamento de consulta iniciado!')}>
                <FaCalendarAlt /> Agendar Consulta
              </button>
              <button className="btn-action-secondary" onClick={() => navigate('/mensagens')}>
                <FaComments /> Enviar Mensagem
              </button>
            </div>
          </aside>

          
          <div className="profile-main-details">
            
        
            <section className="details-block-card">
              <h2>Sobre o Profissional</h2>
              <p className="detailed-bio">{professional.bio}</p>
            </section>

            <section className="details-block-card">
              <h2>Atuação e Competências</h2>
              <div className="technical-info-grid">
                
                <div className="sub-info-card">
                  <h3><FaCertificate className="card-title-icon" /> Certificações</h3>
                  <ul>
                    {professional.certificacoes.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>

                <div className="sub-info-card">
                  <h3><FaToolbox className="card-title-icon" /> Métodos & Abordagens</h3>
                  <div className="tags-flex-container">
                    {professional.metodos.map((metodo, index) => (
                      <span key={index} className="pill-tag-style">{metodo}</span>
                    ))}
                  </div>
                </div>

                <div className="sub-info-card">
                  <h3><FaBullseye className="card-title-icon" /> Foco de Especialidade</h3>
                  <div className="tags-flex-container">
                    {professional.subEspecializacoes.map((sub, index) => (
                      <span key={index} className="pill-tag-style secondary-color">{sub}</span>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            <section className="details-block-card generic-padding">
              <h2>Avaliações de Pacientes</h2>
              
              {professional.avaliacoes.length > 0 ? (
                <div className="reviews-stack-container">
                  {professional.avaliacoes.map(avaliacao => (
                    <div key={avaliacao.id} className="patient-review-tile">
                      <div className="review-tile-top">
                        <span className="patient-anonymous-name">{avaliacao.usuario}</span>
                        <div className="tile-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < avaliacao.nota ? 'star-tile filled' : 'star-tile'} />
                          ))}
                        </div>
                      </div>
                      <p className="patient-text-comment">"{avaliacao.comentario}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state-text">Este profissional ainda não possui avaliações cadastradas.</p>
              )}

              {/* Formulário Embutido de Nova Review */}
              <div className="interactive-review-box">
                <h3>Como foi sua experiência com este especialista?</h3>
                <form onSubmit={handleSubmitReview} className="form-inner-layout">
                  <div className="star-picker-wrapper">
                    <span className="label-rating">Sua nota:</span>
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < userRating ? 'star-interactive picked' : 'star-interactive'}
                          onClick={() => handleRatingChange(i + 1)}
                        />
                      ))}
                    </div>
                    <span className="rating-hint-text">
                      {userRating > 0 ? `${userRating} de 5 estrelas` : 'Toque nas estrelas'}
                    </span>
                  </div>
                  
                  <textarea
                    placeholder="Deixe um depoimento construtivo sobre o atendimento recebido..."
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                    rows="3"
                    required
                  ></textarea>
                  
                  <button type="submit" className="btn-submit-review">Publicar Avaliação</button>
                </form>
              </div>

            </section>

          </div>
        </div>
      </main>
    </div>
  );
}