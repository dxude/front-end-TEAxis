import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChildProfileForm from './ChildProfileForm';
import { getChildrenProfiles, listenChildrenProfiles, deleteChildProfile, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const GuardianDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewMode = searchParams.get('preview') === 'responsavel';
  const [currentUser, setCurrentUser] = useState(null);
  const guardianId = currentUser?.uid || null;
  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (previewMode) {
      setCurrentUser({
        uid: 'preview-guardian-id',
        displayName: 'Responsável Preview',
        email: 'responsavel.preview@teaxis.test'
      });
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // não autenticado — redirecionar para login
        navigate('/login');
        return;
      }
      setCurrentUser(user);
    });

    return () => unsub();
  }, [navigate, previewMode]);

  useEffect(() => {
    if (previewMode) {
      setChildren([
        {
          id: 'preview-child-1',
          name: 'Mariana Silva',
          dob: '2013-06-15',
          sex: 'Feminino',
          conditions: ['TDAH'],
          allergies: ['Amendoim'],
          notes: 'Prefere atividades curtas e visuais.',
          consent: {
            givenBy: 'preview-guardian-id',
            givenAt: new Date().toISOString(),
            termsVersion: 'v1'
          }
        },
        {
          id: 'preview-child-2',
          name: 'Gustavo Pereira',
          dob: '2011-09-20',
          sex: 'Masculino',
          conditions: ['Autismo'],
          allergies: [],
          notes: 'Gosta de jogos de tabuleiro e rotinas estruturadas.',
          consent: {
            givenBy: 'preview-guardian-id',
            givenAt: new Date().toISOString(),
            termsVersion: 'v1'
          }
        }
      ]);
      setLoading(false);
      return;
    }

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
  }, [guardianId, previewMode]);

  const handleSaved = (child) => {
    if (previewMode) {
      setChildren((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === child.id);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = child;
          return next;
        }
        return [...prev, child];
      });
    }
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
      {previewMode && (
        <p style={{ color: '#7b3ff2', fontWeight: 600 }}>Modo preview ativo — você está vendo a área do responsável sem autenticação real.</p>
      )}
      <p>Responsável: {currentUser?.displayName || currentUser?.email || 'Usuário'}</p>

      <div className="actions mt-4">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Adicionar Perfil de Menor</button>
      </div>

      {showForm && <ChildProfileForm guardianId={guardianId} child={selectedChild} onSaved={handleSaved} previewMode={previewMode} />}

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
