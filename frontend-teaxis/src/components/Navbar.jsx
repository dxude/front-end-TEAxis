// src/components/Navbar.jsx
import React from 'react';
import '../Styles/Home.css'; // Certifique-se que o caminho para o CSS está correto

const Navbar = () => {
  return (
    <nav className="navbar-container"> {/* Adicionamos uma classe para estilizar o container da navbar */}
      <div className="navbar-logo">
        TEAxis
      </div>
      <ul className="navbar-links">
        <li><a href="#">Buscar Especialistas</a></li>
        <li><a href="#">Acessar Jogos Educativos</a></li>
        <li><a href="#">Agendar Consulta</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
