// src/components/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { isValidEmail, isNonEmpty } from '../../../utils/validators';
import Button from '../../ui/Button';
import TextField from '../../ui/TextField';
import styles from './LoginForm.module.css';

/**
 * Auth modal — toggles between Login and Criar Conta.
 *
 * Sign-up always provisions role='paciente' (handle_new_user trigger).
 * Promotion to tecnico/admin is an explicit, separate administrative action.
 * The UI intentionally never exposes role selection — least-privilege by design.
 */
export default function LoginForm({ onSuccess }) {
  const { login, signUp } = useAuth();

  const [mode, setMode]           = useState('login'); // 'login' | 'signup'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');
  const [loading, setLoading]     = useState(false);

  const clearFeedback = () => { setError(''); setInfo(''); };

  const switchMode = (next) => {
    clearFeedback();
    setPassword('');
    setConfirm('');
    setMode(next);
  };

  // ── Login ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (!isValidEmail(email)) { setError('Introduz um email válido.'); return; }
    if (!isNonEmpty(password)) { setError('Introduz a senha.'); return; }
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

  // ── Sign-up ───────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (!isValidEmail(email))               { setError('Introduz um email válido.'); return; }
    if (!isNonEmpty(password) || password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm)               { setError('As senhas não coincidem.'); return; }

    setLoading(true);
    try {
      await signUp(email, password);
      setInfo('Conta criada! Verifica o teu email para confirmar o registo e depois entra abaixo.');
      setPassword('');
      setConfirm('');
      setMode('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = mode === 'signup';

  return (
    <div className={styles.wrap}>

      {/* Brand */}
      <div className={styles.brand}>
        <span>🌿</span>
        <div>
          <p className={styles.brandTitle}>Botânica ISPK</p>
          <p className={styles.brandSub}>Comunidade Botânica</p>
        </div>
      </div>

      {/* Feedback */}
      {info  && <p className={styles.info}>{info}</p>}

      {/* Form */}
      {isSignUp ? (
        <form onSubmit={handleSignUp} noValidate className={styles.form}>
          <TextField label="Email" type="email" placeholder="email@exemplo.ao"
            value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required />
          <TextField label="Senha" type="password" placeholder="Mínimo 6 caracteres"
            value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" required />
          <TextField label="Confirmar senha" type="password" placeholder="••••••••"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password" required error={error} />
          <p className={styles.hint}>
            A conta é criada com acesso de <strong>Paciente</strong>.
            O acesso de Técnico de Campo ou Administrador é atribuído por um administrador existente.
          </p>
          <Button type="submit" fullWidth loading={loading}>Criar conta</Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} noValidate className={styles.form}>
          <TextField label="Email" type="email" placeholder="email@exemplo.ao"
            value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required />
          <TextField label="Senha" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" required error={error} />
          <Button type="submit" fullWidth loading={loading}>Entrar</Button>
        </form>
      )}

      {/* Mode switch */}
      <button type="button" className={styles.switchLink}
        onClick={() => switchMode(isSignUp ? 'login' : 'signup')}>
        {isSignUp ? 'Já tens conta? Entrar' : 'Ainda não tens conta? Criar conta'}
      </button>

    </div>
  );
}
