import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import logo from '../assets/imagens/fundoLogo.png'


export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img src={logo} alt="Logo TEAxis" className="logo-img" /> {/* Adicionei uma classe para estilizar */}
        </Link>

        <nav className="navbar-links">
          <Link to="/" className="nav-item">Início</Link>
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/cadastro" className="nav-item">Cadastro</Link>
        </nav>
      </div>
    </header>
  );
}
