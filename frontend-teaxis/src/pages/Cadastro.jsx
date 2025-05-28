import React from 'react';

export default function Cadastro() {
  return (
    <div className="min-h-screen flex font-sans">8

    {/*lembrar de adicionar nossas imagens em assets depois*/}
      
      {/* Lado Esquerdo: Ilustração e logo */}
      <div className="w-1/2 bg-gradient-to-br from-purple-100 to-pink-200 flex flex-col justify-center items-center p-8">
        <img 
          src="/img/logo-teaxis.svg" 
          alt="Logo TEAXIS" 
          className="w-40 mb-8"
        />
        <img 
          src="/img/illustration-cadastro.svg" 
          alt="Ilustração de cadastro" 
          className="w-80"
        />
      </div>

      {/* Lado Direito: Formulário */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-10 py-8">
          <h1 className="text-2xl font-bold text-purple-700 mb-2">Crie a sua conta</h1>
          <p className="text-sm text-purple-400 mb-6">
            Já tem uma conta? <a href="#" className="underline">Entre aqui</a>
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Por favor, insira o seu nome
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Por favor, insira o seu email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Aqui você cria sua senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Repita a confirmação da senha criada
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition"
            >
              CADASTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
