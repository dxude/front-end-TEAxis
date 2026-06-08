import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';
import { FaSearch, FaCalendarAlt, FaPuzzlePiece, FaLock, FaHeart, FaRobot, FaUsers, FaCommentDots } from 'react-icons/fa';
import axisImg from '../assets/imagens/axis-sorridente.png';
import logoImg from '../assets/imagens/fundoLogo.png';
import depoimentoImg from '../assets/imagens/depoimento.png';
import video1 from '../assets/imagens/video1.mp4';

const Home = () => {
  const [showTopbar, setShowTopbar] = useState(true);
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;

      if (currentScroll <= 0) {
        setShowTopbar(true);
      } else if (delta > 15) {
        setShowTopbar(false);
      } else if (delta < -15) {
        setShowTopbar(true);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className={`home-topbar-glass ${showTopbar ? 'visible' : 'hidden'}`}>
        <div className="home-topbar-inner">
          <div className="home-brand">
            <img src={logoImg} alt="Logo TEAxis" className="logo-img-small" />
            <span className="logo-text-glass">TEAxis</span>
          </div>
          <nav className="home-topbar-links-glass">
            <button type="button" className="nav-item-glass" onClick={scrollToComoFunciona}>Como funciona</button>
            <button type="button" className="nav-item-glass" onClick={scrollToBottom}>Começar</button>
            <Link to="/cadastro" className="nav-item-cadastro-glass">Criar conta</Link>
          </nav>
          <div className="home-topbar-actions">
            <Link to="/login" className="nav-login-glass">Entrar</Link>
          </div>
        </div>
      </header>

      <section className="home-hero fade-in">
        <div className="hero-copy">
          <span className="hero-eyebrow">Apoio especializado e acolhedor</span>
          <h1>Conecte-se a profissionais que entendem você e sua família.</h1>
          <p>
            TEAxis aproxima responsáveis, jovens e profissionais neurodivergentes de uma jornada de cuidado com segurança, empatia e acompanhamento contínuo.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleCadastro}>Criar conta gratuita</button>
            <button className="btn btn-secondary" onClick={scrollToComoFunciona}>Ver como funciona</button>
          </div>

          <div className="hero-highlights">
            <div className="highlight-card">
              <FaUsers className="highlight-icon" />
              <div>
                <strong>Proteção de dados</strong>
                <span>Privacidade e LGPD em cada etapa do processo.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-tag">O seu ponto de partida</div>
            <h2>Gestão de perfis, agendamentos e conexões com profissionais.</h2>
            <p>Uma experiência acolhedora para todos aqueles que desejam buscar um suporte especializado dentro de um único ambiente.</p>
            <button className="btn btn-primary-sm" onClick={scrollToBottom}>Quero conhecer</button>
          </div>
          <div className="hero-image-wrapper">
            <img src={axisImg} alt="Axis sorridente" className="axis-flutuando" />
          </div>
        </div>
      </section>

      <section className="home-features fade-in">
        <div className="feature-card">
          <FaSearch className="feature-icon" />
          <h3>Descoberta inteligente</h3>
          <p>Encontre profissionais com experiência real em neurodiversidade.</p>
        </div>
        <div className="feature-card">
          <FaCalendarAlt className="feature-icon" />
          <h3>Agendamento rápido</h3>
          <p>Marque atendimentos com facilidade e mantenha o controle.</p>
        </div>
        <div className="feature-card">
          <FaCommentDots className="feature-icon" />
          <h3>Comunicação acolhedora</h3>
          <p>Mensagens e acompanhamento pensados para pessoas e familiares.</p>
        </div>
      </section>

      <section className="como-funciona fade-in">
        <div className="como-funciona-header">
          <span>01</span>
          <h2>Como o TEAxis ajuda você</h2>
        </div>
        <div className="funciona-cards">
          <div className="card card-large">
            <div className="card-icon-wrapper bg-lilac">
              <FaRobot className="card-icon" />
            </div>
            <h3>Inteligência para recomendar</h3>
            <p>Conte seu caso e veja profissionais sugeridos com base nas suas necessidades.</p>
          </div>
          <div className="card card-large">
            <div className="card-icon-wrapper bg-green">
              <FaSearch className="card-icon" />
            </div>
            <h3>Busca personalizada</h3>
            <p>Encontre especialistas por área, idade e forma de atendimento.</p>
          </div>
          <div className="card card-large">
            <div className="card-icon-wrapper bg-blue">
              <FaCalendarAlt className="card-icon" />
            </div>
            <h3>Agenda organizada</h3>
            <p>Visualize e controle seus agendamentos direto na plataforma.</p>
          </div>
        </div>
      </section>

      <section className="home-stories fade-in">
        <div className="story-card">
          <img src={depoimentoImg} alt="Menino feliz usando TEAxis" className="testimonial-image" />
          <div className="story-card-header">
            <span>História real</span>
            <strong>“O TEAxis mudou a forma como encontramos apoio em família.”</strong>
          </div>
          <p>
            “Cadastrar meu filho e conectar com um profissional empático foi muito mais simples. A plataforma trouxe calma e organização para nossa rotina.”
          </p>
          <footer>— Mariana, mãe do Lucas</footer>
        </div>
        <div className="trust-card">
          <h3>Construído para confiança</h3>
          <ul>
            <li><FaHeart className="trust-icon" /> Acolhimento em cada etapa</li>
            <li><FaLock className="trust-icon" /> Privacidade com LGPD</li>
            <li><FaPuzzlePiece className="trust-icon" /> Experiência inclusiva</li>
          </ul>
        </div>
      </section>

      <section className="beneficios-section fade-in">
        <div className="beneficios-header">
          <div>
            <h2>O que você encontra no TEAxis</h2>
            <p className="beneficios-tagline">Conte com o Axis para auxiliar você nessa jornada tão importante.</p>
          </div>
          <div className="beneficios-badge">
            <FaRobot className="beneficios-badge-icon" />
            <span>Axis em ação</span>
          </div>
        </div>

        <div className="beneficios-grid">
          <div className="beneficios-video-row">
            <div className="video-card">
              <div className="video-frame">
                <video
                  src={video1}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="beneficios-video"
                />
              </div>
            </div>
          </div>

          <div className="beneficios-card-grid">
            <div className="beneficio-card">
              <strong>Conexão humana</strong>
              <p>Profissionais empáticos que entendem as necessidades individuais.</p>
            </div>
            <div className="beneficio-card">
              <strong>Transparência</strong>
              <p>Controle de perfis, consentimentos e histórico de atendimento.</p>
            </div>
            <div className="beneficio-card">
              <strong>Inclusão</strong>
              <p>Interface acessível para jovens, responsáveis e profissionais.</p>
            </div>
            <div className="beneficio-card">
              <strong>Apoio familiar</strong>
              <p>Espaço para responsáveis gerenciarem perfis de menores em segurança.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section fade-in">
        <div className="cta-grid">
          <div>
            <h2>Comece agora com o Axis</h2>
            <p>Uma plataforma pensada para neurodivergentes, famílias e profissionais que desejam apoio seguro e acolhedor.</p>
          </div>
          <div className="cta-actions">
            <button className="btn btn-primary" onClick={handleCadastro}>Criar conta gratuita</button>
            <Link to="/login" className="btn btn-secondary cta-login">Entrar</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;