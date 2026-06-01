import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaUsers, FaCalendarDay, FaClipboardCheck, FaFileInvoiceDollar, FaCopy, FaDownload, FaCheckCircle, FaTimesCircle, FaBell } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import '../Styles/DashboardProfissional.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';
import { carregarAgendamentos, carregarMensagens } from '../utils/dataSync';

const parseDate = (value) => {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function Relatorios() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  const [agenda, setAgenda] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const agendaFull = carregarAgendamentos().filter(item => item.toRole === 'profissional');
    const mensagensFull = carregarMensagens();
    setAgenda(agendaFull);
    setMensagens(mensagensFull);
  }, []);

  const relatorio = useMemo(() => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(timeRange));
    const periodo = agenda.filter(item => parseDate(item.data) >= dataLimite);

    const confirmados = periodo.filter(item => item.status === 'Confirmado').length;
    const concluidos = periodo.filter(item => item.status === 'Concluído').length;
    const cancelados = periodo.filter(item => item.status === 'Cancelado').length;
    const total = periodo.length;
    const pacientesAtivos = new Set(periodo.map(item => item.cliente)).size;
    const novasMensagens = mensagens.filter(msg => msg.toRole === 'profissional' && !msg.lida).length;
    const performance = total > 0 ? Math.round(((confirmados + concluidos) / total) * 100) : 0;

    return {
      total,
      confirmados,
      concluidos,
      cancelados,
      pacientesAtivos,
      novasMensagens,
      performance,
      taxaRetencao: total > 0 ? Math.round((concluidos / total) * 100) : 0,
    };
  }, [agenda, mensagens, timeRange]);

  const chartData = useMemo(() => ([
    { label: 'Confirmados', value: relatorio.confirmados, color: '#22c55e', icon: FaCheckCircle },
    { label: 'Concluídos', value: relatorio.concluidos, color: '#2563eb', icon: FaClipboardCheck },
    { label: 'Cancelados', value: relatorio.cancelados, color: '#ef4444', icon: FaTimesCircle },
  ]), [relatorio]);

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

  const handleExportReportCSV = () => {
    const rows = [
      ['Métrica', 'Valor'].join(','),
      [`Período`, `Últimos ${timeRange} dias`],
      ['Atendimentos totais', relatorio.total],
      ['Confirmados', relatorio.confirmados],
      ['Concluídos', relatorio.concluidos],
      ['Cancelados', relatorio.cancelados],
      ['Pacientes ativos', relatorio.pacientesAtivos],
      ['Mensagens não lidas', relatorio.novasMensagens],
      ['Taxa de retenção (%)', relatorio.taxaRetencao],
      ['Performance (%)', relatorio.performance],
    ].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','));
    downloadFile('relatorio-profissional.csv', rows.join('\n'));
    setCopyStatus('CSV de relatório gerado e baixado!');
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const handleCopyReport = async () => {
    const text = `Relatório TEAxis - Últimos ${timeRange} dias:\nTotal: ${relatorio.total}\nConfirmados: ${relatorio.confirmados}\nConcluídos: ${relatorio.concluidos}\nCancelados: ${relatorio.cancelados}\nPacientes ativos: ${relatorio.pacientesAtivos}\nMensagens não lidas: ${relatorio.novasMensagens}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Resumo copiado com sucesso!');
    } catch (error) {
      setCopyStatus('Erro ao copiar resumo.');
    }
    setTimeout(() => setCopyStatus(''), 2500);
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
          <span className="professional-badge">Relatórios</span>
        </div>
        <nav className="header-nav-glass">
          <Link to="/dashboard-profissional" className="nav-link-glass"><FaArrowLeft /> Voltar</Link>
          <Link to="/minha-agenda" className="nav-link-glass"><FaCalendarDay /> Agenda</Link>
          <Link to="/meus-clientes" className="nav-link-glass"><FaUsers /> Clientes</Link>
          <Link to="/relatorios" className="nav-link-glass active"><FaChartBar /> Relatórios</Link>
          <button onClick={() => setShowLogoutModal(true)} className="nav-link-glass logout-btn">Sair</button>
        </nav>
      </header>

      <main className="main-content-glass">
        <section className="glass-panel-dashboard fade-in hero-prof">
          <div>
            <h1>Relatórios dinâmicos</h1>
            <p>Indicadores em tempo real para você tomar decisões rápidas na agenda e no atendimento dos pacientes.</p>
          </div>
          <div className="schedule-summary">
            <div className="summary-card">
              <span className="summary-value">{relatorio.total}</span>
              <span className="summary-label">Atendimentos últimos {timeRange} dias</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{relatorio.pacientesAtivos}</span>
              <span className="summary-label">Pacientes ativos</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{relatorio.taxaRetencao}%</span>
              <span className="summary-label">Taxa de retenção</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{relatorio.novasMensagens}</span>
              <span className="summary-label">Mensagens pendentes</span>
            </div>
          </div>
        </section>

        <section className="glass-panel-dashboard fade-in delay-1">
          <div className="section-header">
            <h2><FaChartBar className="title-icon" /> Período</h2>
            <div className="action-row">
              <button className="btn-action-premium secondary" onClick={handleCopyReport}><FaCopy /> Copiar relatório</button>
              <button className="btn-action-premium secondary" onClick={handleExportReportCSV}><FaDownload /> Exportar CSV</button>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-select-wrapper">
              <select className="filter-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
            </div>
          </div>
          {copyStatus && <div className="copy-banner">{copyStatus}</div>}
        </section>

        <section className="glass-panel-dashboard fade-in delay-2">
          <div className="section-header">
            <h2><FaClipboardCheck className="title-icon" /> Distribuição de atendimentos</h2>
          </div>
          <div className="chart-grid">
            {chartData.map((column) => (
              <div key={column.label} className="chart-card">
                <div className="chart-label">
                  <span>{column.label}</span>
                  <strong>{column.value}</strong>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ height: `${Math.min(column.value * 12, 260)}px`, background: column.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel-dashboard fade-in delay-3">
          <div className="section-header">
            <h2><FaBell className="title-icon" /> Insights</h2>
          </div>
          <div className="insight-grid">
            <div className="insight-card">
              <h4>Agenda equilibrada</h4>
              <p>Atendimentos confirmados representam <strong>{relatorio.performance}%</strong> da sua agenda ativa.</p>
            </div>
            <div className="insight-card">
              <h4>Foco em resultados</h4>
              <p>Mantenha a taxa de retenção acima de <strong>70%</strong> para fortalecer o relacionamento com seus pacientes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
