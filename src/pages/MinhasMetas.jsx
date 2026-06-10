import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaCheck, FaEdit, FaTrash, FaArrowLeft, FaCheckCircle, FaRegCircle, FaSearch, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaBookOpen, FaBullseye } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useProgresso } from '../contexts/ProgressoContext';
import '../Styles/MinhasMetas.css';
import logoPlataforma from '../assets/imagens/fundoLogo.png'; 

export default function MinhasMetas() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('todas'); 

  // Conexão com o Contexto Global
  const { dados, atualizarMetas } = useProgresso();
  const metas = dados?.metas || [];

  const setMetas = (novasMetas) => {
    atualizarMetas(novasMetas);
  };

  const [novaMeta, setNovaMeta] = useState('');
  const [novaDataLimite, setNovaDataLimite] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Rotina');
  
  // Controle do Modal de Edição
  const [metaEmEdicao, setMetaEmEdicao] = useState(null);
  const [novaSubmetaModal, setNovaSubmetaModal] = useState(''); 

  const handleAdicionarMeta = (e) => {
    e.preventDefault();
    if (novaMeta && novaDataLimite) {
      const novaMetaObj = { 
        id: Date.now(), 
        descricao: novaMeta, 
        dataLimite: novaDataLimite, 
        categoria: novaCategoria,
        concluida: false,
        submetas: [] 
      };
      setMetas([novaMetaObj, ...metas]); 
      setNovaMeta('');
      setNovaDataLimite('');
      setNovaCategoria('Rotina');
    }
  };

  const handleConcluirMeta = (id) => {
    setMetas(metas.map(meta => {
      if (meta.id === id) {
        const novoStatus = !meta.concluida;
        const submetasAtualizadas = meta.submetas.map(sub => ({ ...sub, concluida: novoStatus }));
        return { ...meta, concluida: novoStatus, submetas: submetasAtualizadas };
      }
      return meta;
    }));
  };

  const handleToggleSubmeta = (metaId, submetaId) => {
    setMetas(metas.map(meta => {
      if (meta.id === metaId) {
        const submetasAtualizadas = meta.submetas.map(sub => 
          sub.id === submetaId ? { ...sub, concluida: !sub.concluida } : sub
        );
        const todasConcluidas = submetasAtualizadas.length > 0 && submetasAtualizadas.every(sub => sub.concluida);
        return { ...meta, submetas: submetasAtualizadas, concluida: todasConcluidas };
      }
      return meta;
    }));
  };

  const handleAbrirEdicao = (meta) => {
    setMetaEmEdicao({ ...meta }); 
    setNovaSubmetaModal('');
  };

  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    setMetas(metas.map(m => m.id === metaEmEdicao.id ? metaEmEdicao : m));
    setMetaEmEdicao(null); 
  };

  const handleAddSubmetaModal = () => {
    if(novaSubmetaModal.trim()) {
      setMetaEmEdicao({
        ...metaEmEdicao,
        submetas: [...metaEmEdicao.submetas, { id: Date.now(), texto: novaSubmetaModal, concluida: false }]
      });
      setNovaSubmetaModal('');
    }
  };

  const handleRemoveSubmetaModal = (subId) => {
    setMetaEmEdicao({
      ...metaEmEdicao,
      submetas: metaEmEdicao.submetas.filter(s => s.id !== subId)
    });
  };

  const handleChangeSubmetaTextModal = (subId, novoTexto) => {
    setMetaEmEdicao({
      ...metaEmEdicao,
      submetas: metaEmEdicao.submetas.map(s => s.id === subId ? { ...s, texto: novoTexto } : s)
    });
  };

  const handleExcluirMeta = (id) => {
    if(window.confirm('Tem certeza que deseja excluir esta meta?')) {
      setMetas(metas.filter(meta => meta.id !== id));
    }
  };

  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teaxis_auth_token');
      localStorage.removeItem('teaxis_role');
      localStorage.removeItem('login_method');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_photo');
      window.dispatchEvent(new Event('teaxis:auth_changed'));
    }
    setShowLogoutModal(false);
    navigate('/login');
  };

  const progressoMetasUi = metas.length > 0 
    ? Math.round((metas.filter(m => m.concluida).length / metas.length) * 100) 
    : 0;

  const metasFiltradas = metas.filter(meta => {
    if (filtroAtivo === 'andamento') return !meta.concluida;
    if (filtroAtivo === 'concluidas') return meta.concluida;
    return true; 
  });

  return (
    <div className="minhas-metas-container">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      
      <header className="minhas-metas-header-glass">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-to-space-btn">
            <FaArrowLeft className="back-icon" /> Voltar ao Meu Espaço
          </Link>
          <img src={logoPlataforma} alt="Logo" className="header-logo-small" />
        </div>
        <nav className="header-nav-glass">
          <Link to="/buscar-profissionais" className="nav-link-glass">
            <FaSearch className="nav-icon" /> Buscar
          </Link>
          <Link to="/meus-agendamentos" className="nav-link-glass">
            <FaCalendarAlt className="nav-icon" /> Agendamentos
          </Link>
          <Link to="/minhas-trilhas" className="nav-link-glass">
            <FaBookOpen className="nav-icon" /> Trilhas
          </Link>
          <Link to="/minhas-metas" className="nav-link-glass active">
            <FaBullseye className="nav-icon" /> Metas
          </Link>
          <Link to="/perfil" className="nav-link-glass">
            <FaUserCircle className="nav-icon" /> Perfil
          </Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">
            <FaSignOutAlt className="nav-icon" /> Sair
          </button>
        </nav>
      </header>

      <main className="minhas-metas-content">
        <section className="minhas-metas-adicionar glass-panel">
          <h2>🎯 Nova Meta</h2>
          <form onSubmit={handleAdicionarMeta} className="form-adicionar-moderno">
            <div className="input-group">
              <input
                type="text"
                placeholder="Ex: Organizar o quarto no sábado"
                value={novaMeta}
                onChange={(e) => setNovaMeta(e.target.value)}
                required
                className="input-moderno"
              />
            </div>
            <div className="row-inputs">
              <select 
                value={novaCategoria} 
                onChange={(e) => setNovaCategoria(e.target.value)}
                className="input-moderno select-categoria"
              >
                <option value="Rotina">🔄 Rotina</option>
                <option value="Saúde">💚 Saúde</option>
                <option value="Estudos">📚 Estudos</option>
                <option value="Lazer">🎮 Lazer</option>
              </select>
              <input
                type="date"
                value={novaDataLimite}
                onChange={(e) => setNovaDataLimite(e.target.value)}
                required
                className="input-moderno input-data"
              />
              <button type="submit" className="btn-moderno-primary">
                <FaPlus /> Criar
              </button>
            </div>
          </form>
        </section>

        <section className="minhas-metas-lista glass-panel">
          <div className="lista-header">
            <h2>Minhas Metas</h2>
            <div className="filtros-container">
              <button className={`btn-filtro ${filtroAtivo === 'todas' ? 'ativo' : ''}`} onClick={() => setFiltroAtivo('todas')}>Todas</button>
              <button className={`btn-filtro ${filtroAtivo === 'andamento' ? 'ativo' : ''}`} onClick={() => setFiltroAtivo('andamento')}>Em Andamento</button>
              <button className={`btn-filtro ${filtroAtivo === 'concluidas' ? 'ativo' : ''}`} onClick={() => setFiltroAtivo('concluidas')}>Concluídas</button>
            </div>
          </div>

          {/* =========================================
              BARRA DE PROGRESSO PREMIUM ANIMADA
              ========================================= */}
          <div className="progresso-general-container fade-in-up">
            <div className="progresso-general-header">
              <span className="progresso-general-title">Progresso desta Sessão</span>
              <span className="progresso-general-porcentagem">{progressoMetasUi}%</span>
            </div>
            <div className="progresso-general-bg">
              <div className="progresso-general-fill" style={{ width: `${progressoMetasUi}%` }}></div>
            </div>
          </div>

          {metasFiltradas.length > 0 ? (
            <div className="metas-grid">
              {metasFiltradas.map(meta => (
                <div key={meta.id} className={`meta-card ${meta.concluida ? 'meta-concluida-card' : ''}`}>
                  <div className="meta-card-header">
                    <span className={`badge-categoria badge-${meta.categoria.toLowerCase()}`}>
                      {meta.categoria}
                    </span>
                    <span className="meta-data-badge">Até: {meta.dataLimite}</span>
                  </div>
                  
                  <div className="meta-card-body">
                    <h3 className="meta-titulo">{meta.descricao}</h3>

                    {meta.submetas.length > 0 && (
                      <ul className="submetas-list">
                        {meta.submetas.map(sub => (
                          <li key={sub.id} className="submeta-item" onClick={() => handleToggleSubmeta(meta.id, sub.id)}>
                            {sub.concluida ? <FaCheckCircle className="icon-concluido" /> : <FaRegCircle className="icon-pendente" />}
                            <span className={sub.concluida ? 'texto-riscado' : ''}>{sub.texto}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="meta-card-footer">
                    <button onClick={() => handleConcluirMeta(meta.id)} className={`btn-acao ${meta.concluida ? 'btn-desfazer' : 'btn-concluir-meta'}`}>
                      {meta.concluida ? 'Reabrir Meta' : <><FaCheck /> Concluir</>}
                    </button>
                    <div className="acoes-secundarias">
                      <button onClick={() => handleAbrirEdicao(meta)} className="btn-icon btn-edit" title="Editar"><FaEdit /></button>
                      <button onClick={() => handleExcluirMeta(meta.id)} className="btn-icon btn-trash" title="Excluir"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhuma meta encontrada nesta categoria. Que tal criar uma nova? ✨</p>
            </div>
          )}
        </section>
      </main>

      {/* =========================================
          MODAL DE EDIÇÃO DE METAS
          ========================================= */}
      {metaEmEdicao && (
        <div className="modal-edicao-overlay" onClick={() => setMetaEmEdicao(null)}>
          <div className="modal-edicao-content glass-panel fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Editar Meta</h2>
            <form onSubmit={handleSalvarEdicao} className="form-adicionar-moderno">
              <div className="input-group">
                <label className="modal-label">Descrição Principal</label>
                <input
                  type="text"
                  value={metaEmEdicao.descricao}
                  onChange={(e) => setMetaEmEdicao({ ...metaEmEdicao, descricao: e.target.value })}
                  required
                  className="input-moderno"
                />
              </div>

              <div className="row-inputs" style={{ marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="modal-label">Categoria</label>
                  <select 
                    value={metaEmEdicao.categoria} 
                    onChange={(e) => setMetaEmEdicao({ ...metaEmEdicao, categoria: e.target.value })}
                    className="input-moderno select-categoria"
                  >
                    <option value="Rotina">🔄 Rotina</option>
                    <option value="Saúde">💚 Saúde</option>
                    <option value="Estudos">📚 Estudos</option>
                    <option value="Lazer">🎮 Lazer</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="modal-label">Data Limite</label>
                  <input
                    type="date"
                    value={metaEmEdicao.dataLimite}
                    onChange={(e) => setMetaEmEdicao({ ...metaEmEdicao, dataLimite: e.target.value })}
                    required
                    className="input-moderno input-data"
                  />
                </div>
              </div>

              <div className="modal-submetas-section">
                <label className="modal-label">Tópicos / Passos</label>
                <div className="modal-submetas-lista">
                  {metaEmEdicao.submetas.map(sub => (
                    <div key={sub.id} className="modal-submeta-item">
                      <input
                        type="text"
                        value={sub.texto}
                        onChange={(e) => handleChangeSubmetaTextModal(sub.id, e.target.value)}
                        className="input-moderno input-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubmetaModal(sub.id)} 
                        className="btn-icon btn-trash"
                        title="Remover tópico"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="modal-add-submeta">
                  <input
                    type="text"
                    placeholder="Adicionar novo tópico..."
                    value={novaSubmetaModal}
                    onChange={(e) => setNovaSubmetaModal(e.target.value)}
                    className="input-moderno input-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); 
                        handleAddSubmetaModal();
                      }
                    }}
                  />
                  <button type="button" onClick={handleAddSubmetaModal} className="btn-secundario-sm">
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="modal-edicao-actions">
                <button type="button" onClick={() => setMetaEmEdicao(null)} className="btn-acao btn-desfazer">Cancelar</button>
                <button type="submit" className="btn-moderno-primary">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          ESTILOS INJETADOS (BARRA DE PROGRESSO & ANIMAÇÕES)
          ========================================= */}
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }

        /* --- BARRA DE PROGRESSO DA SESSÃO --- */
        .progresso-general-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        .progresso-general-container:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          border-color: #cbd5e1;
        }
        .progresso-general-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .progresso-general-title {
          font-weight: 700;
          color: #334155;
          font-size: 1.15rem;
        }
        .progresso-general-porcentagem {
          font-weight: 900;
          color: #7b2cbf;
          font-size: 1.4rem;
        }
        .progresso-general-bg {
          width: 100%;
          height: 14px;
          background-color: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        .progresso-general-fill {
          height: 100%;
          background: linear-gradient(90deg, #7b2cbf, #9d4edd);
          border-radius: 99px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(123, 44, 191, 0.4);
        }

        /* Melhorias Visuais Extras para os Filtros */
        .filtros-container {
          display: flex;
          gap: 8px;
          background: #f8fafc;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .btn-filtro {
          border: none;
          background: transparent;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-filtro:hover {
          color: #334155;
          background: #f1f5f9;
        }
        .btn-filtro.ativo {
          background: #ffffff;
          color: #7b2cbf;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        /* Botão Criar Modernizado */
        .btn-moderno-primary {
          background: #7b2cbf;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .btn-moderno-primary:hover {
          background: #5a189a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(123, 44, 191, 0.3);
        }
      `}</style>
    </div>
  );
}