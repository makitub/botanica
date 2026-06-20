// src/components/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DEMO_ACCOUNTS } from '../../../constants';
import Button from '../../ui/Button';
import TextField from '../../ui/TextField';
import styles from './LoginForm.module.css';

export default function LoginForm({ onSuccess }) {
  const { login, loginDemo, isDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    loginDemo(role);
    onSuccess?.();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.brand}>
        <span>🌿</span>
        <div>
          <p className={styles.brandTitle}>Botânica</p>
          <p className={styles.brandSub}>Comunidade ISPK</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <TextField
          label="Email"
          type="email"
          placeholder="email@exemplo.ao"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <TextField
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          error={error}
        />
        <Button type="submit" fullWidth loading={loading}>Entrar</Button>
      </form>

      {isDemoMode && (
        <div className={styles.demo}>
          <p className={styles.demoLabel}>Modo demonstração — entra como:</p>
          <div className={styles.demoButtons}>
            {DEMO_ACCOUNTS.map((a) => (
              <button key={a.role} className={styles.demoBtn} onClick={() => handleDemoLogin(a.role)}>
                {a.role === 'admin' ? '🛡️' : a.role === 'tecnico' ? '🌾' : '🧑'}&nbsp;{a.role.charAt(0).toUpperCase() + a.role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
