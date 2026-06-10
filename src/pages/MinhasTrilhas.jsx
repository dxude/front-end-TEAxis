import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBookOpen, FaPlus, FaCheck, FaArrowLeft, FaLightbulb, FaRocket, 
  FaBullseye, FaChartLine, FaFire, FaTrophy, FaSearch, FaUserCircle, 
  FaChevronDown, FaChevronUp, FaTrash, FaStar, FaClock, FaLock, FaBell, 
  FaPlayCircle, FaTimes, FaCheckCircle, FaFilePdf, FaDownload, FaArrowRight, FaFilter, FaExternalLinkAlt
} from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useProgresso } from '../contexts/ProgressoContext';
import { obterProximasAcoes, gerarNotificacoes } from '../utils/dataSync';
import '../Styles/MinhasTrilhas.css';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

// BASE DE CONHECIMENTO REAL - 3 PERGUNTAS POR TRILHA (COM CATEGORIAS)
const TRILHAS_PRESETS = [
  {
    id: 'foco', titulo: 'Foco e Concentração', categoria: 'Produtividade',
    descricao: 'Técnicas comprovadas para minimizar distrações e maximizar sua produtividade',
    descricaoCompleta: 'Desenvolva habilidades de concentração profunda, aprenda técnicas de gestão de tempo e elimine distrações digitais.',
    dificuldade: 'Intermediária', duracao: '4 semanas', impacto: 'Melhora no foco pessoal e profissional',
    cor: '#20C997', icone: '🎯',
    modulos: [
      { 
        id: 1, titulo: 'Compreendendo a Concentração', descricao: 'Bases neurocientíficas do Foco', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "O Transtorno de Déficit de Atenção (TDAH) e as variações do espectro podem tornar o foco sustentado um desafio. Entender o funcionamento das vias dopaminérgicas (o sistema de recompensa do cérebro) ajuda a criar estratégias eficientes para a manutenção do interesse.",
          pdfs: [{ titulo: "Guia de Técnicas de Deep Work Adaptadas", tamanho: "1.8 MB" }],
          pratica: "Método Pomodoro Inverso: Trabalhe 15 min, descanse 5 min. Repita 3 vezes e avalie se o seu foco sustentado melhorou sem causar sobrecarga cognitiva.",
          quiz: [
            {
              pergunta: "Por que o sistema de recompensa é crucial na adaptação do foco para mentes neurodivergentes?",
              opcoes: [
                "Porque a punição por falta de atenção provou ser o método mais eficaz.",
                "Porque cria picos de dopamina que auxiliam na manutenção do interesse e execução da tarefa.",
                "Porque elimina 100% das distrações externas do ambiente físico."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "O que caracteriza o 'Deep Work' (Trabalho Profundo)?",
              opcoes: [
                "Fazer o máximo de tarefas simultâneas (multitarefa) durante o dia.",
                "Trabalhar mais de 12 horas seguidas sem pausas para refeição.",
                "Um estado de concentração livre de distrações que leva as capacidades cognitivas ao seu limite."
              ],
              respostaCorreta: 2
            },
            {
              pergunta: "Qual é a principal função da técnica Pomodoro no gerenciamento de energia?",
              opcoes: [
                "Alternar períodos de foco intenso com pausas curtas para evitar a exaustão mental.",
                "Aumentar o estresse para que as tarefas sejam feitas mais rapidamente sob pressão.",
                "Desligar a internet permanentemente enquanto se trabalha."
              ],
              respostaCorreta: 0
            }
          ]
        }
      },
      { id: 2, titulo: 'Técnicas de Deep Work', descricao: 'Método Pomodoro e variações', duracao: '3h', status: 'bloqueado' },
      { id: 3, titulo: 'Gestão de Distrações Digitais', descricao: 'Bloqueadores e hábitos', duracao: '2.5h', status: 'bloqueado' },
      { id: 4, titulo: 'Criando seu Ambiente Ideal', descricao: 'Espaço físico e mental', duracao: '1.5h', status: 'bloqueado' },
    ]
  },
  {
    id: 'social', titulo: 'Habilidades Sociais', categoria: 'Social',
    descricao: 'Amplie sua capacidade de se relacionar e comunicar com assertividade',
    descricaoCompleta: 'Aprenda técnicas de comunicação não-violenta, inteligência emocional e como se relacionar melhor em diferentes contextos sociais.',
    dificuldade: 'Intermediária', duracao: '5 semanas', impacto: 'Relacionamentos mais saudáveis',
    cor: '#7B3FF2', icone: '🤝',
    modulos: [
      { 
        id: 1, titulo: 'Fundamentos da Comunicação', descricao: 'Teoria e prática da CNV', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "A Comunicação Não-Violenta (CNV), desenvolvida por Marshall Rosenberg, baseia-se na empatia e na expressão clara de sentimentos e necessidades. O objetivo é estabelecer relações de parceria e cooperação, evitando a linguagem que culpa ou julga o outro.",
          pdfs: [{ titulo: "Guia Prático de Comunicação Não-Violenta", tamanho: "3.2 MB" }, { titulo: "Cartilha: Assertividade nas Relações", tamanho: "1.5 MB" }],
          pratica: "Exercício Prático: Da próxima vez que se sentir irritado, formule uma frase usando a CNV: 'Quando observo [fato], sinto [emoção] porque preciso de [necessidade]. O que acha de [pedido]?'",
          quiz: [
            {
              pergunta: "Qual atitude devemos EVITAR ao utilizar a Comunicação Não-Violenta no nosso dia a dia?",
              opcoes: [
                "Expressar nossos sentimentos de vulnerabilidade com clareza.",
                "Fazer pedidos positivos, claros e específicos ao invés de exigências abstratas.",
                "Utilizar termos que remetam a julgamentos morais, como 'bom', 'mau', 'certo' ou 'errado'."
              ],
              respostaCorreta: 2
            },
            {
              pergunta: "Na CNV, o que significa expressar uma 'necessidade'?",
              opcoes: [
                "Comunicar valores universais e essenciais que não estão sendo atendidos, como respeito, segurança ou clareza.",
                "Exigir que a outra pessoa mude imediatamente a atitude dela.",
                "Listar os defeitos da outra pessoa para que ela entenda o motivo da sua raiva."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "A 'escuta ativa' empática exige qual comportamento do ouvinte?",
              opcoes: [
                "Ouvir para compreender a experiência do outro, sem tentar 'consertar' o problema imediatamente.",
                "Pensar no que vai responder enquanto a outra pessoa ainda está falando.",
                "Interromper o familiar para contar uma história parecida que aconteceu com você."
              ],
              respostaCorreta: 0
            }
          ]
        }
      },
      { id: 2, titulo: 'Escuta Ativa e Empatia', descricao: 'Sendo presente', duracao: '2h', status: 'bloqueado' },
      { id: 3, titulo: 'Assertividade e Limites', descricao: 'Dizendo não com respeito', duracao: '2.5h', status: 'bloqueado' },
      { id: 4, titulo: 'Resolvendo Conflitos', descricao: 'Comunicação não-violenta', duracao: '2.5h', status: 'bloqueado' },
    ]
  },
  {
    id: 'organizacao', titulo: 'Organização e Planejamento', categoria: 'Produtividade',
    descricao: 'Estruture sua vida com sistemas de organização que realmente funcionam',
    descricaoCompleta: 'Domine técnicas de planejamento pessoal, gestão de tempo e sistemas de organização.',
    dificuldade: 'Fácil', duracao: '3 semanas', impacto: 'Rotina estruturada e produtiva',
    cor: '#074f9b', icone: '📋',
    modulos: [
      { 
        id: 1, titulo: 'Diagnóstico Pessoal', descricao: 'Mapeando seu tempo', duracao: '1.5h', status: 'em-progresso',
        conteudo: {
          texto: "A disfunção executiva pode fazer com que tarefas simples pareçam montanhas intransponíveis. O primeiro passo para se organizar não é baixar um aplicativo complexo, mas sim mapear onde sua energia e seu tempo realmente estão sendo gastos atualmente.",
          pdfs: [{ titulo: "Planilha de Rastreio de Tempo Adaptada", tamanho: "1.2 MB" }],
          pratica: "Time Blocking Simples: Durante os próximos 2 dias, anote o que você fez em blocos de 2 horas. Não tente mudar a rotina, apenas observe os padrões.",
          quiz: [
            {
              pergunta: "Qual é o principal objetivo do diagnóstico pessoal antes de adotar um novo sistema de organização?",
              opcoes: [
                "Identificar picos de energia e ralos de tempo para criar um sistema realista, em vez de copiar a rotina de outras pessoas.",
                "Sentir culpa pelas horas desperdiçadas nas redes sociais.",
                "Preencher 100% do seu dia com atividades produtivas para não sobrar tempo ocioso."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "O que é a 'Disfunção Executiva' no contexto de organização diária?",
              opcoes: [
                "Uma dificuldade neurológica em planejar, iniciar e sequenciar tarefas, comum no TDAH e Autismo.",
                "Uma desculpa usada por pessoas que têm preguiça de trabalhar.",
                "O ato de ser demitido do cargo de executivo de uma empresa."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "No planejamento de 3 níveis, o que deve ser priorizado na sua visão diária?",
              opcoes: [
                "Responder a todos os e-mails e mensagens que chegarem, independentemente do assunto.",
                "As 3 tarefas mais importantes (MITs) que trarão o maior impacto e alívio se concluídas naquele dia.",
                "Fazer apenas as tarefas que exigem esforço físico."
              ],
              respostaCorreta: 1
            }
          ]
        }
      },
      { id: 2, titulo: 'Sistemas de Organização', descricao: 'Escolhendo o seu', duracao: '2h', status: 'bloqueado' },
      { id: 3, titulo: 'Planejamento em 3 Níveis', descricao: 'Dia, semana, mês', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'sensorial', titulo: 'Regulação Sensorial no Dia a Dia', categoria: 'Saúde',
    descricao: 'Estratégias práticas para lidar com sobrecarga e criar ambientes confortáveis.',
    descricaoCompleta: 'Aprenda a mapear seu perfil sensorial, identificar gatilhos e aplicar técnicas de acomodação para viver com mais conforto e menos crises.',
    dificuldade: 'Iniciante', duracao: '3 semanas', impacto: 'Prevenção de crises e bem-estar',
    cor: '#F59E0B', icone: '🎧',
    modulos: [
      { 
        id: 1, titulo: 'Mapeamento Sensorial', descricao: 'Entendendo seu perfil', duracao: '1.5h', status: 'em-progresso',
        conteudo: {
          texto: "A integração sensorial é a forma como o cérebro recebe, organiza e responde às informações recebidas pelos sentidos (visão, audição, tato, paladar, olfato, vestibular e proprioceptivo). Muitas pessoas no espectro autista (TEA) possuem hiper ou hiporreatividade a esses estímulos.",
          pdfs: [{ titulo: "Cartilha de Inclusão e Regulação Sensorial (TEA)", tamanho: "4.1 MB" }],
          pratica: "Exercício de Escaneamento: Sente-se confortavelmente e feche os olhos por 1 minuto. Tente identificar 3 sons diferentes e 2 texturas que seu corpo está tocando. Como você reage a elas?",
          quiz: [
            {
              pergunta: "Qual é o primeiro passo fundamental para lidar com crises de sobrecarga sensorial, segundo as diretrizes de saúde?",
              opcoes: [
                "Forçar a exposição contínua ao ambiente causador para criar resistência natural.",
                "Identificar o tipo de crise e mapear as circunstâncias estimuladoras para buscar acomodação.",
                "Ignorar os estímulos físicos e focar exclusivamente em uma tarefa mental complexa."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "O que é, na prática, uma 'Acomodação Sensorial'?",
              opcoes: [
                "Modificações no ambiente ou uso de ferramentas (como fones canceladores de ruído) para reduzir o impacto de estímulos aversivos.",
                "Um tipo de hotel voltado exclusivamente para tratamentos psiquiátricos intensivos.",
                "Omitir o diagnóstico do paciente para que ele viva como se os sentidos não o afetassem."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "O que caracteriza a 'hiporreatividade' sensorial em algumas pessoas neurodivergentes?",
              opcoes: [
                "Sentir dor imediata ao ouvir o som de um liquidificador.",
                "Evitar qualquer tipo de abraço ou toque físico.",
                "A necessidade de buscar mais estímulos (como balançar o corpo ou morder objetos) para que o cérebro consiga registrar a informação física."
              ],
              respostaCorreta: 2
            }
          ]
        }
      },
      { id: 2, titulo: 'Identificando Gatilhos', descricao: 'O que causa sobrecarga', duracao: '2h', status: 'bloqueado' },
      { id: 3, titulo: 'Ferramentas de Regulação', descricao: 'Técnicas práticas', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'ansiedade', titulo: 'Gerenciamento de Ansiedade', categoria: 'Saúde',
    descricao: 'Ferramentas de regulação para lidar com pensamentos acelerados.',
    descricaoCompleta: 'Entenda os mecanismos da ansiedade e pratique técnicas de grounding, respiração e reestruturação cognitiva validadas por especialistas.',
    dificuldade: 'Intermediária', duracao: '4 semanas', impacto: 'Calma mental e controle',
    cor: '#EC4899', icone: '🧘‍♀️',
    modulos: [
      { 
        id: 1, titulo: 'O Ciclo da Ansiedade', descricao: 'Reconhecendo sinais físicos', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "A ansiedade é uma emoção natural de alerta (luta ou fuga), mas quando se torna crônica, afeta gravemente a saúde. Segundo a OMS (2023), o Brasil é o país com a maior proporção de pessoas ansiosas no mundo (9,3% da população).",
          pdfs: [{ titulo: "Cartilha de Saúde Mental: O Ciclo da Ansiedade", tamanho: "2.7 MB" }, { titulo: "Guia de Técnicas de Aterramento", tamanho: "800 KB" }],
          pratica: "Técnica de Grounding (5-4-3-2-1): Encontre 5 coisas que você pode ver, 4 que pode tocar, 3 que pode ouvir, 2 que pode cheirar e 1 que pode provar. Isso traz o cérebro de volta para o momento presente.",
          quiz: [
            {
              pergunta: "Em que momento a ansiedade deixa de ser considerada um alerta natural e passa a ser classificada como um Transtorno de Ansiedade Generalizada (TAG)?",
              opcoes: [
                "Quando ocorre esporadicamente antes de entrevistas de emprego ou provas importantes.",
                "Quando a pessoa sente o coração acelerar exclusivamente ao realizar exercícios físicos intensos.",
                "Quando causa sofrimento significativo, fadiga mental e prejudica o desempenho das atividades diárias, geralmente por mais de 6 meses."
              ],
              respostaCorreta: 2
            },
            {
              pergunta: "Qual é o propósito principal da técnica de aterramento (Grounding), como a regra do 5-4-3-2-1?",
              opcoes: [
                "Redirecionar a atenção da mente acelerada (futuro/passado) para as sensações físicas do momento presente.",
                "Ajudar a pessoa a dormir e entrar em sono profundo imediatamente.",
                "Resolver permanentemente os problemas financeiros que causam a ansiedade."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "Como a prática da respiração diafragmática (respiração abdominal) afeta o nosso sistema nervoso?",
              opcoes: [
                "Ela eleva a pressão arterial para nos preparar para lutar.",
                "Ela estimula o nervo vago, ativando o sistema parassimpático e sinalizando ao corpo que ele está seguro.",
                "Ela não afeta o cérebro, servindo apenas para expandir o pulmão."
              ],
              respostaCorreta: 1
            }
          ]
        }
      },
      { id: 2, titulo: 'Técnicas de Respiração', descricao: 'Acalmando o sistema nervoso', duracao: '1.5h', status: 'bloqueado' },
      { id: 3, titulo: 'Exercícios de Grounding', descricao: 'Trazendo a mente para o presente', duracao: '2.5h', status: 'bloqueado' },
      { id: 4, titulo: 'Rotina Anti-estresse', descricao: 'Hábitos de manutenção', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'autonomia', titulo: 'Autonomia e Vida Independente', categoria: 'Autonomia',
    descricao: 'Passo a passo para gerenciar moradia, autocuidado e rotina com segurança.',
    descricaoCompleta: 'Um guia prático voltado para o desenvolvimento da independência no dia a dia, abordando desde tarefas domésticas até cuidados pessoais básicos.',
    dificuldade: 'Avançada', duracao: '5 semanas', impacto: 'Maior independência diária',
    cor: '#3B82F6', icone: '🏠',
    modulos: [
      { 
        id: 1, titulo: 'Autocuidado Essencial', descricao: 'Higiene, sono e alimentação', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "O autocuidado básico (Atividades de Vida Diária - AVDs) forma o alicerce para uma vida autônoma. Para pessoas neurodivergentes, adaptar a higiene e a alimentação às suas necessidades sensoriais (ex: escovas de dentes macias, alimentos com texturas seguras) reduz a demanda cognitiva do dia a dia.",
          pdfs: [{ titulo: "Checklist Visual de Rotinas Diárias", tamanho: "1.1 MB" }],
          pratica: "Construção Visual: Crie um checklist visual de 4 passos para a sua rotina da manhã e cole no espelho do banheiro para reduzir o esforço da memória de trabalho.",
          quiz: [
            {
              pergunta: "Qual é o principal benefício prático de usar checklists visuais para o autocuidado essencial no dia a dia?",
              opcoes: [
                "Eles substituem a necessidade de acompanhamento médico ou terapêutico.",
                "Eles reduzem a carga cognitiva e a demanda sobre a função executiva, tornando a rotina previsível e menos exaustiva.",
                "Eles garantem que as tarefas sejam feitas 50% mais rápido, sobrando tempo livre."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "Na gestão financeira e vida independente, qual deve ser o primeiro hábito desenvolvido por um jovem adulto?",
              opcoes: [
                "Investir todo o salário em ações na bolsa de valores.",
                "Registrar todas as entradas e saídas de dinheiro (fluxo de caixa) para ter clareza visual de onde a renda está sendo gasta.",
                "Pedir cartões de crédito ilimitados em vários bancos."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "Como criar e manter 'rotinas previsíveis' ajudam na autonomia de pessoas neurodivergentes?",
              opcoes: [
                "Diminuem a ansiedade antecipatória e reduzem drasticamente a fadiga de decisão enfrentada no dia a dia.",
                "Elas tornam a vida monótona, forçando a pessoa a se rebelar e procurar ajuda de parentes.",
                "Aumentam a velocidade de pensamento e o QI da pessoa ao longo das semanas."
              ],
              respostaCorreta: 0
            }
          ]
        }
      },
      { id: 2, titulo: 'Gestão da Casa', descricao: 'Limpeza e manutenção básica', duracao: '3h', status: 'bloqueado' },
      { id: 3, titulo: 'Noções Financeiras', descricao: 'Lidando com contas e gastos', duracao: '2.5h', status: 'bloqueado' },
      { id: 4, titulo: 'Navegando a Cidade', descricao: 'Transporte e segurança externa', duracao: '2h', status: 'bloqueado' },
    ]
  },
  {
    id: 'carreira', titulo: 'Carreira e Empregabilidade', categoria: 'Autonomia',
    descricao: 'Como montar currículo, fazer entrevistas e entender a dinâmica do trabalho.',
    descricaoCompleta: 'Preparação para o mercado de trabalho, valorizando seus pontos fortes e ensinando a navegar pelas dinâmicas do ambiente corporativo.',
    dificuldade: 'Avançada', duracao: '4 semanas', impacto: 'Sucesso e adaptação profissional',
    cor: '#10B981', icone: '💼',
    modulos: [
      { 
        id: 1, titulo: 'Descobrindo Pontos Fortes', descricao: 'Mapeando habilidades reais', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "A neurodiversidade traz habilidades únicas para o mercado de trabalho. Traços como hiperfoco, reconhecimento de padrões, pensamento lateral e atenção profunda aos detalhes são altamente valorizados por empresas inovadoras. Além disso, a legislação apoia adaptações no ambiente de trabalho.",
          pdfs: [{ titulo: "Guia de Acomodações Razoáveis (LBI - Lei Brasileira de Inclusão)", tamanho: "2.4 MB" }],
          pratica: "Mapeamento de Soft Skills: Liste 3 interesses intensos (hiperfocos) que você possui e escreva ao lado como eles podem se traduzir em habilidades profissionais (ex: organização, pesquisa, persistência).",
          quiz: [
            {
              pergunta: "O que a legislação trabalhista brasileira entende por 'Acomodação Razoável' no ambiente de trabalho?",
              opcoes: [
                "Uma modificação no ambiente ou nos processos de trabalho que garante à pessoa com deficiência ou neurodivergente as mesmas oportunidades que os demais.",
                "O pagamento de um bônus em dinheiro para compensar o desgaste físico do trabalhador na equipe.",
                "A isenção total do trabalhador de cumprir qualquer meta estabelecida pelo chefe."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "Ao construir um 'Currículo Funcional', qual deve ser o seu foco principal?",
              opcoes: [
                "Listar todas as escolas primárias em que você já estudou desde criança.",
                "Destacar suas habilidades, projetos e competências práticas (Hard e Soft Skills) em vez de focar apenas na ordem cronológica dos empregos.",
                "Colocar uma foto grande ocupando metade do documento."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "Qual a melhor abordagem para comunicar a necessidade de uma acomodação a um gestor do RH?",
              opcoes: [
                "Exigir a acomodação na frente de outros funcionários usando um tom agressivo e processual.",
                "Focar na solução, explicando de forma clara como o pequeno ajuste ajudará você a entregar um resultado muito melhor e mais produtivo para a própria empresa.",
                "Nunca contar nada ao gestor e tentar improvisar as acomodações em segredo."
              ],
              respostaCorreta: 1
            }
          ]
        }
      },
      { id: 2, titulo: 'O Currículo Funcional', descricao: 'Como apresentar sua jornada', duracao: '2h', status: 'bloqueado' },
      { id: 3, titulo: 'Dinâmica de Entrevistas', descricao: 'O que esperam de você', duracao: '3h', status: 'bloqueado' },
      { id: 4, titulo: 'Acomodações no Trabalho', descricao: 'Comunicando suas necessidades', duracao: '1.5h', status: 'bloqueado' },
    ]
  },
  {
    id: 'familia', titulo: 'Comunicação Familiar', categoria: 'Social',
    descricao: 'Construindo pontes de entendimento, limites saudáveis e empatia dentro de casa.',
    descricaoCompleta: 'Trilha desenhada para ajudar na comunicação de necessidades, estabelecimento de limites e no fortalecimento de laços familiares duradouros.',
    dificuldade: 'Intermediária', duracao: '3 semanas', impacto: 'Harmonia e compreensão no lar',
    cor: '#EF4444', icone: '❤️',
    modulos: [
      { 
        id: 1, titulo: 'O Poder da Escuta', descricao: 'Ouvindo sem julgamentos', duracao: '2h', status: 'em-progresso',
        conteudo: {
          texto: "Na dinâmica familiar, frequentemente ouvimos para responder, e não para compreender. A escuta ativa exige silenciar o impulso de 'consertar' o problema do familiar e, em vez disso, focar em validar o que ele está sentindo no momento.",
          pdfs: [{ titulo: "Dinâmicas Práticas de Escuta Ativa em Família", tamanho: "900 KB" }],
          pratica: "Desafio do Silêncio Ativo: Na próxima conversa sobre um problema com um familiar, pratique apenas ouvir e dizer: 'Eu entendo como isso pode ser difícil', sem oferecer nenhum conselho prático, a menos que ele peça.",
          quiz: [
            {
              pergunta: "Qual é o principal objetivo da Escuta Ativa nas relações entre os familiares na mesma casa?",
              opcoes: [
                "Vencer uma discussão através do acúmulo de argumentos lógicos enquanto a outra pessoa fala.",
                "Compreender verdadeiramente os sentimentos e a perspectiva do familiar, fazendo com que ele se sinta emocionalmente validado.",
                "Encontrar a solução técnica mais rápida para o problema e interromper a fala do familiar para explicá-la."
              ],
              respostaCorreta: 1
            },
            {
              pergunta: "O que significa estabelecer um 'limite saudável' no convívio familiar?",
              opcoes: [
                "Comunicar de forma clara e respeitosa quais comportamentos são inaceitáveis para proteger seu próprio bem-estar físico e emocional.",
                "Trancar a porta do quarto e nunca mais conversar com os pais ou irmãos.",
                "Dizer 'sim' para todas as exigências da família para evitar qualquer tipo de briga."
              ],
              respostaCorreta: 0
            },
            {
              pergunta: "Qual é a abordagem mais construtiva para expressar frustração com a atitude de um parente?",
              opcoes: [
                "Usar frases focadas no 'Eu' (Ex: 'Eu me sinto estressado quando a TV fica muito alta'), evitando acusações que comecem com 'Você sempre...' ou 'Você nunca...'.",
                "Ficar em silêncio por dias (tratamento de gelo) até que ele perceba sozinho o erro cometido.",
                "Gritar as frustrações na frente de toda a família durante o almoço de domingo para ter testemunhas."
              ],
              respostaCorreta: 0
            }
          ]
        }
      },
      { id: 2, titulo: 'Estabelecendo Limites', descricao: 'O que é meu e o que é seu', duracao: '2.5h', status: 'bloqueado' },
      { id: 3, titulo: 'Expressão de Necessidades', descricao: 'Pedindo ajuda de forma clara', duracao: '2h', status: 'bloqueado' },
    ]
  }
];

// O Dicionário de URLs agora fica do lado de fora para podermos acessá-lo facilmente
const linksExternosPDF = {
  "Guia de Técnicas de Deep Work Adaptadas": "https://bvsms.saude.gov.br/bvs/boletim_tematico/transtorno_deficit_atencao_v4_n4.pdf",
  "Guia Prático de Comunicação Não-Violenta": "https://ifsp.edu.br/images/reitoria/Nucleos/Nrpc/Guia_Prtico3_Implementando_a_Comunicao_No_Violenta_CNV_em_uma_Equipe.pdf",
  "Cartilha: Assertividade nas Relações": "https://ifsp.edu.br/images/reitoria/Nucleos/Nrpc/Guia_Prtico3_Implementando_a_Comunicao_No_Violenta_CNV_em_uma_Equipe.pdf", 
  "Planilha de Rastreio de Tempo Adaptada": "https://proaes.ufra.edu.br/images/Documentos/Documentos/Cartilha_-Planejamento_de_Estudos_e_Manejo_do_Tempo-Equipe_de_psicologia_Assistncia-estudantil-UFRA.pdf",
  "Cartilha de Inclusão e Regulação Sensorial (TEA)": "https://www.gov.br/hubrasil/pt-br/hospitais-universitarios/regiao-nordeste/hc-ufpe/governanca/divgp/documentos/CartilhaTEA_compressed.pdf",
  "Cartilha de Saúde Mental: O Ciclo da Ansiedade": "https://sites.usp.br/lepsis/wp-content/uploads/sites/107/2020/07/Sa%C3%BAde-Mental-na-Quarentena-Uma-cartilha-com-estrat%C3%A9gias-para-vestibulandos.pdf",
  "Guia de Técnicas de Aterramento": "https://sites.usp.br/lepsis/wp-content/uploads/sites/107/2020/07/Sa%C3%BAde-Mental-na-Quarentena-Uma-cartilha-com-estrat%C3%A9gias-para-vestibulandos.pdf",
  "Checklist Visual de Rotinas Diárias": "https://escola.defensoria.df.gov.br/wp-content/uploads/2025/06/CARTILHA-Autismo-Direitos-e-Defensoria-Publica.pdf",
  "Guia de Acomodações Razoáveis (LBI - Lei Brasileira de Inclusão)": "https://www.pge.pa.gov.br/sites/default/files/manuais/cartilha_autismo.pdf",
  "Dinâmicas Práticas de Escuta Ativa em Família": "https://acervodigital.ufpr.br/xmlui/bitstream/handle/1884/98122/Cartilha%20LABNEURO-UFPR%20para%20fam%C3%ADlias%20com%20adolescentes.pdf"
};

export default function MinhasTrilhas() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCriarTrilha, setShowCriarTrilha] = useState(false);
  const [expandedTrilha, setExpandedTrilha] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas'); 
  const [animacaoNovasTrilhas, setAnimacaoNovasTrilhas] = useState({});
  const [notificacoes, setNotificacoes] = useState([]);
  const [proximasAcoes, setProximasAcoes] = useState([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  
  const [moduloAtivo, setModuloAtivo] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [opcaoQuiz, setOpcaoQuiz] = useState(null);
  const [quizStatus, setQuizStatus] = useState('respondendo'); 
  const [quizErro, setQuizErro] = useState(false);

  const [showSucessoModal, setShowSucessoModal] = useState(false);

  const { dados, atualizarTrilhas } = useProgresso();
  const trilhasUsuario = dados?.trilhas || [];
  const xpTotal = dados?.xpTotal || 0;

  const setTrilhasUsuario = (novasTrilhas) => {
    atualizarTrilhas(novasTrilhas);
  };

  useEffect(() => {
    const acoes = obterProximasAcoes(trilhasUsuario);
    setProximasAcoes(acoes);
    const notificacoesAnteriores = JSON.parse(localStorage.getItem('trilhas_notificacoes') || '[]');
    const novasNotificacoes = gerarNotificacoes(trilhasUsuario, notificacoesAnteriores);
    setNotificacoes(novasNotificacoes);
    localStorage.setItem('trilhas_notificacoes', JSON.stringify(novasNotificacoes));
  }, [trilhasUsuario]);

  const adicionarTrilha = (trilhaId) => {
    const trilhaPreset = TRILHAS_PRESETS.find(t => t.id === trilhaId);
    if (trilhaPreset && !trilhasUsuario.find(t => t.id === trilhaId)) {
      setAnimacaoNovasTrilhas({ [trilhaId]: true });
      setTrilhasUsuario([...trilhasUsuario, { ...trilhaPreset, status: 'nao-iniciada', progresso: 0 }]);
      setTimeout(() => setAnimacaoNovasTrilhas({ [trilhaId]: false }), 500);
    }
  };

  const obterStatusReal = (trilha, index, modulo) => {
    if (modulo.status === 'concluido') return 'concluido';
    if (index === 0) return 'em-progresso';
    if (trilha.modulos[index - 1].status === 'concluido') return 'em-progresso';
    return 'bloqueado';
  };

  const calcularProgresso = (trilha) => {
    if (!trilha.modulos || trilha.modulos.length === 0) return 0;
    const concluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
    return Math.round((concluidos / trilha.modulos.length) * 100);
  };

  const atualizarModulo = (trilhaId, moduloId, novoStatus) => {
    setTrilhasUsuario(trilhasUsuario.map(trilha => {
      if (trilha.id === trilhaId) {
        const modulosAtualizados = trilha.modulos.map(m => 
          m.id === moduloId ? { ...m, status: novoStatus } : m
        );
        const progresso = Math.round((modulosAtualizados.filter(m => m.status === 'concluido').length / modulosAtualizados.length) * 100);
        return { 
          ...trilha, 
          modulos: modulosAtualizados,
          progresso,
          status: trilha.status === 'concluida' ? 'concluida' : 'em-andamento' 
        };
      }
      return trilha;
    }));
  };

  const finalizarTrilha = (trilhaId) => {
    setTrilhasUsuario(trilhasUsuario.map(trilha => {
      if (trilha.id === trilhaId) {
        return { ...trilha, status: 'concluida' };
      }
      return trilha;
    }));
    setShowSucessoModal(true);
  };

  const removerTrilha = (trilhaId) => {
    setTrilhasUsuario(trilhasUsuario.filter(t => t.id !== trilhaId));
  };

  const iniciarTrilha = (trilhaId) => {
    setTrilhasUsuario(trilhasUsuario.map(trilha => {
      if (trilha.id === trilhaId && trilha.status === 'nao-iniciada') {
        return { ...trilha, status: 'em-andamento', progresso: 0 };
      }
      return trilha;
    }));
  };

  const abrirConteudoModulo = (trilha, modulo, statusReal) => {
    if (statusReal === 'bloqueado') {
      alert("🔒 Este módulo está bloqueado. Conclua o módulo anterior para ter acesso!");
      return;
    }
    const presetBase = TRILHAS_PRESETS.find(t => t.id === trilha.id)?.modulos.find(m => m.id === modulo.id);
    
    setPerguntaAtual(0);
    setOpcaoQuiz(null);
    setQuizStatus('respondendo');
    setQuizErro(false);
    
    setModuloAtivo({ 
      trilhaId: trilha.id, 
      cor: trilha.cor, 
      statusReal, 
      ...modulo,
      conteudoRico: presetBase?.conteudo || null
    });
  };

  const verificarRespostaQuiz = () => {
    const questoes = moduloAtivo.conteudoRico.quiz;
    if (opcaoQuiz === questoes[perguntaAtual].respostaCorreta) {
      setQuizErro(false);
      if (perguntaAtual === questoes.length - 1) {
        setQuizStatus('finalizado');
      } else {
        setQuizStatus('resolvido-pergunta');
      }
    } else {
      setQuizErro(true);
    }
  };

  const proximaPergunta = () => {
    setPerguntaAtual(prev => prev + 1);
    setOpcaoQuiz(null);
    setQuizStatus('respondendo');
    setQuizErro(false);
  };

  // FUNÇÃO 1: Apenas abre o PDF em uma nova aba
  const handleAbrirPDF = (pdfNome) => {
    const url = linksExternosPDF[pdfNome];
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("O documento solicitado não está disponível no momento.");
    }
  };

  // FUNÇÃO 2: Tenta forçar o download direto para a máquina do usuário
  const handleBaixarPDF = async (pdfNome) => {
    const url = linksExternosPDF[pdfNome];
    if (!url) {
      alert("O documento solicitado não está disponível no momento.");
      return;
    }
    
    try {
      // Tenta puxar o arquivo via Fetch para forçar o download em vez de abrir
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${pdfNome}.pdf`; // Define o nome do arquivo a ser salvo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: Se o servidor do governo bloquear o fetch (CORS), ele baixa via nova aba
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${pdfNome}.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const trilhasFiltradas = trilhasUsuario.filter(t => {
    let passStatus = true;
    if (filtroStatus === 'ativas') passStatus = ['em-andamento', 'nao-iniciada'].includes(t.status);
    if (filtroStatus === 'concluidas') passStatus = t.status === 'concluida';

    const presetRef = TRILHAS_PRESETS.find(p => p.id === t.id);
    const categoriaReal = t.categoria || (presetRef ? presetRef.categoria : 'Sem Categoria');

    let passCategoria = true;
    if (filtroCategoria !== 'todas') passCategoria = categoriaReal === filtroCategoria;

    return passStatus && passCategoria;
  });

  const trilhasDisponíveis = TRILHAS_PRESETS.filter(p => {
    const naoAdicionada = !trilhasUsuario.find(u => u.id === p.id);
    const passCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria;
    return naoAdicionada && passCategoria;
  });

  const handleLogout = () => setShowLogoutModal(true);
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

  return (
    <div className="trilhas-container-v2">
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />

      {showSucessoModal && (
        <div className="modal-aula-overlay" onClick={() => setShowSucessoModal(false)}>
          <div className="modal-sucesso fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sucesso-header">
              <FaTrophy style={{ fontSize: '2rem', color: '#FFD700' }} />
              <img src={logoTeaxis} alt="Logo" style={{ height: '30px', marginLeft: 'auto' }} />
            </div>
            <div className="modal-sucesso-body">
              <h1>Parabéns!</h1>
              <p>Você finalizou a trilha com sucesso!</p>
              <p>Essa conquista incrível já foi adicionada ao seu <strong>Progresso Geral</strong>.</p>
              <button className="modal-sucesso-button" onClick={() => setShowSucessoModal(false)}>
                Comemorar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="bg-shapes-v2">
        <div className="shape-v2 shape-1"></div>
        <div className="shape-v2 shape-2"></div>
        <div className="shape-v2 shape-3"></div>
      </div>

      <main className="trilhas-main-v2">
        <section className="hero-trilhas-v2 fade-in-up">
          <div className="hero-content-v2">
            <h1>🎓 Minhas Trilhas de Aprendizado</h1>
            <p>Caminhos estruturados de desenvolvimento com atividades práticas e testes de fixação.</p>
          </div>
        </section>

        <section className="filtros-acoes-v2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
            
            <div className="filtros-combinados" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="filtro-group">
                <button className={`filtro-btn ${filtroStatus === 'todas' ? 'active' : ''}`} onClick={() => setFiltroStatus('todas')}>Todas</button>
                <button className={`filtro-btn ${filtroStatus === 'ativas' ? 'active' : ''}`} onClick={() => setFiltroStatus('ativas')}>Ativas</button>
                <button className={`filtro-btn ${filtroStatus === 'concluidas' ? 'active' : ''}`} onClick={() => setFiltroStatus('concluidas')}>Concluídas</button>
              </div>
              
              <div className="filtro-categoria-wrapper">
                <FaFilter className="filter-icon-small" />
                <select 
                  value={filtroCategoria} 
                  onChange={(e) => setFiltroCategoria(e.target.value)} 
                  className="select-categoria-elegante"
                >
                  <option value="todas">Todas as Categorias</option>
                  <option value="Produtividade">Produtividade e Foco</option>
                  <option value="Saúde">Saúde e Bem-Estar</option>
                  <option value="Social">Habilidades Sociais</option>
                  <option value="Autonomia">Vida e Autonomia</option>
                </select>
              </div>
            </div>

            <div className="acoes-direita">
              <div className="xp-badge">
                <FaFire className="fire-icon" />
                <span>{xpTotal} XP</span>
              </div>
              <button className="btn-nova-trilha-v2" onClick={() => setShowCriarTrilha(!showCriarTrilha)}>
                <FaPlus /> {showCriarTrilha ? 'Cancelar Exploração' : 'Explorar Trilhas'}
              </button>
            </div>

          </div>
        </section>

        {showCriarTrilha && (
          <section className="trilhas-disponiveis-v2 fade-in-down">
            <h2>Explore Novas Trilhas</h2>
            <div className="trilhas-disponiveis-grid">
              {trilhasDisponíveis.length > 0 ? trilhasDisponíveis.map(trilha => (
                <div key={trilha.id} className="trilha-disponivel-card">
                  <div className="card-header" style={{ backgroundColor: trilha.cor }}>
                    <span className="trilha-icon">{trilha.icone}</span>
                  </div>
                  <div className="card-content">
                    <span className="badge-categoria-disponivel">{trilha.categoria}</span>
                    <h3>{trilha.titulo}</h3>
                    <p className="descricao-breve">{trilha.descricao}</p>
                    <div className="info-trilha">
                      <span className="badge badge-dificuldade">{trilha.dificuldade}</span>
                      <span className="badge badge-duracao"><FaClock /> {trilha.duracao}</span>
                    </div>
                    <button className="btn-adicionar-trilha" onClick={() => adicionarTrilha(trilha.id)}>
                      <FaPlus /> Adicionar à Minha Jornada
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state-small" style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                  Nenhuma nova trilha disponível nesta categoria.
                </div>
              )}
            </div>
          </section>
        )}

        <section className="trilhas-usuario-grid-v2">
          {trilhasFiltradas.length === 0 ? (
            <div className="empty-state-trilhas">
              <FaBookOpen className="empty-icon" />
              <h3>Jornada Limpa</h3>
              <p>Nenhuma trilha encontrada para este filtro. Explore novas jornadas para adicionar ao seu painel.</p>
            </div>
          ) : (
            trilhasFiltradas.map(trilha => {
              const progresso = calcularProgresso(trilha);
              const modulosConcluidos = trilha.modulos.filter(m => m.status === 'concluido').length;
              const isExpanded = expandedTrilha === trilha.id;

              const presetRef = TRILHAS_PRESETS.find(p => p.id === trilha.id);
              const categoriaCard = trilha.categoria || (presetRef ? presetRef.categoria : 'Sem Categoria');

              return (
                <div key={trilha.id} className={`trilha-card-v2 ${trilha.status} ${animacaoNovasTrilhas[trilha.id] ? 'novo' : ''}`}>
                  <div className="trilha-card-header">
                    <div className="trilha-info-header">
                      <span className="trilha-icon-large">{trilha.icone}</span>
                      <div className="trilha-titulo-info">
                        <span className="badge-categoria-card">{categoriaCard}</span>
                        <h3>{trilha.titulo}</h3>
                        <span className={`status-tag status-${trilha.status}`}>
                          {trilha.status === 'em-andamento' ? '🔥 Em Andamento' : 
                           trilha.status === 'concluida' ? '✅ Concluída' : '🔒 Não Iniciada'}
                        </span>
                      </div>
                    </div>
                    <button className="btn-expand" onClick={() => setExpandedTrilha(isExpanded ? null : trilha.id)}>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  <div className="progresso-container-v2">
                    <div className="progresso-info">
                      <span className="progresso-label">Progresso: <strong>{progresso}%</strong></span>
                      <span className="modulos-info">{modulosConcluidos}/{trilha.modulos.length} módulos</span>
                    </div>
                    <div className="progresso-bar-v2">
                      <div className="progresso-fill" style={{ width: `${progresso}%`, backgroundColor: trilha.cor }}></div>
                    </div>
                  </div>

                  {trilha.status === 'nao-iniciada' && (
                    <div className="trilha-actions" style={{padding: '0 25px 25px'}}>
                      <button className="btn-action btn-iniciar" onClick={() => iniciarTrilha(trilha.id)}>
                        <FaRocket /> Iniciar Trilha
                      </button>
                    </div>
                  )}

                  {isExpanded && trilha.status !== 'nao-iniciada' && (
                    <div className="modulos-expandidos-v2 fade-in">
                      <h4>Módulos da Trilha (Clique para acessar a aula)</h4>
                      <div className="modulos-list">
                        {trilha.modulos.map((modulo, index) => {
                          const statusReal = obterStatusReal(trilha, index, modulo);
                          
                          return (
                            <div 
                              key={modulo.id} 
                              className={`modulo-item modulo-${statusReal} ${statusReal !== 'bloqueado' ? 'cursor-pointer' : ''}`}
                              onClick={() => abrirConteudoModulo(trilha, modulo, statusReal)}
                              title={statusReal !== 'bloqueado' ? "Clique para abrir o conteúdo" : "Módulo Bloqueado"}
                            >
                              <div className="modulo-header">
                                <div className="modulo-numero"><span>{index + 1}</span></div>
                                <div className="modulo-info">
                                  <h5>{modulo.titulo}</h5>
                                  <p>{modulo.descricao}</p>
                                </div>
                                <div className="modulo-duracao"><FaClock /> {modulo.duracao}</div>
                              </div>

                              {statusReal === 'bloqueado' && (
                                <div className="modulo-bloqueado"><FaLock className="lock-icon" /><span>Desbloqueado após módulo anterior</span></div>
                              )}
                              {statusReal === 'concluido' && (
                                <div className="modulo-concluido"><FaCheck className="check-icon" /><span>Concluído (Clique para revisar)</span></div>
                              )}
                              {statusReal === 'em-progresso' && (
                                <div className="modulo-progresso">
                                  <button className="btn-acessar-aula"><FaPlayCircle /> Acessar Aula</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="modulos-actions">
                        {progresso === 100 && trilha.status !== 'concluida' && (
                          <button className="btn-action btn-finalizar" onClick={() => finalizarTrilha(trilha.id)}>
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

          {/* CARD DE EM BREVE PERMANENTE E ESTILIZADO */}
          <div className="trilha-card-v2 em-breve-card" style={{ border: '2px dashed #cbd5e1', background: 'rgba(255,255,255,0.4)', opacity: 0.85 }}>
            <div className="trilha-card-header">
              <div className="trilha-info-header">
                <span className="trilha-icon-large" style={{ filter: 'grayscale(30%)' }}>🚀</span>
                <div className="trilha-titulo-info">
                  <h3 style={{ color: '#64748b' }}>Mais trilhas em breve, aguarde</h3>
                  <span className="status-tag" style={{ background: '#94a3b8', color: 'white' }}>⏳ Construindo novidades</span>
                </div>
              </div>
            </div>
            <div className="trilha-metadata" style={{ padding: '0 0 20px 0' }}>
              <p className="descricao-trilha" style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Nossa equipe de especialistas está preparando novos caminhos de desenvolvimento, dinâmicas imersivas, testes interativos de fixação e materiais de apoio gratuitos para expandir ainda mais sua jornada. Fique de olho nas atualizações do espaço!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE AULA */}
      {moduloAtivo && (
        <div className="modal-aula-overlay" onClick={() => setModuloAtivo(null)}>
          <div className="modal-aula-card fade-in-up" onClick={(e) => e.stopPropagation()}>
            <header className="modal-aula-header" style={{ backgroundColor: moduloAtivo?.cor || '#7B3FF2' }}>
              <div>
                <span className="aula-badge">AULA {moduloAtivo?.id || 'X'}</span>
                <h2>{moduloAtivo?.titulo || 'Carregando...'}</h2>
              </div>
              <button className="btn-fechar-aula" onClick={() => setModuloAtivo(null)}><FaTimes /></button>
            </header>
            
            <div className="modal-aula-body">
              <div className="video-player-fake">
                <FaPlayCircle className="play-icon-fake" />
                <p>O vídeo explicativo será carregado aqui.</p>
                <div className="video-controls-fake">
                  <div className="progress-bar-fake"></div>
                  <span>00:00 / {moduloAtivo?.duracao || '0h'}</span>
                </div>
              </div>

              {moduloAtivo.conteudoRico ? (
                <div className="aula-conteudo-rico fade-in">
                  <p className="texto-explicativo-rico">{moduloAtivo.conteudoRico.texto}</p>
                  
                  <div className="materiais-apoio-box">
                    <h3>Biblioteca e Materiais Complementares</h3>
                    <div className="pdf-list">
                      {moduloAtivo.conteudoRico.pdfs.map((pdf, idx) => (
                        <div key={idx} className="pdf-card">
                          <FaFilePdf className="pdf-icon" />
                          <div className="pdf-info">
                            <h4>{pdf.titulo}</h4>
                            <span>Documento PDF • {pdf.tamanho}</span>
                          </div>
                          
                          {/* OS DOIS NOVOS BOTÕES DE AÇÃO DO PDF */}
                          <div className="pdf-actions">
                            <button 
                              className="btn-pdf-action" 
                              onClick={() => handleAbrirPDF(pdf.titulo)} 
                              title="Visualizar Documento"
                            >
                              <FaExternalLinkAlt />
                            </button>
                            <button 
                              className="btn-pdf-action" 
                              onClick={() => handleBaixarPDF(pdf.titulo)} 
                              title="Fazer Download"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="aula-dica-box pratica-box">
                    <FaLightbulb className="pratica-icon" />
                    <div>
                      <strong>Prática do Dia:</strong>
                      <p>{moduloAtivo.conteudoRico.pratica}</p>
                    </div>
                  </div>

                  <div className="quiz-container">
                    <div className="quiz-header-top">
                      <h3>Teste de Fixação</h3>
                      <span className="quiz-contador">Pergunta {perguntaAtual + 1} de {moduloAtivo.conteudoRico.quiz.length}</span>
                    </div>
                    
                    <p className="quiz-pergunta">{moduloAtivo.conteudoRico.quiz[perguntaAtual].pergunta}</p>
                    
                    <div className="quiz-opcoes">
                      {moduloAtivo.conteudoRico.quiz[perguntaAtual].opcoes.map((opcao, idx) => {
                        let btnClass = "quiz-opcao-btn";
                        if (opcaoQuiz === idx) btnClass += " selected";
                        if (quizStatus !== 'respondendo' && idx === moduloAtivo.conteudoRico.quiz[perguntaAtual].respostaCorreta) btnClass += " correct";
                        if (quizStatus !== 'respondendo' && opcaoQuiz === idx && idx !== moduloAtivo.conteudoRico.quiz[perguntaAtual].respostaCorreta) btnClass += " wrong";

                        return (
                          <button 
                            key={idx} 
                            className={btnClass}
                            onClick={() => { if(quizStatus === 'respondendo') setOpcaoQuiz(idx) }}
                            disabled={quizStatus !== 'respondendo'}
                          >
                            <span className="quiz-radio">{opcaoQuiz === idx ? '●' : '○'}</span>
                            {opcao}
                          </button>
                        );
                      })}
                    </div>

                    {quizStatus === 'respondendo' && (
                      <div className="quiz-acoes">
                        <button 
                          className="btn-verificar-quiz" 
                          disabled={opcaoQuiz === null}
                          onClick={verificarRespostaQuiz}
                        >
                          Verificar Resposta
                        </button>
                        {quizErro && <span className="quiz-erro-msg">Incorreto. Tente novamente!</span>}
                      </div>
                    )}

                    {quizStatus === 'resolvido-pergunta' && (
                      <div className="quiz-sucesso-parcial fade-in">
                        <span className="quiz-acerto-msg"><FaCheckCircle /> Resposta Certa!</span>
                        <button className="btn-proxima-pergunta" onClick={proximaPergunta}>
                          Próxima Pergunta <FaArrowRight />
                        </button>
                      </div>
                    )}

                    {quizStatus === 'finalizado' && (
                      <div className="quiz-sucesso-msg fade-in">
                        <FaTrophy /> Excelente! Você acertou todas as perguntas e dominou o conteúdo. A aula já pode ser concluída.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aula-conteudo-texto">
                  <h3>Material de Apoio</h3>
                  <p>Bem-vindo ao módulo de <strong>{moduloAtivo?.titulo || 'estudos'}</strong>.</p>
                  <p>Aguarde! Os materiais complementares, quizzes e práticas deste módulo estarão disponíveis em breve.</p>
                </div>
              )}
            </div>

            <footer className="modal-aula-footer">
              <button className="btn-fechar-simples" onClick={() => setModuloAtivo(null)}>Fechar</button>
              
              {moduloAtivo?.statusReal !== 'concluido' ? (
                <button 
                  className="btn-concluir-oficial"
                  style={{ backgroundColor: (moduloAtivo.conteudoRico && quizStatus !== 'finalizado') ? '#94a3b8' : (moduloAtivo?.cor || '#7B3FF2') }}
                  disabled={moduloAtivo.conteudoRico && quizStatus !== 'finalizado'}
                  onClick={() => {
                    atualizarModulo(moduloAtivo.trilhaId, moduloAtivo.id, 'concluido');
                    setModuloAtivo(null);
                  }}
                  title={moduloAtivo.conteudoRico && quizStatus !== 'finalizado' ? "Acerte todas as perguntas do Teste para liberar" : "Concluir Aula"}
                >
                  <FaCheck /> Marcar Aula como Concluída
                </button>
              ) : (
                <span className="badge-concluido-modal" style={{color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'}}>
                  <FaCheckCircle /> Módulo finalizado
                </span>
              )}
            </footer>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }

        .filtro-categoria-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .filter-icon-small {
          color: #64748b;
          font-size: 0.9rem;
        }
        .select-categoria-elegante {
          border: none;
          background: transparent;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }
        
        .badge-categoria-card {
          background: #f1f5f9;
          color: #64748b;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 6px;
        }

        .badge-categoria-disponivel {
          background: rgba(0,0,0,0.05);
          color: #475569;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 12px;
        }

        .modal-sucesso {
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 450px;
            overflow: hidden;
            position: relative;
        }
        .modal-sucesso-header {
            background-color: #7b2cbf;
            color: #ffffff;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .modal-sucesso-body {
            padding: 30px 25px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .modal-sucesso-body h1 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 15px;
            text-transform: uppercase;
            color: #7b2cbf;
        }
        .modal-sucesso-body p {
            font-size: 1.1rem;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .modal-sucesso-button {
            background-color: #7b2cbf;
            color: #ffffff;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 25px;
            transition: all 0.2s ease;
            width: 100%;
        }
        .modal-sucesso-button:hover {
            background-color: #5a189a;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(123, 44, 191, 0.3);
        }

        .cursor-pointer { cursor: pointer; transition: transform 0.2s; }
        .cursor-pointer:hover { transform: scale(1.01); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .btn-acessar-aula { background: #7B3FF2; color: white; border: none; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: bold; cursor: pointer; }
        .btn-acessar-aula:hover { background: #612bc4; }
        .modal-aula-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 99999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); padding: 20px; }
        .modal-aula-card { background: white; border-radius: 16px; width: 100%; max-width: 850px; height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .modal-aula-header { padding: 20px 24px; color: white; display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
        .aula-badge { background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; display: inline-block; margin-bottom: 8px; }
        .modal-aula-header h2 { margin: 0; font-size: 1.5rem; line-height: 1.2; }
        .btn-fechar-aula { background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
        .btn-fechar-aula:hover { opacity: 1; transform: scale(1.1); }
        .modal-aula-body { padding: 24px; overflow-y: auto; flex: 1; text-align: left; background: #f8fafc; }
        .video-player-fake { background: #0f172a; border-radius: 12px; height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; position: relative; margin-bottom: 24px; flex-shrink: 0; }
        .play-icon-fake { font-size: 4rem; color: white; opacity: 0.8; margin-bottom: 12px; cursor: pointer; }
        .play-icon-fake:hover { opacity: 1; transform: scale(1.05); }
        .video-controls-fake { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; display: flex; align-items: center; gap: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
        .progress-bar-fake { height: 4px; background: rgba(255,255,255,0.3); flex: 1; border-radius: 2px; }
        .video-controls-fake span { color: white; font-size: 0.8rem; }
        
        .texto-explicativo-rico { font-size: 1.05rem; color: #334155; line-height: 1.6; margin-bottom: 24px; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .materiais-apoio-box h3 { color: #1e293b; margin-bottom: 16px; font-size: 1.1rem; }
        
        /* ESTILOS ATUALIZADOS PARA OS PDFs */
        .pdf-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .pdf-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: white; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 12px; transition: all 0.2s ease; }
        .pdf-card:hover { border-color: #94a3b8; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transform: translateY(-2px); }
        .pdf-icon { font-size: 2rem; color: #ef4444; flex-shrink: 0; }
        .pdf-info { flex: 1; }
        .pdf-info h4 { margin: 0 0 4px 0; color: #334155; font-size: 0.95rem; }
        .pdf-info span { font-size: 0.8rem; color: #64748b; }
        
        .pdf-actions { display: flex; gap: 8px; align-items: center; }
        .btn-pdf-action { background: #f1f5f9; color: #475569; border: none; padding: 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .btn-pdf-action:hover { background: #e2e8f0; color: #7B3FF2; }

        .pratica-box { background: #e0f2fe !important; border-left-color: #3b82f6 !important; color: #1e3a8a !important; margin-bottom: 32px; }
        .pratica-icon { font-size: 1.5rem; color: #2563eb; flex-shrink: 0; margin-top: 2px; }
        
        .quiz-container { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 16px; }
        .quiz-header-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; }
        .quiz-header-top h3 { margin: 0; color: #1e293b; font-size: 1.2rem; }
        .quiz-contador { background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
        .quiz-pergunta { font-size: 1.05rem; font-weight: 600; color: #334155; margin-bottom: 20px; }
        .quiz-opcoes { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .quiz-opcao-btn { display: flex; align-items: flex-start; gap: 12px; width: 100%; text-align: left; background: #f8fafc; border: 2px solid #e2e8f0; padding: 14px 16px; border-radius: 8px; color: #475569; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .quiz-opcao-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .quiz-opcao-btn.selected { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
        .quiz-opcao-btn.correct { background: #d1fae5; border-color: #10b981; color: #065f46; font-weight: bold; }
        .quiz-opcao-btn.wrong { background: #fee2e2; border-color: #ef4444; color: #991b1b; opacity: 0.7; }
        .quiz-radio { font-size: 1.2rem; line-height: 1; }
        
        .quiz-acoes { display: flex; align-items: center; gap: 16px; }
        .btn-verificar-quiz { background: #1e293b; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .btn-verificar-quiz:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-verificar-quiz:hover:not(:disabled) { background: #0f172a; }
        .quiz-erro-msg { color: #ef4444; font-size: 0.9rem; font-weight: 600; }
        
        .quiz-sucesso-parcial { display: flex; align-items: center; justify-content: space-between; background: #f0fdf4; padding: 12px 16px; border-radius: 8px; border: 1px solid #a7f3d0; }
        .quiz-acerto-msg { color: #059669; font-weight: bold; display: flex; align-items: center; gap: 8px; }
        .btn-proxima-pergunta { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-proxima-pergunta:hover { background: #059669; }
        
        .quiz-sucesso-msg { display: flex; align-items: center; gap: 8px; color: #10b981; background: #ecfdf5; padding: 12px 16px; border-radius: 8px; font-weight: bold; border: 1px solid #a7f3d0;}
        
        .modal-aula-footer { padding: 20px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; align-items: center; background: white; flex-shrink: 0; }
        .btn-fechar-simples { padding: 10px 20px; border: 1px solid #cbd5e1; background: white; border-radius: 8px; color: #475569; font-weight: 600; cursor: pointer; }
        .btn-fechar-simples:hover { background: #f1f5f9; }
        .btn-concluir-oficial { color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: transform 0.2s; }
        .btn-concluir-oficial:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-concluir-oficial:disabled { cursor: not-allowed; }
      `}</style>
    </div>
  );
}