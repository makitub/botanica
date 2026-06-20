// src/components/layout/Header.jsx
import React from 'react';
import { ROLES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

export default function Header({ onMenuClick, onLoginClick, onHelpClick }) {
  const { isAuthenticated, role, user, logout } = useAuth();
  const roleInfo = role ? ROLES[role] : null;

  return (
    <header className={styles.header}>
      <button className={styles.iconButton} onClick={onMenuClick} aria-label="Abrir menu">
        ☰
      </button>

      <span className={styles.brand}>🌿 Botânica</span>

      <div className={styles.right}>
        <button className={[styles.iconButton, styles.helpButton].join(' ')} onClick={onHelpClick} aria-label="Ajuda — como usar a Botânica" title="Ajuda">
          ?
        </button>

        {isAuthenticated ? (
          <div className={styles.session}>
            <span className={styles.avatar} style={{ background: roleInfo?.accent }} title={user?.email}>
              {roleInfo?.initial}
            </span>
            <button className={styles.iconButton} onClick={logout} aria-label="Terminar sessão" title="Terminar sessão">
              ⏻
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={onLoginClick}>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
