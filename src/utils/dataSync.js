/**
 * Sistema de Sincronização de Dados
 * Conecta Trilhas, Metas e Progresso em um ecossistema integrado
 */

// Mapear conexões entre trilhas e metas
export const TRILHAS_METAS_MAPPING = {
  'foco': {
    metaIds: [1], // Ler 10 páginas por dia
    impactoPorModulo: 10,
    descricao: 'Cada módulo de Foco e Concentração contribui para sua meta de leitura diária'
  },
  'social': {
    metaIds: [2], // Praticar mindfulness
    impactoPorModulo: 15,
    descricao: 'Habilidades sociais fortalecem sua prática de mindfulness e bem-estar'
  },
  'organizacao': {
    metaIds: [1],
    impactoPorModulo: 20,
    descricao: 'Organização e planejamento são essenciais para atingir suas metas'
  },
  'emocional': {
    metaIds: [2],
    impactoPorModulo: 25,
    descricao: 'Inteligência emocional é a base para bem-estar consistente'
  }
};

// Mapear impacto nas áreas de progresso
export const AREAS_IMPACTADAS = {
  'foco': ['Foco e Concentração'],
  'social': ['Habilidades Sociais'],
  'organizacao': ['Organização'],
  'emocional': ['Inteligência Emocional']
};

/**
 * Calcular progressão geral baseada em trilhas
 */
export const calcularProgressaoGeral = (trilhasUsuario) => {
  if (!trilhasUsuario || trilhasUsuario.length === 0) return 0;
  
  let totalProgresso = 0;
  const pesosConcluidas = 25; // Trilhas concluídas têm peso maior
  
  trilhasUsuario.forEach(trilha => {
    const progresso = calcularProgressoTrilha(trilha);
    const peso = trilha.status === 'concluida' ? pesosConcluidas : progresso;
    totalProgresso += peso;
  });
  
  return Math.round(totalProgresso / trilhasUsuario.length);
};

/**
 * Calcular progresso de uma trilha específica
 */
export const calcularProgressoTrilha = (trilha) => {
  if (!trilha.modulos || trilha.modulos.length === 0) return 0;
  const concluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
  return Math.round((concluidos / trilha.modulos.length) * 100);
};

/**
 * Sincronizar impacto de trilhas nas metas
 */
export const sincronizarTrilhaComMetas = (trilhasUsuario, metasUsuario) => {
  if (!metasUsuario) return metasUsuario;
  
  const metasAtualizadas = [...metasUsuario];
  
  trilhasUsuario.forEach(trilha => {
    const mapeamento = TRILHAS_METAS_MAPPING[trilha.id];
    if (!mapeamento) return;
    
    // Calcular impacto baseado em módulos concluídos
    const modulosConcluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
    const impactoTotal = modulosConcluidos * mapeamento.impactoPorModulo;
    
    // Aplicar impacto às metas relacionadas
    mapeamento.metaIds.forEach(metaId => {
      const metaIndex = metasAtualizadas.findIndex(m => m.id === metaId);
      if (metaIndex !== -1) {
        // Se trilha está concluída, marcar meta como concluída
        if (trilha.status === 'concluida' && !metasAtualizadas[metaIndex].concluida) {
          // Marcar todas as submetas como concluídas
          if (metasAtualizadas[metaIndex].submetas) {
            metasAtualizadas[metaIndex].submetas = metasAtualizadas[metaIndex].submetas.map(sub => ({
              ...sub,
              concluida: true
            }));
          }
          metasAtualizadas[metaIndex].concluida = true;
          metasAtualizadas[metaIndex].impactoTrilhas = (metasAtualizadas[metaIndex].impactoTrilhas || 0) + impactoTotal;
        }
      }
    });
  });
  
  return metasAtualizadas;
};

/**
 * Obter sugestões de próximas ações baseadas em trilhas
 */
export const obterProximasAcoes = (trilhasUsuario) => {
  const acoes = [];
  
  trilhasUsuario.forEach(trilha => {
    if (trilha.status === 'nao-iniciada') {
      acoes.push({
        id: `iniciar-${trilha.id}`,
        tipo: 'iniciar-trilha',
        titulo: `Iniciar: ${trilha.titulo}`,
        descricao: trilha.descricao,
        prioridade: 'alta',
        impacto: '+50 XP'
      });
    } else if (trilha.status === 'em-andamento') {
      const proximoModulo = trilha.modulos.find(m => m.status === 'em-progresso' || m.status === 'bloqueado');
      if (proximoModulo) {
        acoes.push({
          id: `modulo-${trilha.id}-${proximoModulo.id}`,
          tipo: 'completar-modulo',
          titulo: `Continuar: ${trilha.titulo}`,
          descricao: `Próximo módulo: ${proximoModulo.titulo}`,
          prioridade: 'media',
          impacto: '+25 XP'
        });
      }
    }
  });
  
  return acoes.slice(0, 5); // Retornar top 5
};

/**
 * Calcular estatísticas gerais
 */
export const calcularEstatisticas = (trilhasUsuario, metasUsuario) => {
  const stats = {
    trilhasAtivas: trilhasUsuario.filter(t => ['em-andamento', 'nao-iniciada'].includes(t.status)).length,
    trilhasConcluidas: trilhasUsuario.filter(t => t.status === 'concluida').length,
    modulosConcluidos: trilhasUsuario.reduce((acc, t) => acc + (t.modulos ? t.modulos.filter(m => m.status === 'concluido').length : 0), 0),
    modulosTotal: trilhasUsuario.reduce((acc, t) => acc + (t.modulos ? t.modulos.length : 0), 0),
    metasConcluidas: metasUsuario ? metasUsuario.filter(m => m.concluida).length : 0,
    metasTotal: metasUsuario ? metasUsuario.length : 0,
    progressoMedio: Math.round(
      trilhasUsuario.reduce((acc, t) => acc + calcularProgressoTrilha(t), 0) / (trilhasUsuario.length || 1)
    )
  };
  
  return stats;
};

/**
 * Gerar notificações baseadas em progresso
 */
export const gerarNotificacoes = (trilhasUsuario, ultimasNotificacoes = []) => {
  const novasNotificacoes = [];
  const timestamp = new Date().getTime();
  
  trilhasUsuario.forEach(trilha => {
    const progresso = calcularProgressoTrilha(trilha);
    
    // Notificação de 50% de progresso
    if (progresso === 50 && !ultimasNotificacoes.find(n => n.id === `50-${trilha.id}`)) {
      novasNotificacoes.push({
        id: `50-${trilha.id}`,
        tipo: 'milestone',
        titulo: `Meio caminho! 🎉`,
        descricao: `Você atingiu 50% em "${trilha.titulo}"`,
        timestamp,
        trilhaId: trilha.id
      });
    }
    
    // Notificação de conclusão
    if (progresso === 100 && trilha.status !== 'concluida' && !ultimasNotificacoes.find(n => n.id === `100-${trilha.id}`)) {
      novasNotificacoes.push({
        id: `100-${trilha.id}`,
        tipo: 'sucesso',
        titulo: `Trilha Concluída! 🏆`,
        descricao: `Você completou "${trilha.titulo}"`,
        timestamp,
        trilhaId: trilha.id
      });
    }
  });
  
  return [...ultimasNotificacoes, ...novasNotificacoes].slice(-10);
};

/**
 * Salvar dados sincronizados no localStorage
 */
export const salvarDadosSincronizados = (trilhas, metas, progresso) => {
  const dados = {
    trilhas,
    metas,
    progresso,
    ultimaSincronizacao: new Date().getTime()
  };
  localStorage.setItem('teaxis_dados_sincronizados', JSON.stringify(dados));
};

/**
 * Carregar dados sincronizados do localStorage
 */
export const carregarDadosSincronizados = () => {
  const dados = localStorage.getItem('teaxis_dados_sincronizados');
  return dados ? JSON.parse(dados) : null;
};

/**
 * Calcular XP total ganho
 */
export const calcularXPTotal = (trilhasUsuario) => {
  let xpTotal = 0;
  
  trilhasUsuario.forEach(trilha => {
    const progresso = calcularProgressoTrilha(trilha);
    
    // Base XP por progresso
    xpTotal += progresso * 2;
    
    // Bonus por trilha concluída
    if (trilha.status === 'concluida') {
      xpTotal += 500;
    }
    
    // Bonus por dificuldade
    const dificuldadeBonus = {
      'Fácil': 100,
      'Intermediária': 250,
      'Avançada': 500
    };
    xpTotal += dificuldadeBonus[trilha.dificuldade] || 0;
  });
  
  return xpTotal;
};

const MENSAGENS_KEY = 'teaxis_mensagens';
const AGENDAMENTOS_KEY = 'teaxis_agendamentos';

const defaultMensagens = [
  {
    id: 1,
    fromName: 'Dra. Helena Costa',
    toName: 'Usuário TEAxis',
    fromRole: 'profissional',
    toRole: 'usuario',
    subject: 'Confirmar consulta',
    body: 'Olá, gostaria de confirmar nossa sessão de amanhã às 10h. Se precisar reagendar, me avise!',
    date: '2025-07-08',
    lida: false
  },
  {
    id: 2,
    fromName: 'Dr. Lucas Ribeiro',
    toName: 'Usuário TEAxis',
    fromRole: 'profissional',
    toRole: 'usuario',
    subject: 'Feedback da sessão',
    body: 'Olá, espero que a sessão de hoje tenha sido produtiva. Fico à disposição para qualquer dúvida.',
    date: '2025-07-05',
    lida: true
  },
  {
    id: 101,
    fromName: 'Usuário TEAxis',
    toName: 'Dra. Mariana Santos',
    fromRole: 'usuario',
    toRole: 'profissional',
    subject: 'Dúvida sobre trilha',
    body: 'Olá Dra. Mariana, tenho uma dúvida sobre o módulo 3 da trilha de organização.',
    date: '2025-07-07',
    lida: true
  }
];

const defaultAgendamentos = [
  {
    id: 1,
    profissional: 'Dra. Helena Costa',
    idProfissional: 1,
    cliente: 'Usuário TEAxis',
    fromRole: 'usuario',
    toRole: 'profissional',
    data: '15/07/2025',
    hora: '10:00',
    status: 'Confirmado'
  },
  {
    id: 2,
    profissional: 'Dr. Lucas Ribeiro',
    idProfissional: 2,
    cliente: 'Usuário TEAxis',
    fromRole: 'usuario',
    toRole: 'profissional',
    data: '20/07/2025',
    hora: '14:30',
    status: 'Confirmado'
  }
];

export const carregarMensagens = () => {
  if (typeof window === 'undefined') return defaultMensagens;
  const raw = localStorage.getItem(MENSAGENS_KEY);
  return raw ? JSON.parse(raw) : defaultMensagens;
};

export const salvarMensagens = (mensagens) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENSAGENS_KEY, JSON.stringify(mensagens));
};

export const carregarAgendamentos = () => {
  if (typeof window === 'undefined') return defaultAgendamentos;
  const raw = localStorage.getItem(AGENDAMENTOS_KEY);
  return raw ? JSON.parse(raw) : defaultAgendamentos;
};

export const salvarAgendamentos = (agendamentos) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(agendamentos));
};
