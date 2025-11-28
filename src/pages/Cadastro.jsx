import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../Styles/Cadastro.css'; 
import { FaUser, FaBriefcase, FaGoogle, FaEnvelope, FaLock, FaCalendarAlt, FaBrain, FaMapMarkerAlt, FaVenusMars, FaHeart, FaComments, FaSchool, FaGraduationCap, FaIdBadge, FaClock } from 'react-icons/fa';

// Endpoints da sua API de Registro. SUBSTITUA PELAS SUAS URLS REAIS!
const API_REGISTRO_USUARIO = 'SUA_URL_DA_API/api/v1/usuarios/registro'; 
const API_REGISTRO_PROFISSIONAL = 'SUA_URL_DA_API/api/v1/profissionais/registro'; 
// NOVO ENDPOINT: Onde o backend recebe o token do Google para autenticar/cadastrar
const API_LOGIN_SOCIAL = 'SUA_URL_DA_API/api/v1/auth/google'; 

const GOOGLE_CLIENT_ID = '758588038448-q7gogvej1nfkmftglh6669iv1huqkvu3.apps.googleusercontent.com'; 

const Cadastro = () => {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    
    // Estados Comuns (Email/Senha/Nome)
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [nome, setNome] = useState('');

    // Estado para Dados do UTILIZADOR (DTO 1: DadosCadastroUsuario)
    const [dadosUsuario, setDadosUsuario] = useState({
        dataNascimento: '', tipoNeurodivergencia: '', hobbies: '', genero: '',
        cidade: '', estado: '', preferenciasSensoriais: '', modoComunicacao: '',
        historicoEscolar: ''
    });

    // Estado para Dados do PROFISSIONAL (DTO 2: CadastroProfissionalDTO)
    const [dadosProfissional, setDadosProfissional] = useState({
        dataNascimento: '',
        certificacoes: '',
        especializacoes: '',
        metodosUtilizados: '',
        disponibilidade: '',
        cidade: '',
        estado: '',
    });

    // Funções de atualização
    const handleDadosUsuarioChange = (e) => {
        setDadosUsuario({ ...dadosUsuario, [e.target.name]: e.target.value });
    };

    const handleDadosProfissionalChange = (e) => {
        setDadosProfissional({ ...dadosProfissional, [e.target.name]: e.target.value });
    };


    const handleCadastroSubmit = async (e) => {
        e.preventDefault(); 

        if (senha !== confirmarSenha) {
            alert("As palavras-passes não coincidem.");
            return;
        }

        const endpoint = perfil === 'usuario' ? API_REGISTRO_USUARIO : API_REGISTRO_PROFISSIONAL;
        let dadosParaAPI = {};

        try {
            if (perfil === 'usuario') {
                dadosParaAPI = {
                    nome, email, senha, tipo: perfil,
                    dataNascimento: dadosUsuario.dataNascimento, 
                    tipoNeurodivergencia: dadosUsuario.tipoNeurodivergencia,
                    hobbies: dadosUsuario.hobbies.split(',').map(h => h.trim()).filter(h => h),
                    genero: dadosUsuario.genero, cidade: dadosUsuario.cidade, estado: dadosUsuario.estado,
                    preferenciasSensoriais: dadosUsuario.preferenciasSensoriais,
                    modoComunicacao: dadosUsuario.modoComunicacao,
                    historicoEscolar: dadosUsuario.historicoEscolar
                };
            } else if (perfil === 'profissional') {
                dadosParaAPI = {
                    nome, email, senha,
                    dataNascimento: dadosProfissional.dataNascimento,
                    cidade: dadosProfissional.cidade,
                    estado: dadosProfissional.estado,
                    
                    certificacoes: dadosProfissional.certificacoes,
                    especializacoes: dadosProfissional.especializacoes,
                    metodosUtilizados: dadosProfissional.metodosUtilizados,
                    disponibilidade: dadosProfissional.disponibilidade
                };
            }

            console.log(`Enviando para ${endpoint}:`, dadosParaAPI);

            const apiResponse = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaAPI)
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.message || `Erro ${apiResponse.status} ao registar o perfil. Status: ${apiResponse.statusText}`);
            }

            // SUCESSO E REDIRECIONAMENTO
            alert("✅ Registo realizado com sucesso! Faça login para continuar.");
            navigate('/login'); 

        } catch (error) {
            alert(error.message);
        }
    };
    

    // FUNÇÃO DE LOGIN SOCIAL COM GOOGLE (GIS + API)
    const handleGoogleLoginAPI = async (token) => {
        try {
            // 1. Envia o token JWT do Google + o tipo de perfil para o backend
            const response = await fetch(API_LOGIN_SOCIAL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: token,
                    perfil_tipo: perfil // O backend saberá se deve registrar ou logar
                })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Falha na autenticação com Google na API.');
            }

            const data = await response.json();
            
            // 2. O backend retorna o token de autenticação (JWT próprio do TEAXIS)
            const teaxisToken = data.token; 
            
            if (teaxisToken) {
                // 3. Salva o token localmente e redireciona
                localStorage.setItem('teaxis_auth_token', teaxisToken);
                alert(`✅ Login Social bem-sucedido! Redirecionando para o Dashboard.`);
                navigate('/dashboard-usuario');
            }

        } catch (error) {
            alert(error.message);
        }
    };

    // ⚠️ FUNÇÃO QUE INICIA O PROCESSO DO GOOGLE (Gatilha o pop-up ou redireciona)
    const initGoogleLogin = () => {
        if (!perfil) {
            alert("Por favor, selecione primeiro se você é Utilizador ou Profissional.");
            return;
        }

        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.prompt(); // Inicia o processo de pop-up ou One Tap
        } else {
            alert("Serviços do Google ainda não carregados. Tente novamente em instantes.");
        }
    };
    
    // ⚠️ useEffect para INICIALIZAR o GIS e manipular o token
    React.useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                // Função que captura o token JWT retornado pelo Google
                callback: (response) => {
                    // response.credential é o ID Token JWT
                    if (response.credential) {
                        handleGoogleLoginAPI(response.credential);
                    }
                },
                ux_mode: "popup" 
            });
        }
    }, [perfil, navigate]); 

    const PerfilSelector = () => (
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

    const CadastroForm = ({ tipo }) => (
        <form className="cadastro-form" onSubmit={handleCadastroSubmit}>
            <h2 className="text-dark mb-8 text-2xl font-bold">
                Crie a sua conta como {tipo === 'usuario' ? 'Utilizador' : 'Profissional'}
            </h2>

            {/* Login Social (CONECTADO) */}
            <button type="button" className="btn btn-social btn-google mb-4" onClick={initGoogleLogin}>
                <FaGoogle className="mr-2" /> Continuar com Google
            </button>
            
            <div className="divider mb-4">
                <span>OU REGISTE COM EMAIL</span>
            </div>

            {/* CAMPOS COMUNS */}
            <div className="input-group">
                <label htmlFor="nome"><FaUser /> Nome Completo:</label>
                <input id="nome" type="text" placeholder="Insira o seu nome" required onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="email"><FaEnvelope /> Email:</label>
                <input id="email" type="email" placeholder="Insira o seu email" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="senha"><FaLock /> Palavra-passe:</label>
                <input id="senha" type="password" placeholder="Crie a sua palavra-passe" required onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div className="input-group">
                <label htmlFor="confirmar">Confirme a Palavra-passe:</label>
                <input id="confirmar" type="password" placeholder="Repita a palavra-passe" required onChange={(e) => setConfirmarSenha(e.target.value)} />
            </div>
            
            {tipo === 'usuario' && (
                <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg">
                    <h3 className="text-lilac-main font-bold mb-4">Dados para o Perfil de Cuidado</h3>
                    
                    <div className="input-group">
                        <label htmlFor="dataNascimento"><FaCalendarAlt /> Data de Nascimento:</label>
                        <input id="dataNascimento" name="dataNascimento" type="date" required onChange={handleDadosUsuarioChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="genero"><FaVenusMars /> Género:</label>
                        <input id="genero" name="genero" type="text" placeholder="Género" onChange={handleDadosUsuarioChange} />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="tipoNeurodivergencia"><FaBrain /> Tipo de Neurodivergência:</label>
                        <input id="tipoNeurodivergencia" name="tipoNeurodivergencia" type="text" placeholder="Ex: Autismo, TDAH, Dislexia" onChange={handleDadosUsuarioChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="cidade"><FaMapMarkerAlt /> Cidade/Distrito:</label>
                        <input id="cidade" name="cidade" type="text" placeholder="Cidade" required onChange={handleDadosUsuarioChange} />
                        <input id="estado" name="estado" type="text" placeholder="Distrito (Ex: Porto)" required onChange={handleDadosUsuarioChange} className="mt-2" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="hobbies"><FaHeart /> Hobbies (separados por vírgula):</label>
                        <input id="hobbies" name="hobbies" type="text" placeholder="Ex: Leitura, Desportos, Música" onChange={handleDadosUsuarioChange} />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="modoComunicacao"><FaComments /> Modo de Comunicação:</label>
                        <input id="modoComunicacao" name="modoComunicacao" type="text" placeholder="Ex: Oral, Escrita, Visual" onChange={handleDadosUsuarioChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="preferenciasSensoriais">Preferências Sensoriais:</label>
                        <textarea id="preferenciasSensoriais" name="preferenciasSensoriais" placeholder="Sensibilidades a texturas, ruídos, luzes, etc." onChange={handleDadosUsuarioChange} rows="2" />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="historicoEscolar"><FaSchool /> Histórico Escolar (Resumo):</label>
                        <textarea id="historicoEscolar" name="historicoEscolar" placeholder="Ex: Último ano cursado, principais dificuldades" onChange={handleDadosUsuarioChange} rows="2" />
                    </div>
                </div>
            )}
            
            {tipo === 'profissional' && (
                 <div className="dados-adicionais mt-6 p-4 border border-lilac-main rounded-lg">
                    <h3 className="text-lilac-main font-bold mb-4">Dados de Registo e Atuação</h3>
                    
                    <div className="input-group">
                        <label htmlFor="dataNascimentoProf"><FaCalendarAlt /> Data de Nascimento:</label>
                        <input id="dataNascimentoProf" name="dataNascimento" type="date" required onChange={handleDadosProfissionalChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="certificacoes"><FaIdBadge /> Certificações (Registo Profissional):</label>
                        <input id="certificacoes" name="certificacoes" type="text" required placeholder="Nº de Registo e Conselho (Ex: CRP 00/0000)" onChange={handleDadosProfissionalChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="especializacoes"><FaGraduationCap /> Especializações:</label>
                        <textarea id="especializacoes" name="especializacoes" type="text" required placeholder="Áreas de foco (separadas por vírgula)" onChange={handleDadosProfissionalChange} rows="2" />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="metodosUtilizados"><FaGraduationCap /> Métodos/Abordagens Utilizadas:</label>
                        <textarea id="metodosUtilizados" name="metodosUtilizados" placeholder="Ex: TCC, ABA, Psicodrama" onChange={handleDadosProfissionalChange} rows="2" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="disponibilidade"><FaClock /> Disponibilidade (Horário e Dias):</label>
                        <input id="disponibilidade" name="disponibilidade" type="text" placeholder="Ex: Seg/Qua/Sex, 14h-18h" required onChange={handleDadosProfissionalChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="cidadeProf"><FaMapMarkerAlt /> Cidade/Distrito Base:</label>
                        <input id="cidadeProf" name="cidade" type="text" placeholder="Cidade" required onChange={handleDadosProfissionalChange} />
                        <input id="estadoProf" name="estado" type="text" placeholder="Distrito (Ex: Porto)" required onChange={handleDadosProfissionalChange} className="mt-2" />
                    </div>
                </div>
            )}

            {/* Botão CADASTRAR */}
            <button type="submit" className="btn btn-primary-green btn-full mt-6">
                REGISTAR E CONCLUIR
            </button>
            
            <p className="login-link mt-4 text-center">
                <a href="#" onClick={() => setPerfil(null)} className="text-lilac-main font-semibold">
                    &larr; Voltar à escolha de perfil
                </a>
            </p>
        </form>
    );
    
    // Renderiza o seletor ou o formulário, dependendo do estado
    return (
        <div className="cadastro-page-container">
            {perfil ? <CadastroForm tipo={perfil} /> : <PerfilSelector setPerfil={setPerfil} />}
        </div>
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