// src/components/ui/Disclaimer.jsx
import React from 'react';
import styles from './Disclaimer.module.css';

export default function Disclaimer({ children }) {
  return (
    <div className={styles.banner} role="note">
      <span aria-hidden="true">⚠️</span>
      <p>{children || 'Esta informação é educativa e não substitui uma consulta médica profissional.'}</p>
    </div>
  );
}
