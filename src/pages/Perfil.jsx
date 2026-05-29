import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaUser, FaMapMarkerAlt, FaClipboard, FaBrain } from 'react-icons/fa';
import '../Styles/Perfil.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function Perfil() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('Bem-vindo');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [accountType, setAccountType] = useState('user');

  const [neurodivergenceType, setNeurodivergenceType] = useState('');
  const [sensoryPreferences, setSensoryPreferences] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [userInterests, setUserInterests] = useState('');
  const [userGoals, setUserGoals] = useState('');

  const [specialty, setSpecialty] = useState('');
  const [professionalRegistration, setProfessionalRegistration] = useState('');
  const [bio, setBio] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alterei o ícone do último passo para ficar mais coerente visualmente
  const steps = [
    { id: 0, title: 'Dados Pessoais', icon: FaUser },
    { id: 1, title: 'Endereço', icon: FaMapMarkerAlt },
    { id: 2, title: 'Tipo de Conta', icon: FaClipboard },
    { id: 3, title: 'Detalhes', icon: FaBrain },
  ];

  useEffect(() => {
    // Valida apenas quando o passo muda, não em cada input
    validateCurrentStep();
  }, [currentStep]);

  const validateCurrentStep = () => {
    let newErrors = {};

    if (currentStep === 0) {
      if (!fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
      if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else if (currentStep === 1) {
      if (!street.trim()) newErrors.street = 'Rua é obrigatória';
      if (!number.trim()) newErrors.number = 'Número é obrigatório';
      if (!zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
      if (!neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
      if (!city.trim()) newErrors.city = 'Cidade é obrigatória';
      if (!state.trim()) newErrors.state = 'Estado é obrigatório';
    } else if (currentStep === 3) {
      if (accountType === 'user') {
        if (!neurodivergenceType?.trim?.()) newErrors.neurodivergenceType = 'Obrigatório';
        if (!sensoryPreferences?.trim?.()) newErrors.sensoryPreferences = 'Obrigatório';
        if (!learningStyle?.trim?.()) newErrors.learningStyle = 'Obrigatório';
        if (!userInterests?.trim?.()) newErrors.userInterests = 'Obrigatório';
        if (!userGoals?.trim?.()) newErrors.userGoals = 'Obrigatório';
      } else if (accountType === 'professional') {
        if (!specialty?.trim?.()) newErrors.specialty = 'Obrigatória';
        if (!professionalRegistration?.trim?.()) newErrors.professionalRegistration = 'Obrigatório';
        if (!bio?.trim?.()) newErrors.bio = 'Obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceedToNextStep = () => {
    if (currentStep === 0) {
      return fullName.trim() && phone.trim() && birthDate;
    } else if (currentStep === 1) {
      return street.trim() && number.trim() && zipCode.trim() && neighborhood.trim() && city.trim() && state.trim();
    } else if (currentStep === 2) {
      return true;
    }
    return false;
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId < currentStep || canProceedToNextStep()) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !phone || !birthDate || !street || !number || !zipCode || !neighborhood || !city || !state) {
      alert('Por favor, preencha todos os dados pessoais e de endereço.');
      return;
    }

    let profileData = {
      fullName, phone, birthDate, profilePicture: profilePicture || null,
      street, number, zipCode, neighborhood, city, state, accountType,
    };

    if (accountType === 'user') {
      if (!neurodivergenceType || !sensoryPreferences || !learningStyle || !userInterests || !userGoals) {
        alert('Por favor, preencha todas as informações adicionais.');
        return;
      }
      profileData = { ...profileData, neurodivergenceType, sensoryPreferences, learningStyle, userInterests, userGoals };
      console.log('Perfil de Usuário Atualizado:', profileData);
      alert('Perfil atualizado com sucesso! ✨');
      navigate('/dashboard-usuario');
    } else if (accountType === 'professional') {
      if (!specialty || !professionalRegistration || !bio) {
        alert('Por favor, preencha todos os dados obrigatórios para profissionais.');
        return;
      }
      profileData = { ...profileData, specialty, professionalRegistration, bio };
      console.log('Perfil de Profissional Atualizado:', profileData);
      alert('Perfil de Profissional atualizado com sucesso! ✨');
      navigate('/dashboard-profissional');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máx 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfilePicture(reader.result);
    reader.readAsDataURL(file);
  };

  const isStepCompleted = (stepId) => {
    if (stepId === 0) return fullName?.trim?.() && phone?.trim?.() && birthDate;
    if (stepId === 1) return street?.trim?.() && number?.trim?.() && zipCode?.trim?.() && neighborhood?.trim?.() && city?.trim?.() && state?.trim?.();
    if (stepId === 2) return true;
    if (stepId === 3) {
      if (accountType === 'user') return neurodivergenceType?.trim?.() && sensoryPreferences?.trim?.() && learningStyle?.trim?.() && userInterests?.trim?.() && userGoals?.trim?.();
      return specialty?.trim?.() && professionalRegistration?.trim?.() && bio?.trim?.();
    }
    return false;
  };

  return (
    <div className="perfil-container">
      {/* HEADER DE VIDRO */}
      <header className="perfil-header-glass">
        <Link to="/dashboard-usuario" className="back-to-space-btn">
          <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
        </Link>
        <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo-small" />
      </header>

      {/* BACKGROUND DECORATIVO */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="perfil-content-wrapper">
        <div className="perfil-hero-text">
          <h1>Olá, {userName}! ✨</h1>
          <p>Personalize seu perfil para a melhor experiência no TEAxis.</p>
        </div>

        {/* PROGRESS INDICATOR PREMIUM */}
        <div className="perfil-progress-container">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div key={step.id} className="progress-step-wrapper">
                <button
                  className={`progress-step ${currentStep === step.id ? 'active' : ''} ${isStepCompleted(step.id) ? 'completed' : ''}`}
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.id > currentStep && !canProceedToNextStep()}
                >
                  <div className="icon-circle">
                    {isStepCompleted(step.id) ? <FaCheckCircle className="step-icon check" /> : <step.icon className="step-icon" />}
                  </div>
                  <span className="step-label">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`progress-line ${isStepCompleted(step.id) ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORMULÁRIO GLASSMORPHISM */}
        <section className="perfil-form-glass">
          <form onSubmit={handleSubmit} className="perfil-form">
            
            {/* STEP 0: DADOS PESSOAIS */}
            {currentStep === 0 && (
              <div className="form-step-container fade-in">
                <div className="step-header">
                  <h2>Dados Pessoais</h2>
                  <p>Suas informações básicas de contato</p>
                </div>

                <div className="profile-upload-center">
                  <div className={`avatar-preview ${profilePicture ? 'has-image' : 'empty'}`}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="Perfil" className="current-profile-pic" />
                    ) : (
                      <FaUser className="avatar-placeholder-icon" />
                    )}
                  </div>
                  <div className="upload-actions">
                    <label className="upload-btn-premium">
                      <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange} className="file-input" />
                      Alterar Foto
                    </label>
                    {profilePicture && (
                      <button type="button" className="remove-avatar-text" onClick={() => setProfilePicture('')}>Remover</button>
                    )}
                  </div>
                </div>

                <div className="form-fields-grid">
                  <div className="form-group full-width">
                    <label htmlFor="fullName">Nome Completo</label>
                    <input id="fullName" name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`input-premium ${errors.fullName ? 'error' : ''}`} placeholder="Digite seu nome completo" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telefone</label>
                    <input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`input-premium ${errors.phone ? 'error' : ''}`} placeholder="(XX) 9XXXX-XXXX" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthDate">Data de Nascimento</label>
                    <input id="birthDate" name="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={`input-premium ${errors.birthDate ? 'error' : ''}`} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: ENDEREÇO */}
            {currentStep === 1 && (
              <div className="form-step-container fade-in">
                <div className="step-header">
                  <h2>Seu Endereço</h2>
                  <p>Para conectarmos você à rede de apoio local</p>
                </div>

                <div className="form-fields-grid">
                  <div className="form-group">
                    <label htmlFor="zipCode">CEP</label>
                    <input id="zipCode" name="zipCode" type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={`input-premium ${errors.zipCode ? 'error' : ''}`} placeholder="00000-000" />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="street">Rua / Avenida</label>
                    <input id="street" name="street" type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={`input-premium ${errors.street ? 'error' : ''}`} placeholder="Nome do seu logradouro" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="number">Número</label>
                    <input id="number" name="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} className={`input-premium ${errors.number ? 'error' : ''}`} placeholder="Nº" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="neighborhood">Bairro</label>
                    <input id="neighborhood" name="neighborhood" type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={`input-premium ${errors.neighborhood ? 'error' : ''}`} placeholder="Seu bairro" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Cidade</label>
                    <input id="city" name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={`input-premium ${errors.city ? 'error' : ''}`} placeholder="Sua cidade" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">Estado</label>
                    <input id="state" name="state" type="text" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} maxLength="2" className={`input-premium ${errors.state ? 'error' : ''}`} placeholder="UF" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TIPO DE CONTA */}
            {currentStep === 2 && (
              <div className="form-step-container fade-in">
                <div className="step-header">
                  <h2>Tipo de Perfil</h2>
                  <p>Como você utilizará a plataforma?</p>
                </div>

                <div className="account-type-grid">
                  <label className={`account-card-premium ${accountType === 'user' ? 'selected' : ''}`}>
                    <input id="accountTypeUser" name="accountType" type="radio" value="user" checked={accountType === 'user'} onChange={() => setAccountType('user')} />
                    <div className="card-body">
                      <h3>Busco Apoio</h3>
                      <p>Sou usuário ou familiar buscando profissionais e trilhas de desenvolvimento.</p>
                    </div>
                  </label>

                  <label className={`account-card-premium ${accountType === 'professional' ? 'selected' : ''}`}>
                    <input id="accountTypeProfessional" name="accountType" type="radio" value="professional" checked={accountType === 'professional'} onChange={() => setAccountType('professional')} />
                    <div className="card-body">
                      <h3>Sou Profissional</h3>
                      <p>Ofereço atendimento especializado a pessoas neurodivergentes.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: INFORMAÇÕES ADICIONAIS */}
            {currentStep === 3 && (
              <div className="form-step-container fade-in">
                {accountType === 'user' ? (
                  <>
                    <div className="step-header">
                      <h2>Seu Perfil Neurodivergente</h2>
                      <p>Respostas nos ajudam a moldar a inteligência do TEAxis para você</p>
                    </div>
                    <div className="form-fields-stack">
                      <div className="form-group">
                        <label htmlFor="neurodivergenceType">Tipo de Neurodivergência</label>
                        <input id="neurodivergenceType" name="neurodivergenceType" type="text" value={neurodivergenceType} onChange={(e) => setNeurodivergenceType(e.target.value)} className={`input-premium ${errors.neurodivergenceType ? 'error' : ''}`} placeholder="Ex: TEA, TDAH, Dislexia..." />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sensoryPreferences">Preferências Sensoriais</label>
                        <textarea id="sensoryPreferences" name="sensoryPreferences" value={sensoryPreferences} onChange={(e) => setSensoryPreferences(e.target.value)} rows="2" className={`input-premium text-area ${errors.sensoryPreferences ? 'error' : ''}`} placeholder="Ex: Sensibilidade a luz forte, prefiro ambientes silenciosos..."></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="learningStyle">Estilo de Aprendizado</label>
                        <textarea id="learningStyle" name="learningStyle" value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)} rows="2" className={`input-premium text-area ${errors.learningStyle ? 'error' : ''}`} placeholder="Ex: Aprendo melhor visualmente ou na prática..."></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="userInterests">Seus Interesses</label>
                        <textarea id="userInterests" name="userInterests" value={userInterests} onChange={(e) => setUserInterests(e.target.value)} rows="2" className={`input-premium text-area ${errors.userInterests ? 'error' : ''}`} placeholder="Ex: Tecnologia, artes, games..."></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="userGoals">Objetivos na plataforma</label>
                        <textarea id="userGoals" name="userGoals" value={userGoals} onChange={(e) => setUserGoals(e.target.value)} rows="2" className={`input-premium text-area ${errors.userGoals ? 'error' : ''}`} placeholder="Ex: Encontrar um psicólogo especializado, organizar rotina..."></textarea>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="step-header">
                      <h2>Dados Profissionais</h2>
                      <p>Sua vitrine para os usuários da plataforma</p>
                    </div>
                    <div className="form-fields-stack">
                      <div className="form-group">
                        <label htmlFor="specialty">Especialidade</label>
                        <input id="specialty" name="specialty" type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={`input-premium ${errors.specialty ? 'error' : ''}`} placeholder="Ex: Psicopedagogo, Terapeuta Ocupacional..." />
                      </div>
                      <div className="form-group">
                        <label htmlFor="professionalRegistration">Registro Profissional (CRM, CRP, etc)</label>
                        <input id="professionalRegistration" name="professionalRegistration" type="text" value={professionalRegistration} onChange={(e) => setProfessionalRegistration(e.target.value)} className={`input-premium ${errors.professionalRegistration ? 'error' : ''}`} placeholder="Nº do registro" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="bio">Biografia Profissional</label>
                        <textarea id="bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength="300" rows="4" className={`input-premium text-area ${errors.bio ? 'error' : ''}`} placeholder="Resuma sua experiência com neurodivergência..."></textarea>
                        <span className="char-count">{bio.length}/300</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="form-navigation-premium">
              <button type="button" className="btn-voltar" onClick={handlePrevStep} disabled={currentStep === 0}>
                ← Voltar
              </button>

              {currentStep < steps.length - 1 ? (
                <button type="button" className="btn-avancar" onClick={handleNextStep} disabled={!canProceedToNextStep()}>
                  Próximo Passo →
                </button>
              ) : (
                <button type="submit" className="btn-finalizar" disabled={!validateCurrentStep() || isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Perfil ✨'}
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}