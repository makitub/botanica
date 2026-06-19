// src/components/layout/PageShell.jsx
import React from 'react';
import styles from './PageShell.module.css';

export default function PageShell({ icon, title, subtitle, actions, children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.head}>
        <div className={styles.headText}>
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
