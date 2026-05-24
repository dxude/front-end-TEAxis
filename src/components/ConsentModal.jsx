import React from 'react';

const ConsentModal = ({ onAgree, onCancel }) => {
  return (
    <div className="consent-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="consent-content bg-white p-6 rounded max-w-lg">
        <h3 className="text-xl font-bold mb-2">Autorização para tratamento de dados</h3>
        <p className="mb-4 text-sm">Ao concordar, o(a) responsável autoriza a TEAxis a coletar e tratar os dados do menor para fins de cadastro, agendamento e comunicação com profissionais. Este consentimento pode ser revogado a qualquer momento.</p>
        <div className="modal-actions flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" onClick={onAgree}>Concordo e Continuar</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
