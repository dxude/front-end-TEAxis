// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter foi REMOVIDO daqui
import Navbar from './components/Navbar';     // Importa a Navbar
import Footer from './components/Footer';       // Importa o Footer
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import './App.css'; // Seu CSS do App

function App() {
  return (
    <> {/* Fragment para agrupar sem adicionar div extra */}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          {/* Outras rotas futuras aqui */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
