import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaCircle, FaCamera, FaUser, FaMapMarkerAlt, FaClipboard } from 'react-icons/fa';
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

  const steps = [
    { id: 0, title: 'Dados Pessoais', icon: FaUser },
    { id: 1, title: 'Endereço', icon: FaMapMarkerAlt },
    { id: 2, title: 'Tipo de Conta', icon: FaClipboard },
    { id: 3, title: 'Informações Adicionais', icon: FaClipboard },
  ];

  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, fullName, phone, birthDate, street, number, zipCode, neighborhood, city, state, accountType]);

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
        if (!neurodivergenceType.trim()) newErrors.neurodivergenceType = 'Tipo de neurodivergência é obrigatório';
        if (!sensoryPreferences.trim()) newErrors.sensoryPreferences = 'Preferências sensoriais são obrigatórias';
        if (!learningStyle.trim()) newErrors.learningStyle = 'Estilo de aprendizado é obrigatório';
        if (!userInterests.trim()) newErrors.userInterests = 'Interesses são obrigatórios';
        if (!userGoals.trim()) newErrors.userGoals = 'Objetivos são obrigatórios';
      } else if (accountType === 'professional') {
        if (!specialty.trim()) newErrors.specialty = 'Especialidade é obrigatória';
        if (!professionalRegistration.trim()) newErrors.professionalRegistration = 'Registro profissional é obrigatório';
        if (!bio.trim()) newErrors.bio = 'Biografia é obrigatória';
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
      fullName,
      phone,
      birthDate,
      profilePicture: profilePicture || null,
      street,
      number,
      zipCode,
      neighborhood,
      city,
      state,
      accountType,
    };

    if (accountType === 'user') {
      if (!neurodivergenceType || !sensoryPreferences || !learningStyle || !userInterests || !userGoals) {
        alert('Por favor, preencha todas as informações sobre sua neurodivergência, preferências e objetivos.');
        return;
      }
      profileData = {
        ...profileData,
        neurodivergenceType,
        sensoryPreferences,
        learningStyle,
        userInterests,
        userGoals
      };
      console.log('Perfil de Usuário Atualizado:', profileData);
      alert('Perfil de Usuário atualizado com sucesso!');
      navigate('/dashboard-usuario');
    } else if (accountType === 'professional') {
      if (!specialty || !professionalRegistration || !bio) {
        alert('Por favor, preencha todos os dados obrigatórios para profissionais.');
        return;
      }
      profileData = { ...profileData, specialty, professionalRegistration, bio };
      console.log('Perfil de Profissional Atualizado:', profileData);
      alert('Perfil de Profissional atualizado com sucesso!');
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
    if (stepId === 0) {
      return fullName.trim() && phone.trim() && birthDate;
    } else if (stepId === 1) {
      return street.trim() && number.trim() && zipCode.trim() && neighborhood.trim() && city.trim() && state.trim();
    } else if (stepId === 2) {
      return true;
    } else if (stepId === 3) {
      if (accountType === 'user') {
        return neurodivergenceType.trim() && sensoryPreferences.trim() && learningStyle.trim() && userInterests.trim() && userGoals.trim();
      } else {
        return specialty.trim() && professionalRegistration.trim() && bio.trim();
      }
    }
    return false;
  };

  return (
    <div className="perfil-container">
      {/* HEADER */}
      <header className="perfil-header">
        <Link to="/dashboard-usuario" className="back-to-space-btn">
          <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="perfil-hero-section">
        <div className="perfil-hero-content">
          <img src={logoTeaxis} alt="Logo TEAxis" className="perfil-hero-logo" />
          <h1>Olá, {userName}!</h1>
          <p>Detalhe seu perfil para uma experiência personalizada na plataforma.</p>
        </div>
      </section>

      {/* PROGRESS INDICATOR */}
      <div className="perfil-progress-container">
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div key={step.id} className="progress-step-wrapper">
              <button
                className={`progress-step ${currentStep === step.id ? 'active' : ''} ${isStepCompleted(step.id) ? 'completed' : ''}`}
                onClick={() => handleStepClick(step.id)}
                disabled={step.id > currentStep && !canProceedToNextStep()}
              >
                {isStepCompleted(step.id) ? (
                  <FaCheckCircle className="step-icon" />
                ) : (
                  <FaCircle className="step-icon" />
                )}
                <span className="step-label">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`progress-line ${isStepCompleted(step.id) ? 'completed' : ''}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="progress-percentage">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% completo
        </div>
      </div>

      {/* FORM SECTION */}
      <section className="perfil-form-section">
        <form onSubmit={handleSubmit} className="perfil-form">
          
          {/* STEP 0: DADOS PESSOAIS */}
          {currentStep === 0 && (
            <div className="form-step-container fade-in">
              <div className="step-header">
                <h2>Dados Pessoais</h2>
                <p>Comece compartilhando informações básicas sobre você</p>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label>Nome Completo <span className="required">*</span></label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? 'input-error' : ''}
                    placeholder="Seu nome completo"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Telefone <span className="required">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={errors.phone ? 'input-error' : ''}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Data de Nascimento <span className="required">*</span></label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={errors.birthDate ? 'input-error' : ''}
                  />
                  {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                </div>
              </div>

              <div className="profile-upload-section">
                <label>Foto de Perfil</label>
                <div className="upload-grid">
                  <div className={`avatar-preview ${profilePicture ? 'has-image' : 'empty'}`}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="Foto de Perfil" className="current-profile-pic" />
                    ) : (
                      <div className="avatar-empty-state">Nenhuma imagem selecionada</div>
                    )}
                    {profilePicture && (
                      <button type="button" className="remove-avatar-btn" onClick={() => setProfilePicture('')}>Remover</button>
                    )}
                  </div>

                  <div className="upload-controls">
                    <p className="helper-text">Envie uma foto (JPG/PNG). Máx 5MB. Você também pode colar uma URL.</p>

                    <label className="upload-btn">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                      Enviar nova foto
                    </label>

                    <div className="or-text">ou</div>

                    <input
                      type="text"
                      placeholder="Cole a URL da sua foto (ex: https://seusite.com/foto.jpg)"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      className="url-input-field"
                    />

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: ENDEREÇO */}
          {currentStep === 1 && (
            <div className="form-step-container fade-in">
              <div className="step-header">
                <h2>Seu Endereço</h2>
                <p>Onde você mora? Isso nos ajuda a conectar com profissionais próximos a você</p>
              </div>

              <div className="form-fields-grid">
                <div className="form-group full-width">
                  <label>Rua <span className="required">*</span></label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={errors.street ? 'input-error' : ''}
                    placeholder="Nome da rua"
                  />
                  {errors.street && <span className="error-message">{errors.street}</span>}
                </div>

                <div className="form-group">
                  <label>Número <span className="required">*</span></label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={errors.number ? 'input-error' : ''}
                    placeholder="Número"
                  />
                  {errors.number && <span className="error-message">{errors.number}</span>}
                </div>

                <div className="form-group">
                  <label>CEP <span className="required">*</span></label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={errors.zipCode ? 'input-error' : ''}
                    placeholder="XXXXX-XXX"
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Bairro <span className="required">*</span></label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className={errors.neighborhood ? 'input-error' : ''}
                    placeholder="Nome do bairro"
                  />
                  {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
                </div>

                <div className="form-group">
                  <label>Cidade <span className="required">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={errors.city ? 'input-error' : ''}
                    placeholder="Cidade"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Estado (Sigla) <span className="required">*</span></label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    maxLength="2"
                    className={errors.state ? 'input-error' : ''}
                    placeholder="SP"
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TIPO DE CONTA */}
          {currentStep === 2 && (
            <div className="form-step-container fade-in">
              <div className="step-header">
                <h2>Qual é o seu Perfil?</h2>
                <p>Escolha como você vai usar o TEAxis</p>
              </div>

              <div className="account-type-selection-container">
                <label className={`account-type-card ${accountType === 'user' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value="user"
                    checked={accountType === 'user'}
                    onChange={() => setAccountType('user')}
                  />
                  <div className="card-content">
                    <h3>Sou um Usuário</h3>
                    <p>Busco profissionais e apoio especializado para meu desenvolvimento</p>
                  </div>
                </label>

                <label className={`account-type-card ${accountType === 'professional' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value="professional"
                    checked={accountType === 'professional'}
                    onChange={() => setAccountType('professional')}
                  />
                  <div className="card-content">
                    <h3>Sou um Profissional</h3>
                    <p>Oferço atendimento especializado a pessoas neurodivergentes</p>
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
                    <h2>Sobre você e suas Preferências</h2>
                    <p>Essas informações nos ajudam a personalizar sua experiência</p>
                  </div>

                  <div className="form-fields-stack">
                    <div className="form-group">
                      <label>Qual o tipo de sua neurodivergência? <span className="required">*</span></label>
                      <p className="field-hint">Ex: TEA, TDAH, Dislexia, Altas Habilidades, etc</p>
                      <input
                        type="text"
                        value={neurodivergenceType}
                        onChange={(e) => setNeurodivergenceType(e.target.value)}
                        className={errors.neurodivergenceType ? 'input-error' : ''}
                        placeholder="Digite sua neurodivergência"
                      />
                      {errors.neurodivergenceType && <span className="error-message">{errors.neurodivergenceType}</span>}
                    </div>

                    <div className="form-group">
                      <label>Preferências Sensoriais <span className="required">*</span></label>
                      <p className="field-hint">Ex: prefiro ambientes calmos, sensibilidade à luz</p>
                      <textarea
                        value={sensoryPreferences}
                        onChange={(e) => setSensoryPreferences(e.target.value)}
                        rows="3"
                        className={`text-area-input ${errors.sensoryPreferences ? 'input-error' : ''}`}
                        placeholder="Descreva suas preferências sensoriais..."
                      ></textarea>
                      {errors.sensoryPreferences && <span className="error-message">{errors.sensoryPreferences}</span>}
                    </div>

                    <div className="form-group">
                      <label>Melhor forma de aprendizado <span className="required">*</span></label>
                      <p className="field-hint">Ex: visual, auditivo, prático, combinado</p>
                      <textarea
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        rows="3"
                        className={`text-area-input ${errors.learningStyle ? 'input-error' : ''}`}
                        placeholder="Descreva seu estilo de aprendizado..."
                      ></textarea>
                      {errors.learningStyle && <span className="error-message">{errors.learningStyle}</span>}
                    </div>

                    <div className="form-group">
                      <label>Quais são seus interesses? <span className="required">*</span></label>
                      <p className="field-hint">Ex: jogos, leitura, artes, tecnologia, esportes</p>
                      <textarea
                        value={userInterests}
                        onChange={(e) => setUserInterests(e.target.value)}
                        rows="3"
                        className={`text-area-input ${errors.userInterests ? 'input-error' : ''}`}
                        placeholder="Compartilhe seus interesses..."
                      ></textarea>
                      {errors.userInterests && <span className="error-message">{errors.userInterests}</span>}
                    </div>

                    <div className="form-group">
                      <label>Quais seus objetivos com o TEAxis? <span className="required">*</span></label>
                      <p className="field-hint">O que você espera alcançar através da plataforma?</p>
                      <textarea
                        value={userGoals}
                        onChange={(e) => setUserGoals(e.target.value)}
                        rows="3"
                        className={`text-area-input ${errors.userGoals ? 'input-error' : ''}`}
                        placeholder="Descreva seus objetivos..."
                      ></textarea>
                      {errors.userGoals && <span className="error-message">{errors.userGoals}</span>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="step-header">
                    <h2>Seus Dados Profissionais</h2>
                    <p>Informações que os usuários verão sobre sua expertise</p>
                  </div>

                  <div className="form-fields-stack">
                    <div className="form-group">
                      <label>Sua Especialidade <span className="required">*</span></label>
                      <p className="field-hint">Ex: Psicólogo, Pedagogo, Fonoaudiólogo, Psicopedagogo</p>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className={errors.specialty ? 'input-error' : ''}
                        placeholder="Digite sua especialidade"
                      />
                      {errors.specialty && <span className="error-message">{errors.specialty}</span>}
                    </div>

                    <div className="form-group">
                      <label>Número de Registro Profissional <span className="required">*</span></label>
                      <p className="field-hint">Ex: CRP, CREFITO, Matrícula, etc</p>
                      <input
                        type="text"
                        value={professionalRegistration}
                        onChange={(e) => setProfessionalRegistration(e.target.value)}
                        className={errors.professionalRegistration ? 'input-error' : ''}
                        placeholder="Número de registro"
                      />
                      {errors.professionalRegistration && <span className="error-message">{errors.professionalRegistration}</span>}
                    </div>

                    <div className="form-group">
                      <label>Pequena Biografia <span className="required">*</span></label>
                      <p className="field-hint">Máximo 200 caracteres - fale sobre sua experiência</p>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength="200"
                        rows="4"
                        className={`text-area-input ${errors.bio ? 'input-error' : ''}`}
                        placeholder="Conte um pouco sobre você..."
                      ></textarea>
                      <span className="char-count">{bio.length}/200</span>
                      {errors.bio && <span className="error-message">{errors.bio}</span>}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="form-navigation">
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              ← Voltar
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
              >
                Próximo →
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary btn-submit"
                disabled={!validateCurrentStep() || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar e Atualizar Perfil'}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}