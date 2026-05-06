import React, { useState } from 'react';

const IdentificacaoPlanta = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setImageBase64(base64);
      setPreviewUrl(ev.target.result);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

 const handleAnalyze = async () => {
  if (!imageBase64) return;
  setLoading(true);
  setError('');
  try {
    // Attempt real API call
    const res = await fetch('/api/gemini-plant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, imageMime })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setResult(data);
  } catch (err) {
    // Mock fallback for demonstration (remove when deployed)
    console.warn('API not available, using mock data');
    setResult({
      nome_popular: "Planta medicinal (demonstração)",
      nome_cientifico: "Plantae demonstratio",
      caracteristicas: "Esta é uma resposta simulada porque a API Gemini não está disponível no ambiente de desenvolvimento local sem o Vercel CLI.",
      usos_medicinais: "Use Vercel CLI (vercel dev) ou faça deploy para testar a integração real.",
      preparacao: "Infusão de 5g por xícara",
      dose_recomendada: "1 xícara, 2x ao dia",
      quem_pode_usar: ["Adultos", "Idosos"],
      contraindicacoes: ["Alergias conhecidas"]
    });
  } finally {
    setLoading(false);
  }
};
  const clearImage = () => {
    setImageBase64(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em' }}>🌿 Identificador de Plantas</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Envie uma foto da planta (folhas, flores ou frutos). O sistema usará IA para identificar e descrever usos medicinais.
      </p>

      {/* Upload area */}
      {!previewUrl && (
        <div
          style={{
            border: '2px dashed var(--primary-light)',
            borderRadius: 'var(--radius)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
            marginBottom: '1rem',
            transition: '0.2s'
          }}
          onClick={() => document.getElementById('plant-upload').click()}
        >
          <input
            type="file"
            id="plant-upload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📸</span>
          <strong>Clique ou arraste uma foto</strong>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
            Suporta JPG, PNG (até 5MB)
          </p>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div style={{ position: 'relative', marginBottom: '1rem', textAlign: 'center' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxHeight: '280px', maxWidth: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          />
          <button
            onClick={clearImage}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'white', border: '1px solid var(--border)',
              cursor: 'pointer', fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Analyze button */}
      {previewUrl && !result && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', backgroundColor: 'var(--primary)',
            color: 'white', border: 'none', borderRadius: '40px', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Analisando com Gemini...' : '🔍 Identificar planta'}
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto 1rem', border: '3px solid var(--green-pale)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <p>Processando imagem com IA...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fee', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', padding: '1rem', color: '#b91c1c', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && !result.erro && (
        <div style={{ marginTop: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 500, fontFamily: 'Georgia, serif' }}>
              {result.nome_popular || 'Planta identificada'}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, fontStyle: 'italic' }}>
              {result.nome_cientifico || ''}
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <Section label="Características" text={result.caracteristicas} />
            <Section label="Usos medicinais" text={result.usos_medicinais} />
            <Section label="Preparação" text={result.preparacao} />
            <Section label="Dose recomendada" text={result.dose_recomendada} />
            <Section label="Quem pode usar" tags={result.quem_pode_usar} type="ok" />
            <Section label="Contraindicações" tags={result.contraindicacoes} type="warn" />
          </div>
        </div>
      )}
      {result && result.erro && (
        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
          ⚠️ {result.erro}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(82,183,136,0.07)', borderRadius: 'var(--radius)', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        🌿 Informações educativas baseadas em conhecimento tradicional. Consulte um profissional de saúde.
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// Helper component for consistent sections
const Section = ({ label, text, tags, type }) => {
  if (tags && tags.length) {
    return (
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              background: type === 'ok' ? '#d8f3dc' : '#fde8d8',
              color: type === 'ok' ? '#1b4332' : '#7f3d1b',
              fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 500
            }}>{t}</span>
          ))}
        </div>
      </div>
    );
  }
  if (text && text !== '—') {
    return (
      <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{text}</p>
      </div>
    );
  }
  return null;
};

export default IdentificacaoPlanta;