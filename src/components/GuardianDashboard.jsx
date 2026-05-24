import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildProfileForm from './ChildProfileForm';
import { getChildrenProfiles, listenChildrenProfiles, deleteChildProfile, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const GuardianDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const guardianId = currentUser?.uid || null;
  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // não autenticado — redirecionar para login
        navigate('/login');
        return;
      }
      setCurrentUser(user);
    });

    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    let unsub;
    if (!guardianId) return;
    setLoading(true);
    try {
      unsub = listenChildrenProfiles(guardianId, (items) => {
        setChildren(items);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [guardianId]);

  const handleSaved = (child) => {
    // onSnapshot atualizará a lista; apenas fechar e limpar seleção
    setShowForm(false);
    setSelectedChild(null);
  };

  const handleEdit = (child) => {
    setSelectedChild(child);
    setShowForm(true);
  };

  const handleDelete = async (child) => {
    if (!window.confirm(`Apagar o perfil de ${child.name}? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteChildProfile(guardianId, child.id);
      // onSnapshot cuidará de remover da lista
    } catch (err) {
      alert('Erro ao apagar perfil: ' + err.message);
    }
  };

  return (
    <div className="guardian-dashboard p-4">
      <h2>Área do Responsável</h2>
      <p>Responsável: {currentUser?.displayName || currentUser?.email || 'Usuário'}</p>

      <div className="actions mt-4">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Adicionar Perfil de Menor</button>
      </div>

      {showForm && <ChildProfileForm guardianId={guardianId} child={selectedChild} onSaved={handleSaved} />}

      <div className="children-list mt-6">
        <h3>Perfis adicionados</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : children.length === 0 ? (
          <p>Nenhum perfil adicionado ainda.</p>
        ) : (
          <ul>
            {children.map(c => (
              <li key={c.id} className="child-item flex items-center justify-between">
                <span>{c.name} — {c.dob}</span>
                <span className="actions flex gap-2">
                  <button className="btn btn-secondary" onClick={() => handleEdit(c)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c)}>Apagar</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuardianDashboard;
