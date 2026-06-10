import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressoContext = createContext();

export function useProgresso() {
  return useContext(ProgressoContext);
}

export function ProgressoProvider({ children }) {
  // Função para pegar o email real do momento
  const getEmail = () => localStorage.getItem('user_email') || 'visitante';

  const [activeEmail, setActiveEmail] = useState(getEmail());

  const stateInicialVazio = {
    metas: [],
    trilhas: [],
    progressoGeral: 0,
    xpTotal: 0
  };

  const [dados, setDados] = useState(stateInicialVazio);

  // 1. O VIGILANTE ABSOLUTO: Roda a cada 500ms para garantir que pega a troca de usuário,
  // mesmo que a tela de Login não avise o sistema corretamente.
  useEffect(() => {
    const interval = setInterval(() => {
      const emailAtual = getEmail();
      if (emailAtual !== activeEmail) {
        setActiveEmail(emailAtual);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [activeEmail]);

  // A CHAVE DE ACESSO ÚNICA DE CADA USUÁRIO NO NAVEGADOR
  const STORAGE_KEY = `dados_plataforma_${activeEmail}`;

  // 2. Quando o e-mail muda, NÓS TROCAMOS OS DADOS IMEDIATAMENTE
  useEffect(() => {
    if (activeEmail === 'visitante') {
      setDados(stateInicialVazio);
      return;
    }

    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
      setDados(JSON.parse(dadosSalvos));
    } else {
      // Usuário novo logou? Começa do zero absoluto, sem herdar nada de ninguém!
      setDados(stateInicialVazio);
    }
  }, [STORAGE_KEY, activeEmail]);

  const recalcularProgressoTotal = (novasMetas, novasTrilhas) => {
    let pontuacaoMetas = 0;
    if (novasMetas.length > 0) {
      const metasConcluidas = novasMetas.filter(m => m.concluida).length;
      pontuacaoMetas = (metasConcluidas / novasMetas.length) * 50;
    }

    let pontuacaoTrilhas = 0;
    let totalModulos = 0;
    let modulosConcluidos = 0;
    
    novasTrilhas.forEach(t => {
      totalModulos += t.modulos.length;
      modulosConcluidos += t.modulos.filter(m => m.status === 'concluido').length;
    });

    if (totalModulos > 0) {
      pontuacaoTrilhas = (modulosConcluidos / totalModulos) * 50;
    }

    const novoProgressoGeral = Math.round(pontuacaoMetas + pontuacaoTrilhas);
    const novoXpTotal = modulosConcluidos * 50 + (novasMetas.filter(m => m.concluida).length * 100);

    return { novoProgressoGeral, novoXpTotal };
  };

  const atualizarMetas = (novasMetas) => {
    const { novoProgressoGeral, novoXpTotal } = recalcularProgressoTotal(novasMetas, dados.trilhas);
    const atualizado = {
      ...dados,
      metas: novasMetas,
      progressoGeral: novoProgressoGeral,
      xpTotal: novoXpTotal
    };
    setDados(atualizado);
    if (activeEmail !== 'visitante') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    }
  };

  const atualizarTrilhas = (novasTrilhas) => {
    const { novoProgressoGeral, novoXpTotal } = recalcularProgressoTotal(dados.metas, novasTrilhas);
    const atualizado = {
      ...dados,
      trilhas: novasTrilhas,
      progressoGeral: novoProgressoGeral,
      xpTotal: novoXpTotal
    };
    setDados(atualizado);
    if (activeEmail !== 'visitante') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    }
  };

  return (
    <ProgressoContext.Provider value={{ dados, atualizarMetas, atualizarTrilhas }}>
      {children}
    </ProgressoContext.Provider>
  );
}