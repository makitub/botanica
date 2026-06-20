// src/components/layout/BottomNav.jsx
import React from 'react';
import { MENU_ITEMS, BOTTOM_NAV_IDS } from '../../constants';
import styles from './BottomNav.module.css';

export default function BottomNav({ activeId, onNavigate }) {
  const items = BOTTOM_NAV_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)).filter(Boolean);

  return (
    <nav className={styles.bar} aria-label="Navegação principal">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            className={[styles.tab, isActive ? styles.tabActive : ''].join(' ')}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            {isActive && <span className={styles.dot} aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}
