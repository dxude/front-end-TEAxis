import React, { useState } from 'react';
import { FaStar, FaSearch, FaCalendarAlt, FaBookOpen, FaBullseye, FaUserCircle, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../Styles/AvaliarProfissional.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png';

const ratingLabels = {
  1: '1 - Ruim',
  2: '2 - Razoável',
  3: '3 - Satisfatório',
  4: '4 - Bom',
  5: '5 - Atendeu todas as expectativas'
};

export default function AvaliarProfissional() {
  const navigate = useNavigate();
  const { idProfissional } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      setError('Selecione uma avaliação por estrelas antes de enviar.');
      setMessage('');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Escreva um comentário com pelo menos 10 caracteres.');
      setMessage('');
      return;
    }

    setError('');
    setMessage('Obrigado! Sua avaliação foi registrada com sucesso.');

    // Simulação de envio
    console.log({ idProfissional, rating, comment });
  };

  return (
    <div className="avaliar-page-container">
      
      {/* NAVBAR DE VIDRO PREMIUM (IDÊNTICA A BUSCARESPECIALISTA) */}
      <header className="avaliar-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoPlataforma} alt="Logo" className="header-logo-small" />
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
          <Link to="/minhas-metas" className="nav-link-glass">
            <FaBullseye className="nav-icon" /> Metas
          </Link>
          <Link to="/perfil" className="nav-link-glass">
            <FaUserCircle className="nav-icon" /> Perfil
          </Link>
          <button onClick={() => navigate('/login')} className="nav-link-glass logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      {/* BACKGROUND DECORATIVO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="avaliar-page-content">
        <div className="avaliar-panel-premium">
          <div className="avaliar-hero">
            <h1>Avalie sua consulta</h1>
            <p>Sua opinião é fundamental. Compartilhe sua experiência com o profissional #{idProfissional} para ajudar a aprimorar o atendimento.</p>
            <div className="avaliar-summary">
              <span className="tag">Experiência real</span>
              <span className="tag">Feedback claro</span>
            </div>
          </div>

          <div className="avaliar-card">
            <div className="avaliar-intro-text">
              <h2>Como foi o atendimento?</h2>
              <p>Classifique sua experiência e deixe um comentário sincero sobre os pontos positivos e o que pode ser melhorado.</p>
            </div>

            {message && <div className="success-banner">{message}</div>}
            {error && <div className="error-banner">{error}</div>}

            <div className="rating-grid">
              <div className="rating-input" role="radiogroup" aria-label="Avaliação por estrelas">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star-button ${value <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${ratingLabels[value]}`}
                  >
                    <FaStar />
                  </button>
                ))}
                <span className="rating-description">
                  {rating > 0 ? ratingLabels[rating] : 'Selecione até 5 estrelas.'}
                </span>
              </div>

              <div className="rating-guidance">
                <p>O que cada estrela significa?</p>
                <ul>
                  <li><strong>1 a 2 estrelas:</strong> Atendimento deixou a desejar.</li>
                  <li><strong>3 estrelas:</strong> Atendimento satisfatório.</li>
                  <li><strong>4 a 5 estrelas:</strong> Bom a excelente, superou expectativas!</li>
                </ul>
              </div>
            </div>

            <div className="comment-card">
              <label htmlFor="comment">Seu comentário detalhado</label>
              <textarea
                id="comment"
                placeholder="Conte como foi o atendimento, se o profissional foi atencioso e se a sessão atendeu suas necessidades..."
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>

            <div className="avaliar-actions">
              <button className="btn-secondary" type="button" onClick={() => navigate('/meus-agendamentos')}>
                Cancelar
              </button>
              <button className="btn-primary-modern" type="button" onClick={handleSubmit}>
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}