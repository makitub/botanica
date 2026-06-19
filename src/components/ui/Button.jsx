// src/components/ui/Button.jsx
import React from 'react';
import styles from './Button.module.css';

/**
 * The one button in the app. Every screen reuses this instead of styling
 * its own — that's what makes every tap feel like part of the same product.
 */
export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md', // sm | md | lg
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : ''].join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.dimmed : undefined}>{children}</span>
    </button>
  );
}
