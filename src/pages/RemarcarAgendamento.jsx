import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/MeusAgendamentos.css';

export default function RemarcarAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="meus-agendamentos-container">
      <main className="agendamentos-main-content">
        <h1>Remarcar Agendamento</h1>
        <p>Escolha uma nova data e horário para o agendamento #{id}. Você pode confirmar a alteração ou voltar para a lista de agendamentos.</p>
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => alert('Simulação: página de remarcação carregada.')}>Selecionar nova data</button>
          <button className="btn-secondary" onClick={() => navigate('/meus-agendamentos')}>Voltar para Meus Agendamentos</button>
        </div>
      </main>
    </div>
  );
}
