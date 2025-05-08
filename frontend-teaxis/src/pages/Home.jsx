import React from 'react';
import '../Styles/Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroImg from '../assets/imagens/images.jfif';


const Home = () => {
  return (
    <>
      <Navbar />
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
            <li>Profissionais Verificados</li>
            <li>Atendimento 100% Online</li>
            <li>Jogos adaptados para foco e aprendizagem</li>
            <li>Trilhas de desenvolvimento</li>
          </ul>
        </section>

        <section className="depoimento">
          <blockquote>
            “O TEAxis me ajudou a encontrar um especialista incrível que entende minhas dificuldades únicas. Obrigado TEAxis!”
            <footer>– Lucas, 14 anos</footer>
          </blockquote>
        </section>

        <section className="seguranca">
          <h2>Área segura para todos</h2>
          <ul>
            <li>✅ Segurança de dados garantida</li>
            <li>✅ Consultas</li>
            <li>✅ Espaço acolhedor e respeitoso</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;

