// src/pages/Home.jsx - CORRIGIDO DE VERDADE AGORA!
import React from 'react';
import '../Styles/Home.css'; // Seu CSS da Home
import heroImg from '../assets/imagens/images.jfif'; // Sua imagem hero
// ... quaisquer outros imports que a Home precise para o conteúdo dela ...

const Home = () => {
  return (
    // Você pode ter um Fragment <> ou diretamente o <main> se não precisar de outro wrapper
    // O importante é NÃO TER <Navbar /> nem <Footer /> AQUI.
    <main className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1>Conectamos você a profissionais que entendem o seu jeito de aprender e crescer</h1>
          <div className="hero-buttons">
            <button className="btn-primary">Encontre Seu Especialista</button>
            <button className="btn-secondary">Conheça Nossos Recursos</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Ilustração TEAxis" />
        </div>
      </section>

      <section className="como-funciona">
        <h2>Como Funciona</h2>
        <div className="funciona-cards">
          <div className="card">
            <img src={heroImg} alt="Buscar especialista" />
            <p>Pesquise e encontre profissionais especializados</p>
          </div>
          <div className="card">
            <img src={heroImg} alt="Agendar consulta" />
            <p>Agende consultas online com facilidade</p>
          </div>
          <div className="card">
            <img src={heroImg} alt="Jogos educativos" />
            <p>Desenvolva-se com jogos e trilhas educativas</p>
          </div>
        </div>
      </section>

      <section className="beneficios">
        <ul>
          <li>Profissionais <br />Verificados</li>
          <li>Atendimento <br /> 100% Online</li>
          <li>Jogos adaptados para foco e aprendizagem</li>
          <li>Trilhas de <br /> desenvolvimento</li>
        </ul>
      </section>

      <section className="depoimento-e-seguranca-container">
        {/* Coluna do Depoimento */}
        <div className="depoimento-coluna">
          <div className="depoimento-card">
            <img
              src={heroImg} // <<< LEMBRE-SE DE TROCAR PELA FOTO DO LUCAS
              alt="Lucas, 14 anos"
              className="depoimento-avatar"
            />
            <div className="depoimento-conteudo">
              <p className="depoimento-texto">
                “O TEAxis me ajudou a encontrar um terapeuta incrível que entende minhas dificuldades na escola. Hoje consigo ter um melhor foco em cada matéria.”
              </p>
              <footer className="depoimento-autor">
                Lucas, 14 anos
              </footer>
            </div>
          </div>
        </div>

        {/* Coluna da Segurança */}
        <div className="seguranca-coluna">
          <h2>Área segura para todos</h2>
          <ul className="seguranca-lista">
            <li>
              <span className="icone-seguranca icone-dados"></span>
              <span>Segurança de dados garantida</span>
            </li>
            <li>
              <span className="icone-seguranca icone-consultas"></span>
              <span>Consultas criptografadas</span>
            </li>
            <li>
              <span className="icone-seguranca icone-acolhimento"></span>
              <span>Espaço de acolhimento e respeito</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Home;