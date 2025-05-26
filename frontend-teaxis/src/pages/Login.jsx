import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
// Futuramente, vamos importar o CSS aqui: import '../Styles/Login.css';

const Login = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}> {/* Estilo inline provisório */}
      <h1>Página de Login</h1>
      <p>
        Você não tem uma conta ainda?{' '}
        <Link to="/cadastro">Cadastre-se</Link> {/* Link para a página de Cadastro */}
      </p>
      {/* Aqui virá todo o design lindo que você me mostrou! */}
    </div>
  );
};

export default Login;