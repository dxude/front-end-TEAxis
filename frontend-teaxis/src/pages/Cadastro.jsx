import React, { useState } from 'react';
import '../Styles/Cadastro.css'; // Novo CSS específico para o layout
import { FaUser, FaBriefcase, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

const Cadastro = () => {
    // 1. Estado para controlar a escolha do perfil (null, 'usuario', 'profissional')
    const [perfil, setPerfil] = useState(null);

    // 2. Componente de Seleção de Perfil (Cards)
    const PerfilSelector = () => (
        <div className="perfil-selector">
            <h2 className="text-dark mb-8 text-2xl font-bold">Como você quer usar o TEAxis?</h2>
            
            <div className="card-selection-wrapper">
                {/* Card Usuário/Paciente */}
                <div 
                    className="selection-card card-green"
                    onClick={() => setPerfil('usuario')}
                >
                    <FaUser className="card-icon" />
                    <h3>Sou Usuário / Paciente</h3>
                    <p>Quero encontrar profissionais que entendam minhas necessidades.</p>
                </div>

                {/* Card Profissional */}
                <div 
                    className="selection-card card-lilac"
                    onClick={() => setPerfil('profissional')}
                >
                    <FaBriefcase className="card-icon" />
                    <h3>Sou Profissional</h3>
                    <p>Quero oferecer apoio especializado e transformar vidas.</p>
                </div>
            </div>
            
            <p className="login-link mt-8">
                Já tem conta? <a href="/login" className="text-lilac-main font-semibold">Faça seu Login</a>
            </p>
        </div>
    );

    // 3. Componente de Formulário (Apenas um exemplo básico de Login/Cadastro Padrão)
    const CadastroForm = ({ tipo }) => (
        <div className="cadastro-form">
            <h2 className="text-dark mb-8 text-2xl font-bold">
                Crie sua conta {tipo === 'usuario' ? 'como Usuário' : 'como Profissional'}
            </h2>

            {/* Login Social */}
            <button className="btn btn-social btn-google mb-4">
                <FaGoogle className="mr-2" /> Continuar com Google
            </button>
            
            <div className="divider mb-4">
                <span>OU CADASTRE COM EMAIL</span>
            </div>

            {/* Campos Padrão (Nome, Email, Senha) */}
            <div className="input-group">
                <label htmlFor="nome"><FaUser /> Nome Completo:</label>
                <input id="nome" type="text" placeholder="Insira seu nome" />
            </div>
            <div className="input-group">
                <label htmlFor="email"><FaEnvelope /> Email:</label>
                <input id="email" type="email" placeholder="Insira seu email" />
            </div>
            <div className="input-group">
                <label htmlFor="senha"><FaLock /> Senha:</label>
                <input id="senha" type="password" placeholder="Crie sua senha" />
            </div>
            <div className="input-group">
                <label htmlFor="confirmar">Confirme a Senha:</label>
                <input id="confirmar" type="password" placeholder="Repita a senha" />
            </div>

            {/* Aqui, idealmente, entrariam os campos específicos do tipo de perfil */}
            {tipo === 'profissional' && (
                <p className="text-sm mt-4 text-lilac-main">
                    Após esta etapa, você preencherá seus dados de registro profissional (CRP/Registro).
                </p>
            )}

            <button className="btn btn-primary-green btn-full mt-6">
                CADASTRAR
            </button>
            
            <p className="login-link mt-4 text-center">
                <a href="#" onClick={() => setPerfil(null)} className="text-lilac-main font-semibold">
                    &larr; Voltar à escolha de perfil
                </a>
            </p>
        </div>
    );
    
    // Renderiza o seletor ou o formulário, dependendo do estado
    return (
        <div className="cadastro-page-container">
            {perfil ? <CadastroForm tipo={perfil} /> : <PerfilSelector />}
        </div>
    );
};

export default Cadastro;