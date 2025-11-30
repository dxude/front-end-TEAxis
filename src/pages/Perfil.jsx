import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Perfil.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png'; 
import defaultProfilePic from '../assets/imagens/default-profile.png'; 

export default function Perfil() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('O que deseja fazer?');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  // Usando a variável importada corretamente
  const [profilePicture, setProfilePicture] = useState(defaultProfilePic);

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

  useEffect(() => {
  }, []);

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
      profilePicture: profilePicture === defaultProfilePic ? null : profilePicture,
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

  return (
    <div className="perfil-container">
      <section className="perfil-hero-section">
        <div className="perfil-hero-content">
          <img src={logoTeaxis} alt="Logo TEAxis" className="perfil-hero-logo" />
          <h1>Olá, {userName}!</h1>
          <p>Detalhe seu perfil para uma experiência personalizada na plataforma.</p>
        </div>
      </section>

      <section className="perfil-form-section">
        <form onSubmit={handleSubmit} className="perfil-form">

          <div className="form-section-group">
            <h2>Dados Pessoais</h2>
            <div className="form-fields-grid">
                <label>Nome Completo</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

                <label>Telefone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                <label>Data de Nascimento</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />

                <label>URL da Foto de Perfil</label>
                <div className="profile-picture-input-wrapper">
                  {/* Usando a variável importada corretamente */}
                  <img src={profilePicture || defaultProfilePic} alt="Foto de Perfil" className="current-profile-pic" />
                  <input
                    type="text"
                    placeholder="Cole a URL da sua foto (ex: https://seusite.com/foto.jpg)"
                    value={profilePicture === defaultProfilePic ? '' : profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value || defaultProfilePic)}
                    className="url-input-field"
                  />
                </div>
            </div>
          </div>

          <div className="form-section-group">
            <h2>Endereço</h2>
            <div className="form-fields-grid">
                <label>Rua</label>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />

                <label>Número</label>
                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} required />

                <label>CEP</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />

                <label>Bairro</label>
                <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />

                <label>Cidade</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />

                <label>Estado (Sigla)</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} maxLength="2" required />
            </div>
          </div>

          <div className="form-section-group">
            <h2>Você é?</h2>
            <div className="account-type-selection">
              <label className="radio-label">
                <input
                  type="radio"
                  value="user"
                  checked={accountType === 'user'}
                  onChange={() => setAccountType('user')}
                />
                Usuário
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="professional"
                  checked={accountType === 'professional'}
                  onChange={() => setAccountType('professional')}
                />
                Profissional
              </label>
            </div>
          </div>

          {accountType === 'user' && (
            <div className="form-section-group user-specific-fields">
              <h2>Sobre sua Neurodivergência e Preferências</h2>
              <label>Qual o tipo de sua neurodivergência? (ex: TEA, TDAH, Dislexia)</label>
              <input
                type="text"
                value={neurodivergenceType}
                onChange={(e) => setNeurodivergenceType(e.target.value)}
                required
              />

              <label>Preferências Sensoriais (ex: prefiro ambientes calmos, sensibilidade à luz)</label>
              <textarea
                value={sensoryPreferences}
                onChange={(e) => setSensoryPreferences(e.target.value)}
                rows="3"
                className="text-area-input"
                required
              ></textarea>

              <label>Melhor forma de aprendizado (ex: visual, auditivo, prático)</label>
              <textarea
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                rows="3"
                className="text-area-input"
                required
              ></textarea>

              <label>Quais são seus interesses (ex: jogos, leitura, artes)?</label>
              <textarea
                value={userInterests}
                onChange={(e) => setUserInterests(e.target.value)}
                rows="3"
                className="text-area-input"
                required
              ></textarea>

              <label>Quais seus objetivos com o TEAxis?</label>
              <textarea
                value={userGoals}
                onChange={(e) => setUserGoals(e.target.value)}
                rows="3"
                className="text-area-input"
                required
              ></textarea>
            </div>
          )}

          {accountType === 'professional' && (
            <div className="form-section-group professional-specific-fields">
              <h2>Dados do Profissional</h2>
              <label>Sua Especialidade (ex: Psicólogo, Pedagogo)</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />

              <label>Número de Registro Profissional (ex: CRP, CREFITO)</label>
              <input
                type="text"
                value={professionalRegistration}
                onChange={(e) => setProfessionalRegistration(e.target.value)}
                required
              />

              <label>Pequena Biografia (máx. 200 caracteres)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength="200"
                rows="4"
                className="text-area-input"
                required
              ></textarea>
            </div>
          )}

          <button type="submit" className="update-profile-button">Atualizar Perfil</button>
        </form>
      </section>
    </div>
  );
}