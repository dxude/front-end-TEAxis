import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import '../Styles/MinhasMetas.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png'; 

export default function MinhasMetas() {
  const navigate = useNavigate();
  const [metas, setMetas] = useState([
    { id: 1, descricao: 'Ler 10 páginas por dia', dataLimite: '2025-07-15', concluida: false },
    { id: 2, descricao: 'Praticar mindfulness 15 minutos', dataLimite: '2025-06-30', concluida: true },
  ]);
  const [novaMeta, setNovaMeta] = useState('');
  const [novaDataLimite, setNovaDataLimite] = useState('');

  const handleAdicionarMeta = (e) => {
    e.preventDefault();
    if (novaMeta && novaDataLimite) {
      const novaMetaObj = { id: Date.now(), descricao: novaMeta, dataLimite: novaDataLimite, concluida: false };
      setMetas([...metas, novaMetaObj]);
      setNovaMeta('');
      setNovaDataLimite('');
    }
  };

  const handleConcluirMeta = (id) => {
    setMetas(metas.map(meta => (meta.id === id ? { ...meta, concluida: !meta.concluida } : meta)));
  };

  const handleEditarMeta = (id) => {
    alert(`Editar meta ${id}`);
  };

  const handleExcluirMeta = (id) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

    const handleLogout = () => {
        alert('Você foi desconectado.');
        navigate('/login');
    };

  return (
    <div className="minhas-metas-container">
      <header className="minhas-metas-header">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo TEAxis" className="header-logo" />
        </div>
        <nav className="header-nav">
            <Link to="/buscar-profissionais" className="nav-link">
                Buscar Profissionais
            </Link>
            <Link to="/meus-agendamentos" className="nav-link">
                Meus Agendamentos
            </Link>
            <Link to="/perfil" className="nav-link">
                Meu Perfil
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
                Sair
            </button>
        </nav>
      </header>

      <main className="minhas-metas-content">
        <section className="minhas-metas-adicionar">
          <h2>Adicionar Nova Meta</h2>
          <form onSubmit={handleAdicionarMeta}>
            <input
              type="text"
              placeholder="Descrição da meta"
              value={novaMeta}
              onChange={(e) => setNovaMeta(e.target.value)}
              required
            />
            <input
              type="date"
              value={novaDataLimite}
              onChange={(e) => setNovaDataLimite(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              <FaPlus /> Adicionar
            </button>
          </form>
        </section>

        <section className="minhas-metas-lista">
          <h2>Minhas Metas</h2>
          {metas.length > 0 ? (
            <ul className="metas-list">
              {metas.map(meta => (
                <li key={meta.id} className={`meta-item ${meta.concluida ? 'concluida' : ''}`}>
                  <div className="meta-detalhes">
                    <p className="meta-descricao">{meta.descricao}</p>
                    <p className="meta-data-limite">Até: {meta.dataLimite}</p>
                  </div>
                  <div className="meta-acoes">
                    <button onClick={() => handleConcluirMeta(meta.id)} className="btn-concluir">
                      {meta.concluida ? <FaCheck /> : <FaCheck />}
                    </button>
                    <button onClick={() => handleEditarMeta(meta.id)} className="btn-editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluirMeta(meta.id)} className="btn-excluir">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}\
            </ul>
          ) : (
            <p>Nenhuma meta adicionada ainda.</p>
          )}
        </section>
      </main>
    </div>
  );
}