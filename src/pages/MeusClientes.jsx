import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaCalendarAlt, FaCommentDots, FaClipboardList, FaSearch, FaFilter, FaStickyNote, FaTimes } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardProfissional.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos } from '../utils/dataSync';

const parseDate = (value) => {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function MeusClientes() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [agenda, setAgenda] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const professionalName = localStorage.getItem('user_name');
    const agendaCompleta = carregarAgendamentos();
    
    // Filtro rigoroso: se não tiver nome ou não bater, agenda vira array vazio
    const profAgenda = agendaCompleta.filter(item => 
      item.toRole === 'profissional' && item.profissional === professionalName
    );
    
    // Se o filtro retornar vazio, o estado 'agenda' será []
    setAgenda(profAgenda);
    
    const savedNotes = JSON.parse(localStorage.getItem('teaxis_patient_notes') || '{}');
    setNotes(savedNotes);
  }, []);

  const clientes = useMemo(() => {
    return agenda.reduce((acc, item) => {
      let cliente = acc.find(c => c.nome === item.cliente);
      if (!cliente) {
        cliente = {
          nome: item.cliente,
          ultimaVisita: item.data,
          status: item.status,
          totalAtendimentos: 0,
          proximos: [],
          historico: [],
        };
        acc.push(cliente);
      }
      cliente.totalAtendimentos += 1;
      if (item.status === 'Confirmado') cliente.proximos.push(item);
      if (item.status === 'Concluído' || item.status === 'Cancelado') cliente.historico.push(item);
      if (parseDate(item.data) > parseDate(cliente.ultimaVisita)) cliente.ultimaVisita = item.data;
      return acc;
    }, []);
  }, [agenda]);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const text = `${cliente.nome} ${cliente.status}`.toLowerCase();
      const matchesSearch = text.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || cliente.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clientes, searchQuery, statusFilter]);

  const selectedData = selectedCliente ? clientes.find(c => c.nome === selectedCliente) : null;

  const handleAddNote = () => {
    if (!selectedCliente) return;
    const noteText = prompt('Adicionar nota rápida para o paciente:');
    if (!noteText) return;
    const updated = {
      ...notes,
      [selectedCliente]: [...(notes[selectedCliente] || []), { text: noteText, date: new Date().toLocaleDateString('pt-BR') }],
    };
    setNotes(updated);
    localStorage.setItem('teaxis_patient_notes', JSON.stringify(updated));
  };

  const confirmarLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="dash-prof-page-premium">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmarLogout} />

      <header className="header-glass-premium">
        <div className="header-left">
          <img src={logoTeaxis} alt="Logo" className="header-logo-small" />
          <span className="professional-badge">Meus Pacientes</span>
        </div>
        <nav className="header-nav-glass">
          <Link to="/dashboard-profissional" className="nav-link-glass"><FaArrowLeft /> Voltar</Link>
          <Link to="/minha-agenda" className="nav-link-glass"><FaCalendarAlt /> Agenda</Link>
          <Link to="/meus-clientes" className="nav-link-glass active"><FaUsers /> Clientes</Link>
          <Link to="/relatorios" className="nav-link-glass"><FaClipboardList /> Relatórios</Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">Sair</button>
        </nav>
      </header>

      <main className="main-content-glass">
        <section className="glass-panel-dashboard fade-in hero-prof">
          <div>
            <h1>Pacientes em foco</h1>
            <p>Busca inteligente, histórico de atendimentos e notas rápidas. Tudo pronto para você entregar o cuidado mais preciso.</p>
          </div>
          <div className="schedule-summary">
            <div className="summary-card">
              <span className="summary-value">{clientes.length}</span>
              <span className="summary-label">Pacientes únicos</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{clientes.reduce((acc, item) => acc + item.proximos.length, 0)}</span>
              <span className="summary-label">Atendimentos próximos</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{clientes.reduce((acc, item) => acc + item.totalAtendimentos, 0)}</span>
              <span className="summary-label">Consultas totais</span>
            </div>
          </div>
        </section>

        <section className="glass-panel-dashboard fade-in delay-1">
          <div className="section-header">
            <h2><FaUsers className="title-icon" /> Lista de pacientes</h2>
            <span>{clientesFiltrados.length} resultados</span>
          </div>
          <div className="filter-group">
            <div className="filter-input-wrapper">
              <FaSearch className="filter-icon" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-select-wrapper">
              <FaFilter className="filter-icon" />
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Todos os status</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="clients-grid">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente, index) => (
                <button
                  key={index}
                  className={`client-card ${selectedCliente === cliente.nome ? 'active' : ''}`}
                  onClick={() => setSelectedCliente(cliente.nome)}
                >
                  <div>
                    <strong>{cliente.nome}</strong>
                    <span>Última visita: {cliente.ultimaVisita}</span>
                    <span>{cliente.totalAtendimentos} atendimentos</span>
                  </div>
                  <div className="client-card-meta">
                    <span className={`status-pill ${cliente.status.toLowerCase()}`}>{cliente.status}</span>
                    <FaCommentDots />
                  </div>
                </button>
              ))
            ) : (
              <div className="empty-state-small">Nenhum paciente encontrado com esses filtros.</div>
            )}
          </div>
        </section>

        <section className="glass-panel-dashboard fade-in delay-2">
          <div className="section-header">
            <h2><FaStickyNote className="title-icon" /> Detalhes do paciente</h2>
          </div>
          {selectedData ? (
            <div className="detail-panel">
              <div className="detail-header">
                <div>
                  <h3>{selectedData.nome}</h3>
                  <p>Última visita em {selectedData.ultimaVisita} · {selectedData.totalAtendimentos} consultas</p>
                </div>
                <button className="btn-icon-premium small" onClick={() => setSelectedCliente(null)}><FaTimes /></button>
              </div>

              <div className="metrics-row">
                <div className="metric-card">
                  <span>{selectedData.proximos.length}</span>
                  <small>Atendimentos próximos</small>
                </div>
                <div className="metric-card">
                  <span>{selectedData.historico.length}</span>
                  <small>Histórico disponível</small>
                </div>
                <div className="metric-card">
                  <span>{(notes[selectedData.nome] || []).length}</span>
                  <small>Notas rápidas</small>
                </div>
              </div>

              <div className="client-detail-grid">
                <div>
                  <h4>Próximas consultas</h4>
                  {selectedData.proximos.length > 0 ? (
                    selectedData.proximos.map((item, index) => (
                      <div key={index} className="timeline-event">
                        <strong>{item.data} · {item.hora}</strong>
                        <span>{item.status}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Sem consultas futuras registradas.</p>
                  )}
                </div>
                <div>
                  <h4>Notas rápidas</h4>
                  {notes[selectedData.nome] && notes[selectedData.nome].length > 0 ? (
                    notes[selectedData.nome].map((note, index) => (
                      <div key={index} className="note-card">
                        <small>{note.date}</small>
                        <p>{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Sem notas ainda.</p>
                  )}
                  <button className="btn-action-premium secondary full-width" onClick={handleAddNote}>Adicionar nota rápida</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state-small">Selecione um paciente para ver histórico, notas e próximos atendimentos.</div>
          )}
        </section>
      </main>
    </div>
  );
}