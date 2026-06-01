import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaPaperPlane, FaReply, FaTrash, FaInfoCircle, FaCheck, FaArrowLeft, FaUsers, FaChartLine } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/Mensagens.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarMensagens, salvarMensagens } from '../utils/dataSync';

export default function Mensagens() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recebidas'); 
  const [mensagemDetalhe, setMensagemDetalhe] = useState(null); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userRole, setUserRole] = useState('usuario');
  const [userName, setUserName] = useState('Usuário TEAxis');
  const [destinatario, setDestinatario] = useState('');
  const [assunto, setAssunto] = useState('');
  const [texto, setTexto] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [mensagensRecebidas, setMensagensRecebidas] = useState([]);
  const [mensagensEnviadas, setMensagensEnviadas] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('teaxis_role') || 'usuario';
    const storedEmail = localStorage.getItem('user_email') || 'Usuário TEAxis';
    setUserRole(storedRole);
    setUserName(storedEmail);

    const syncMessages = () => {
      const allMessages = carregarMensagens();
      setMensagens(allMessages);
      const recebidas = allMessages.filter(msg => msg.toRole === storedRole);
      const enviadas = allMessages.filter(msg => msg.fromRole === storedRole);
      setMensagensRecebidas(recebidas);
      setMensagensEnviadas(enviadas);
    };

    syncMessages();
    const handleStorage = (event) => {
      if (!event.key || event.key === 'teaxis_mensagens') {
        syncMessages();
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(syncMessages, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const updateStorage = (updatedMessages) => {
    setMensagens(updatedMessages);
    salvarMensagens(updatedMessages);
    setMensagensRecebidas(updatedMessages.filter(msg => msg.toRole === userRole));
    setMensagensEnviadas(updatedMessages.filter(msg => msg.fromRole === userRole));
  };

  const handleMarcarLida = (id, tipo) => {
    if (tipo !== 'recebidas') {
      setMensagemDetalhe(null);
      return;
    }

    const updatedMessages = mensagens.map(msg => msg.id === id ? { ...msg, lida: true } : msg);
    updateStorage(updatedMessages);
    setMensagemDetalhe(null);
  };

  const handleExcluirMensagem = (id, tipo) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    const updatedMessages = mensagens.filter(msg => msg.id !== id);
    updateStorage(updatedMessages);
    setMensagemDetalhe(null);
  };

  const handleEnviarMensagem = (e) => {
    e.preventDefault();

    if (!destinatario.trim() || !assunto.trim() || !texto.trim()) {
      alert('Preencha destinatário, assunto e mensagem antes de enviar.');
      return;
    }

    const newId = mensagens.length > 0 ? Math.max(...mensagens.map(msg => msg.id)) + 1 : 1;
    const newMessage = {
      id: newId,
      fromName: userName,
      toName: destinatario.trim(),
      fromRole: userRole,
      toRole: userRole === 'profissional' ? 'usuario' : 'profissional',
      subject: assunto.trim(),
      body: texto.trim(),
      date: new Date().toISOString().slice(0, 10),
      lida: false
    };

    const updatedMessages = [newMessage, ...mensagens];
    updateStorage(updatedMessages);
    setDestinatario('');
    setAssunto('');
    setTexto('');
    setActiveTab('enviadas');
    alert('Mensagem enviada com sucesso!');
  };

  return (
    <div className="mensagens-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => {setShowLogoutModal(false); navigate('/login');}} />
      
      {/* HEADER DE VIDRO IDÊNTICO AO BUSCARESPECIALISTA */}
      <header className="mensagens-header-glass">
        <div className="header-left">
          <Link to={userRole === 'profissional' ? '/dashboard-profissional' : '/dashboard-usuario'} className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
            {userRole === 'profissional' ? (
              <>
                <Link to="/minha-agenda" className="nav-link-glass">
                  <FaCalendarAlt className="nav-icon" /> Minha Agenda
                </Link>
                <Link to="/meus-clientes" className="nav-link-glass">
                  <FaUsers className="nav-icon" /> Meus Clientes
                </Link>
                <Link to="/relatorios" className="nav-link-glass">
                  <FaChartLine className="nav-icon" /> Relatórios
                </Link>
              </>
            ) : (
              <>
                <Link to="/buscar-profissionais" className="nav-link-glass">
                  <FaSearch className="nav-icon" /> Buscar Profissionais
                </Link>
                <Link to="/meus-agendamentos" className="nav-link-glass">
                  <FaCalendarAlt className="nav-icon" /> Meus Agendamentos
                </Link>
                <Link to="/perfil" className="nav-link-glass">
                  <FaUserCircle className="nav-icon" /> Meu Perfil
                </Link>
              </>
            )}
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
                        <span className="remetente">{msg.fromName}</span>
                        <span className="data">{msg.date}</span>
                      </div>
                      <p className="assunto">{!msg.lida && <span className="unread-dot"></span>}{msg.subject}</p>
                      <p className="preview">{msg.body.substring(0, 80)}...</p>
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
                        <span className="remetente">Para: {msg.toName}</span>
                        <span className="data">{msg.date}</span>
                      </div>
                      <p className="assunto">{msg.subject}</p>
                      <p className="preview">{msg.body.substring(0, 80)}...</p>
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
                    <h3>{mensagemDetalhe.subject}</h3>
                    <p><strong>{activeTab === 'recebidas' ? 'De:' : 'Para:'}</strong> {activeTab === 'recebidas' ? mensagemDetalhe.fromName : mensagemDetalhe.toName}</p>
                    <span className="data-detalhe">{mensagemDetalhe.date}</span>
                  </div>
                  <button className="btn-close-detalhe" onClick={() => setMensagemDetalhe(null)}>✕</button>
                </div>
                
                <div className="detalhe-body">
                  <p className="mensagem-texto">{mensagemDetalhe.body}</p>
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
                <form className="form-nova-mensagem" onSubmit={handleEnviarMensagem}>
                  <input
                    type="text"
                    placeholder="Destinatário (nome do profissional)"
                    className="input-premium"
                    required
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Assunto"
                    className="input-premium"
                    required
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                  />
                  <textarea
                    placeholder="Escreva sua mensagem aqui..."
                    rows="8"
                    className="textarea-premium"
                    required
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
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