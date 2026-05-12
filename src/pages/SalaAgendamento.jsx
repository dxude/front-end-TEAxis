import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/MeusAgendamentos.css';

export default function SalaAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const linkSala = `https://meet.example.com/consulta-${id}`;

  return (
    <div className="meus-agendamentos-container">
      <main className="agendamentos-main-content">
        <h1>Sala do Agendamento</h1>
        <p>Você está prestes a entrar na sala do agendamento #{id}. Clique abaixo para entrar na consulta.</p>
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => window.open(linkSala, '_blank')}>Entrar na sala</button>
          <button className="btn-secondary" onClick={() => navigate('/meus-agendamentos')}>Voltar para Meus Agendamentos</button>
        </div>
      </main>
    </div>
  );
}
