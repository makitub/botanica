// src/components/ui/Card.jsx
import React from 'react';
import styles from './Card.module.css';

export default function Card({ children, padding = 'md', interactive = false, as: Tag = 'div', className = '', ...rest }) {
  return (
    <Tag
      className={[styles.card, styles[`pad-${padding}`], interactive ? styles.interactive : '', className].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
