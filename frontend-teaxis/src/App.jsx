import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import DashboardProfissional from './pages/DashboardProfissional';
import DashboardUsuario from './pages/DashboardUsuario';
import BuscarProfissionais from './pages/BuscarProfissionais';
import MinhasMetas from './pages/MinhasMetas'; 
import PerfilProfissionalDetalhado from './pages/PerfilProfissionalDetalhado'; 
import MeusAgendamentos from './pages/MeusAgendamentos'; 
import MinhasTrilhas from './pages/MinhasTrilhas';    
import JogosEducativos from './pages/JogosEducativos';
import Mensagens from './pages/Mensagens';          
import MeuProgresso from './pages/MeuProgresso';       

import './App.css'; 

function App() {
  const location = useLocation();

  const esconderNavbar = [
    '/perfil',
    '/dashboard-usuario',
    '/dashboard-profissional',
    '/buscar-profissionais',
    '/minhas-metas',
    '/perfil-profissional/:id',
    '/meus-agendamentos', 
    '/minhas-trilhas',     
    '/jogos-educativos',   
    '/mensagens',          
    '/meu-progresso'       
  ].includes(location.pathname);


  return (
    <>
      {!esconderNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dashboard-usuario" element={<DashboardUsuario />} />
          <Route path="/dashboard-profissional" element={<DashboardProfissional />} />
          <Route path="/buscar-profissionais" element={<BuscarProfissionais />} />
          <Route path="/minhas-metas" element={<MinhasMetas />} />
          <Route path="/perfil-profissional/:id" element={<PerfilProfissionalDetalhado />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} /> 
          <Route path="/minhas-trilhas" element={<MinhasTrilhas />} />      
          <Route path="/jogos-educativos" element={<JogosEducativos />} />   
          <Route path="/mensagens" element={<Mensagens />} />              
          <Route path="/meu-progresso" element={<MeuProgresso />} />           
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;