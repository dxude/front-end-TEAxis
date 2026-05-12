import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/MeusAgendamentos.css';
import '../Styles/AvaliarProfissional.css';

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

    // Simulação de envio de avaliação
    console.log({ idProfissional, rating, comment });
  };

  return (
    <div className="avaliar-page-container">
      <main className="avaliar-page-content">
        <div className="avaliar-panel">
          <div className="avaliar-hero">
            <h1>Avalie sua consulta</h1>
            <p>Compartilhe sua experiência com o profissional #{idProfissional} para ajudar a melhorar o atendimento e orientar outros pacientes.</p>
            <div className="avaliar-summary">
              <span className="tag">Experiência real</span>
              <span className="tag">Feedback claro</span>
            </div>
          </div>

          <div className="avaliar-card">
            <div>
              <h2>Como foi a sua consulta?</h2>
              <p>Use as estrelas para classificar o atendimento e escreva um comentário sincero sobre os pontos positivos e o que pode ser melhorado.</p>
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
                  {rating > 0 ? ratingLabels[rating] : 'Selecione até 5 estrelas para avaliar a consulta.'}
                </span>
              </div>

              <div className="rating-guidance">
                <p>O que cada estrela significa?</p>
                <ul>
                  <li>1 estrela: Atendimento ruim</li>
                  <li>2 estrelas: Atendimento razoável</li>
                  <li>3 estrelas: Atendimento satisfatório</li>
                  <li>4 estrelas: Atendimento bom</li>
                  <li>5 estrelas: Superou expectativas</li>
                </ul>
              </div>
            </div>

            <div className="comment-card">
              <label htmlFor="comment">Comentário sobre a consulta</label>
              <textarea
                id="comment"
                placeholder="Conte como foi o atendimento, se o profissional foi atencioso e se a sessão atendeu suas necessidades."
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>

            <div className="avaliar-actions">
              <button className="btn-primary" type="button" onClick={handleSubmit}>
                Enviar avaliação
              </button>
              <button className="btn-secondary" type="button" onClick={() => navigate('/meus-agendamentos')}>
                Voltar para Meus Agendamentos
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
