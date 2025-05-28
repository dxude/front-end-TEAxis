import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex">
      
      {/* Lado esquerdo com imagem ilustrativa */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <img 
          src="/img/illustration-login.svg" /*corrigir para imagem do prototipo*/
          alt="Ilustração de login" 
          className="max-w-md w-full"
        />
      </div>

      {/* Lado direito com formulário */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center">
        <div className="bg-blue-600 text-white max-w-sm w-full px-10 py-12 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Bem Vindo ao</h2>
          <h1 className="text-3xl font-extrabold mb-6">TEAXIS!</h1>

          <p className="text-sm mb-6">
            Você não tem uma conta ainda?{' '}
            <a href="#" className="underline text-white font-semibold">Cadastre-se</a>
          </p>

          <form>
            <div className="mb-4">
              <label className="block text-sm mb-1">Nome de usuário</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Manter-me conectado
              </label>
              <a href="#" className="underline">Esqueceu a sua senha?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-700 py-2 rounded font-bold text-white transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
