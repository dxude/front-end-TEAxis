import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUserMd, FaArrowRight, FaList, FaRegCalendarAlt, FaSearch, FaFilter, FaCopy, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardProfissional.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos } from '../utils/dataSync';

const parseDate = (value) => {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function MinhaAgenda() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [agenda, setAgenda] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const agendaCompleta = carregarAgendamentos();
    const profAgenda = agendaCompleta.filter(item => item.toRole === 'profissional');
    setAgenda(profAgenda);
  }, []);

  const agendaOrdenada = useMemo(() => {
    return [...agenda].sort((a, b) => {
      const dateA = parseDate(a.data);
      const dateB = parseDate(b.data);
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
      return a.hora.localeCompare(b.hora);
    });
  }, [agenda]);

  const agendaFiltrada = useMemo(() => {
    return agendaOrdenada.filter(item => {
      const matchText = [item.cliente, item.profissional, item.status].join(' ').toLowerCase();
      const matchesSearch = matchText.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [agendaOrdenada, searchQuery, statusFilter]);

  const proximos = agendaFiltrada.filter(item => item.status === 'Confirmado');
  const anteriores = agendaFiltrada.filter(item => item.status === 'Concluído' || item.status === 'Cancelado');

  const agendaPorData = useMemo(() => {
    return agendaFiltrada.reduce((acc, item) => {
      const dateKey = item.data;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [agendaFiltrada]);

  const conflitos = useMemo(() => {
    const map = {};
    agendaOrdenada.forEach(item => {
      const key = `${item.data}-${item.hora}`;
      map[key] = map[key] || [];
      map[key].push(item);
    });
    return Object.values(map).filter(group => group.length > 1);
  }, [agendaOrdenada]);

  const estatisticas = useMemo(() => ({
    total: agenda.length,
    confirmados: agenda.filter(item => item.status === 'Confirmado').length,
    concluidos: agenda.filter(item => item.status === 'Concluído').length,
    cancelados: agenda.filter(item => item.status === 'Cancelado').length,
  }), [agenda]);

  const downloadFile = (filename, content, mimeType = 'text/csv') => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleCopyAgenda = async () => {
    const text = agendaOrdenada.map(item => `${item.data} ${item.hora} — ${item.cliente} (${item.status})`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Agenda copiada para a área de transferência!');
      setTimeout(() => setCopySuccess(''), 2500);
    } catch (error) {
      setCopySuccess('Não foi possível copiar.');
      setTimeout(() => setCopySuccess(''), 2500);
    }
  };

  const handleExportAgendaCSV = () => {
    const rows = [
      ['Data', 'Hora', 'Cliente', 'Profissional', 'Status'].join(','),
      ...agendaFiltrada.map(item => [item.data, item.hora, item.cliente, item.profissional, item.status].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')),
    ];
    downloadFile('agenda-profissional.csv', rows.join('\n'));
    setCopySuccess('CSV da agenda gerado e baixado!');
    setTimeout(() => setCopySuccess(''), 2500);
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
          <span className="professional-badge">Agenda Completa</span>
        </div>
        <nav className="header-nav-glass">
          <Link to="/dashboard-profissional" className="nav-link-glass"><FaArrowLeft /> Voltar</Link>
          <Link to="/minha-agenda" className="nav-link-glass active"><FaCalendarAlt /> Agenda</Link>
          <Link to="/meus-clientes" className="nav-link-glass"><FaUserMd /> Clientes</Link>
          <Link to="/relatorios" className="nav-link-glass"><FaArrowRight /> Relatórios</Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">Sair</button>
        </nav>
      </header>

      <main className="main-content-glass">
        <section className="glass-panel-dashboard fade-in hero-prof">
          <div>
            <h1>Agenda profissional</h1>
            <p>Uma visão completa da sua semana com agenda inteligente, filtros e alertas de conflito para você gerir sua rotina com confiança.</p>
          </div>
          <div className="schedule-summary">
            <div className="summary-card">
              <span className="summary-value">{estatisticas.total}</span>
              <span className="summary-label">Atendimentos</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{estatisticas.confirmados}</span>
              <span className="summary-label">Confirmados</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{estatisticas.concluidos}</span>
              <span className="summary-label">Concluídos</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{estatisticas.cancelados}</span>
              <span className="summary-label">Cancelados</span>
            </div>
          </div>
        </section>

        <section className="glass-panel-dashboard fade-in delay-1">
          <div className="section-header">
            <h2><FaRegCalendarAlt className="title-icon" /> Filtros e visualização</h2>
            <div className="action-row">
              <button className="btn-action-premium secondary" onClick={handleCopyAgenda}><FaCopy /> Copiar agenda</button>
              <button className="btn-action-premium secondary" onClick={handleExportAgendaCSV}><FaDownload /> Exportar CSV</button>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-input-wrapper">
              <FaSearch className="filter-icon" />
              <input
                type="text"
                placeholder="Buscar cliente, status ou horário"
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
            <div className="toggle-group">
              <button className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}><FaList /> Cartões</button>
              <button className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`} onClick={() => setViewMode('timeline')}><FaRegCalendarAlt /> Linha do tempo</button>
            </div>
          </div>
          {copySuccess && <div className="copy-banner">{copySuccess}</div>}
          {conflitos.length > 0 && (
            <div className="warning-banner">
              <FaExclamationTriangle /> Existem <strong>{conflitos.length}</strong> conflitos de horário na sua agenda. Reveja os horários duplicados para evitar sobreposição.
            </div>
          )}
        </section>

        {viewMode === 'cards' ? (
          <section className="glass-panel-dashboard fade-in delay-2">
            <div className="section-header">
              <h2><FaCalendarAlt className="title-icon" /> Atendimentos</h2>
              <span>{agendaFiltrada.length} resultados</span>
            </div>
            {agendaFiltrada.length > 0 ? (
              <div className="agendamentos-list">
                {agendaFiltrada.map(item => (
                  <div key={item.id} className="agendamento-item-premium">
                    <div className="agendamento-time">
                      <span className="time">{item.hora}</span>
                      <span className="date">{item.data}</span>
                    </div>
                    <div className="agendamento-details">
                      <strong>{item.cliente}</strong>
                      <span>{item.profissional}</span>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                    <button className="btn-icon-premium" title="Ver detalhes"><FaArrowRight /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">Nenhum agendamento corresponde aos filtros.</div>
            )}
          </section>
        ) : (
          <section className="glass-panel-dashboard fade-in delay-2">
            <div className="section-header">
              <h2><FaClock className="title-icon" /> Linha do tempo</h2>
              <span>{Object.keys(agendaPorData).length} dias</span>
            </div>
            {Object.keys(agendaPorData).length > 0 ? (
              <div className="timeline-wrapper">
                {Object.entries(agendaPorData).map(([data, eventos]) => (
                  <div key={data} className="timeline-day">
                    <h3>{data}</h3>
                    <div className="timeline-events">
                      {eventos.map(item => (
                        <div key={item.id} className="timeline-event">
                          <strong>{item.hora}</strong>
                          <div>
                            <span>{item.cliente}</span>
                            <small>{item.status}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">A linha do tempo não encontrou agendamentos.</div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
