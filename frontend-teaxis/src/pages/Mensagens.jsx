import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaComments, FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaPaperPlane, FaReply, FaTrash, FaInfoCircle, FaCheck } from 'react-icons/fa';
import '../Styles/Mensagens.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function Mensagens() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recebidas'); // 'recebidas' ou 'enviadas'

  const [mensagensRecebidas, setMensagensRecebidas] = useState([
    { id: 1, remetente: 'Dra. Helena Costa', assunto: 'Confirmar consulta', data: '2025-07-08', lida: false, texto: 'Olá, gostaria de confirmar nossa sessão de amanhã às 10h. Se precisar reagendar, me avise!' },
    { id: 2, remetente: 'Dr. Lucas Ribeiro', assunto: 'Feedback da sessão', data: '2025-07-05', lida: true, texto: 'Olá, espero que a sessão de hoje tenha sido produtiva. Fico à disposição para qualquer dúvida.' },
  ]);

  const [mensagensEnviadas, setMensagensEnviadas] = useState([
    { id: 101, destinatario: 'Dra. Mariana Santos', assunto: 'Dúvida sobre trilha', data: '2025-07-07', texto: 'Olá Dra. Mariana, tenho uma dúvida sobre o módulo 3 da trilha de organização.' },
  ]);

  const [mensagemDetalhe, setMensagemDetalhe] = useState(null); 

  const handleMarcarLida = (id, tipo) => {
    if (tipo === 'recebidas') {
      setMensagensRecebidas(mensagensRecebidas.map(msg =>
        msg.id === id ? { ...msg, lida: true } : msg
      ));
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
      alert('Mensagem excluída.');
    }
  };

  const handleLogout = () => {
    alert('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <div className="mensagens-container">
      {/* Top Bar de Navegação Interna */}
      <header className="mensagens-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
          <Link to="/buscar-profissionais" className="nav-link">
            <FaSearch className="nav-icon" /> Buscar Profissionais
          </Link>
          <Link to="/meus-agendamentos" className="nav-link">
            <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
          </Link>
          <Link to="/perfil" className="nav-link">
            <FaUserCircle className="nav-icon" /> Meu Perfil
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      <main className="mensagens-main-content">
        <h1>Minhas Mensagens</h1>
        <p className="subtitle">Comunique-se com seus profissionais e gerencie suas conversas.</p>

        <div className="mensagens-tabs">
          <button className={`tab-button ${activeTab === 'recebidas' ? 'active' : ''}`} onClick={() => { setActiveTab('recebidas'); setMensagemDetalhe(null); }}>
            Caixa de Entrada ({mensagensRecebidas.filter(msg => !msg.lida).length})
          </button>
          <button className={`tab-button ${activeTab === 'enviadas' ? 'active' : ''}`} onClick={() => { setActiveTab('enviadas'); setMensagemDetalhe(null); }}>
            Enviadas
          </button>
        </div>

        <section className="mensagens-section">
          {mensagemDetalhe ? (
            <div className="mensagem-detalhe-card">
              <button className="btn-back-list" onClick={() => setMensagemDetalhe(null)}>
                Voltar para a Lista
              </button>
              <h3>Assunto: {mensagemDetalhe.assunto}</h3>
              <p><strong>De:</strong> {mensagemDetalhe.remetente || mensagemDetalhe.destinatario} - {mensagemDetalhe.data}</p>
              <p className="mensagem-texto">{mensagemDetalhe.texto}</p>
              <div className="detalhe-actions">
                {activeTab === 'recebidas' && !mensagemDetalhe.lida && (
                  <button className="btn-secondary" onClick={() => handleMarcarLida(mensagemDetalhe.id, 'recebidas')}>
                    <FaCheck /> Marcar como Lida
                  </button>
                )}
                <button className="btn-reply">
                  <FaReply /> Responder
                </button>
                <button className="btn-danger" onClick={() => handleExcluirMensagem(mensagemDetalhe.id, activeTab)}>
                  <FaTrash /> Excluir
                </button>
              </div>
            </div>
          ) : (
            <div className="mensagens-list">
              {activeTab === 'recebidas' ? (
                mensagensRecebidas.length > 0 ? (
                  mensagensRecebidas.map(msg => (
                    <div key={msg.id} className={`mensagem-card ${msg.lida ? 'lida' : 'nao-lida'}`} onClick={() => setMensagemDetalhe(msg)}> 
                      <div className="card-header">
                        <span className="remetente">{msg.remetente}</span>
                        <span className="data">{msg.data}</span>
                      </div>
                      <p className="assunto">{msg.assunto}</p>
                      <p className="preview">{msg.texto.substring(0, 100)}...</p>
                      <div className="card-actions-list">
                         <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); setMensagemDetalhe(msg); }}>
                            <FaInfoCircle /> Ver Detalhes
                        </button>
                        {!msg.lida && (
                            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleMarcarLida(msg.id, 'recebidas'); }}>
                                <FaCheck /> Lida 
                            </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-messages-message">Nenhuma mensagem na caixa de entrada.</p>
                )
              ) : ( 
                mensagensEnviadas.length > 0 ? (
                  mensagensEnviadas.map(msg => (
                    <div key={msg.id} className="mensagem-card" onClick={() => setMensagemDetalhe(msg)}> {/* onClick para ver detalhes */}
                      <div className="card-header">
                        <span className="remetente">Para: {msg.destinatario}</span>
                        <span className="data">{msg.data}</span>
                      </div>
                      <p className="assunto">{msg.assunto}</p>
                      <p className="preview">{msg.texto.substring(0, 100)}...</p>
                      <div className="card-actions-list">
                         <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); setMensagemDetalhe(msg); }}>
                            <FaInfoCircle /> Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-messages-message">Nenhuma mensagem enviada.</p>
                )
              )}
            </div>
          )}
        </section>

        <section className="nova-mensagem-section">
          <h2>Enviar Nova Mensagem</h2>
          <form>
            <input type="text" placeholder="Destinatário (nome do profissional)" required />
            <input type="text" placeholder="Assunto" required />
            <textarea placeholder="Escreva sua mensagem aqui..." rows="6" required></textarea>
            <button type="submit" className="btn-primary"><FaPaperPlane /> Enviar Mensagem</button>
          </form>
        </section>
      </main>
    </div>
  );
}