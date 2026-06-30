// src/components/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DEMO_ACCOUNTS } from '../../../constants';
import { isValidEmail, isNonEmpty } from '../../../utils/validators';
import Button from '../../ui/Button';
import TextField from '../../ui/TextField';
import styles from './LoginForm.module.css';

/**
 * Auth modal content. Toggles between "Entrar" and "Criar conta" without
 * leaving the modal — same pattern App.jsx already uses (one Modal,
 * swappable body), so no new route or disclosure state is introduced.
 *
 * Sign-up always provisions role='paciente' (see supabase/schema.sql,
 * handle_new_user trigger). Promotion to tecnico/admin is an explicit,
 * separate administrative action — the UI never lets a user pick their
 * own role. This is intentional: least-privilege by default.
 */
export default function LoginForm({ onSuccess }) {
  const { login, signUp, loginDemo, isDemoMode } = useAuth();
  const [mode, setMode] = useState('login'); // login | signup

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFeedback = () => {
    setError('');
    setInfo('');
  };

  const switchMode = (nextMode) => {
    resetFeedback();
    setPassword('');
    setConfirmPassword('');
    setMode(nextMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetFeedback();
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!isValidEmail(email)) {
      setError('Introduz um email válido.');
      return;
    }
    if (!isNonEmpty(password) || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      setInfo('Conta criada com sucesso como Paciente. Verifica o teu email para confirmar, depois entra abaixo.');
      setPassword('');
      setConfirmPassword('');
      setMode('login');
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

  const isSignUp = mode === 'signup';

  return (
    <div className={styles.wrap}>
      <div className={styles.brand}>
        <span>🌿</span>
        <div>
          <p className={styles.brandTitle}>Botânica</p>
          <p className={styles.brandSub}>Comunidade ISPK</p>
        </div>
      </div>

      {info && <p className={styles.info}>{info}</p>}

      {isSignUp ? (
        <form onSubmit={handleSignUp} noValidate className={styles.form}>
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <TextField
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            error={error}
          />
          <p className={styles.hint}>
            A conta é criada com acesso de <strong>Paciente</strong> (aberto e inclusivo). Acesso de Técnico de
            Campo ou Administrador é atribuído depois por um administrador existente.
          </p>
          <Button type="submit" fullWidth loading={loading}>Criar conta</Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} noValidate className={styles.form}>
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
      )}

      {!isDemoMode && (
        <button type="button" className={styles.switchLink} onClick={() => switchMode(isSignUp ? 'login' : 'signup')}>
          {isSignUp ? 'Já tens conta? Entrar' : 'Ainda não tens conta? Criar conta'}
        </button>
      )}

      {isDemoMode && !isSignUp && (
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
