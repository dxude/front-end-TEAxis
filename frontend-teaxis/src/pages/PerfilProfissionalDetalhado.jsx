import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCertificate, FaToolbox, FaCalendarAlt, FaSearch, FaUserCircle, FaSignOutAlt, FaComments, FaBullseye } from 'react-icons/fa';
import '../Styles/PerfilProfissionalDetalhado.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png'; 

export default function PerfilProfissionalDetalhado() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null); // Inicia como null para indicar carregamento
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
        foto: 'https://randomuser.me/api/portraits/women/68.jpg', // URL de exemplo
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
  }, [id]); // Dependência 'id' para recarregar se o ID mudar

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
        <main className="professional-detail-content loading-content">
          <p>Carregando perfil do profissional...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="perfil-profissional-container">
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
        <section className="professional-overview-card">
          <div className="overview-header">
            <img src={professional.foto} alt={professional.nome} className="professional-detail-photo" />
            <div className="overview-info">
              <h1>{professional.nome}</h1>
              <p className="main-specialization">{professional.especializacao}</p>
              <div className="rating-full">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(professional.avaliacaoMedia) ? 'star-full filled' : 'star-full'} />
                ))}
                <span>({professional.avaliacaoMedia}) ({professional.totalAvaliacoes} avaliações)</span>
              </div>
              <p className="bio">{professional.bio}</p>
              <div className="contact-info">
                {professional.contato.telefone && <p><FaPhone /> {professional.contato.telefone}</p>}
                {professional.contato.email && <p><FaEnvelope /> {professional.contato.email}</p>}
                {professional.contato.site && <p><FaGlobe /> <a href={professional.contato.site} target="_blank" rel="noopener noreferrer">{professional.contato.site.replace('https://', '')}</a></p>}
                <p><FaMapMarkerAlt /> {professional.localidades.join(', ')}</p>
              </div>
            </div>
          </div>
          <div className="overview-actions">
            <button className="btn-primary" onClick={() => alert('Agendamento de consulta iniciado!')}>
              <FaCalendarAlt /> Agendar Consulta
            </button>
            <button className="btn-secondary" onClick={() => navigate('/mensagens')}>
              <FaComments /> Enviar Mensagem
            </button>
          </div>
        </section>

        <section className="professional-details-section">
          <h2>Mais Detalhes</h2>
          <div className="details-grid">
            <div className="details-card">
              <h3><FaCertificate /> Certificações</h3>
              <ul>
                {professional.certificacoes.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
            <div className="details-card">
              <h3><FaToolbox /> Métodos e Abordagens</h3>
              <ul>
                {professional.metodos.map((metodo, index) => (
                  <li key={index}>{metodo}</li>
                ))}
              </ul>
            </div>
            <div className="details-card">
              <h3><FaBullseye /> Especializações Secundárias</h3>
              <ul>
                {professional.subEspecializacoes.map((sub, index) => (
                  <li key={index}>{sub}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="professional-evaluations-section">
          <h2>Avaliações de Usuários</h2>
          {professional.avaliacoes.length > 0 ? (
            <div className="evaluations-list">
              {professional.avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="evaluation-card">
                  <div className="evaluation-header">
                    <span className="evaluation-user">{avaliacao.usuario}</span>
                    <div className="evaluation-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < avaliacao.nota ? 'star-full filled' : 'star-full'} />
                      ))}
                    </div>
                  </div>
                  <p className="evaluation-comment">{avaliacao.comentario}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-evaluations-message">Este profissional ainda não possui avaliações.</p>
          )}

          <div className="submit-evaluation-form">
            <h3>Deixe sua Avaliação</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="rating-input">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < userRating ? 'star-input filled' : 'star-input'}
                    onClick={() => handleRatingChange(i + 1)}
                  />
                ))}
                <span>{userRating > 0 ? `${userRating} Estrelas` : 'Clique para avaliar'}</span>
              </div>
              <textarea
                placeholder="Escreva seu comentário..."
                value={userReviewText}
                onChange={(e) => setUserReviewText(e.target.value)}
                rows="4"
                required
              ></textarea>
              <button type="submit" className="btn-primary">Enviar Avaliação</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}