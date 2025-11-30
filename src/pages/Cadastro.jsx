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
    

    // Estado e função para o popup simulado (mesmo comportamento do Login.jsx)
    const [showSimPopup, setShowSimPopup] = useState(false);
    const [simPopupMessage, setSimPopupMessage] = useState('');

    const handleSimulatedGoogle = async () => {
        if (!perfil) {
            alert('Por favor, selecione primeiro se você é Utilizador ou Profissional.');
            return;
        }

        if (SIMULATED_GOOGLE_LOGIN) {
            const token = `simulated_token_${Date.now()}`;
            localStorage.setItem('teaxis_auth_token', token);
            localStorage.setItem('login_method', 'google_simulated');
            localStorage.setItem('user_email', email || 'usuario.simulado@example.com');
            setSimPopupMessage('✅ Login/Cadastro Simulado bem-sucedido! Redirecionando...');
            setShowSimPopup(true);
            setTimeout(() => {
                setShowSimPopup(false);
                navigate('/dashboard-usuario');
            }, 1500);
            return;
        }

        alert('Integração social removida — apenas modo simulado disponível.');
    };

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

            {/* Login Social (agora apenas simulado) */}
            <button type="button" className="btn btn-social btn-google mb-4" onClick={() => handleSimulatedGoogle()}>
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

            {showSimPopup && (
                <div className="sim-popup" role="dialog" aria-live="polite">
                    <div style={{ width: '100%', textAlign: 'center', fontWeight: 600, color: '#202124' }}>
                        Redirecionando..
                    </div>
                </div>
            )}
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