// src/components/LoginForm.jsx
import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email === 'admin@comunidadebotanica.ao' && password === 'admin123') {
      onLogin('admin');
    } else if (email === 'tecnico@comunidadebotanica.ao' && password === 'tecnico123') {
      onLogin('tecnico');
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6b54' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px 14px', marginTop: 4, marginBottom: 12,
            borderRadius: 10, border: '1.5px solid #d4e0d8', fontSize: 13,
            fontFamily: 'Georgia, serif', outline: 'none'
          }}
          placeholder="admin@comunidadebotanica.ao"
        />
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6b54' }}>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px 14px', marginTop: 4, marginBottom: 12,
            borderRadius: 10, border: '1.5px solid #d4e0d8', fontSize: 13,
            fontFamily: 'Georgia, serif', outline: 'none'
          }}
          placeholder="••••••••"
        />
        {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: '100%', padding: '13px', background: '#1a9a60', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Georgia, serif'
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}