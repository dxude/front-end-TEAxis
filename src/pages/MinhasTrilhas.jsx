import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBookOpen, FaPlus, FaCheck, FaArrowLeft, FaLightbulb, FaRocket, 
  FaBullseye, FaChartLine, FaFire, FaTrophy, FaSearch, FaUserCircle, 
  FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaStar, FaClock, FaSpinner, FaLock, FaBell
} from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { 
  calcularProgressaoGeral, 
  calcularEstatisticas, 
  obterProximasAcoes,
  calcularXPTotal,
  gerarNotificacoes
} from '../utils/dataSync';
import '../Styles/MinhasTrilhas.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

const TRILHAS_PRESETS = [
  {
    id: 'foco',
    titulo: 'Foco e Concentração',
    descricao: 'Técnicas comprovadas para minimizar distrações e maximizar sua produtividade',
    descricaoCompleta: 'Desenvolva habilidades de concentração profunda, aprenda técnicas de gestão de tempo e elimine distrações digitais. Perfeito para quem quer melhorar a atenção e o desempenho',
    dificuldade: 'Intermediária',
    duracao: '4 semanas',
    impacto: 'Melhora no foco pessoal e profissional',
    cor: '#20C997',
    icone: '🎯',
    modulos: [
      { id: 1, titulo: 'Compreendendo a Concentração', descricao: 'Bases neurocientíficas', duracao: '2h', status: 'concluido' },
      { id: 2, titulo: 'Técnicas de Deep Work', descricao: 'Método Pomodoro e variações', duracao: '3h', status: 'concluido' },
      { id: 3, titulo: 'Gestão de Distrações Digitais', descricao: 'Bloqueadores e hábitos', duracao: '2.5h', status: 'em-progresso' },
      { id: 4, titulo: 'Criando seu Ambiente Ideal', descricao: 'Espaço físico e mental', duracao: '1.5h', status: 'bloqueado' },
      { id: 5, titulo: 'Consolidando o Hábito', descricao: 'Desafio final de 7 dias', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'social',
    titulo: 'Habilidades Sociais',
    descricao: 'Amplie sua capacidade de se relacionar e comunicar com assertividade',
    descricaoCompleta: 'Aprenda técnicas de comunicação não-violenta, inteligência emocional e como se relacionar melhor em diferentes contextos sociais. Ideal para melhorar relacionamentos pessoais e profissionais',
    dificuldade: 'Intermediária',
    duracao: '5 semanas',
    impacto: 'Relacionamentos mais saudáveis e satisfatórios',
    cor: '#7B3FF2',
    icone: '🤝',
    modulos: [
      { id: 1, titulo: 'Fundamentos da Comunicação', descricao: 'Teoria e prática básica', duracao: '2h', status: 'concluido' },
      { id: 2, titulo: 'Escuta Ativa e Empatia', descricao: 'Sendo presente', duracao: '2h', status: 'concluido' },
      { id: 3, titulo: 'Assertividade e Limites', descricao: 'Dizendo não com respeito', duracao: '2.5h', status: 'em-progresso' },
      { id: 4, titulo: 'Inteligência Emocional Social', descricao: 'Lendo pessoas', duracao: '3h', status: 'bloqueado' },
      { id: 5, titulo: 'Resolvendo Conflitos', descricao: 'Comunicação não-violenta', duracao: '2.5h', status: 'bloqueado' },
      { id: 6, titulo: 'Apresentações Confiantes', descricao: 'Falando em público', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'organizacao',
    titulo: 'Organização e Planejamento',
    descricao: 'Estruture sua vida com sistemas de organização que realmente funcionam',
    descricaoCompleta: 'Domine técnicas de planejamento pessoal, gestão de tempo e sistemas de organização. Aprenda a transformar sonhos em planos executáveis',
    dificuldade: 'Fácil',
    duracao: '3 semanas',
    impacto: 'Rotina estruturada e produtiva',
    cor: '#074f9b',
    icone: '📋',
    modulos: [
      { id: 1, titulo: 'Diagnóstico Pessoal', descricao: 'Mapeando seu tempo', duracao: '1.5h', status: 'concluido' },
      { id: 2, titulo: 'Sistemas de Organização', descricao: 'Escolhendo o seu', duracao: '2h', status: 'concluido' },
      { id: 3, titulo: 'Planejamento em 3 Níveis', descricao: 'Dia, semana, mês', duracao: '2h', status: 'concluido' },
    ],
    status: 'concluida'
  },
  {
    id: 'emocional',
    titulo: 'Inteligência Emocional',
    descricao: 'Conheça-se melhor e construa relacionamentos mais autênticos',
    descricaoCompleta: 'Explore suas emoções, desenvolvendo autoconhecimento e autorregulação emocional. Base para bem-estar e relacionamentos de qualidade',
    dificuldade: 'Avançada',
    duracao: '6 semanas',
    impacto: 'Bem-estar emocional e relacionamentos profundos',
    cor: '#FFD700',
    icone: '💛',
    modulos: [
      { id: 1, titulo: 'Reconhecendo Emoções', descricao: 'Atlas das emoções', duracao: '2h', status: 'bloqueado' },
      { id: 2, titulo: 'Autoconhecimento Emocional', descricao: 'Seus gatilhos e padrões', duracao: '2.5h', status: 'bloqueado' },
      { id: 3, titulo: 'Regulação Emocional', descricao: 'Técnicas práticas', duracao: '2.5h', status: 'bloqueado' },
      { id: 4, titulo: 'Empatia Avançada', descricao: 'Conectando com outros', duracao: '2h', status: 'bloqueado' },
      { id: 5, titulo: 'Relacionamentos Autênticos', descricao: 'Vulnerabilidade segura', duracao: '2.5h', status: 'bloqueado' },
      { id: 6, titulo: 'Jornada de Transformação', descricao: 'Integrando tudo', duracao: '2h', status: 'bloqueado' },
    ]
  },
];

export default function MinhasTrilhas() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCriarTrilha, setShowCriarTrilha] = useState(false);
  const [trilhasUsuario, setTrilhasUsuario] = useState([]);
  const [expandedTrilha, setExpandedTrilha] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [animacaoNovasTrilhas, setAnimacaoNovasTrilhas] = useState({});
  const [notificacoes, setNotificacoes] = useState([]);
  const [xpTotal, setXpTotal] = useState(0);
  const [proximasAcoes, setProximasAcoes] = useState([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);

  // Carregar trilhas do localStorage
  useEffect(() => {
    const trilhasSalvas = localStorage.getItem('trilhas_usuario');
    if (trilhasSalvas) {
      setTrilhasUsuario(JSON.parse(trilhasSalvas));
    } else {
      setTrilhasUsuario([TRILHAS_PRESETS[0], TRILHAS_PRESETS[1], TRILHAS_PRESETS[2]]);
    }
  }, []);

  // Salvar trilhas no localStorage e sincronizar dados
  useEffect(() => {
    localStorage.setItem('trilhas_usuario', JSON.stringify(trilhasUsuario));
    
    // Atualizar XP total
    const xp = calcularXPTotal(trilhasUsuario);
    setXpTotal(xp);
    
    // Atualizar próximas ações
    const acoes = obterProximasAcoes(trilhasUsuario);
    setProximasAcoes(acoes);
    
    // Gerar notificações
    const notificacoesAnteriores = JSON.parse(localStorage.getItem('trilhas_notificacoes') || '[]');
    const novasNotificacoes = gerarNotificacoes(trilhasUsuario, notificacoesAnteriores);
    setNotificacoes(novasNotificacoes);
    localStorage.setItem('trilhas_notificacoes', JSON.stringify(novasNotificacoes));
  }, [trilhasUsuario]);

  // Adicionar nova trilha
  const adicionarTrilha = (trilhaId) => {
    const trilhaPreset = TRILHAS_PRESETS.find(t => t.id === trilhaId);
    if (trilhaPreset && !trilhasUsuario.find(t => t.id === trilhaId)) {
      setAnimacaoNovasTrilhas({ [trilhaId]: true });
      setTrilhasUsuario([...trilhasUsuario, { ...trilhaPreset, status: 'nao-iniciada', progresso: 0 }]);
      setTimeout(() => setAnimacaoNovasTrilhas({ [trilhaId]: false }), 500);
    }
  };

  // Calcular progresso da trilha
  const calcularProgresso = (trilha) => {
    if (!trilha.modulos || trilha.modulos.length === 0) return 0;
    const concluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
    return Math.round((concluidos / trilha.modulos.length) * 100);
  };

  // Atualizar status do módulo
  const atualizarModulo = (trilhaId, moduloId, novoStatus) => {
    setTrilhasUsuario(trilhasUsuario.map(trilha => {
      if (trilha.id === trilhaId) {
        const modulosAtualizados = trilha.modulos.map(mod => 
          mod.id === moduloId ? { ...mod, status: novoStatus } : mod
        );
        const progresso = Math.round((modulosAtualizados.filter(m => m.status === 'concluido').length / modulosAtualizados.length) * 100);
        return { 
          ...trilha, 
          modulos: modulosAtualizados,
          progresso,
          status: progresso === 100 ? 'concluida' : 'em-andamento'
        };
      }
      return trilha;
    }));
  };

  // Remover trilha
  const removerTrilha = (trilhaId) => {
    setTrilhasUsuario(trilhasUsuario.filter(t => t.id !== trilhaId));
  };

  // Iniciar trilha
  const iniciarTrilha = (trilhaId) => {
    setTrilhasUsuario(trilhasUsuario.map(trilha => {
      if (trilha.id === trilhaId && trilha.status === 'nao-iniciada') {
        return { ...trilha, status: 'em-andamento', progresso: 0 };
      }
      return trilha;
    }));
  };

  // Filtrar trilhas
  const trilhasFiltradas = trilhasUsuario.filter(t => {
    if (filtroStatus === 'todas') return true;
    if (filtroStatus === 'ativas') return ['em-andamento', 'nao-iniciada'].includes(t.status);
    if (filtroStatus === 'concluidas') return t.status === 'concluida';
    return true;
  });

  // Trilhas disponíveis para adicionar
  const trilhasDisponíveis = TRILHAS_PRESETS.filter(p => !trilhasUsuario.find(u => u.id === p.id));

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => { setShowLogoutModal(false); navigate('/login'); };

  return (
    <div className="trilhas-container-v2">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />

      {/* Header Premium */}
      <header className="trilhas-header-v2">
        <div className="header-left">
          <Link to="/dashboard-usuario" className="back-btn-v2"><FaArrowLeft /> Voltar</Link>
          <img src={logoTeaxis} alt="Logo" className="header-logo-v2" />
        </div>
        <nav className="header-nav-v2">
          <Link to="/minhas-trilhas" className="nav-link-v2 active"><FaBookOpen /> Trilhas</Link>
          <Link to="/minhas-metas" className="nav-link-v2"><FaBullseye /> Metas</Link>
          <Link to="/meu-progresso" className="nav-link-v2"><FaChartLine /> Progresso</Link>
        </nav>
      </header>

      {/* Background Animado */}
      <div className="bg-shapes-v2">
        <div className="shape-v2 shape-1"></div>
        <div className="shape-v2 shape-2"></div>
        <div className="shape-v2 shape-3"></div>
      </div>

      <main className="trilhas-main-v2">
        {/* Hero Section com Explicação */}
        <section className="hero-trilhas-v2 fade-in-up">
          <div className="hero-content-v2">
            <h1>🎓 Minhas Trilhas de Aprendizado</h1>
            <p>Caminhos estruturados de desenvolvimento pessoal dentro do TEAXIS. Cada trilha conecta-se às suas metas e impacta seu progresso geral.</p>
          </div>

          {/* Card Explicativo Interativo */}
          <div className="explicacao-trilhas-v2">
            <div className="explicacao-icon">
              <FaLightbulb className="lightbulb-icon" />
            </div>
            <div className="explicacao-content">
              <h3>O que são Trilhas?</h3>
              <p>Trilhas são <strong>sequências estruturadas de aprendizado</strong> no TEAXIS. Cada trilha tem módulos temáticos que, quando concluídos, desbloqueem conquistas e alimentam suas metas pessoais. É um sistema integrado de desenvolvimento.</p>
              <div className="conexoes-trilhas">
                <div className="conexao-item">
                  <FaBullseye className="con-icon" />
                  <span>Conecta com <strong>Minhas Metas</strong> - cada módulo concluído avança suas metas</span>
                </div>
                <div className="conexao-item">
                  <FaChartLine className="con-icon" />
                  <span>Impacta <strong>Meu Progresso</strong> - trilhas completadas elevam seu percentual geral</span>
                </div>
                <div className="conexao-item">
                  <FaTrophy className="con-icon" />
                  <span>Gera <strong>Conquistas</strong> - desbloqueia badges exclusivas e reconhecimento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Filtros e Ações */}
        <section className="filtros-acoes-v2">
          <div className="filtro-group">
            <button 
              className={`filtro-btn ${filtroStatus === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('todas')}
            >
              Todas ({trilhasUsuario.length})
            </button>
            <button 
              className={`filtro-btn ${filtroStatus === 'ativas' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('ativas')}
            >
              Ativas
            </button>
            <button 
              className={`filtro-btn ${filtroStatus === 'concluidas' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('concluidas')}
            >
              Concluídas
            </button>
          </div>
          <div className="acoes-direita">
            <div className="xp-badge">
              <FaFire className="fire-icon" />
              <span>{xpTotal} XP</span>
            </div>
            <button 
              className={`btn-notificacoes ${notificacoes.length > 0 ? 'has-notifications' : ''}`}
              onClick={() => setShowNotificacoes(!showNotificacoes)}
              title="Notificações"
            >
              <FaBell />
              {notificacoes.length > 0 && <span className="notification-badge">{notificacoes.length}</span>}
            </button>
            <button className="btn-nova-trilha-v2" onClick={() => setShowCriarTrilha(!showCriarTrilha)}>
              <FaPlus /> {showCriarTrilha ? 'Cancelar' : 'Explorar Trilhas'}
            </button>
          </div>
        </section>

        {/* Notificações */}
        {showNotificacoes && notificacoes.length > 0 && (
          <section className="notificacoes-panel fade-in-down">
            <h3>Suas Notificações</h3>
            <div className="notificacoes-list">
              {notificacoes.slice(-5).map(notif => (
                <div key={notif.id} className={`notificacao-item notificacao-${notif.tipo}`}>
                  <div className="notif-icon">
                    {notif.tipo === 'milestone' && '🎉'}
                    {notif.tipo === 'sucesso' && '🏆'}
                  </div>
                  <div className="notif-content">
                    <h4>{notif.titulo}</h4>
                    <p>{notif.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Próximas Ações Recomendadas */}
        {proximasAcoes.length > 0 && (
          <section className="proximas-acoes-v2 fade-in">
            <h3>🎯 Próximas Ações Recomendadas</h3>
            <div className="acoes-grid">
              {proximasAcoes.map(acao => (
                <div key={acao.id} className={`acao-card prioridade-${acao.prioridade}`}>
                  <span className="acao-tipo">{acao.tipo === 'iniciar-trilha' ? 'Iniciar' : 'Continuar'}</span>
                  <h4>{acao.titulo}</h4>
                  <p>{acao.descricao}</p>
                  <span className="acao-impacto">{acao.impacto}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modal de Criar/Explorar Trilha */}
        {showCriarTrilha && (
          <section className="trilhas-disponiveis-v2 fade-in-down">
            <h2>Explore Novas Trilhas</h2>
            <div className="trilhas-disponiveis-grid">
              {trilhasDisponíveis.map(trilha => (
                <div key={trilha.id} className="trilha-disponivel-card">
                  <div className="card-header" style={{ backgroundColor: trilha.cor }}>
                    <span className="trilha-icon">{trilha.icone}</span>
                  </div>
                  <div className="card-content">
                    <h3>{trilha.titulo}</h3>
                    <p className="descricao-breve">{trilha.descricao}</p>
                    <div className="info-trilha">
                      <span className="badge badge-dificuldade">{trilha.dificuldade}</span>
                      <span className="badge badge-duracao"><FaClock /> {trilha.duracao}</span>
                    </div>
                    <p className="descricao-completa">{trilha.descricaoCompleta}</p>
                    <div className="impacto-trilha">
                      <FaFire className="fire-icon" />
                      <span><strong>Impacto:</strong> {trilha.impacto}</span>
                    </div>
                    <button className="btn-adicionar-trilha" onClick={() => adicionarTrilha(trilha.id)}>
                      <FaPlus /> Adicionar à Minha Jornada
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid de Trilhas do Usuário */}
        <section className="trilhas-usuario-grid-v2">
          {trilhasFiltradas.length === 0 ? (
            <div className="empty-state-trilhas">
              <FaBookOpen className="empty-icon" />
              <h3>Nenhuma trilha encontrada</h3>
              <p>Explore novas trilhas para começar sua jornada de desenvolvimento</p>
            </div>
          ) : (
            trilhasFiltradas.map(trilha => {
              const progresso = calcularProgresso(trilha);
              const modulosConcluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
              const isExpanded = expandedTrilha === trilha.id;

              return (
                <div key={trilha.id} className={`trilha-card-v2 ${trilha.status} ${animacaoNovasTrilhas[trilha.id] ? 'novo' : ''}`}>
                  {/* Cabeçalho do Card */}
                  <div className="trilha-card-header">
                    <div className="trilha-info-header">
                      <span className="trilha-icon-large">{trilha.icone}</span>
                      <div className="trilha-titulo-info">
                        <h3>{trilha.titulo}</h3>
                        <span className={`status-tag status-${trilha.status}`}>
                          {trilha.status === 'em-andamento' ? '🔥 Em Andamento' : 
                           trilha.status === 'concluida' ? '✅ Concluída' : 
                           '🔒 Não Iniciada'}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn-expand"
                      onClick={() => setExpandedTrilha(isExpanded ? null : trilha.id)}
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="progresso-container-v2">
                    <div className="progresso-info">
                      <span className="progresso-label">Progresso: <strong>{progresso}%</strong></span>
                      <span className="modulos-info">{modulosConcluidos}/{trilha.modulos.length} módulos</span>
                    </div>
                    <div className="progresso-bar-v2">
                      <div className="progresso-fill" style={{ width: `${progresso}%`, backgroundColor: trilha.cor }}></div>
                    </div>
                  </div>

                  {/* Descrição e Metadata */}
                  <div className="trilha-metadata">
                    <p className="descricao-trilha">{trilha.descricao}</p>
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <FaClock className="meta-icon" />
                        <span>{trilha.duracao}</span>
                      </div>
                      <div className="metadata-item">
                        <FaStar className="meta-icon" />
                        <span>{trilha.dificuldade}</span>
                      </div>
                      <div className="metadata-item">
                        <FaFire className="meta-icon" />
                        <span>+{Math.round(progresso * 0.5)} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  {trilha.status === 'nao-iniciada' && (
                    <div className="trilha-actions">
                      <button className="btn-action btn-iniciar" onClick={() => iniciarTrilha(trilha.id)}>
                        <FaRocket /> Iniciar Trilha
                      </button>
                    </div>
                  )}

                  {/* Módulos Expandíveis */}
                  {isExpanded && (
                    <div className="modulos-expandidos-v2 fade-in">
                      <h4>Módulos da Trilha</h4>
                      <div className="modulos-list">
                        {trilha.modulos.map((modulo, index) => (
                          <div key={modulo.id} className={`modulo-item modulo-${modulo.status}`}>
                            <div className="modulo-header">
                              <div className="modulo-numero">
                                <span>{index + 1}</span>
                              </div>
                              <div className="modulo-info">
                                <h5>{modulo.titulo}</h5>
                                <p>{modulo.descricao}</p>
                              </div>
                              <div className="modulo-duracao">
                                <FaClock /> {modulo.duracao}
                              </div>
                            </div>

                            {/* Status do Módulo */}
                            {modulo.status === 'bloqueado' && (
                              <div className="modulo-bloqueado">
                                <FaLock className="lock-icon" />
                                <span>Desbloqueado após módulo anterior</span>
                              </div>
                            )}

                            {modulo.status === 'concluido' && (
                              <div className="modulo-concluido">
                                <FaCheck className="check-icon" />
                                <span>Concluído</span>
                              </div>
                            )}

                            {modulo.status === 'em-progresso' && (
                              <div className="modulo-progresso">
                                <button 
                                  className="btn-concluir-modulo"
                                  onClick={() => atualizarModulo(trilha.id, modulo.id, 'concluido')}
                                >
                                  <FaCheck /> Marcar como Concluído
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Ações Finais */}
                      <div className="modulos-actions">
                        {progresso === 100 && trilha.status !== 'concluida' && (
                          <button className="btn-action btn-finalizar" onClick={() => {}}>
                            <FaTrophy /> Finalizar e Celebrar
                          </button>
                        )}
                        <button className="btn-action btn-remover" onClick={() => removerTrilha(trilha.id)}>
                          <FaTrash /> Remover Trilha
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Seção de Conexões e Próximos Passos */}
        <section className="conexoes-finais-v2 fade-in-up">
          <div className="conexao-card conexao-metas">
            <div className="conexao-header">
              <FaBullseye className="conexao-icon" />
              <h3>Suas Metas e Trilhas</h3>
            </div>
            <p>Cada módulo concluído de uma trilha avança automaticamente suas metas relacionadas. Veja como estão conectadas!</p>
            <Link to="/minhas-metas" className="btn-conexao">
              Acessar Minhas Metas <FaArrowLeft style={{transform: 'rotate(180deg)'}} />
            </Link>
          </div>

          <div className="conexao-card conexao-progresso">
            <div className="conexao-header">
              <FaChartLine className="conexao-icon" />
              <h3>Seu Progresso Geral</h3>
            </div>
            <p>Trilhas completadas, módulos finalizados - tudo contribui para seu percentual de progresso geral na plataforma.</p>
            <Link to="/meu-progresso" className="btn-conexao">
              Ver Meu Progresso <FaArrowLeft style={{transform: 'rotate(180deg)'}} />
            </Link>
          </div>
        </section>

        {/* Gamification Stats */}
        <section className="gamification-stats-v2">
          <h2>Seus Números</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-valor">{trilhasUsuario.length}</span>
              <span className="stat-label">Trilhas Ativas</span>
            </div>
            <div className="stat-item">
              <span className="stat-valor">{trilhasUsuario.reduce((a, t) => a + t.modulos.filter(m => m.status === 'concluido').length, 0)}</span>
              <span className="stat-label">Módulos Concluídos</span>
            </div>
            <div className="stat-item">
              <span className="stat-valor">{Math.round(trilhasUsuario.reduce((a, t) => a + calcularProgresso(t), 0) / trilhasUsuario.length || 0)}%</span>
              <span className="stat-label">Progresso Médio</span>
            </div>
            <div className="stat-item">
              <span className="stat-valor">{trilhasUsuario.filter(t => t.status === 'concluida').length}</span>
              <span className="stat-label">Trilhas Concluídas</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}