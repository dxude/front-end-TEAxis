import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaPaperPlane, FaReply, FaTrash, FaInfoCircle, FaCheck, FaArrowLeft } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/Mensagens.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function Mensagens() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recebidas'); 
  const [mensagemDetalhe, setMensagemDetalhe] = useState(null); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [mensagensRecebidas, setMensagensRecebidas] = useState([
    { id: 1, remetente: 'Dra. Helena Costa', assunto: 'Confirmar consulta', data: '2025-07-08', lida: false, texto: 'Olá, gostaria de confirmar nossa sessão de amanhã às 10h. Se precisar reagendar, me avise!' },
    { id: 2, remetente: 'Dr. Lucas Ribeiro', assunto: 'Feedback da sessão', data: '2025-07-05', lida: true, texto: 'Olá, espero que a sessão de hoje tenha sido produtiva. Fico à disposição para qualquer dúvida.' },
  ]);

  const [mensagensEnviadas, setMensagensEnviadas] = useState([
    { id: 101, destinatario: 'Dra. Mariana Santos', assunto: 'Dúvida sobre trilha', data: '2025-07-07', texto: 'Olá Dra. Mariana, tenho uma dúvida sobre o módulo 3 da trilha de organização.' },
  ]);

  const handleMarcarLida = (id, tipo) => {
    if (tipo === 'recebidas') {
      setMensagensRecebidas(mensagensRecebidas.map(msg => msg.id === id ? { ...msg, lida: true } : msg ));
    }
    setMensagemDetalhe(null); 
  };

  const handleExcluirMensagem = (id, tipo) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      if (tipo === 'recebidas') {
        setMensagensRecebidas(mensagensRecebidas.filter(msg => msg.id !== id));
      } else {
        setMensagensEnviadas(mensagensEnviadas.filter(msg => msg.id !== id));
      }
      setMensagemDetalhe(null); 
    }
  };

  return (
    <div className="mensagens-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => {setShowLogoutModal(false); navigate('/login');}} />
      
      {/* HEADER DE VIDRO IDÊNTICO AO BUSCARESPECIALISTA */}
      <header className="mensagens-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass">
            <FaSearch className="nav-icon" /> Buscar Profissionais
          </Link>
          <Link to="/meus-agendamentos" className="nav-link-glass">
            <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
          </Link>
          <Link to="/perfil" className="nav-link-glass">
            <FaUserCircle className="nav-icon" /> Meu Perfil
          </Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      {/* BACKGROUND DECORATIVO (FUNDO ESPELHADO) */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="mensagens-main-content">
        <div className="mensagens-hero-text">
          <h1>Minhas Mensagens</h1>
          <p className="subtitle">Comunique-se com seus profissionais e gerencie suas conversas.</p>
        </div>

        <div className="mensagens-layout-grid">
          {/* COLUNA ESQUERDA: LISTAGEM COM GLASSMORPHISM */}
          <section className="mensagens-list-panel-glass">
            <div className="mensagens-tabs">
              <button className={`tab-button ${activeTab === 'recebidas' ? 'active' : ''}`} onClick={() => { setActiveTab('recebidas'); setMensagemDetalhe(null); }}>
                Caixa de Entrada 
                {mensagensRecebidas.filter(msg => !msg.lida).length > 0 && (
                  <span className="badge-count">{mensagensRecebidas.filter(msg => !msg.lida).length}</span>
                )}
              </button>
              <button className={`tab-button ${activeTab === 'enviadas' ? 'active' : ''}`} onClick={() => { setActiveTab('enviadas'); setMensagemDetalhe(null); }}>
                Enviadas
              </button>
            </div>

            <div className="mensagens-list-scroll">
              {activeTab === 'recebidas' ? (
                mensagensRecebidas.length > 0 ? (
                  mensagensRecebidas.map(msg => (
                    <div key={msg.id} className={`mensagem-card-premium ${msg.lida ? '' : 'nao-lida'} ${mensagemDetalhe?.id === msg.id ? 'selected' : ''}`} onClick={() => setMensagemDetalhe(msg)}> 
                      <div className="card-header">
                        <span className="remetente">{msg.remetente}</span>
                        <span className="data">{msg.data}</span>
                      </div>
                      <p className="assunto">{!msg.lida && <span className="unread-dot"></span>}{msg.assunto}</p>
                      <p className="preview">{msg.texto.substring(0, 80)}...</p>
                    </div>
                  ))
                ) : (
                  <p className="no-messages-message">Nenhuma mensagem na caixa de entrada.</p>
                )
              ) : ( 
                mensagensEnviadas.length > 0 ? (
                  mensagensEnviadas.map(msg => (
                    <div key={msg.id} className={`mensagem-card-premium ${mensagemDetalhe?.id === msg.id ? 'selected' : ''}`} onClick={() => setMensagemDetalhe(msg)}>
                      <div className="card-header">
                        <span className="remetente">Para: {msg.destinatario}</span>
                        <span className="data">{msg.data}</span>
                      </div>
                      <p className="assunto">{msg.assunto}</p>
                      <p className="preview">{msg.texto.substring(0, 80)}...</p>
                    </div>
                  ))
                ) : (
                  <p className="no-messages-message">Nenhuma mensagem enviada.</p>
                )
              )}
            </div>
          </section>

          {/* COLUNA DIREITA: LEITURA OU NOVA MENSAGEM */}
          <section className="mensagens-view-panel-glass">
            {mensagemDetalhe ? (
              <div className="mensagem-detalhe-premium">
                <div className="detalhe-header">
                  <div>
                    <h3>{mensagemDetalhe.assunto}</h3>
                    <p><strong>{activeTab === 'recebidas' ? 'De:' : 'Para:'}</strong> {mensagemDetalhe.remetente || mensagemDetalhe.destinatario}</p>
                    <span className="data-detalhe">{mensagemDetalhe.data}</span>
                  </div>
                  <button className="btn-close-detalhe" onClick={() => setMensagemDetalhe(null)}>✕</button>
                </div>
                
                <div className="detalhe-body">
                  <p className="mensagem-texto">{mensagemDetalhe.texto}</p>
                </div>

                <div className="detalhe-actions">
                  {activeTab === 'recebidas' && !mensagemDetalhe.lida && (
                    <button className="btn-action-premium secondary" onClick={() => handleMarcarLida(mensagemDetalhe.id, 'recebidas')}><FaCheck /> Marcar Lida</button>
                  )}
                  {activeTab === 'recebidas' && (
                    <button className="btn-action-premium primary"><FaReply /> Responder</button>
                  )}
                  <button className="btn-action-premium danger" onClick={() => handleExcluirMensagem(mensagemDetalhe.id, activeTab)}><FaTrash /> Excluir</button>
                </div>
              </div>
            ) : (
              <div className="nova-mensagem-premium">
                <h2><FaPaperPlane /> Enviar Nova Mensagem</h2>
                <form className="form-nova-mensagem">
                  <input type="text" placeholder="Destinatário (nome do profissional)" className="input-premium" required />
                  <input type="text" placeholder="Assunto" className="input-premium" required />
                  <textarea placeholder="Escreva sua mensagem aqui..." rows="8" className="textarea-premium" required></textarea>
                  <button type="submit" className="btn-action-premium primary submit-btn">Enviar Mensagem</button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}