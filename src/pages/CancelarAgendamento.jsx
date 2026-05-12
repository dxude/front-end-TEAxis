import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/MeusAgendamentos.css';

export default function CancelarAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleConfirmCancel = () => {
    alert('Agendamento cancelado com sucesso!');
    navigate('/meus-agendamentos');
  };

  return (
    <div className="meus-agendamentos-container">
      <main className="agendamentos-main-content">
        <h1>Cancelar Agendamento</h1>
        <p>Você está cancelando o agendamento #{id}. Confirme abaixo para concluir o cancelamento.</p>
        <div className="action-buttons">
          <button className="btn-danger" onClick={handleConfirmCancel}>Confirmar cancelamento</button>
          <button className="btn-secondary" onClick={() => navigate('/meus-agendamentos')}>Voltar para Meus Agendamentos</button>
        </div>
      </main>
    </div>
  );
}
