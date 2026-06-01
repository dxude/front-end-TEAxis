import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBrain, FaPuzzlePiece, FaComments, FaSignOutAlt, FaSearch, FaChartLine, FaBullseye, FaTimes } from 'react-icons/fa';
import logoTeaxis from '../assets/imagens/fundoLogo.png';

export default function Sidebar({ 
  userName, 
  activeLink, 
  setActiveLink, 
  handleLogout, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) {
  return (
    <>
      <style>{`
        /* ==================== ANIMAÇÕES ==================== */
        @keyframes fadeInOverlay {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(4px); }
        }

        @keyframes slideInSidebar {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* ==================== OVERLAY (Fundo escuro) ==================== */
        .sidebar-overlay-premium {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4); /* Tom escuro azulado elegante */
          z-index: 1040;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay-premium.active {
          opacity: 1;
          pointer-events: auto;
          animation: fadeInOverlay 0.4s forwards;
        }

        /* ==================== SIDEBAR PRINCIPAL ==================== */
        .sidebar-premium {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 300px;
          background: rgba(255, 255, 255, 0.85); /* Vidro claro */
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 20px 0 50px -10px rgba(123, 63, 242, 0.15);
          z-index: 1050;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .sidebar-premium.open {
          transform: translateX(0);
        }

        /* ==================== BOTÃO FECHAR ==================== */
        .sidebar-close-btn-premium {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          background: rgba(123, 63, 242, 0.1);
          border: none;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #7B3FF2;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sidebar-close-btn-premium:hover {
          background: #7B3FF2;
          color: white;
          transform: rotate(90deg);
        }

        /* ==================== HEADER DA SIDEBAR ==================== */
        .sidebar-header-premium {
          padding: 3rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .sidebar-logo-premium {
          width: 140px;
          height: auto;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
        }

        .user-welcome-premium {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
          text-align: center;
        }

        .user-badge {
          background: linear-gradient(135deg, #7B3FF2 0%, #5A0FC8 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          margin-top: 0.5rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ==================== NAVEGAÇÃO ==================== */
        .sidebar-nav-premium {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .sidebar-nav-premium ul {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .nav-item-premium {
          border-radius: 12px;
          overflow: hidden;
        }

        .nav-link-premium {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-icon-premium {
          font-size: 1.2rem;
          color: #94A3B8;
          transition: all 0.3s ease;
        }

        /* Efeito Hover */
        .nav-link-premium:hover {
          background: rgba(123, 63, 242, 0.06);
          color: #7B3FF2;
          transform: translateX(4px);
        }

        .nav-link-premium:hover .nav-icon-premium {
          color: #7B3FF2;
        }

        /* Estado Ativo */
        .nav-link-premium.active {
          background: #7B3FF2;
          color: white;
          box-shadow: 0 4px 15px rgba(123, 63, 242, 0.25);
        }

        .nav-link-premium.active .nav-icon-premium {
          color: white;
        }

        /* Linha decorativa no link ativo */
        .nav-link-premium.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          height: 60%;
          width: 4px;
          background: #D8B4FE;
          border-radius: 0 4px 4px 0;
        }

        /* ==================== RODAPÉ (LOGOUT) ==================== */
        .sidebar-footer-premium {
          padding: 1.5rem;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .logout-btn-premium {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1rem;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #EF4444;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn-premium:hover {
          background: #EF4444;
          color: white;
          border-color: #EF4444;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        /* Custom Scrollbar para a nav */
        .sidebar-nav-premium::-webkit-scrollbar { width: 6px; }
        .sidebar-nav-premium::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav-premium::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.5); border-radius: 10px; }
        .sidebar-nav-premium::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }

        @media (max-width: 400px) {
          .sidebar-premium { width: 85%; max-width: 320px; }
        }
      `}</style>

      {/* Overlay escurecido */}
      <div 
        className={`sidebar-overlay-premium ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Drawer */}
      <aside className={`sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn-premium" onClick={() => setIsSidebarOpen(false)} title="Fechar menu">
          <FaTimes />
        </button>

        <div className="sidebar-header-premium">
          <img src={logoTeaxis} alt="Logo TEAxis" className="sidebar-logo-premium" />
          <p className="user-welcome-premium">{
            (() => {
              try {
                const role = typeof window !== 'undefined' ? localStorage.getItem('teaxis_role') : null;
                if (role === 'profissional') return `Olá, ${userName}`;
              } catch (e) {}
              return `Olá, seja bem vindo, ${userName}`;
            })()
          }</p>
          <span className="user-badge">Meu Espaço</span>
        </div>

        <nav className="sidebar-nav-premium">
          <ul>
            <li className="nav-item-premium">
              <Link to="/dashboard-usuario" className={`nav-link-premium ${activeLink === 'home' ? 'active' : ''}`} onClick={() => { setActiveLink('home'); setIsSidebarOpen(false); }}>
                <FaHome className="nav-icon-premium" /> Meu Espaço
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/buscar-profissionais" className={`nav-link-premium ${activeLink === 'buscar' ? 'active' : ''}`} onClick={() => { setActiveLink('buscar'); setIsSidebarOpen(false); }}>
                <FaSearch className="nav-icon-premium" /> Buscar Especialista
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/meus-agendamentos" className={`nav-link-premium ${activeLink === 'agendamentos' ? 'active' : ''}`} onClick={() => { setActiveLink('agendamentos'); setIsSidebarOpen(false); }}>
                <FaCalendarAlt className="nav-icon-premium" /> Agendamentos
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/minhas-trilhas" className={`nav-link-premium ${activeLink === 'trilhas' ? 'active' : ''}`} onClick={() => { setActiveLink('trilhas'); setIsSidebarOpen(false); }}>
                <FaBrain className="nav-icon-premium" /> Minhas Trilhas
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/minhas-metas" className={`nav-link-premium ${activeLink === 'metas' ? 'active' : ''}`} onClick={() => { setActiveLink('metas'); setIsSidebarOpen(false); }}>
                <FaBullseye className="nav-icon-premium" /> Minhas Metas
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/jogos-educativos" className={`nav-link-premium ${activeLink === 'jogos' ? 'active' : ''}`} onClick={() => { setActiveLink('jogos'); setIsSidebarOpen(false); }}>
                <FaPuzzlePiece className="nav-icon-premium" /> Jogos Educativos
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/meu-progresso" className={`nav-link-premium ${activeLink === 'progresso' ? 'active' : ''}`} onClick={() => { setActiveLink('progresso'); setIsSidebarOpen(false); }}>
                <FaChartLine className="nav-icon-premium" /> Meu Progresso
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/mensagens" className={`nav-link-premium ${activeLink === 'mensagens' ? 'active' : ''}`} onClick={() => { setActiveLink('mensagens'); setIsSidebarOpen(false); }}>
                <FaComments className="nav-icon-premium" /> Mensagens
              </Link>
            </li>
            <li className="nav-item-premium">
              <Link to="/perfil" className={`nav-link-premium ${activeLink === 'perfil' ? 'active' : ''}`} onClick={() => { setActiveLink('perfil'); setIsSidebarOpen(false); }}>
                <FaUser className="nav-icon-premium" /> Meu Perfil
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer-premium">
          <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className="logout-btn-premium">
            <FaSignOutAlt /> Sair do TEAxis
          </button>
        </div>
      </aside>
    </>
  );
}