import React from 'react';
import { FaSignOutAlt, FaRocket, FaTimes } from 'react-icons/fa';
import '../Styles/LogoutModal.css';

export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="logout-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
      <div className="logout-modal-card">
        <div className="logout-modal-top">
          <div className="logout-modal-badge">
            <FaSignOutAlt />
          </div>
          <div>
            <h2 id="logout-modal-title">Você está saindo do seu Espaço TEAxis</h2>
            <p>Esperamos você de volta em breve. Seu ambiente está seguro e pronto para continuar onde parou.</p>
          </div>
        </div>

        <div className="logout-modal-actions">
          <button className="logout-modal-button logout-modal-cancel" onClick={onClose}>
            <FaTimes /> Cancelar
          </button>
          <button className="logout-modal-button logout-modal-confirm" onClick={onConfirm}>
            <FaRocket /> Sair e voltar
          </button>
        </div>
      </div>
    </div>
  );
}
