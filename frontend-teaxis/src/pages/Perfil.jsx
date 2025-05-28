import React from 'react';
import { FaUserCircle, FaCheckCircle, FaList, FaClock } from 'react-icons/fa';

export default function Perfil() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C1435] text-white flex flex-col p-4">
        <div className="flex items-center gap-2 mb-6">
          <FaUserCircle size={40} />
          <div>
            <p className="font-semibold">Joaninha do Ibura</p>
            <span className="text-sm bg-blue-500 px-2 py-0.5 rounded-full">Cadastrada desde 2025</span>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <div className="font-bold text-lg">Informações</div>
          <ul className="pl-2 text-sm space-y-2">
            <li className="hover:underline cursor-pointer">Editar Foto</li>
            <li className="hover:underline cursor-pointer">Nome e Endereço</li>
            <li className="hover:underline cursor-pointer">Editar outras informações</li>
            <li className="hover:underline cursor-pointer">Excluir Conta</li>
          </ul>

          <div className="font-bold text-lg mt-4">Tipos de neurodivergência</div>
          <ul className="pl-2 text-sm space-y-2">
            <li className="hover:underline cursor-pointer">Preferências sensoriais</li>
            <li className="hover:underline cursor-pointer">Hobbies</li>
          </ul>

          <button className="mt-auto text-left text-red-400 hover:text-red-300">Sair</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edital Perfil</h1>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Pesquisar" className="px-3 py-1 border rounded-md" />
            <div className="flex items-center gap-2">
              <FaUserCircle size={24} />
              <span className="text-sm">Joaninha do Ibura</span>
            </div>
          </div>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-2 gap-6">
          {/* Coluna da esquerda */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold text-lg mb-4">Progresso feito</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                <span>Acompanhou aqui</span>
              </li>
              <li className="flex items-center gap-2">
                <FaList className="text-blue-500" />
                <span>Lorem lorem</span>
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                <span>lorem lorem iputo</span>
              </li>
            </ul>
          </div>

          {/* Coluna da direita */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold text-lg mb-4">Loremmm Loremmm Ipsa</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-500" />
                  <div>
                    <p className="font-semibold">Lorem ihu</p>
                    <span className="text-xs text-green-500">Feito</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <div>
                    <p className="font-semibold">Lorem 2</p>
                    <span className="text-xs text-blue-500">Em progresso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
