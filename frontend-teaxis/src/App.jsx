import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';

import './App.css';

function App() {
  const location = useLocation();

  // Oculta a Navbar nas páginas privadas
  const esconderNavbar = location.pathname === '/perfil';

  return (
    <>
      {!esconderNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<p>Página não encontrada</p>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
