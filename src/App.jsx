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
import MinhaAgenda from './pages/MinhaAgenda';
import MeusClientes from './pages/MeusClientes';
import Relatorios from './pages/Relatorios';
import RemarcarAgendamento from './pages/RemarcarAgendamento';
import AvaliarProfissional from './pages/AvaliarProfissional';
import SalaAgendamento from './pages/SalaAgendamento';
import CancelarAgendamento from './pages/CancelarAgendamento';
import GuardianDashboard from './components/GuardianDashboard';
import RoleGuard from './components/RoleGuard';

import './App.css';

function App() {
  const location = useLocation();

  const esconderNavbarRotas = [
    '/',
    '/perfil',
    '/dashboard-usuario',
    '/dashboard-profissional',
    '/buscar-profissionais',
    '/minhas-metas',
    '/meus-agendamentos',
    '/minha-agenda',
    '/meus-clientes',
    '/relatorios',
    '/minhas-trilhas',
    '/jogos-educativos',
    '/mensagens',
    '/meu-progresso'
  ];

  const esconderNavbar =
    esconderNavbarRotas.includes(location.pathname) ||
    location.pathname.startsWith('/perfil-profissional/');

  return (
    <>
      {!esconderNavbar && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel', 'profissional' ]} fallback="/login"><Perfil /></RoleGuard>} />
          <Route path="/dashboard-usuario" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel' ]} fallback="/login"><DashboardUsuario /></RoleGuard>} />
          <Route path="/dashboard-profissional" element={<RoleGuard allowedRoles={[ 'profissional' ]} fallback="/login"><DashboardProfissional /></RoleGuard>} />
          <Route path="/buscar-profissionais" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel' ]} fallback="/login"><BuscarProfissionais /></RoleGuard>} />
          <Route path="/minhas-metas" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel' ]} fallback="/login"><MinhasMetas /></RoleGuard>} />
          <Route path="/perfil-profissional/:id" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel' ]} fallback="/login"><PerfilProfissionalDetalhado /></RoleGuard>} />
          <Route path="/meus-agendamentos" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel' ]} fallback="/login"><MeusAgendamentos /></RoleGuard>} />
          <Route path="/minha-agenda" element={<RoleGuard allowedRoles={[ 'profissional' ]} fallback="/login"><MinhaAgenda /></RoleGuard>} />
          <Route path="/meus-clientes" element={<RoleGuard allowedRoles={[ 'profissional' ]} fallback="/login"><MeusClientes /></RoleGuard>} />
          <Route path="/relatorios" element={<RoleGuard allowedRoles={[ 'profissional' ]} fallback="/login"><Relatorios /></RoleGuard>} />
          <Route path="/remarcar/:id" element={<RemarcarAgendamento />} />
          <Route path="/avaliar/:idProfissional" element={<AvaliarProfissional />} />
          <Route path="/sala/:id" element={<SalaAgendamento />} />
          <Route path="/cancelar/:id" element={<CancelarAgendamento />} />
          <Route path="/minhas-trilhas" element={<MinhasTrilhas />} />
          <Route path="/jogos-educativos" element={<JogosEducativos />} />
          <Route path="/mensagens" element={<RoleGuard allowedRoles={[ 'usuario', 'responsavel', 'profissional' ]} fallback="/login"><Mensagens /></RoleGuard>} />
          <Route path="/meu-progresso" element={<MeuProgresso />} />
          <Route path="/area-responsavel" element={<GuardianDashboard />} />
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;