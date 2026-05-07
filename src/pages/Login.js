// src/pages/Login.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@comunidadebotanica.ao' && password === 'admin123') {
      login('admin');
    } else if (email === 'tecnico@comunidadebotanica.ao' && password === 'tecnico123') {
      login('tecnico');
    } else {
      setError('Credenciais inválidas. Tente: admin@comunidadebotanica.ao / admin123');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#fbfbfb'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🌿 Comunidade Botânica Ispk</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Acesso ao Sistema</h2>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#b91c1c',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1e3a2f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#5a6e5a', textAlign: 'center' }}>
          <p>Demo:</p>
          <p><strong>Administrador:</strong> admin@comunidadebotanica.ao / admin123</p>
          <p><strong>Técnico de Campo:</strong> tecnico@comunidadebotanica.ao / tecnico123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;