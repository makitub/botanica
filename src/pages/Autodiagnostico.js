import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Autodiagnostico = () => {
  const { language } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini-autodiagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, language })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 500 }}>🩺 Autodiagnóstico com IA</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Descreva os seus sintomas (RF04 / UC04)</p>
      <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: 14 }}>
        ⚠️ <strong>RD02:</strong> Esta ferramenta não substitui uma consulta médica. Em caso de emergência, vá ao hospital.
      </div>

      <textarea rows={4} value={symptoms} onChange={e => setSymptoms(e.target.value)}
        placeholder="Ex: dor de cabeça forte, febre baixa, cansaço..."
        style={{ width: '100%', padding: 16, borderRadius: 24, border: '1px solid var(--border)', fontSize: 16, marginBottom: 16 }}
      />
      <button onClick={handleSubmit} disabled={loading} style={{
        backgroundColor: 'var(--primary)',
        color: 'white', border: 'none', padding: '12px 24px', borderRadius: 40, fontSize: '1rem', fontWeight: 500, cursor: 'pointer', marginBottom: 24
      }}>{loading ? 'Analisando...' : 'Pesquisar remédios naturais'}</button>

      {error && <div style={{ background: '#ffe0e0', padding: 12, borderRadius: 16, color: '#b00020' }}>{error}</div>}

      {result && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          {result.triage === 'red' && (
            <div style={{ background: '#e63946', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
              🚨 URGÊNCIA: {result.urgentMessage || 'Procure atendimento hospitalar imediatamente!'}
            </div>
          )}
          {result.triage === 'yellow' && (
            <div style={{ background: '#f4a261', color: 'white', padding: '1rem', textAlign: 'center' }}>
              ⚠️ Atenção: {result.urgentMessage || 'Consulte um profissional se os sintomas piorarem.'}
            </div>
          )}
          <div style={{ padding: 24 }}>
            {result.remedies?.map((r, idx) => (
              <div key={idx} style={{ marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 500 }}>🌿 {r.plantName}</h3>
                <p><strong>Preparo:</strong> {r.preparation}</p>
                <p><strong>Dose:</strong> {r.dosage}</p>
                <p><strong>Cuidados:</strong> {r.precautions}</p>
              </div>
            ))}
            {(!result.remedies || result.remedies.length === 0) && <p>Nenhum remédio natural encontrado. Consulte um médico.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autodiagnostico;