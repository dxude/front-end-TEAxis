import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBriefcase, FaArrowRight } from 'react-icons/fa';
import '../Styles/RoleSelection.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState('select'); // 'select' ou 'action'
  const [action, setAction] = useState(null); // 'login' ou 'signup'

  useEffect(() => {
    // Se já tem role no localStorage, vai direto pro login
    const savedRole = localStorage.getItem('teaxis_role');
    if (savedRole) {
      navigate(`/login?type=${savedRole}`);
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('action');
  };

  const handleAction = (actionType) => {
    localStorage.setItem('teaxis_role', selectedRole);
    
    if (actionType === 'login') {
      navigate(`/login?type=${selectedRole}`);
    } else {
      navigate(`/cadastro?type=${selectedRole}`);
    }
  };

  const handleBackFromAction = () => {
    setStep('select');
    setSelectedRole(null);
    setAction(null);
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <header className="role-selection-header">
          <img src={logoTeaxis} alt="TEAxis" className="role-logo" />
          <h1>Bem-vindo ao TEAxis 👋</h1>
          <p>Uma plataforma conectando usuários e profissionais especializados</p>
        </header>

        {step === 'select' ? (
          <div className="role-selection-content">
            <h2>Escolha seu tipo de conta</h2>
            <div className="role-cards">
              <div
                className={`role-card ${selectedRole === 'usuario' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('usuario')}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect('usuario')}
              >
                <div className="role-icon">
                  <FaUser />
                </div>
                <h3>Sou Usuário</h3>
                <p>Buscar e agendar consultas com profissionais especializados</p>
                <ul className="role-benefits">
                  <li>✓ Encontrar profissionais qualificados</li>
                  <li>✓ Agendar consultas fácilmente</li>
                  <li>✓ Acompanhar progresso com metas</li>
                  <li>✓ Mensagens diretas com profissionais</li>
                </ul>
              </div>

              <div
                className={`role-card ${selectedRole === 'profissional' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('profissional')}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect('profissional')}
              >
                <div className="role-icon">
                  <FaBriefcase />
                </div>
                <h3>Sou Profissional</h3>
                <p>Ofertar serviços e gerenciar sua agenda de atendimentos</p>
                <ul className="role-benefits">
                  <li>✓ Gerenciar perfil profissional</li>
                  <li>✓ Controlar disponibilidade</li>
                  <li>✓ Receber agendamentos de clientes</li>
                  <li>✓ Acessar relatórios e estatísticas</li>
                </ul>
              </div>
            </div>

            {selectedRole && (
              <div className="role-selection-actions">
                <button
                  className="btn-next"
                  onClick={() => handleAction('login')}
                >
                  Já tenho conta <FaArrowRight />
                </button>
                <button
                  className="btn-next btn-next-primary"
                  onClick={() => handleAction('signup')}
                >
                  Criar nova conta <FaArrowRight />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoleSelection;
