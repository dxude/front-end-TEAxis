import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha"; 
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

// Endpoints da sua API de Registro. SUBSTITUA PELA SUA URL
const API_LOGIN_SOCIAL = 'SUA_URL_DA_API/api/v1/auth/google'; 
const API_LOGIN_EMAIL = 'SUA_URL_DA_API/api/v1/auth/login'; 

const GOOGLE_CLIENT_ID = '758588038448-q7gogvej1nfkmftglh6669iv1huqkvu3.apps.googleusercontent.com'; 

const Login = () => {
    const navigate = useNavigate();
    const [captchaValido, setCaptchaValido] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleCaptcha = (value) => {
        setCaptchaValido(!!value);
    };

    const handleGoogleLoginAPI = async (token) => {
        try {
            console.log('🔐 Token do Google recebido:', token.substring(0, 50) + '...');
            
            // Verifica se a API está configurada
            if (API_LOGIN_SOCIAL.includes('SUA_URL_DA_API')) {
                // Modo de teste/desenvolvimento: salva o token no localStorage e simula sucesso
                console.log('⚠️ API_LOGIN_SOCIAL não configurada. Modo teste ativado.');
                localStorage.setItem('teaxis_auth_token', token);
                localStorage.setItem('login_method', 'google');
                alert(`✅ Login Social bem-sucedido (TESTE)! Redirecionando para o Dashboard.`);
                navigate('/dashboard-usuario');
                return;
            }

            // 1. Envia o token JWT do Google para o backend
            const response = await fetch(API_LOGIN_SOCIAL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: token,
                    // O backend deve agora verificar o perfil do usuário existente
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
                localStorage.setItem('login_method', 'google');
                alert(`✅ Login Social bem-sucedido! Redirecionando para o Dashboard.`);
                navigate('/dashboard-usuario');
            }

        } catch (error) {
            console.error('❌ Erro no login social:', error);
            alert(error.message);
        }
    };

    // ⚠️ useEffect para INICIALIZAR o GIS (não mais necessário com @react-oauth/google)
    React.useEffect(() => {
        // A biblioteca @react-oauth/google cuida da inicialização do Google
        console.log('✅ Login.jsx carregado e pronto para Google Sign-In');
    }, [navigate]); 

    const handleGoogleLoginInit = () => {
        // O botão GoogleLogin cuida de tudo — não precisa chamar nada aqui
        console.log('Google Sign-In button clicado');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!captchaValido) {
            alert("Por favor, confirme que você não é um robô antes de continuar.");
            return;
        }

        try {
            // Tenta fazer login com Email e Senha na sua API
            const response = await fetch(API_LOGIN_EMAIL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || "Falha no login. Verifique seu email e senha.");
            }
            
            const data = await response.json();
            
            // O backend retorna o token de autenticação (JWT próprio do TEAXIS)
            const teaxisToken = data.token;
            
            localStorage.setItem('teaxis_auth_token', teaxisToken);
            alert("✅ Login realizado com sucesso! Redirecionando...");
            navigate('/dashboard-usuario');

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="cadastro-page-container">
                <div className="login-form-card"> 
                    <h2>Bem-vindo(a) de volta! 👋</h2>

                    {/* BOTÃO DO GOOGLE CONECTADO AO FLUXO DA API */}
                    <div className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log('✅ Google login sucesso:', credentialResponse);
                                handleGoogleLoginAPI(credentialResponse.credential);
                            }}
                            onError={() => {
                                console.error('❌ Falha no login do Google');
                                alert('Falha ao fazer login com Google. Tente novamente.');
                            }}
                            theme="outline"
                            size="large"
                            text="signin_with"
                        />
                    </div>

                    <div className="divider">OU ENTRE COM EMAIL</div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>
                                <FaEnvelope /> Email:
                            </label>
                            <input 
                                type="email" 
                                placeholder="Seu email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                <FaLock /> Senha:
                            </label>
                            <input 
                                type="password" 
                                placeholder="Sua senha" 
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        
                        {/* === reCAPTCHA === */}
                        <div className="captcha-wrapper">
                            <ReCAPTCHA
                                sitekey="6Lfu2QssAAAAAO7L1Os1H12CYVrIxj0LH1Ck6c6E"
                                onChange={handleCaptcha}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary-green btn-full">
                            ENTRAR
                        </button>
                    </form>

                    <p className="login-link mt-4 text-center">
                        Não tem conta? <a href="/cadastro">Crie sua conta aqui!</a>
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;