import React from 'react';
import '../Styles/BookingModal.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function BookingModal({ open, onClose, onConfirm, professional, date = '25/07/2025', time = '11:00' }) {
  if (!open) return null;

  return (
    <div className="booking-overlay" role="dialog" aria-modal="true">
      <div className="booking-modal glass-panel">
        <header className="booking-header">
          <img src={logoTeaxis} alt="TEAxis" className="booking-logo" />
          <h3>Confirmar Agendamento</h3>
        </header>

        <div className="booking-body">
          <div className="professional-row">
            <img src={professional?.foto || ''} alt={professional?.nome || 'Profissional'} className="professional-photo" />
            <div>
              <strong className="professional-name">{professional?.nome || 'Profissional'}</strong>
              <div className="professional-meta">{professional?.especializacao || ''}</div>
            </div>
          </div>

          <div className="booking-info">
            <div className="info-item">
              <label>Data</label>
              <div className="info-value">{date}</div>
            </div>
            <div className="info-item">
              <label>Hora</label>
              <div className="info-value">{time}</div>
            </div>
            <div className="info-item">
              <label>Local</label>
              <div className="info-value">Online / Presencial</div>
            </div>
          </div>

          <p className="booking-note">Um lembrete será adicionado ao seu painel. Você poderá cancelar ou remarcar posteriormente.</p>
        </div>

        <footer className="booking-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirmar Agendamento</button>
        </footer>
      </div>
    </div>
  );
}
