import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import logo from '../assets/imagens/fundoLogo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt="Logo TEAxis" className="logo-img" />
          <span className="logo-text">TEAxis</span>
        </Link>

        {/* HAMBURGER MENU ICON */}
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item" onClick={closeMobileMenu}>
            Início
          </Link>
          <Link to="/login" className="nav-item" onClick={closeMobileMenu}>
            Entrar
          </Link>
          <Link to="/cadastro" className="nav-item nav-item-cadastro" onClick={closeMobileMenu}>
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
