import React, { useState, useEffect } from 'react';
import { createChildProfile, updateChildProfile } from '../firebase';
import ConsentModal from './ConsentModal';

const ChildProfileForm = ({ guardianId, onSaved, child }) => {
  const [form, setForm] = useState({ name: '', dob: '', sex: '', conditions: '', allergies: '', notes: '' });
  const [showConsent, setShowConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (child) {
      setForm({
        name: child.name || '',
        dob: child.dob || '',
        sex: child.sex || '',
        conditions: Array.isArray(child.conditions) ? child.conditions.join(', ') : (child.conditions || ''),
        allergies: Array.isArray(child.allergies) ? child.allergies.join(', ') : (child.allergies || ''),
        notes: child.notes || ''
      });
    }
  }, [child]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConsent(true);
  };

  const handleConsentAgree = async () => {
    setShowConsent(false);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        dob: form.dob,
        sex: form.sex,
        conditions: form.conditions ? form.conditions.split(',').map(s => s.trim()) : [],
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [],
        notes: form.notes || '',
        consent: child && child.consent ? child.consent : {
          givenBy: guardianId,
          givenAt: new Date().toISOString(),
          termsVersion: 'v1'
        }
      };

      let res;
      if (child && child.id) {
        res = await updateChildProfile(guardianId, child.id, payload);
      } else {
        res = await createChildProfile(guardianId, payload);
      }
      setSaving(false);
      if (onSaved) onSaved(res);
    } catch (err) {
      setSaving(false);
      alert('Erro ao salvar perfil: ' + err.message);
    }
  };

  return (
    <div className="child-profile-form p-4 border rounded">
      <h3>{child && child.id ? 'Editar Perfil do Menor' : 'Adicionar Perfil do Menor'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nome completo</label>
          <input name="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Data de nascimento</label>
          <input name="dob" type="date" required value={form.dob} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Género</label>
          <input name="sex" value={form.sex} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Condições (separadas por vírgula)</label>
          <input name="conditions" value={form.conditions} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Alergias (separadas por vírgula)</label>
          <input name="allergies" value={form.allergies} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Observações</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" />
        </div>
        <div className="form-actions mt-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'A gravar...' : 'Salvar Perfil'}</button>
        </div>
      </form>

      {showConsent && (
        <ConsentModal onAgree={handleConsentAgree} onCancel={() => setShowConsent(false)} />
      )}
    </div>
  );
};

export default ChildProfileForm;
