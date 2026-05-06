import React, { useState } from 'react';

// Base de dados local (simulação – pode depois ligar à API Gemini)
const plantasConhecidas = [
  { nome: "Neem", cientifico: "Azadirachta indica", sintomas: ["pele", "fungos", "sarna", "acne"], uso: "Antifúngico, antibacteriano" },
  { nome: "Hortelã-pimenta", cientifico: "Mentha piperita", sintomas: ["dor de cabeça", "náuseas", "indigestão"], uso: "Digestivo, analgésico leve" },
  { nome: "Camomila", cientifico: "Matricaria chamomilla", sintomas: ["ansiedade", "insônia", "cólica"], uso: "Calmante, anti-inflamatório" },
  { nome: "Boldo", cientifico: "Peumus boldus", sintomas: ["má digestão", "cólica hepática"], uso: "Estimulante hepático" },
  { nome: "Aloe vera", cientifico: "Aloe barbadensis", sintomas: ["queimadura", "pele", "feridas"], uso: "Cicatrizante, hidratante" }
];

const Consultas = () => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [pesquisou, setPesquisou] = useState(false);

  const handleSearch = () => {
    if (!termo.trim()) return;
    const lowerTermo = termo.toLowerCase();
    const encontrados = plantasConhecidas.filter(planta =>
      planta.nome.toLowerCase().includes(lowerTermo) ||
      planta.cientifico.toLowerCase().includes(lowerTermo) ||
      planta.sintomas.some(s => s.toLowerCase().includes(lowerTermo))
    );
    setResultados(encontrados);
    setPesquisou(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Pesquisa de Plantas / Tratamentos (RF07)</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Digite um nome de planta, doença ou sintoma para encontrar informações na base de conhecimento tradicional.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Ex: Neem, dor de cabeça, pele, insônia..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '40px',
            border: '1px solid var(--border)',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '12px 28px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Pesquisar
        </button>
      </div>

      {pesquisou && resultados.length === 0 && (
        <div style={{ background: '#fde8d8', padding: '1.5rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
          Nenhuma planta encontrada para "{termo}". Tente outro termo ou consulte um técnico de campo.
        </div>
      )}

      {resultados.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {resultados.map((planta, idx) => (
            <div key={idx} style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              overflow: 'hidden'
            }}>
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 1.5rem' }}>
                <h3 style={{ margin: 0 }}>🌿 {planta.nome}</h3>
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.8 }}>{planta.cientifico}</div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p><strong>Indicações (sintomas):</strong> {planta.sintomas.join(', ')}</p>
                <p><strong>Uso tradicional:</strong> {planta.uso}</p>
                <p><strong>Preparação recomendada:</strong> Infusão ou chá (consulte um especialista).</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(82,183,136,0.07)', borderRadius: 'var(--radius)', fontSize: '0.8rem', textAlign: 'center' }}>
        ⚠️ Base de dados simplificada para demonstração. A versão completa utilizará a base de conhecimento registada pelos técnicos de campo.
      </div>
    </div>
  );
};

export default Consultas;