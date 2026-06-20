// src/components/ui/TextField.jsx
import React, { useId } from 'react';
import styles from './TextField.module.css';

export default function TextField({ label, error, as = 'input', rows = 4, ...rest }) {
  const id = useId();
  const Tag = as;
  return (
    <div className={styles.wrap}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <Tag
        id={id}
        rows={as === 'textarea' ? rows : undefined}
        className={[styles.field, error ? styles.fieldError : ''].join(' ')}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
