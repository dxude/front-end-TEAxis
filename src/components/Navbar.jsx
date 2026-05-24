import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import logo from '../assets/imagens/fundoLogo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('teaxis_role'));
      setIsAuthed(!!localStorage.getItem('teaxis_auth_token'));
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teaxis_auth_token');
      localStorage.removeItem('teaxis_role');
      localStorage.removeItem('login_method');
      localStorage.removeItem('user_email');
    }
    setUserRole(null);
    setIsAuthed(false);
    closeMobileMenu();
    navigate('/login');
  };

  const renderAuthLinks = () => {
    if (!isAuthed) {
      return (
        <>
          <Link to="/area-responsavel?preview=responsavel" className="nav-item" onClick={closeMobileMenu}>
            Área do Responsável (Preview)
          </Link>
          <details className="nav-dropdown">
            <summary className="nav-item">Entrar</summary>
            <div className="dropdown-menu">
              <Link to="/login" className="dropdown-link" onClick={closeMobileMenu}>
                Entrar
              </Link>
              <Link to="/login?type=usuario" className="dropdown-link" onClick={closeMobileMenu}>
                Entrar como Usuário
              </Link>
              <Link to="/login?type=responsavel" className="dropdown-link" onClick={closeMobileMenu}>
                Entrar como Responsável
              </Link>
              <Link to="/login?type=profissional" className="dropdown-link" onClick={closeMobileMenu}>
                Entrar como Profissional
              </Link>
            </div>
          </details>
        </>
      );
    }

    if (userRole === 'responsavel') {
      return (
        <>
          <Link to="/area-responsavel" className="nav-item" onClick={closeMobileMenu}>
            Área do Responsável
          </Link>
          <button className="nav-item nav-logout-button" onClick={handleLogout}>
            Sair
          </button>
        </>
      );
    }

    if (userRole === 'profissional') {
      return (
        <>
          <Link to="/dashboard-profissional" className="nav-item" onClick={closeMobileMenu}>
            Dashboard Profissional
          </Link>
          <button className="nav-item nav-logout-button" onClick={handleLogout}>
            Sair
          </button>
        </>
      );
    }

    return (
      <>
        <Link to="/dashboard-usuario" className="nav-item" onClick={closeMobileMenu}>
          Meu Painel
        </Link>
        <button className="nav-item nav-logout-button" onClick={handleLogout}>
          Sair
        </button>
      </>
    );
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
          {renderAuthLinks()}
          <Link to="/cadastro" className="nav-item nav-item-cadastro" onClick={closeMobileMenu}>
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
