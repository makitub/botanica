// src/components/ui/EmptyState.jsx
import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '🌱', title, text, action }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      {title && <h3 className={styles.title}>{title}</h3>}
      {text && <p className={styles.text}>{text}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
