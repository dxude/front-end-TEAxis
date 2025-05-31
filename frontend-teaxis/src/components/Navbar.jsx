import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TEAXIS
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
