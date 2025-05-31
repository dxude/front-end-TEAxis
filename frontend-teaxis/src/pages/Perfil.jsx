import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="perfil-container">
      {/* Sidebar */}
      <aside className="perfil-sidebar">
        <div className="perfil-user">
          <img src="/img/avatar.svg" alt="Avatar" className="perfil-avatar" />
          <p className="perfil-nome">Joaninha do Ibura</p>
          <span className="perfil-tag">Cadastrada desde 2025</span>
        </div>

        <nav className="perfil-menu">
          <button className="menu-btn active">Informações</button>
          <button className="menu-btn">Editar Foto</button>
          <button className="menu-btn">Editar Nome e Endereço</button>
          <button className="menu-btn">Editar outras informações</button>
          <button className="menu-btn">Excluir Conta</button>
          <hr />
          <button className="menu-btn blue">Tipo de neurodivergência</button>
          <button className="menu-btn">Preferências sensoriais</button>
          <button className="menu-btn">Hobbies</button>
          <button className="menu-btn logout" onClick={handleLogout}>Sair</button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="perfil-main">
        <header className="perfil-header">
          <h1>Edital Perfil</h1>
          <input type="text" placeholder="🔍 Pesquisar" />
          <div className="perfil-ident">
            <span>Joaninha do Ibura</span>
            <img src="/img/avatar.svg" alt="Usuário" />
          </div>
        </header>

        <section className="perfil-content">
          <div className="perfil-card card-left">
            <h3>Progresso feito <span>Acompanhe aqui</span></h3>
            <ul>
              <li>📶 lorem lorem</li>
              <li>🗂️ lorem lorem iputo</li>
              <li>📌 lorem lorem pjfpf</li>
            </ul>
          </div>

          <div className="perfil-card card-right">
            <h3>Loremmm Loremmm Ips</h3>
            <div className="perfil-task">
              <div className="task-icon">📄</div>
              <div>
                <p className="task-title">Lorem ihu</p>
                <span className="status em-progresso">Em progresso</span>
              </div>
            </div>
            <div className="perfil-task">
              <div className="task-icon">📄</div>
              <div>
                <p className="task-title">Lorem 2</p>
                <span className="status em-progresso">Em progresso</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
