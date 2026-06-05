import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCertificate, FaToolbox, FaCalendarAlt, FaSearch, FaUserCircle, FaSignOutAlt, FaComments, FaBullseye, FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/PerfilProfissionalDetalhado.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos, salvarAgendamentos } from '../utils/dataSync';
import BookingModal from '../components/BookingModal';

export default function PerfilProfissionalDetalhado() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

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
    alert('Sua avaliação foi enviada com sucesso!');
    setUserRating(0);
    setUserReviewText('');
  };

  const handleAgendarConsulta = () => {
    setBookingOpen(true);
  };

  const handleConfirmBooking = () => {
    const userEmail = localStorage.getItem('user_email') || 'Usuário';
    const agendaAtual = carregarAgendamentos();
    const novoId = agendaAtual.length > 0 ? Math.max(...agendaAtual.map(item => item.id)) + 1 : 1;
    const novaConsulta = {
      id: novoId,
      profissional: professional.nome,
      idProfissional: professional.id,
      cliente: userEmail,
      fromRole: 'usuario',
      toRole: 'profissional',
      data: '25/07/2025',
      hora: '11:00',
      status: 'Confirmado'
    };
    salvarAgendamentos([novaConsulta, ...agendaAtual]);
    setBookingOpen(false);
    alert('Consulta agendada com sucesso! Verifique em Meus Agendamentos.');
    navigate('/meus-agendamentos');
  };

  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.dispatchEvent(new Event('teaxis:auth_changed'));
    }
    setShowLogoutModal(false);
    navigate('/login');
  };

  const NavbarGlass = () => (
    <header className="header-glass-premium">
      <div className="header-left">
        <Link to="/dashboard-usuario" className="back-to-space-btn">
          <FaArrowLeft className="back-icon" /> Voltar
        </Link>
        <img src={logoPlataforma} alt="Logo" className="header-logo-small" />
      </div>
      <nav className="header-nav-glass">
        <Link to="/buscar-profissionais" className="nav-link-glass"><FaSearch /> Buscar</Link>
        <Link to="/meus-agendamentos" className="nav-link-glass"><FaCalendarAlt /> Agendamentos</Link>
        <Link to="/minhas-trilhas" className="nav-link-glass"><FaBookOpen /> Trilhas</Link>
        <Link to="/perfil" className="nav-link-glass"><FaUserCircle /> Perfil</Link>
        <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn"><FaSignOutAlt /> Sair</button>
      </nav>
    </header>
  );

  if (!professional) {
    return (
      <div className="perfil-page-premium">
        <NavbarGlass />
        <main className="main-content-glass loading-content">
          <p>Carregando perfil do profissional...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="perfil-page-premium">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      <NavbarGlass />

      {/* BACKGROUND DECORATIVO ANIMADO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="main-content-glass">
        
        {/* CABEÇALHO DO PERFIL */}
        <section className="glass-panel-dashboard fade-in profile-overview">
          <div className="profile-header-grid">
            <div className="profile-photo-wrapper">
              <img src={professional.foto} alt={professional.nome} className="professional-photo-premium" />
              <div className="rating-badge">
                <FaStar className="star-icon" /> {professional.avaliacaoMedia}
              </div>
            </div>
            
            <div className="profile-main-info">
              <h1>{professional.nome}</h1>
              <span className="badge-specialization">{professional.especializacao}</span>
              <p className="bio-premium">{professional.bio}</p>
              
              <div className="contact-grid">
                {professional.contato.telefone && <span><FaPhone className="text-primary"/> {professional.contato.telefone}</span>}
                {professional.contato.email && <span><FaEnvelope className="text-primary"/> {professional.contato.email}</span>}
                <span><FaMapMarkerAlt className="text-primary"/> {professional.localidades.join(', ')}</span>
                {professional.contato.site && <span><FaGlobe className="text-primary"/> <a href={professional.contato.site} target="_blank" rel="noopener noreferrer">Website</a></span>}
              </div>
            </div>

            <div className="profile-actions-box">
              <p className="action-hint">Pronto para dar o próximo passo?</p>
              <button className="btn-action-premium primary full-width" onClick={handleAgendarConsulta}>
                <FaCalendarAlt /> Agendar Consulta
              </button>
              <button className="btn-action-premium secondary full-width mt-3" onClick={() => navigate('/mensagens')}>
                <FaComments /> Enviar Mensagem
              </button>
            </div>
          </div>
        </section>

        {/* DETALHES TÉCNICOS */}
        <section className="fade-in delay-1">
          <h2 className="section-title-premium">Conheça o Trabalho</h2>
          <div className="details-grid-premium">
            <div className="glass-panel-dashboard details-card-glass">
              <div className="icon-wrapper"><FaCertificate /></div>
              <h3>Certificações</h3>
              <ul>
                {professional.certificacoes.map((cert, index) => <li key={index}>{cert}</li>)}
              </ul>
            </div>
            <div className="glass-panel-dashboard details-card-glass">
              <div className="icon-wrapper"><FaToolbox /></div>
              <h3>Métodos e Abordagens</h3>
              <ul>
                {professional.metodos.map((metodo, index) => <li key={index}>{metodo}</li>)}
              </ul>
            </div>
            <div className="glass-panel-dashboard details-card-glass">
              <div className="icon-wrapper"><FaBullseye /></div>
              <h3>Sub-especializações</h3>
              <div className="tags-container">
                {professional.subEspecializacoes.map((sub, index) => <span key={index} className="tag-pill">{sub}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* AVALIAÇÕES */}
        <section className="glass-panel-dashboard fade-in delay-2 evaluations-section">
          <h2 className="section-title-premium text-center">Avaliações de Pacientes</h2>
          <p className="text-center text-muted mb-4">Baseado em {professional.totalAvaliacoes} avaliações.</p>
          
          {professional.avaliacoes.length > 0 ? (
            <div className="evaluations-grid">
              {professional.avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="evaluation-card-glass">
                  <div className="eval-header">
                    <strong>{avaliacao.usuario}</strong>
                    <div className="eval-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < avaliacao.nota ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                  </div>
                  <p>"{avaliacao.comentario}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state-glass">Este profissional ainda não possui avaliações.</p>
          )}

          <div className="submit-review-box">
            <h3>Como foi sua experiência?</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="rating-selector">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < userRating ? 'star-input filled' : 'star-input'}
                    onClick={() => handleRatingChange(i + 1)}
                  />
                ))}
                <span className="rating-hint">{userRating > 0 ? `${userRating} Estrelas` : 'Selecione uma nota'}</span>
              </div>
              <textarea
                className="review-textarea"
                placeholder="Compartilhe como o profissional ajudou você ou sua família..."
                value={userReviewText}
                onChange={(e) => setUserReviewText(e.target.value)}
                rows="3"
                required
              />
              <button type="submit" className="btn-action-premium primary mt-3">Enviar Avaliação</button>
            </form>
          </div>
        </section>
      </main>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} onConfirm={handleConfirmBooking} professional={professional} />
    </div>
  );
}