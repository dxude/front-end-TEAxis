import React, { useEffect } from 'react';
import '../Styles/Home.css';
import { FaSearch, FaCalendarAlt, FaPuzzlePiece, FaLock, FaHeart, FaRobot } from 'react-icons/fa';
import axisImg from '../assets/imagens/axis-sorridente.png';
import depoimentoImg from '../assets/imagens/depoimento.png';
import ChatAxis from '../components/ChatAxis';


const Home = () => {
  const handleCadastro = () => {
    window.location.href = '/cadastro';
  };

  const scrollToComoFunciona = () => {
    const section = document.querySelector('.como-funciona');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const section = document.querySelector('.cta-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  // efeito de fade-in ao rolar a página
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="home-container">
      {/* HERO */}
      <section className="hero fade-in">
        <div className="hero-text">
          <h1>Conectamos você a profissionais que entendem o seu jeito de aprender e crescer.</h1>
          <p>O Axis te guia na busca pelo especialista ideal para o seu desenvolvimento.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToBottom}>
              Encontre Seu Especialista
            </button>
            <button className="btn btn-secondary" onClick={scrollToComoFunciona}>
              Saiba mais sobre o TEAxis
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={axisImg} alt="Axis sorridente" className="axis-flutuando" />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="como-funciona fade-in">
        <h2>Como Funciona</h2>
        <div className="funciona-cards">
          <div className="card">
            <div className="card-icon-wrapper bg-lilac">
              <FaRobot className="card-icon" />
            </div>
            <p>Converse com o Axis para entender suas necessidades.</p>
          </div>
          <div className="card">
            <div className="card-icon-wrapper bg-green">
              <FaSearch className="card-icon" />
            </div>
            <p>Receba recomendações de profissionais especializados.</p>
          </div>
          <div className="card">
            <div className="card-icon-wrapper bg-blue">
              <FaCalendarAlt className="card-icon" />
            </div>
            <p>Agende consultas com facilidade e segurança.</p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTO + SEGURANÇA */}
      <section className="depoimento-e-seguranca-container fade-in">
        <div className="depoimento-coluna">
          <div className="depoimento-card">
            <img src={depoimentoImg} alt="Lucas, 14 anos" className="depoimento-avatar" />
            <p className="depoimento-texto">
              “O TEAxis me ajudou a encontrar um terapeuta incrível que entende minhas dificuldades na escola. 
              Hoje consigo ter um melhor foco em cada matéria.”
            </p>
            <footer className="depoimento-autor">Lucas, 14 anos</footer>
          </div>
        </div>

        <div className="seguranca-coluna">
          <h2>Segurança e Acolhimento</h2>
          <ul className="seguranca-lista">
            <li><FaLock className="icone-seguranca color-green" /> Segurança de dados garantida</li>
            <li><FaHeart className="icone-seguranca color-lilac" /> Espaço de respeito e empatia</li>
            <li><FaPuzzlePiece className="icone-seguranca color-blue" /> Tecnologia inclusiva e acessível</li>
          </ul>
        </div>
      </section>

      {/* SOBRE */}
      <section className="sobre-section fade-in">
        <h2>Apoiando Toda a Comunidade Neurodiversa.</h2>
        <p>
          O TEAxis é o ponto de encontro seguro para indivíduos neurodivergentes, suas famílias e a rede de profissionais que os apoiam.
        </p>
        <p>
          <strong>Indivíduos Neurodivergentes:</strong> Encontre apoio especializado, focado no seu desenvolvimento único e bem-estar emocional.<br />
          <strong>Familiares e Cuidadores:</strong> Acompanhe o progresso, receba orientação e participe ativamente da jornada de desenvolvimento.<br />
          <strong>Profissionais Especializados:</strong> Divulgue sua expertise, gerencie atendimentos e amplie seu impacto na comunidade.
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section className="beneficios-section fade-in">
        <h2>Benefícios do TEAxis</h2>
        <ul>
          <li>✅ Comunicação facilitada entre responsáveis e profissionais especializados;</li>
          <li>📊 Relatórios e acompanhamento de evolução em tempo real;</li>
          <li>💬 Atendimento humanizado, empático e focado no desenvolvimento individual;</li>
          <li>🔒 Segurança total dos dados e privacidade garantida;</li>
          <li>💡 Interface acessível e inclusiva, feita para todos os públicos.</li>
        </ul>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section fade-in">
        <h2>Pronto para Iniciar sua Jornada de Apoio?</h2>
        <p>
          Dê o primeiro passo com o Axis e descubra especialistas que entendem o seu jeito de ser. 
          Você merece um espaço seguro de escuta, acolhimento e desenvolvimento.
        </p>
        <button className="btn btn-cta" onClick={handleCadastro}>
          Iniciar agora
        </button>
      </section>
      <ChatAxis />
    </main>
  );
};

export default Home;
