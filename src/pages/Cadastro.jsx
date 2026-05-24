import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Cadastro.css';
import '../Styles/Login.css'; // importa estilos do popup simulado
import { FaUser, FaBriefcase, FaGoogle, FaEnvelope, FaLock, FaCalendarAlt, FaBrain, FaMapMarkerAlt, FaVenusMars, FaHeart, FaComments, FaSchool, FaGraduationCap, FaIdBadge, FaClock } from 'react-icons/fa';

const API_REGISTRO_USUARIO = 'SUA_URL_DA_API/api/v1/usuarios/registro'; 
const API_REGISTRO_PROFISSIONAL = 'SUA_URL_DA_API/api/v1/profissionais/registro'; 
const API_LOGIN_SOCIAL = 'SUA_URL_DA_API/api/v1/auth/google'; 

const SIMULATED_GOOGLE_LOGIN = true;

const Cadastro = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Conta
  const [account, setAccount] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });

  // Detalhes - usuário
  const [detalhesUsuario, setDetalhesUsuario] = useState({ dataNascimento: '', tipoNeurodivergencia: '', hobbies: '', genero: '', cidade: '', estado: '', preferenciasSensoriais: '', modoComunicacao: '', historicoEscolar: '' });

  // Detalhes - profissional
  const [detalhesProfissional, setDetalhesProfissional] = useState({ dataNascimento: '', certificacoes: '', especializacoes: '', metodosUtilizados: '', disponibilidade: '', cidade: '', estado: '' });

  const [showSimPopup, setShowSimPopup] = useState(false);
  const [simPopupMessage, setSimPopupMessage] = useState('');

  const handleAccountChange = (e) => setAccount({ ...account, [e.target.name]: e.target.value });
  const handleDetalhesUsuarioChange = (e) => setDetalhesUsuario({ ...detalhesUsuario, [e.target.name]: e.target.value });
  const handleDetalhesProfissionalChange = (e) => setDetalhesProfissional({ ...detalhesProfissional, [e.target.name]: e.target.value });

  const handleSimulatedGoogle = () => {
    setSimPopupMessage('Modo Google simulado - redirecionando...');
    setShowSimPopup(true);
    setTimeout(() => {
      setShowSimPopup(false);
      navigate('/dashboard-usuario');
    }, 1000);
  };

  const handleCadastroSubmit = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      // valida campos de conta
      if (!account.nome || !account.email || !account.senha || !account.confirmarSenha) {
        alert('Por favor preencha todos os campos iniciais.');
        return;
      }
      if (account.senha !== account.confirmarSenha) {
        alert('As palavras-passe não coincidem.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Aqui enviar os dados ao backend (ou Firebase) — por agora apenas log
    const payload = {
      account,
      perfil,
      detalhesUsuario: perfil === 'usuario' ? detalhesUsuario : null,
      detalhesProfissional: perfil === 'profissional' ? detalhesProfissional : null
    };

        console.log('Dados para registo:', payload);
        alert('Cadastro (cliente) executado com sucesso (demo).');
        navigate('/login');
    };

        // Renderiza o seletor ou o formulário, dependendo do estado
    return (
        <div className="cadastro-page-container">
            {perfil ? (
                <CadastroForm
                    tipo={perfil}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    account={account}
                    handleAccountChange={handleAccountChange}
                    detalhesUsuario={detalhesUsuario}
                    handleDetalhesUsuarioChange={handleDetalhesUsuarioChange}
                    detalhesProfissional={detalhesProfissional}
                    handleDetalhesProfissionalChange={handleDetalhesProfissionalChange}
                    onSubmit={handleCadastroSubmit}
                    onSimulateGoogle={handleSimulatedGoogle}
                />
            ) : (
                <PerfilSelector setPerfil={setPerfil} />
            )}

            {showSimPopup && (
                <div className="sim-popup" role="dialog" aria-live="polite">
                    <div style={{ width: '100%', textAlign: 'center', fontWeight: 600, color: '#202124' }}>
                        {simPopupMessage}
                    </div>
                </div>
            )}
        </div>
    );
};

const CadastroForm = ({ tipo, currentStep, setCurrentStep, account, handleAccountChange, detalhesUsuario, handleDetalhesUsuarioChange, detalhesProfissional, handleDetalhesProfissionalChange, onSubmit, onSimulateGoogle }) => {
    return (
        <form className="cadastro-form" onSubmit={onSubmit}>
            <div className="form-header">
                <div>
                    <span className="eyebrow">Cadastro TEAxis</span>
                    <h2 className="text-dark mb-2">Crie a sua conta como {tipo === 'usuario' ? 'Utilizador' : tipo === 'responsavel' ? 'Responsável' : 'Profissional'}</h2>
                    <p className="form-subtitle">Primeiro confirme seus dados básicos e depois preencha os detalhes do seu perfil.</p>
                </div>
                <div className="form-stepper">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <span>1</span>
                        <p>Conta</p>
                    </div>
                    <div className={`separator ${currentStep > 1 ? 'active' : ''}`} />
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <span>2</span>
                        <p>Detalhes</p>
                    </div>
                </div>
            </div>

            <button type="button" className="btn btn-social btn-google mb-4" onClick={onSimulateGoogle}>
                <FaGoogle className="mr-2" /> Continuar com Google
            </button>

            <div className="divider mb-4">
                <span>OU REGISTE COM EMAIL</span>
            </div>

            {currentStep === 1 && (
                <div className="form-step">
                    <div className="input-group">
                        <label htmlFor="nome"><FaUser /> Nome Completo:</label>
                        <input id="nome" name="nome" type="text" placeholder="Insira o seu nome" required value={account.nome} onChange={handleAccountChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email"><FaEnvelope /> Email:</label>
                        <input id="email" name="email" type="email" placeholder="Insira o seu email" required value={account.email} onChange={handleAccountChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="senha"><FaLock /> Palavra-passe:</label>
                        <input id="senha" name="senha" type="password" placeholder="Crie a sua palavra-passe" required value={account.senha} onChange={handleAccountChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmar"><FaLock /> Confirme a Palavra-passe:</label>
                        <input id="confirmar" name="confirmarSenha" type="password" placeholder="Repita a palavra-passe" required value={account.confirmarSenha} onChange={handleAccountChange} />
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="form-step form-step-2">
                    <div className="section-divider">
                        <div />
                        <span>Quase lá</span>
                        <div />
                    </div>
                    <p className="step-description">Agora complete os detalhes adicionais para que o TEAxis personalize sua experiência.</p>

                    {(tipo === 'usuario' || tipo === 'responsavel') && (
                        <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg">
                            <h3 className="text-lilac-main font-bold mb-4">Dados para o Perfil de Cuidado</h3>
                            <div className="input-group">
                                <label htmlFor="dataNascimento"><FaCalendarAlt /> Data de Nascimento:</label>
                                <input id="dataNascimento" name="dataNascimento" type="date" required value={detalhesUsuario.dataNascimento} onChange={handleDetalhesUsuarioChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="genero"><FaVenusMars /> Género:</label>
                                <input id="genero" name="genero" type="text" placeholder="Género" value={detalhesUsuario.genero} onChange={handleDetalhesUsuarioChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="tipoNeurodivergencia"><FaBrain /> Tipo de Neurodivergência:</label>
                                <input id="tipoNeurodivergencia" name="tipoNeurodivergencia" type="text" placeholder="Ex: Autismo, TDAH, Dislexia" value={detalhesUsuario.tipoNeurodivergencia} onChange={handleDetalhesUsuarioChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="cidade"><FaMapMarkerAlt /> Cidade/Distrito:</label>
                                <input id="cidade" name="cidade" type="text" placeholder="Cidade" required value={detalhesUsuario.cidade} onChange={handleDetalhesUsuarioChange} />
                                <input id="estado" name="estado" type="text" placeholder="Distrito (Ex: Porto)" required value={detalhesUsuario.estado} onChange={handleDetalhesUsuarioChange} className="mt-2" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="hobbies"><FaHeart /> Hobbies (separados por vírgula):</label>
                                <input id="hobbies" name="hobbies" type="text" placeholder="Ex: Leitura, Desportos, Música" value={detalhesUsuario.hobbies} onChange={handleDetalhesUsuarioChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="modoComunicacao"><FaComments /> Modo de Comunicação:</label>
                                <input id="modoComunicacao" name="modoComunicacao" type="text" placeholder="Ex: Oral, Escrita, Visual" value={detalhesUsuario.modoComunicacao} onChange={handleDetalhesUsuarioChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="preferenciasSensoriais">Preferências Sensoriais:</label>
                                <textarea id="preferenciasSensoriais" name="preferenciasSensoriais" placeholder="Sensibilidades a texturas, ruídos, luzes, etc." value={detalhesUsuario.preferenciasSensoriais} onChange={handleDetalhesUsuarioChange} rows="2" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="historicoEscolar"><FaSchool /> Histórico Escolar (Resumo):</label>
                                <textarea id="historicoEscolar" name="historicoEscolar" placeholder="Ex: Último ano cursado, principais dificuldades" value={detalhesUsuario.historicoEscolar} onChange={handleDetalhesUsuarioChange} rows="2" />
                            </div>
                        </div>
                    )}

                    {tipo === 'profissional' && (
                        <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg">
                            <h3 className="text-lilac-main font-bold mb-4">Dados de Registo e Atuação</h3>
                            <div className="input-group">
                                <label htmlFor="dataNascimentoProf"><FaCalendarAlt /> Data de Nascimento:</label>
                                <input id="dataNascimentoProf" name="dataNascimento" type="date" required value={detalhesProfissional.dataNascimento} onChange={handleDetalhesProfissionalChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="certificacoes"><FaIdBadge /> Certificações (Registo Profissional):</label>
                                <input id="certificacoes" name="certificacoes" type="text" required placeholder="Nº de Registo e Conselho (Ex: CRP 00/0000)" value={detalhesProfissional.certificacoes} onChange={handleDetalhesProfissionalChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="especializacoes"><FaGraduationCap /> Especializações:</label>
                                <textarea id="especializacoes" name="especializacoes" type="text" required placeholder="Áreas de foco (separadas por vírgula)" value={detalhesProfissional.especializacoes} onChange={handleDetalhesProfissionalChange} rows="2" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="metodosUtilizados"><FaGraduationCap /> Métodos/Abordagens Utilizadas:</label>
                                <textarea id="metodosUtilizados" name="metodosUtilizados" placeholder="Ex: TCC, ABA, Psicodrama" value={detalhesProfissional.metodosUtilizados} onChange={handleDetalhesProfissionalChange} rows="2" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="disponibilidade"><FaClock /> Disponibilidade (Horário e Dias):</label>
                                <input id="disponibilidade" name="disponibilidade" type="text" placeholder="Ex: Seg/Qua/Sex, 14h-18h" required value={detalhesProfissional.disponibilidade} onChange={handleDetalhesProfissionalChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="cidadeProf"><FaMapMarkerAlt /> Cidade/Distrito Base:</label>
                                <input id="cidadeProf" name="cidade" type="text" placeholder="Cidade" required value={detalhesProfissional.cidade} onChange={handleDetalhesProfissionalChange} />
                                <input id="estadoProf" name="estado" type="text" placeholder="Distrito (Ex: Porto)" required value={detalhesProfissional.estado} onChange={handleDetalhesProfissionalChange} className="mt-2" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="form-actions">
                {currentStep === 2 && (
                    <button type="button" className="btn btn-secondary btn-back" onClick={() => setCurrentStep(1)}>
                        Voltar
                    </button>
                )}
                <button type="submit" className="btn btn-primary-green btn-full">
                    {currentStep === 1 ? 'Continuar' : 'Registrar e concluir'}
                </button>
            </div>

            <p className="login-link mt-4 text-center">
                <a href="#" onClick={() => { /* voltar à seleção */ window.location.reload(); }} className="text-lilac-main font-semibold">
                    &larr; Voltar à escolha de perfil
                </a>
            </p>
        </form>
    );
};

// Componente de Seleção de Perfil (Para Reutilização)
const PerfilSelector = ({ setPerfil }) => (
    <div className="perfil-selector">
        <h2 className="text-dark mb-8 text-2xl font-bold">Como quer usar o TEAxis?</h2>
        
        <div className="card-selection-wrapper">
            <div 
                className="selection-card card-green"
                onClick={() => setPerfil('usuario')}
            >
                <FaUser className="card-icon" />
                <h3>Sou Utilizador / Paciente</h3>
                <p>Quero encontrar profissionais que entendam as minhas necessidades.</p>
            </div>
            <div 
                className="selection-card card-blue"
                onClick={() => setPerfil('responsavel')}
            >
                <FaIdBadge className="card-icon" />
                <h3>Sou Responsável / Tutor</h3>
                <p>Gerencio perfis de crianças/adolescentes e autorizo o tratamento de dados.</p>
            </div>

            <div 
                className="selection-card card-lilac"
                onClick={() => setPerfil('profissional')}
            >
                <FaBriefcase className="card-icon" />
                <h3>Sou Profissional</h3>
                <p>Quero oferecer apoio especializado e transformar vidas.</p>
            </div>
        </div>
        
        <p className="login-link mt-8 text-center">
            Já tem conta? <a href="/login" className="text-lilac-main font-semibold">Faça o seu Login</a>
        </p>
    </div>
);

export default Cadastro;