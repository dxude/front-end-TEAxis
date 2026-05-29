import React from 'react';
import { FaBookOpen, FaBullseye, FaChartLine, FaArrowRight } from 'react-icons/fa';
import '../Styles/ConnectionVisualization.css';

/**
 * Componente que visualiza a conexão entre Trilhas, Metas e Progresso
 * Pode ser usado em qualquer página para mostrar o ecossistema integrado
 */
export default function ConnectionVisualization({ trilhas, metas, progresso }) {
  return (
    <div className="connection-container">
      <h2 className="connection-title">🔗 Como Tudo Se Conecta</h2>
      <p className="connection-subtitle">
        Seu aprendizado nas trilhas alimenta suas metas, que elevam seu progresso geral
      </p>

      {/* Diagram de fluxo */}
      <div className="connection-diagram">
        {/* Trilhas */}
        <div className="connection-box trilhas-box">
          <div className="box-header trilhas-header">
            <FaBookOpen className="box-icon" />
            <h3>Minhas Trilhas</h3>
          </div>
          <div className="box-content">
            <div className="stat-small">
              <span className="stat-number">{trilhas?.length || 0}</span>
              <span className="stat-label">Trilhas Ativas</span>
            </div>
            <div className="stat-small">
              <span className="stat-number">
                {trilhas?.reduce((acc, t) => acc + (t.modulos?.filter(m => m.status === 'concluido').length || 0), 0) || 0}
              </span>
              <span className="stat-label">Módulos Concluídos</span>
            </div>
            <div className="flow-description">
              ✨ Cada módulo completo = Progresso desbloqueado
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="connection-arrow">
          <FaArrowRight className="arrow-icon" />
          <span className="arrow-text">Conecta</span>
        </div>

        {/* Metas */}
        <div className="connection-box metas-box">
          <div className="box-header metas-header">
            <FaBullseye className="box-icon" />
            <h3>Minhas Metas</h3>
          </div>
          <div className="box-content">
            <div className="stat-small">
              <span className="stat-number">{metas?.length || 0}</span>
              <span className="stat-label">Metas Pessoais</span>
            </div>
            <div className="stat-small">
              <span className="stat-number">
                {metas?.filter(m => m.concluida).length || 0}
              </span>
              <span className="stat-label">Concluídas</span>
            </div>
            <div className="flow-description">
              🎯 Trilhas alimentam as metas automaticamente
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="connection-arrow">
          <FaArrowRight className="arrow-icon" />
          <span className="arrow-text">Impulsiona</span>
        </div>

        {/* Progresso */}
        <div className="connection-box progresso-box">
          <div className="box-header progresso-header">
            <FaChartLine className="box-icon" />
            <h3>Meu Progresso</h3>
          </div>
          <div className="box-content">
            <div className="stat-small">
              <span className="stat-number">{progresso || 65}%</span>
              <span className="stat-label">Progresso Geral</span>
            </div>
            <div className="progress-bar-small">
              <div className="progress-fill" style={{ width: `${progresso || 65}%` }}></div>
            </div>
            <div className="flow-description">
              📈 Seu desenvolvimento completo refletido
            </div>
          </div>
        </div>
      </div>

      {/* Detalhes da conexão */}
      <div className="connection-details">
        <h3>📋 Detalhes da Integração</h3>
        <div className="details-grid">
          <div className="detail-card">
            <span className="detail-number">1</span>
            <h4>Trilha Completada</h4>
            <p>Quando você termina todos os módulos de uma trilha</p>
          </div>

          <FaArrowRight className="detail-arrow" />

          <div className="detail-card">
            <span className="detail-number">2</span>
            <h4>Meta Avançada</h4>
            <p>A meta relacionada recebe impacto e progride</p>
          </div>

          <FaArrowRight className="detail-arrow" />

          <div className="detail-card">
            <span className="detail-number">3</span>
            <h4>Progresso +</h4>
            <p>Seu desenvolvimento geral aumenta</p>
          </div>
        </div>
      </div>

      {/* Mapeamento de trilhas para metas */}
      <div className="mapping-section">
        <h3>🔄 Mapeamento Trilhas → Metas</h3>
        <div className="mapping-list">
          <div className="mapping-item">
            <div className="mapping-trilha">
              <span className="trilha-color foco"></span>
              <span>Foco e Concentração</span>
            </div>
            <FaArrowRight className="mapping-arrow" />
            <div className="mapping-meta">
              <span>Ler 10 páginas por dia</span>
            </div>
          </div>

          <div className="mapping-item">
            <div className="mapping-trilha">
              <span className="trilha-color social"></span>
              <span>Habilidades Sociais</span>
            </div>
            <FaArrowRight className="mapping-arrow" />
            <div className="mapping-meta">
              <span>Praticar mindfulness</span>
            </div>
          </div>

          <div className="mapping-item">
            <div className="mapping-trilha">
              <span className="trilha-color org"></span>
              <span>Organização</span>
            </div>
            <FaArrowRight className="mapping-arrow" />
            <div className="mapping-meta">
              <span>Estruturar rotina</span>
            </div>
          </div>

          <div className="mapping-item">
            <div className="mapping-trilha">
              <span className="trilha-color emocional"></span>
              <span>Inteligência Emocional</span>
            </div>
            <FaArrowRight className="mapping-arrow" />
            <div className="mapping-meta">
              <span>Bem-estar geral</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="connection-cta">
        <h3>🚀 Comece Sua Jornada</h3>
        <p>
          Escolha uma trilha, complete os módulos e veja suas metas e progresso evoluírem automaticamente.
          O TEAXIS foi projetado para conectar aprendizado com crescimento pessoal.
        </p>
      </div>
    </div>
  );
}
