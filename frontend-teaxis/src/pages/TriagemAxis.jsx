import React, { useState } from 'react';
import { FaUser, FaRobot, FaCheckCircle } from 'react-icons/fa';
import axisImg from '../assets/imagens/axis-sorridente.png'; // Caminho do seu Axis
import '../Styles/Triagem.css'; // Importe os estilos de layout da Triagem

const TriagemAxis = () => {
    // 1. Estado para controlar a etapa e as respostas
    const [etapa, setEtapa] = useState(1);
    const [respostas, setRespostas] = useState({});
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // Função para atualizar as respostas e avançar
    const handleResposta = (chave, valor) => {
        setRespostas(prev => ({ ...prev, [chave]: valor }));
        setEtapa(etapa + 1);
    };

    // Função para enviar os dados ao backend e fazer o match
    const handleMatchFinal = async (especialidade) => {
        setCarregando(true);
        setErro(null);
        
        const dadosCompletos = {
            ...respostas,
            especialidade: especialidade,
            // Adicione aqui a neurodivergência do usuário, se já foi coletada no cadastro
            // neurodivergencia: 'Autismo', 
        };

        try {
            // Requisição POST para o seu backend
            const response = await fetch('/api/v1/match-profissional', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCompletos)
            });

            if (!response.ok) {
                // Lidar com erros HTTP (4xx ou 5xx)
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao comunicar com o servidor de Match.');
            }

            const data = await response.json();
            
            // Sucesso: Redireciona para a página de resultados, passando os IDs dos matches na URL
            const matchIds = data.profissionais.map(p => p.id).join(',');
            window.location.href = `/resultados?matches=${matchIds}`;

        } catch (err) {
            setErro(err.message || 'Falha ao processar o Match.');
            setCarregando(false);
            setEtapa(5); // Leva para a tela de erro/tentativa
        }
    };

    // --- Componentes das Etapas ---

    // Etapa 1: Boas-Vindas e Início
    const Etapa1 = () => (
        <>
            <h2 className="text-dark text-center">Olá! Eu sou o Axis. 👋</h2>
            <p className="question-text">
                Podemos conversar um minutinho para eu entender suas necessidades e te ajudar a encontrar o especialista ideal?
            </p>
            <div className="action-buttons-group">
                <button 
                    className="btn btn-primary-green btn-full" 
                    onClick={() => setEtapa(2)}
                >
                    Sim, vamos lá!
                </button>
            </div>
        </>
    );

    // Etapa 2: Estado Emocional
    const Etapa2 = () => (
        <>
            <h2 className="text-dark text-center">Como você está se sentindo hoje?</h2>
            <div className="option-grid">
                <button className="option-button" onClick={() => handleResposta('humor', 'Feliz')}>
                    😄 Feliz
                </button>
                <button className="option-button" onClick={() => handleResposta('humor', 'Neutro')}>
                    😐 Neutro
                </button>
                <button className="option-button" onClick={() => handleResposta('humor', 'Triste/Ansioso')}>
                    😔 Triste/Ansioso
                </button>
            </div>
        </>
    );

    // Etapa 3: Área de Desafio
    const Etapa3 = () => (
        <>
            <h2 className="text-dark text-center">Qual dessas áreas você gostaria de melhorar?</h2>
            <div className="option-grid">
                {['Concentração 🎯', 'Comunicação 🗣️', 'Regulação Emocional 💖', 'Habilidades Sociais'].map(option => (
                    <button 
                        key={option} 
                        className="option-button" 
                        onClick={() => handleResposta('desafio', option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </>
    );

    // Etapa 4: Tipo de Profissional (Última Etapa antes de enviar)
    const Etapa4 = () => (
        <>
            <h2 className="text-dark text-center">Que tipo de ajuda você procura?</h2>
            <div className="option-grid">
                {['Psicólogo', 'Terapeuta Ocupacional', 'Fonoaudiólogo', 'Pedagogo'].map(option => (
                    <button 
                        key={option} 
                        className="option-button" 
                        onClick={() => handleMatchFinal(option)} // AQUI CHAMA A FUNÇÃO FINAL
                        disabled={carregando}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {carregando && <p className="loading-text mt-4">Buscando o Match Ideal... 💜</p>}
        </>
    );
    
    // Etapa 5: Erro ou Falha
    const Etapa5 = () => (
        <>
            <FaCheckCircle className="error-icon" />
            <h2 className="text-dark text-center">Ocorreu um erro!</h2>
            <p className="error-message">{erro || 'Não foi possível encontrar um Match. Tente novamente.'}</p>
            <button 
                className="btn btn-primary-green btn-full mt-4" 
                onClick={() => setEtapa(2)} // Volta para o início da triagem
            >
                Tentar Novamente
            </button>
        </>
    );


    // Renderização do conteúdo da Etapa Atual
    const renderEtapa = () => {
        switch (etapa) {
            case 1: return <Etapa1 />;
            case 2: return <Etapa2 />;
            case 3: return <Etapa3 />;
            case 4: return <Etapa4 />;
            case 5: return <Etapa5 />;
            default: return null;
        }
    };

    return (
        <div className="cadastro-page-container">
            <div className="triagem-card">
                <div className="axis-illustration-container">
                    {/* Imagem do Axis muda de acordo com o estado (carregando/erro) se desejar */}
                    <img src={axisImg} alt="Mascote Axis" className="axis-triagem-img" /> 
                </div>
                {renderEtapa()}
            </div>
        </div>
    );
};

export default TriagemAxis;