import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ReCAPTCHA from "react-google-recaptcha"; 
import "../Styles/Login.css";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

// Endpoints da sua API de Registro. SUBSTITUA PELA SUA URL
const API_LOGIN_SOCIAL = 'SUA_URL_DA_API/api/v1/auth/google'; 
const API_LOGIN_EMAIL = 'SUA_URL_DA_API/api/v1/auth/login'; 

const GOOGLE_CLIENT_ID = 'I758588038448-q7gogvej1nfkmftglh6669iv1huqkvu3.apps.googleusercontent.com'; 

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
                alert(`✅ Login Social bem-sucedido! Redirecionando para o Dashboard.`);
                navigate('/dashboard-usuario');
            }

        } catch (error) {
            alert(error.message);
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
                // Define o modo de UX
                ux_mode: "popup" 
            });
        }
        // Limpeza é crucial se este componente for desmontado rapidamente
        return () => {
             if (window.google) {
                 window.google.accounts.id.cancel(); 
             }
        };
    }, [navigate]); 

    const handleGoogleLoginInit = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.prompt(); // Inicia o processo de pop-up ou One Tap
        } else {
            alert("Serviços do Google ainda não carregados. Tente novamente em instantes.");
        }
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
        <div className="cadastro-page-container">
            <div className="login-form-card"> 
                <h2>Bem-vindo(a) de volta! 👋</h2>

                {/* BOTÃO DO GOOGLE CONECTADO AO FLUXO DA API */}
                <button 
                    type="button" 
                    className="btn btn-social mb-4"
                    onClick={handleGoogleLoginInit} 
                >
                    <FaGoogle /> Entrar com Google
                </button>

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
    );
};

export default Login;