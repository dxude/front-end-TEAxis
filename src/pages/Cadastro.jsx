import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Cadastro.css';
import '../Styles/Login.css';
import { FaArrowLeft, FaUser, FaBriefcase, FaGoogle, FaEnvelope, FaLock, FaCalendarAlt, FaBrain, FaMapMarkerAlt, FaVenusMars, FaGenderless, FaTransgender, FaMale, FaQuestionCircle, FaHeart, FaComments, FaSchool, FaGraduationCap, FaIdBadge, FaClock } from 'react-icons/fa';
import { signInWithGoogle } from '../firebase';

const API_REGISTRO_USUARIO = 'SUA_URL_DA_API/api/v1/usuarios/registro'; 
const API_REGISTRO_PROFISSIONAL = 'SUA_URL_DA_API/api/v1/profissionais/registro';

const DEFAULT_SUGGESTIONS_PROFISSIONAL = {
  especializacoes: ['Terapia Ocupacional','Psicologia','Fonoaudiologia','Neuropsicologia','Pedagogia','Psiquiatria'],
  metodosUtilizados: ['TCC','ABA','Psicodrama','Terapia Cognitivo-Comportamental','Terapia Familiar','Treinamento de Habilidades Sociais']
};

const DAYS_OF_WEEK = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

const BRAZIL_STATES = [
  { code: 'AC', name: 'Acre', cities: ['Rio Branco','Cruzeiro do Sul'] },
  { code: 'AL', name: 'Alagoas', cities: ['Maceió','Arapiraca'] },
  { code: 'AP', name: 'Amapá', cities: ['Macapá','Santana'] },
  { code: 'AM', name: 'Amazonas', cities: ['Manaus','Parintins','Itacoatiara'] },
  { code: 'BA', name: 'Bahia', cities: ['Salvador','Feira de Santana','Vitória da Conquista'] },
  { code: 'CE', name: 'Ceará', cities: ['Fortaleza','Sobral','Juazeiro do Norte'] },
  { code: 'DF', name: 'Distrito Federal', cities: ['Brasília'] },
  { code: 'ES', name: 'Espírito Santo', cities: ['Vitória','Vila Velha','Serra'] },
  { code: 'GO', name: 'Goiás', cities: ['Goiânia','Anápolis','Luziânia'] },
  { code: 'MA', name: 'Maranhão', cities: ['São Luís','Imperatriz'] },
  { code: 'MT', name: 'Mato Grosso', cities: ['Cuiabá','Rondonópolis'] },
  { code: 'MS', name: 'Mato Grosso do Sul', cities: ['Campo Grande','Dourados'] },
  { code: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte','Uberlândia','Contagem','Juiz de Fora'] },
  { code: 'PA', name: 'Pará', cities: ['Belém','Ananindeua','Santarém'] },
  { code: 'PB', name: 'Paraíba', cities: ['João Pessoa','Campina Grande'] },
  { code: 'PR', name: 'Paraná', cities: ['Curitiba','Londrina','Maringá'] },
  { code: 'PE', name: 'Pernambuco', cities: ['Recife','Olinda','Jaboatão dos Guararapes','Caruaru'] },
  { code: 'PI', name: 'Piauí', cities: ['Teresina','Parnamirim'] },
  { code: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro','Niterói','Petrópolis','Duque de Caxias'] },
  { code: 'RN', name: 'Rio Grande do Norte', cities: ['Natal','Mossoró'] },
  { code: 'RS', name: 'Rio Grande do Sul', cities: ['Porto Alegre','Caxias do Sul','Pelotas'] },
  { code: 'RO', name: 'Rondônia', cities: ['Porto Velho','Ji-Paraná'] },
  { code: 'RR', name: 'Roraima', cities: ['Boa Vista'] },
  { code: 'SC', name: 'Santa Catarina', cities: ['Florianópolis','Joinville','Blumenau'] },
  { code: 'SP', name: 'São Paulo', cities: ['São Paulo','Campinas','Santos','São José dos Campos'] },
  { code: 'SE', name: 'Sergipe', cities: ['Aracaju','Nossa Senhora do Socorro'] },
  { code: 'TO', name: 'Tocantins', cities: ['Palmas','Araguaína'] }
];

const GENDER_OPTIONS = [
  { key: 'cis', label: 'Cisgênero', desc: 'Pessoa cuja identidade de gênero corresponde ao sexo atribuído no nascimento.', icon: FaVenusMars },
  { key: 'trans', label: 'Transgênero', desc: 'Pessoa cuja identidade de gênero difere do sexo atribuído no nascimento.', icon: FaTransgender },
  { key: 'nb', label: 'Não-binário', desc: 'Identidade fora das categorias exclusivamente masculino ou feminino.', icon: FaGenderless },
  { key: 'fluid', label: 'Gênero-fluido', desc: 'Identidade de gênero que pode variar ao longo do tempo.', icon: FaMale },
  { key: 'nao-dizer', label: 'Prefiro não dizer', desc: 'Prefere não informar sua identidade de gênero.', icon: FaQuestionCircle }
];

const DEFAULT_SUGGESTIONS = {
  hobbies: ['Leitura','Música','Esportes','Desenho','Jogos','Programação','Culinária','Dança'],
  modoComunicacao: ['Oral','Escrita','Visual','Aumentativa/Alternativa','Gestual','Simbólica'],
  preferenciasSensoriais: ['Sensível a ruídos','Sensível a luz','Prefere silêncio','Texturas específicas','Conforto tátil'],
  neurodivergencias: ['Autismo','TDAH','Dislexia','Dispraxia','TEA','Transtorno do Processamento Sensorial','Altas Habilidades']
};

// FUNÇÃO FALTANTE PARA FORMATAR A DISPONIBILIDADE
const formatDisponibilidade = (days, start, end) => {
  if (!days || days.length === 0) return '';
  return `${days.join(', ')} das ${String(start).padStart(2, '0')}:00 às ${String(end).padStart(2, '0')}:00`;
};

const Cadastro = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Conta
  const [account, setAccount] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });

  // Detalhes - usuario
  const [detalhesUsuario, setDetalhesUsuario] = useState({ dataNascimento: '', tipoNeurodivergencia: [], hobbies: [], genero: '', cidade: '', estado: '', distrito: '', preferenciasSensoriais: [], modoComunicacao: [], historicoEscolar: '' });

  // UI helpers
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [genderHoverText, setGenderHoverText] = useState('');
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [stateCities, setStateCities] = useState([]);
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);

  // Detalhes - profissional
  const [detalhesProfissional, setDetalhesProfissional] = useState({ dataNascimento: '', certificacoes: '', especializacoes: [], metodosUtilizados: [], disponibilidade: '', cidade: '', estado: '', genero: '' });
  const [disponibilidadeDays, setDisponibilidadeDays] = useState([]);
  const [disponibilidadeStart, setDisponibilidadeStart] = useState(9);
  const [disponibilidadeEnd, setDisponibilidadeEnd] = useState(17);

  const [showSimPopup, setShowSimPopup] = useState(false);
  const [simPopupMessage, setSimPopupMessage] = useState('');

  const addChipProf = (key, value) => setDetalhesProfissional((p) => ({ ...p, [key]: Array.from(new Set([...(p[key]||[]), value])) }));
  const removeChipProf = (key, value) => setDetalhesProfissional((p) => ({ ...p, [key]: (p[key]||[]).filter(v => v !== value) }));
  const toggleDisponibilidadeDay = (day) => setDisponibilidadeDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const handleAccountChange = (e) => setAccount({ ...account, [e.target.name]: e.target.value });
  
  const handleDetalhesUsuarioChange = (e) => {
    if (e && e.target && e.target.name) {
      setDetalhesUsuario({ ...detalhesUsuario, [e.target.name]: e.target.value });
    } else if (e && e.name) {
      setDetalhesUsuario({ ...detalhesUsuario, [e.name]: e.value });
    }
  };

  // CORREÇÃO DO LOOP INFINITO 1: Só atualiza se a data for realmente nova
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const formattedDate = `${dobYear}-${String(dobMonth).padStart(2,'0')}-${String(dobDay).padStart(2,'0')}`;
      setDetalhesUsuario((prev) => {
        if (prev.dataNascimento === formattedDate) return prev; // Para o looping aqui!
        return { ...prev, dataNascimento: formattedDate };
      });
    }
  }, [dobDay, dobMonth, dobYear]);

  const handleStateChange = (e) => {
    const code = e.target.value;
    setDetalhesUsuario((p) => ({ ...p, estado: code, cidade: '' }));
    const found = BRAZIL_STATES.find(s => s.code === code);
    setStateCities(found ? found.cities : []);
  };

  useEffect(() => {
    if (!cityQuery) { 
      setCitySuggestions(prev => prev.length === 0 ? prev : []); 
      return; 
    }
    const q = cityQuery.trim().toLowerCase();
    if (!q) { 
      setCitySuggestions(prev => prev.length === 0 ? prev : []); 
      return; 
    }
    const source = (stateCities && stateCities.length>0) ? stateCities : BRAZIL_STATES.flatMap(s => s.cities || []);
    const matches = source.filter(c => c.toLowerCase().startsWith(q)).slice(0, 50);
    setCitySuggestions(matches);
  }, [cityQuery, stateCities]);

  const addChip = (key, value) => setDetalhesUsuario((p) => ({ ...p, [key]: Array.from(new Set([...(p[key]||[]), value])) }));
  const removeChip = (key, value) => setDetalhesUsuario((p) => ({ ...p, [key]: (p[key]||[]).filter(v => v !== value) }));
  
  const handleDetalhesProfissionalChange = (e) => {
    if (e && e.target && e.target.name) {
      setDetalhesProfissional({ ...detalhesProfissional, [e.target.name]: e.target.value });
    } else if (e && e.name) {
      setDetalhesProfissional({ ...detalhesProfissional, [e.name]: e.value });
    }
  };

  // CORREÇÃO DO LOOP INFINITO 2: Trava de atualização da disponibilidade
  useEffect(() => {
    const novaDisponibilidade = formatDisponibilidade(disponibilidadeDays, disponibilidadeStart, disponibilidadeEnd);
    setDetalhesProfissional((prev) => {
      if (prev.disponibilidade === novaDisponibilidade) return prev; // Para o looping aqui!
      return { ...prev, disponibilidade: novaDisponibilidade };
    });
  }, [disponibilidadeDays, disponibilidadeStart, disponibilidadeEnd]);

  const handleGoogleSignup = async () => {
    try {
      console.log('🔐 Iniciando signup com Google...');
      const { user, token } = await signInWithGoogle();
      
      console.log('✅ Google auth sucesso:', user.email);
      localStorage.setItem('teaxis_auth_token', token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('login_method', 'google');
      const role = localStorage.getItem('teaxis_role') || 'usuario';
      
      alert('✅ Cadastro com Google realizado com sucesso!');
      
      if (role === 'profissional') {
        navigate('/dashboard-profissional');
      } else {
        navigate('/dashboard-usuario');
      }
    } catch (error) {
      console.error('❌ ERRO ao fazer signup com Google:', error);
      let mensagemErro = 'Erro ao fazer signup com Google.';
      
      if (error.code === 'auth/popup-blocked') {
        mensagemErro = '❌ Popup bloqueado. Permita popups no navegador.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        mensagemErro = '❌ Signup cancelado pelo usuário.';
      } else if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/configuration-not-found') {
        mensagemErro = '❌ Domínio não autorizado no Firebase. Adicione a URL atual lá no painel.';
      } else if (error.code === 'auth/network-request-failed') {
        mensagemErro = '❌ Erro de conexão. Verifique internet.';
      }
      
      alert(mensagemErro);
    }
  };

  const handleCadastroSubmit = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
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

    const payload = {
      account,
      perfil,
      detalhesUsuario: perfil === 'usuario' ? detalhesUsuario : null,
      detalhesProfissional: perfil === 'profissional' ? detalhesProfissional : null
    };

    console.log('Dados para registo:', payload);
    alert('Cadastro executado com sucesso (demo).');
    navigate('/login');
  };

  const handleBackToPerfil = () => {
    setPerfil(null);
    setCurrentStep(1);
  };

  return (
    <div className="cadastro-page-container">
      <div className="auth-page-shell">
        <aside className="auth-side-panel">
          <span className="eyebrow">Criação de conta</span>
          <h1>Cadastre-se com confiança e clareza</h1>
          <p>Complete um fluxo guiado e inclusivo para se conectar a profissionais, familiares e serviços com segurança.</p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <FaHeart className="feature-icon" />
              <div>
                <strong>Cadastro em etapas</strong>
                <p>Formulário simplificado para todo mundo.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <FaLock className="feature-icon" />
              <div>
                <strong>Dados protegidos</strong>
                <p>Privacidade e segurança em todo o processo.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <FaComments className="feature-icon" />
              <div>
                <strong>Comunicação fácil</strong>
                <p>Perfil pronto para conversas e acompanhamentos.</p>
              </div>
            </div>
          </div>

          <div className="auth-panel-footer">
            <p>Já tem conta?</p>
            <Link to="/login" className="text-link">Faça login</Link>
          </div>
        </aside>

        <main className="auth-page-content">
          {perfil ? (
            <ErrorBoundary>
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
              disponibilidadeDays={disponibilidadeDays}
              setDisponibilidadeDays={setDisponibilidadeDays}
              disponibilidadeStart={disponibilidadeStart}
              disponibilidadeEnd={disponibilidadeEnd}
              setDisponibilidadeStart={setDisponibilidadeStart}
              setDisponibilidadeEnd={setDisponibilidadeEnd}
              toggleDisponibilidadeDay={toggleDisponibilidadeDay}
              onSubmit={handleCadastroSubmit}
              onGoogleSignup={handleGoogleSignup}
                  onBackToPerfil={handleBackToPerfil}
                  dobDay={dobDay}
                  setDobDay={setDobDay}
                  dobMonth={dobMonth}
                  setDobMonth={setDobMonth}
                  dobYear={dobYear}
                  setDobYear={setDobYear}
                  GENDER_OPTIONS={GENDER_OPTIONS}
                  showGenderMenu={showGenderMenu}
                  setShowGenderMenu={setShowGenderMenu}
                  genderHoverText={genderHoverText}
                  setGenderHoverText={setGenderHoverText}
                  BRAZIL_STATES={BRAZIL_STATES}
                  stateCities={stateCities}
                  handleStateChange={handleStateChange}
                  cityQuery={cityQuery}
                  setCityQuery={setCityQuery}
                  citySuggestions={citySuggestions}
                  setCitySuggestions={setCitySuggestions}
                  DEFAULT_SUGGESTIONS={DEFAULT_SUGGESTIONS}
                  addChip={addChip}
                  removeChip={removeChip}
                  addChipProf={addChipProf}
                  removeChipProf={removeChipProf}
                  DEFAULT_SUGGESTIONS_PROFISSIONAL={DEFAULT_SUGGESTIONS_PROFISSIONAL}
            />
            </ErrorBoundary>
          ) : (
            <PerfilSelector setPerfil={setPerfil} />
          )}
        </main>
      </div>

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

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  componentDidCatch(error, info) { this.setState({ error, info }); }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:20,background:'#fff0f6',border:'1px solid #ffccd5',borderRadius:8}}>
          <h3 style={{margin:0,color:'#7b1026'}}>Erro ao renderizar o formulário</h3>
          <pre style={{whiteSpace:'pre-wrap',color:'#3b0b17'}}>{String(this.state.error && this.state.error.toString())}</pre>
          <details style={{color:'#3b0b17'}}>
            <summary>Stack</summary>
            <pre style={{whiteSpace:'pre-wrap'}}>{this.state.info && this.state.info.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const CadastroForm = ({ tipo, currentStep, setCurrentStep, account, handleAccountChange, detalhesUsuario, handleDetalhesUsuarioChange, detalhesProfissional, handleDetalhesProfissionalChange, disponibilidadeDays, setDisponibilidadeDays, disponibilidadeStart, disponibilidadeEnd, setDisponibilidadeStart, setDisponibilidadeEnd, toggleDisponibilidadeDay, onSubmit, onGoogleSignup, onBackToPerfil, dobDay, setDobDay, dobMonth, setDobMonth, dobYear, setDobYear, GENDER_OPTIONS, showGenderMenu, setShowGenderMenu, genderHoverText, setGenderHoverText, BRAZIL_STATES, stateCities, handleStateChange, cityQuery, setCityQuery, citySuggestions, setCitySuggestions, DEFAULT_SUGGESTIONS, addChip, removeChip, addChipProf, removeChipProf, DEFAULT_SUGGESTIONS_PROFISSIONAL }) => {
    return (
        <form className="cadastro-form auth-card" onSubmit={onSubmit}>
            <div className="form-header">
                <div>
                    <span className="eyebrow">Cadastro</span>
                    <h2 className="text-dark mb-2">Crie a sua conta como {tipo === 'usuario' ? 'Utilizador' : 'Profissional'}</h2>
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

            <button type="button" className="btn btn-social btn-google mb-4" onClick={onGoogleSignup}>
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
                    <p className="step-description">Agora complete os detalhes adicionais para personalizarmos sua experiência.</p>

                    {tipo === 'usuario' && (
                      <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg details-panel">
                        <h3 className="text-lilac-main font-bold mb-4">Dados para o Perfil de Cuidado</h3>

                        {/* Data de Nascimento */}
                        <div className="input-group">
                          <label><FaCalendarAlt /> Data de Nascimento:</label>
                          <div className="dob-selects">
                            <select value={dobDay} onChange={(e)=>setDobDay(e.target.value)} aria-label="Dia">
                              <option value="">Dia</option>
                              {Array.from({length:31}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                            <select value={dobMonth} onChange={(e)=>setDobMonth(e.target.value)} aria-label="Mês">
                              <option value="">Mês</option>
                              {['01 - Jan','02 - Fev','03 - Mar','04 - Abr','05 - Mai','06 - Jun','07 - Jul','08 - Ago','09 - Set','10 - Out','11 - Nov','12 - Dez'].map((m,idx)=> <option key={idx} value={idx+1}>{m}</option>)}
                            </select>
                            <select value={dobYear} onChange={(e)=>setDobYear(e.target.value)} aria-label="Ano">
                              <option value="">Ano</option>
                              {Array.from({length:100}).map((_,i)=>{
                                const year = new Date().getFullYear()-i;
                                return <option key={year} value={year}>{year}</option>;
                              })}
                            </select>
                          </div>
                        </div>

                        {/* Gênero */}
                        <div className="input-group">
                          <label><FaVenusMars /> Gênero:</label>
                          <div className="gender-control">
                            <button type="button" className={`gender-toggle ${detalhesUsuario.genero ? 'selected' : ''}`} onClick={()=>setShowGenderMenu(!showGenderMenu)}>
                              <span>{detalhesUsuario.genero || 'Escolha ou adicione seu gênero'}</span>
                            </button>
                            {showGenderMenu && (
                              <div className="gender-menu">
                                <div className="gender-menu-grid">
                                  {GENDER_OPTIONS.map(opt => (
                                    <button key={opt.key}
                                      type="button"
                                      className={`gender-option ${detalhesUsuario.genero === opt.label ? 'active' : ''}`}
                                      onMouseEnter={()=>setGenderHoverText(opt.desc)}
                                      onMouseLeave={()=>setGenderHoverText('')}
                                      onClick={()=>{ handleDetalhesUsuarioChange({ name: 'genero', value: opt.label }); setShowGenderMenu(false); }}
                                    >
                                      <span className="gender-option-meta">
                                        <span className="gender-icon"><opt.icon /></span>
                                        <strong>{opt.label}</strong>
                                      </span>
                                      <span>{opt.desc}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="gender-custom-row">
                                  <input type="text" placeholder="Adicione seu gênero personalizado e pressione Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.currentTarget.value.trim()){ handleDetalhesUsuarioChange({ name:'genero', value: e.currentTarget.value.trim() }); setShowGenderMenu(false); e.currentTarget.value=''; e.preventDefault(); } }} />
                                </div>
                              </div>
                            )}
                            <div className="gender-tooltip">{genderHoverText || 'Passe o mouse sobre uma opção para ver mais detalhes.'}</div>
                          </div>
                        </div>

                        {/* Neurodivergência */}
                        <div className="input-group">
                          <label><FaBrain /> Tipo de Neurodivergência:</label>
                          <div className="chip-list">
                            {(detalhesUsuario.tipoNeurodivergencia||[]).map(item => (
                              <span className="chip" key={item}>{item} <button type="button" onClick={()=>removeChip('tipoNeurodivergencia',item)}>×</button></span>
                            ))}
                          </div>
                          <div className="suggestions">
                            {DEFAULT_SUGGESTIONS.neurodivergencias.map(opt => (
                              <button type="button" key={opt} className="suggestion" onClick={()=>addChip('tipoNeurodivergencia',opt)}>{opt}</button>
                            ))}
                          </div>
                          <input id="tipoNeurodivergencia" name="tipoNeurodivergencia" type="text" placeholder="Digite ou adicione sua neurodivergência e pressione Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.currentTarget.value.trim()){ addChip('tipoNeurodivergencia', e.currentTarget.value.trim()); e.currentTarget.value=''; e.preventDefault(); } }} />
                        </div>

                        {/* Estado -> Cidade -> Distrito */}
                        <div className="input-group">
                          <label><FaMapMarkerAlt /> Estado:</label>
                          <select name="estado" value={detalhesUsuario.estado} onChange={(e)=>{ handleStateChange(e); }}>
                            <option value="">Selecione o estado</option>
                            {BRAZIL_STATES.map(s=> <option key={s.code} value={s.code}>{s.name}</option>)}
                          </select>
                          <label className="mt-2">Cidade:</label>
                          <select name="cidade" value={detalhesUsuario.cidade} onChange={handleDetalhesUsuarioChange}>
                            <option value="">Selecione a cidade</option>
                            {stateCities.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <div className="city-search">
                            <input type="text" aria-label="Buscar cidade" placeholder="Ou digite sua cidade para buscar..." value={cityQuery} onChange={(e)=>setCityQuery(e.target.value)} />
                            {citySuggestions.length > 0 && (
                              <ul className="city-suggestions">
                                {citySuggestions.map(c => (
                                  <li key={c} onClick={() => { handleDetalhesUsuarioChange({ name: 'cidade', value: c }); setCityQuery(c); setCitySuggestions([]); }}>{c}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <label className="mt-2">Distrito (livre):</label>
                          <input id="distrito" name="distrito" type="text" placeholder="Ex: Boa Viagem" value={detalhesUsuario.distrito} onChange={handleDetalhesUsuarioChange} />
                        </div>

                        {/* Hobbies */}
                        <div className="input-group">
                          <label><FaHeart /> Hobbies:</label>
                          <div className="chip-list">
                            {(detalhesUsuario.hobbies||[]).map(h => (
                              <span className="chip" key={h}>{h} <button type="button" onClick={()=>removeChip('hobbies',h)}>×</button></span>
                            ))}
                          </div>
                          <div className="suggestions">
                            {DEFAULT_SUGGESTIONS.hobbies.map(s => (
                              <button type="button" key={s} className="suggestion" onClick={()=>addChip('hobbies',s)}>{s}</button>
                            ))}
                          </div>
                          <input placeholder="Adicionar hobby e pressionar Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.target.value.trim()){ addChip('hobbies', e.target.value.trim()); e.target.value=''; e.preventDefault(); } }} />
                        </div>

                        {/* Modo de Comunicação */}
                        <div className="input-group">
                          <label><FaComments /> Modo de Comunicação:</label>
                          <div className="chip-list">
                            {(detalhesUsuario.modoComunicacao||[]).map(m => (
                              <span className="chip" key={m}>{m} <button type="button" onClick={()=>removeChip('modoComunicacao',m)}>×</button></span>
                            ))}
                          </div>
                          <div className="suggestions">
                            {DEFAULT_SUGGESTIONS.modoComunicacao.map(s => (
                              <button type="button" key={s} className="suggestion" onClick={()=>addChip('modoComunicacao',s)}>{s}</button>
                            ))}
                          </div>
                          <input placeholder="Adicionar modo de comunicação e pressionar Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.target.value.trim()){ addChip('modoComunicacao', e.target.value.trim()); e.target.value=''; e.preventDefault(); } }} />
                        </div>

                        {/* Preferências sensoriais */}
                        <div className="input-group">
                          <label>Preferências Sensoriais:</label>
                          <div className="chip-list">
                            {(detalhesUsuario.preferenciasSensoriais||[]).map(p => (
                              <span className="chip" key={p}>{p} <button type="button" onClick={()=>removeChip('preferenciasSensoriais',p)}>×</button></span>
                            ))}
                          </div>
                          <div className="suggestions">
                            {DEFAULT_SUGGESTIONS.preferenciasSensoriais.map(s => (
                              <button type="button" key={s} className="suggestion" onClick={()=>addChip('preferenciasSensoriais',s)}>{s}</button>
                            ))}
                          </div>
                          <input placeholder="Adicionar preferência e pressionar Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.target.value.trim()){ addChip('preferenciasSensoriais', e.target.value.trim()); e.target.value=''; e.preventDefault(); } }} />
                        </div>

                        {/* Histórico Escolar */}
                        <div className="input-group">
                          <label><FaSchool /> Histórico Escolar / Acadêmico:</label>
                          <textarea id="historicoEscolar" name="historicoEscolar" placeholder="Descreva suas principais dificuldades relacionadas ao aprendizado." value={detalhesUsuario.historicoEscolar} onChange={handleDetalhesUsuarioChange} rows="3" />
                        </div>
                      </div>
                    )}

                    {tipo === 'profissional' && (
                        <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg details-panel">
                            <h3 className="text-lilac-main font-bold mb-4">Dados de Registo e Atuação</h3>
                            <div className="input-group">
                                <label htmlFor="dataNascimentoProf"><FaCalendarAlt /> Data de Nascimento:</label>
                                <input id="dataNascimentoProf" name="dataNascimento" type="date" value={detalhesProfissional.dataNascimento} onChange={handleDetalhesProfissionalChange} />
                            </div>
                            <div className="input-group">
                              <label><FaVenusMars /> Gênero:</label>
                              <div className="gender-control">
                                <button type="button" className={`gender-toggle ${detalhesProfissional.genero ? 'selected' : ''}`} onClick={()=>setShowGenderMenu(!showGenderMenu)}>
                                  <span>{detalhesProfissional.genero || 'Escolha ou adicione seu gênero'}</span>
                                </button>
                                {showGenderMenu && (
                                  <div className="gender-menu">
                                    <div className="gender-menu-grid">
                                      {GENDER_OPTIONS.map(opt => (
                                        <button key={opt.key}
                                          type="button"
                                          className={`gender-option ${detalhesProfissional.genero === opt.label ? 'active' : ''}`}
                                          onMouseEnter={()=>setGenderHoverText(opt.desc)}
                                          onMouseLeave={()=>setGenderHoverText('')}
                                          onClick={()=>{ handleDetalhesProfissionalChange({ name: 'genero', value: opt.label }); setShowGenderMenu(false); }}
                                        >
                                          <span className="gender-option-meta">
                                            <span className="gender-icon"><opt.icon /></span>
                                            <strong>{opt.label}</strong>
                                          </span>
                                          <span>{opt.desc}</span>
                                        </button>
                                      ))}
                                    </div>
                                    <div className="gender-custom-row">
                                      <input type="text" placeholder="Adicione seu gênero personalizado e pressione Enter" onKeyDown={(e)=>{ if(e.key==='Enter' && e.currentTarget.value.trim()){ handleDetalhesProfissionalChange({ name:'genero', value: e.currentTarget.value.trim() }); setShowGenderMenu(false); e.currentTarget.value=''; e.preventDefault(); } }} />
                                    </div>
                                  </div>
                                )}
                                <div className="gender-tooltip">{genderHoverText || 'Passe o mouse sobre uma opção para ver mais detalhes.'}</div>
                              </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="certificacoes"><FaIdBadge /> Certificações (Registo Profissional):</label>
                                <input id="certificacoes" name="certificacoes" type="text" placeholder="Nº de Registo e Conselho (Ex: CRP 00/0000)" value={detalhesProfissional.certificacoes} onChange={handleDetalhesProfissionalChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="especializacoesProf"><FaGraduationCap /> Especializações:</label>
                                <div className="chip-list">
                                  {(detalhesProfissional.especializacoes||[]).map(item => (
                                    <span className="chip" key={item}>{item} <button type="button" onClick={()=>removeChipProf('especializacoes', item)}>×</button></span>
                                  ))}
                                </div>
                                <div className="suggestions">
                                  {DEFAULT_SUGGESTIONS_PROFISSIONAL.especializacoes.map(opt => (
                                    <button type="button" key={opt} className="suggestion" onClick={()=>addChipProf('especializacoes', opt)}>{opt}</button>
                                  ))}
                                </div>
                                <input id="especializacoesProf" type="text" placeholder="Adicionar especialização e pressionar Enter" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); if(e.currentTarget.value.trim()){ addChipProf('especializacoes', e.currentTarget.value.trim()); e.currentTarget.value=''; } } }} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="metodosUtilizadosProf"><FaGraduationCap /> Métodos/Abordagens Utilizadas:</label>
                                <div className="chip-list">
                                  {(detalhesProfissional.metodosUtilizados||[]).map(item => (
                                    <span className="chip" key={item}>{item} <button type="button" onClick={()=>removeChipProf('metodosUtilizados', item)}>×</button></span>
                                  ))}
                                </div>
                                <div className="suggestions">
                                  {DEFAULT_SUGGESTIONS_PROFISSIONAL.metodosUtilizados.map(opt => (
                                    <button type="button" key={opt} className="suggestion" onClick={()=>addChipProf('metodosUtilizados', opt)}>{opt}</button>
                                  ))}
                                </div>
                                <input id="metodosUtilizadosProf" type="text" placeholder="Adicionar método/abordagem e pressionar Enter" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); if(e.currentTarget.value.trim()){ addChipProf('metodosUtilizados', e.currentTarget.value.trim()); e.currentTarget.value=''; } } }} />
                            </div>
                            <div className="input-group">
                                <label><FaClock /> Disponibilidade (Horário e Dias):</label>
                                <div className="availability-panel">
                                  <div className="availability-days">
                                    {DAYS_OF_WEEK.map((day) => (
                                      <button
                                        key={day}
                                        type="button"
                                        className={`availability-day ${disponibilidadeDays.includes(day) ? 'active' : ''}`}
                                        onClick={() => toggleDisponibilidadeDay(day)}
                                      >
                                        {day}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="availability-range">
                                    <div className="availability-range-row">
                                      <label>Início: {String(disponibilidadeStart).padStart(2,'0')}:00</label>
                                      <input type="range" min="6" max="20" step="1" value={disponibilidadeStart} onChange={(e) => setDisponibilidadeStart(Number(e.target.value))} />
                                    </div>
                                    <div className="availability-range-row">
                                      <label>Fim: {String(disponibilidadeEnd).padStart(2,'0')}:00</label>
                                      <input type="range" min="7" max="22" step="1" value={disponibilidadeEnd} onChange={(e) => setDisponibilidadeEnd(Number(e.target.value))} />
                                    </div>
                                  </div>
                                  <div className="availability-summary">{formatDisponibilidade(disponibilidadeDays, disponibilidadeStart, disponibilidadeEnd) || 'Selecione dias e horário'}</div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="cidadeProf"><FaMapMarkerAlt /> Cidade/Distrito Base:</label>
                                <input id="cidadeProf" name="cidade" type="text" placeholder="Cidade" value={detalhesProfissional.cidade} onChange={handleDetalhesProfissionalChange} />
                                <input id="estadoProf" name="estado" type="text" placeholder="Distrito (Ex: Porto)" value={detalhesProfissional.estado} onChange={handleDetalhesProfissionalChange} className="mt-2" />
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

            <div className="back-action-row">
                <button type="button" className="btn btn-back-profile" onClick={onBackToPerfil}>
                    <FaArrowLeft /> Voltar à escolha de perfil
                </button>
            </div>
        </form>
    );
};

// Componente de Seleção de Perfil
const PerfilSelector = ({ setPerfil }) => (
    <div className="perfil-selector">
        <h2 className="text-dark mb-8 text-2xl font-bold">Como quer usar o sistema?</h2>
        
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