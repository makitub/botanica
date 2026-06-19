// src/components/ui/Badge.jsx
import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children, tone = 'neutral', ...rest }) {
  return (
    <span className={[styles.badge, styles[tone]].join(' ')} {...rest}>
      {children}
    </span>
  );
}
