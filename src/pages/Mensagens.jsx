import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaSearch, FaCalendarAlt, FaPaperPlane, FaReply, FaTrash, FaCheck, FaArrowLeft, FaUsers, FaChartLine } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/Mensagens.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

// URL oficial da sua API na nuvem
const API_MENSAGENS = 'https://back-end-plataforma-teaxis.onrender.com/api/v1/mensagens';

export default function Mensagens() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recebidas'); 
  const [mensagemDetalhe, setMensagemDetalhe] = useState(null); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userRole, setUserRole] = useState('usuario');
  const [userEmail, setUserEmail] = useState('');
  
  const [destinatario, setDestinatario] = useState('');
  const [assunto, setAssunto] = useState('');
  const [texto, setTexto] = useState('');
  
  const [mensagensRecebidas, setMensagensRecebidas] = useState([]);
  const [mensagensEnviadas, setMensagensEnviadas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Busca as mensagens direto do banco PostgreSQL via API Java
  const buscarMensagensDoBanco = async (email) => {
    if (!email) return;
    try {
      // 1. Busca Caixa de Entrada
      const resEntrada = await fetch(`${API_MENSAGENS}/entrada?email=${email}`);
      if (resEntrada.ok) {
        const dadosEntrada = await resEntrada.json();
        setMensagensRecebidas(dadosEntrada);
      }

      // 2. Busca Mensagens Enviadas
      const resEnviadas = await fetch(`${API_MENSAGENS}/enviadas?email=${email}`);
      if (resEnviadas.ok) {
        const dadosEnviadas = await resEnviadas.json();
        setMensagensEnviadas(dadosEnviadas);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens do Neon:', error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('teaxis_role') || 'usuario';
    const storedEmail = localStorage.getItem('user_email') || '';
    
    setUserRole(storedRole);
    setUserEmail(storedEmail);

    if (storedEmail) {
      buscarMensagensDoBanco(storedEmail);
      // Polling de 5 segundos para manter a caixa atualizada dinamicamente
      const interval = setInterval(() => buscarMensagensDoBanco(storedEmail), 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMensagemDetalhe(null);
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();

    if (!destinatario.trim() || !assunto.trim() || !texto.trim()) {
      alert('Preencha destinatário, assunto e mensagem antes de enviar.');
      return;
    }

    setLoading(true);

    // Estrutura exata esperada pelo DTO / Modelo unificado do Java
    const payload = {
      remetenteEmail: userEmail,
      destinatarioEmail: destinatario.trim(),
      assunto: assunto.trim(),
      conteudo: texto.trim()
    };

    try {
      console.log('📬 Disparando payload de mensagens para o Render...', payload);
      
      const response = await fetch(API_MENSAGENS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: Status ${response.status}`);
      }

      alert('🎉 Mensagem enviada com sucesso e gravada no Neon!');
      
      setDestinatario('');
      setAssunto('');
      setTexto('');
      
      await buscarMensagensDoBanco(userEmail);
      setActiveTab('enviadas');
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      alert('Falha ao enviar mensagem. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Funções de interface mantidas sem quebrar o layout
  const handleMarcarLida = (id) => {
    setMensagensRecebidas(prev => prev.map(msg => msg.id === id ? { ...msg, lida: true } : msg));
    setMensagemDetalhe(null);
  };

  const handleExcluirMensagem = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    setMensagensRecebidas(prev => prev.filter(msg => msg.id !== id));
    setMensagensEnviadas(prev => prev.filter(msg => msg.id !== id));
    setMensagemDetalhe(null);
  };

  return (
    <div className="mensagens-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => {setShowLogoutModal(false); navigate('/login');}} />
      
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
              <Link to="/minha-agenda" className="nav-link-glass"><FaCalendarAlt className="nav-icon" /> Minha Agenda</Link>
              <Link to="/meus-clientes" className="nav-link-glass"><FaUsers className="nav-icon" /> Meus Clientes</Link>
              <Link to="/relatorios" className="nav-link-glass"><FaChartLine className="nav-icon" /> Relatórios</Link>
            </>
          ) : (
            <>
              <Link to="/buscar-profissionais" className="nav-link-glass"><FaSearch className="nav-icon" /> Buscar Profissionais</Link>
              <Link to="/meus-agendamentos" className="nav-link-glass"><FaCalendarAlt className="nav-icon" /> Meus Agendamentos</Link>
              <Link to="/perfil" className="nav-link-glass"><FaUserCircle className="nav-icon" /> Meu Perfil</Link>
            </>
          )}
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

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
          <section className="mensagens-list-panel-glass">
            <div className="mensagens-tabs">
              <button className={`tab-button ${activeTab === 'recebidas' ? 'active' : ''}`} onClick={() => handleTabChange('recebidas')}>
                Caixa de Entrada 
                {mensagensRecebidas.filter(msg => !msg.lida).length > 0 && (
                  <span className="badge-count">{mensagensRecebidas.filter(msg => !msg.lida).length}</span>
                )}
              </button>
              <button className={`tab-button ${activeTab === 'enviadas' ? 'active' : ''}`} onClick={() => handleTabChange('enviadas')}>
                Enviadas
              </button>
            </div>

            <div className="mensagens-list-scroll">
              {activeTab === 'recebidas' ? (
                mensagensRecebidas.length > 0 ? (
                  mensagensRecebidas.map(msg => (
                    <div key={msg.id} className={`mensagem-card-premium ${msg.lida ? '' : 'nao-lida'} ${mensagemDetalhe?.id === msg.id ? 'selected' : ''}`} onClick={() => setMensagemDetalhe(msg)}> 
                      <div className="card-header">
                        <span className="remetente">{msg.remetenteEmail}</span>
                        <span className="data">{msg.dataEnvio ? msg.dataEnvio.slice(0, 10) : ''}</span>
                      </div>
                      <p className="assunto">{!msg.lida && <span className="unread-dot"></span>}{msg.assunto}</p>
                      <p className="preview">{msg.conteudo ? msg.conteudo.substring(0, 80) : ''}...</p>
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
                        <span className="remetente">Para: {msg.destinatarioEmail}</span>
                        <span className="data">{msg.dataEnvio ? msg.dataEnvio.slice(0, 10) : ''}</span>
                      </div>
                      <p className="assunto">{msg.assunto}</p>
                      <p className="preview">{msg.conteudo ? msg.conteudo.substring(0, 80) : ''}...</p>
                    </div>
                  ))
                ) : (
                  <p className="no-messages-message">Nenhuma mensagem enviada.</p>
                )
              )}
            </div>
          </section>

          <section className="mensagens-view-panel-glass">
            {mensagemDetalhe ? (
              <div className="mensagem-detalhe-premium">
                <div className="detalhe-header">
                  <div>
                    <h3>{mensagemDetalhe.assunto}</h3>
                    <p><strong>{activeTab === 'recebidas' ? 'De:' : 'Para:'}</strong> {activeTab === 'recebidas' ? mensagemDetalhe.remetenteEmail : mensagemDetalhe.destinatarioEmail}</p>
                    <span className="data-detalhe">{mensagemDetalhe.dataEnvio ? mensagemDetalhe.dataEnvio.slice(0, 10) : ''}</span>
                  </div>
                  <button className="btn-close-detalhe" onClick={() => setMensagemDetalhe(null)}>✕</button>
                </div>
                
                <div className="detalhe-body">
                  <p className="mensagem-texto">{mensagemDetalhe.conteudo}</p>
                </div>

                <div className="detalhe-actions">
                  {activeTab === 'recebidas' && !mensagemDetalhe.lida && (
                    <button className="btn-action-premium secondary" onClick={() => handleMarcarLida(mensagemDetalhe.id)}><FaCheck /> Marcar Lida</button>
                  )}
                  {activeTab === 'recebidas' && (
                    <button className="btn-action-premium primary" onClick={() => { setDestinatario(mensagemDetalhe.remetenteEmail); setAssunto(`Re: ${mensagemDetalhe.assunto}`); setMensagemDetalhe(null); }}><FaReply /> Responder</button>
                  )}
                  <button className="btn-action-premium danger" onClick={() => handleExcluirMensagem(mensagemDetalhe.id)}><FaTrash /> Excluir</button>
                </div>
              </div>
            ) : (
              <div className="nova-mensagem-premium">
                <h2><FaPaperPlane /> Enviar Nova Mensagem</h2>
                <form className="form-nova-mensagem" onSubmit={handleEnviarMensagem}>
                  <input
                    type="email"
                    placeholder="Destinatário (E-mail do profissional ou usuário)"
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
                  <button type="submit" disabled={loading} className="btn-action-premium primary submit-btn">
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}