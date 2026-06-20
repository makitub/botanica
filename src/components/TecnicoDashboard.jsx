import React from 'react';
import { Screen } from '../App';

export default function TecnicoDashboard({ onNavigate }) {
  const techStats = [
    { label: 'Plantas registadas', value: 180, icon: '🌿' },
    { label: 'Tratamentos', value: 320, icon: '📋' },
    { label: 'Províncias cobertas', value: 21, icon: '📍' },
  ];

  const techActions = [
    { id: 'register', label: 'Registar Saber', icon: '✎' },
    { id: 'media', label: 'Multimédia', icon: '📷' },
    { id: 'identify', label: 'Identificar Planta', icon: '🔍' },
  ];

  return (
    <Screen title="Painel do Técnico de Campo" subtitle="Registo e atualização de conhecimento tradicional">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {techStats.map((s) => (
          <div key={s.label} style={{ background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1a6b4a' }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontWeight: 700, marginBottom: 12 }}>Ações do técnico</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {techActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            style={{
              background: '#fff',
              border: '1px solid #a0c8b0',
              borderRadius: 14,
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 22 }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </Screen>
  );
}
