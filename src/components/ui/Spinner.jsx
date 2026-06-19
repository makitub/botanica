// src/components/ui/Spinner.jsx
import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ label = 'A carregar…', size = 32 }) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.circle} style={{ width: size, height: size }} aria-hidden="true" />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}
