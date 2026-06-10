import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Cadastro.css';
import '../Styles/Login.css';
import { FaArrowLeft, FaUser, FaBriefcase, FaGoogle, FaEnvelope, FaLock, FaCalendarAlt, FaBrain, FaMapMarkerAlt, FaVenusMars, FaGenderless, FaTransgender, FaMale, FaQuestionCircle, FaHeart, FaComments, FaSchool, FaGraduationCap, FaIdBadge, FaClock } from 'react-icons/fa';
import { signInWithGoogle } from '../firebase';

const API_REGISTRO_USUARIO = 'https://back-end-plataforma-teaxis.onrender.com/api/v1/usuarios/registrar'; 

const BRAZIL_STATES = [
  { code: 'AC', name: 'Acre', cities: ['Rio Branco','Cruzeiro do Sul'] },
  { code: 'AL', name: 'Alagoas', cities: ['Maceió','Arapiraca'] },
  { code: 'AP', name: 'Amapá', cities: ['Macapá','Santana'] },
  { code: 'AM', name: 'Amazonas', cities: ['Manaus','Parintins'] },
  { code: 'BA', name: 'Bahia', cities: ['Salvador','Feira de Santana'] },
  { code: 'CE', name: 'Ceará', cities: ['Fortaleza','Sobral'] },
  { code: 'DF', name: 'Distrito Federal', cities: ['Brasília'] },
  { code: 'ES', name: 'Espírito Santo', cities: ['Vitória','Vila Velha'] },
  { code: 'GO', name: 'Goiás', cities: ['Goiânia','Anápolis'] },
  { code: 'MA', name: 'Maranhão', cities: ['São Luís','Imperatriz'] },
  { code: 'MT', name: 'Mato Grosso', cities: ['Cuiabá','Rondonópolis'] },
  { code: 'MS', name: 'Mato Grosso do Sul', cities: ['Campo Grande','Dourados'] },
  { code: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte','Uberlândia'] },
  { code: 'PA', name: 'Pará', cities: ['Belém','Ananindeua'] },
  { code: 'PB', name: 'Paraíba', cities: ['João Pessoa','Campina Grande'] },
  { code: 'PR', name: 'Paraná', cities: ['Curitiba','Londrina'] },
  { code: 'PE', name: 'Pernambuco', cities: ['Recife','Olinda','Jaboatão dos Guararapes','Caruaru'] },
  { code: 'PI', name: 'Piauí', cities: ['Teresina'] },
  { code: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro','Niterói'] },
  { code: 'RN', name: 'Rio Grande do Norte', cities: ['Natal','Mossoró'] },
  { code: 'RS', name: 'Rio Grande do Sul', cities: ['Porto Alegre','Caxias do Sul'] },
  { code: 'RO', name: 'Rondônia', cities: ['Porto Velho'] },
  { code: 'RR', name: 'Roraima', cities: ['Boa Vista'] },
  { code: 'SC', name: 'Santa Catarina', cities: ['Florianópolis','Joinville'] },
  { code: 'SP', name: 'São Paulo', cities: ['São Paulo','Campinas','Santos'] },
  { code: 'SE', name: 'Sergipe', cities: ['Aracaju'] },
  { code: 'TO', name: 'Tocantins', cities: ['Palmas'] }
];

const GENDER_OPTIONS = [
  { key: 'cis', label: 'Cisgênero', desc: 'Identidade corresponde ao sexo de nascimento.', icon: FaVenusMars },
  { key: 'trans', label: 'Transgênero', desc: 'Identidade difere do sexo de nascimento.', icon: FaTransgender },
  { key: 'nb', label: 'Não-binário', desc: 'Fora das categorias exclusivamente masculina ou feminina.', icon: FaGenderless },
  { key: 'fluid', label: 'Gênero-fluido', desc: 'Identidade que varia ao longo do tempo.', icon: FaMale },
  { key: 'nao-dizer', label: 'Prefiro não dizer', desc: 'Prefere não informar.', icon: FaQuestionCircle }
];

const DEFAULT_SUGGESTIONS = {
  hobbies: ['Leitura','Música','Esportes','Desenho','Jogos','Programação','Culinária','Dança'],
  modoComunicacao: ['Oral','Escrita','Visual','Aumentativa','Gestual'],
  preferenciasSensoriais: ['Sensível a ruídos','Sensível a luz','Prefere silêncio','Texturas específicas'],
  neurodivergencias: ['Autismo','TDAH','Dislexia','Dispraxia','TEA','Altas Habilidades']
};

export default function Cadastro() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estados dos Campos Obrigatórios Alinhados com o Record do Java
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  
  const [tipoNeurodivergencia, setTipoNeurodivergencia] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [genero, setGenero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [preferenciasSensoriais, setPreferenciasSensoriais] = useState('');
  const [modoComunicacao, setModoComunicacao] = useState('');
  const [historicoEscolar, setHistoricoEscolar] = useState('');

  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [genderHoverText, setGenderHoverText] = useState('');
  const [stateCities, setStateCities] = useState([]);

  const handleStateChange = (e) => {
    const code = e.target.value;
    setEstado(code);
    setCidade('');
    const found = BRAZIL_STATES.find(s => s.code === code);
    setStateCities(found ? found.cities : []);
  };

  const addHobby = (hobby) => setHobbies(prev => Array.from(new Set([...prev, hobby])));
  const removeHobby = (hobby) => setHobbies(prev => prev.filter(h => h !== hobby));

  const handleGoogleSignup = async () => {
    try {
      const { user, token } = await signInWithGoogle();
      localStorage.setItem('teaxis_auth_token', token);
      localStorage.setItem('user_email', user.email);
      alert('✅ Cadastro com Google realizado com sucesso!');
      navigate('/dashboard-usuario');
    } catch (error) {
      alert('Erro ao fazer signup com Google.');
    }
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!nome || !email || !senha || !confirmarSenha) {
        alert('Por favor preencha todos os campos iniciais.');
        return;
      }
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Formata a data de nascimento para LocalDate (YYYY-MM-DD) do Java
    const dataNascimento = dobYear && dobMonth && dobDay 
      ? `${dobYear}-${String(dobMonth).padStart(2, '0')}-${String(dobDay).padStart(2, '0')}`
      : null;

    setLoading(true);

    // CONSTRUÇÃO TRANSACIONAL IDÊNTICA AO RECORD DadosCadastroUsuario DO JAVA
    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha,
      dataNascimento: dataNascimento,
      tipoNeurodivergencia: tipoNeurodivergencia || "Não informado",
      hobbies: hobbies.length > 0 ? hobbies : ["Geral"], // Set<String> do Java
      tipo: perfil || "usuario",
      genero: genero || "Não informado",
      cidade: cidade || "Não informado",
      estado: estado || "Não informado",
      preferenciasSensoriais: preferenciasSensoriais || "Nenhuma",
      modoComunicacao: modoComunicacao || "Padrão",
      historicoEscolar: historicoEscolar || "Nenhum histórico informado"
    };

    try {
      console.log('🚀 Enviando payload completo e unificado ao Record do Java...', payload);
      
      const response = await fetch(API_REGISTRO_USUARIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro do Servidor: Status ${response.status}`);
      }

      alert('🎉 Cadastro realizado com sucesso e gravado no Neon!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Falha ao registrar. Verifique os dados inseridos.');
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) {
    return (
      <div className="perfil-selector-wrapper" style={{padding: '40px', textAlign: 'center'}}>
        <h2 className="text-dark mb-8 text-2xl font-bold">Como quer usar o sistema?</h2>
        <div className="card-selection-wrapper" style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
          <div className="selection-card card-green" onClick={() => setPerfil('usuario')} style={{cursor: 'pointer', padding: '20px', border: '1px solid #ccc'}}>
            <FaUser size={40} />
            <h3>Sou Utilizador / Paciente</h3>
            <p>Quero gerenciar meu perfil e acompanhar minhas conversas.</p>
          </div>
          <div className="selection-card card-blue" onClick={() => setPerfil('responsavel')} style={{cursor: 'pointer', padding: '20px', border: '1px solid #ccc'}}>
            <FaIdBadge size={40} />
            <h3>Sou Responsável / Tutor</h3>
            <p>Gerencio perfis de crianças e dependentes neurodivergentes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-page-container">
      <div className="auth-page-shell">
        <main className="auth-page-content">
          <form className="cadastro-form auth-card" onSubmit={handleCadastroSubmit}>
            <div className="form-header">
              <h2>Cadastro do Perfil ({perfil === 'usuario' ? 'Paciente' : 'Responsável'})</h2>
              <p>Etapa {currentStep} de 2</p>
            </div>

            {currentStep === 1 && (
              <div className="form-step">
                <div className="input-group">
                  <label><FaUser /> Nome Completo:</label>
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Insira seu nome" />
                </div>
                <div className="input-group">
                  <label><FaEnvelope /> Email:</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Insira seu email" />
                </div>
                <div className="input-group">
                  <label><FaLock /> Senha:</label>
                  <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Crie sua senha" />
                </div>
                <div className="input-group">
                  <label><FaLock /> Confirme a Senha:</label>
                  <input type="password" required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Repita a senha" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step-2" style={{maxHeight: '450px', overflowY: 'auto', paddingRight: '10px'}}>
                <div className="input-group">
                  <label><FaCalendarAlt /> Data de Nascimento:</label>
                  <div className="dob-selects" style={{display: 'flex', gap: '10px'}}>
                    <select required value={dobDay} onChange={(e)=>setDobDay(e.target.value)}><option value="">Dia</option>{Array.from({length:31}).map((_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>
                    <select required value={dobMonth} onChange={(e)=>setDobMonth(e.target.value)}><option value="">Mês</option>{Array.from({length:12}).map((_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>
                    <select required value={dobYear} onChange={(e)=>setDobYear(e.target.value)}><option value="">Ano</option>{Array.from({length:80}).map((_,i)=><option key={2026-i} value={2026-i}>{2026-i}</option>)}</select>
                  </div>
                </div>

                <div className="input-group">
                  <label><FaVenusMars /> Gênero:</label>
                  <select required value={genero} onChange={(e) => setGenero(e.target.value)}>
                    <option value="">Selecione o Gênero</option>
                    {GENDER_OPTIONS.map(g => <option key={g.key} value={g.label}>{g.label}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label><FaBrain /> Tipo de Neurodivergência Principal:</label>
                  <select required value={tipoNeurodivergencia} onChange={(e) => setTipoNeurodivergencia(e.target.value)}>
                    <option value="">Selecione a Neurodivergência</option>
                    {DEFAULT_SUGGESTIONS.neurodivergencias.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label><FaMapMarkerAlt /> Estado e Cidade:</label>
                  <select required value={estado} onChange={handleStateChange}>
                    <option value="">Selecione o Estado</option>
                    {BRAZIL_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                  <select required value={cidade} onChange={(e) => setCidade(e.target.value)} style={{marginTop: '10px'}}>
                    <option value="">Selecione a Cidade</option>
                    {stateCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label><FaHeart /> Hobbies (Selecione os que se aplicam):</label>
                  <div className="chip-list" style={{margin: '5px 0', display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                    {hobbies.map(h => <span key={h} className="chip" style={{background: '#e0e0e0', padding: '2px 8px', borderRadius: '10px'}}>{h} <button type="button" onClick={()=>removeHobby(h)}>×</button></span>)}
                  </div>
                  <div className="suggestions-grid" style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                    {DEFAULT_SUGGESTIONS.hobbies.map(h => <button type="button" key={h} className="suggestion-btn" onClick={()=>addHobby(h)}>{h}</button>)}
                  </div>
                </div>

                <div className="input-group">
                  <label><FaComments /> Modo de Comunicação Preferencial:</label>
                  <select required value={modoComunicacao} onChange={(e) => setModoComunicacao(e.target.value)}>
                    <option value="">Selecione</option>
                    {DEFAULT_SUGGESTIONS.modoComunicacao.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>Preferências Sensoriais:</label>
                  <select required value={preferenciasSensoriais} onChange={(e) => setPreferenciasSensoriais(e.target.value)}>
                    <option value="">Selecione</option>
                    {DEFAULT_SUGGESTIONS.preferenciasSensoriais.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label><FaSchool /> Histórico Escolar / Notas de Observação:</label>
                  <textarea value={historicoEscolar} onChange={(e) => setHistoricoEscolar(e.target.value)} placeholder="Informações relevantes sobre o aprendizado ou rotina..." rows="3" />
                </div>
              </div>
            )}

            <div className="form-actions" style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
              {currentStep === 2 && <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>Voltar</button>}
              <button type="submit" disabled={loading} className="btn btn-primary-green" style={{width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
                {loading ? 'Processando...' : currentStep === 1 ? 'Avançar' : 'Registrar e Concluir'}
              </button>
            </div>

            <div style={{marginTop: '15px', textAlign: 'center'}}>
              <button type="button" onClick={() => { setPerfil(null); setCurrentStep(1); }} style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}><FaArrowLeft /> Mudar Perfil</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}