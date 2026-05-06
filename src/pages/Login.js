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
    
    // Simulação de login (substituir por chamada real à API mais tarde)
    if (email === 'admin@botanica.com' && password === 'admin123') {
      login('admin');
    } else if (email === 'tecnico@botanica.com' && password === 'tecnico123') {
      login('tecnico');
    } else if (email === 'paciente@botanica.com' && password === 'paciente123') {
      login('paciente');
    } else {
      setError('Credenciais inválidas. Tente: admin@botanica.com / admin123');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--background)'
    }}>
      <div style={{
        background: 'var(--surface)',
        padding: '2rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🌿 Botânica</h1>
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
                border: '1px solid var(--border)',
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
                border: '1px solid var(--border)',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--primary)',
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

        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <p>Demo:</p>
          <p><strong>Administrador:</strong> admin@botanica.com / admin123</p>
          <p><strong>Técnico de Campo:</strong> tecnico@botanica.com / tecnico123</p>
          <p><strong>Paciente:</strong> paciente@botanica.com / paciente123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;