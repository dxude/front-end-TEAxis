import React from 'react';
import '../Styles/Home.css'; 
import heroImg from '../assets/imagens/images.jfif'; 
import primeiraIMG from '../assets/imagens/primeiraImagem.png'
import segundaIMG from '../assets/imagens/_Image_as7.png'
import { FaSearch, FaCalendarAlt, FaPuzzlePiece } from 'react-icons/fa';


const Home = () => {
  return (

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
          <img src={primeiraIMG} alt="Ilustração TEAxis" />
        </div>
      </section>

      <section className="como-funciona">
        <h2>Como Funciona</h2>
        <div className="funciona-cards">
          <div className="card">
            <div className="card-icon-wrapper">
              <FaSearch className="card-icon icon-search" />
            </div>
            <p>Pesquise e encontre profissionais especializados</p>
          </div>

          <div className="card">
            <div className="card-icon-wrapper">
              <FaCalendarAlt className="card-icon icon-calendar" />
            </div>
            <p>Agende consultas online <br></br> com facilidade</p>
          </div>

          <div className="card">
            <div className="card-icon-wrapper">
              <FaPuzzlePiece className="card-icon icon-puzzle" />
            </div>
            <p>Desenvolva-se com jogos <br></br>e trilhas educativas</p>
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
              src={segundaIMG} 
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