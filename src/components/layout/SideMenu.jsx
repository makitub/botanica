// src/components/layout/SideMenu.jsx
import React from 'react';
import { MENU_ITEMS, MENU_GROUPS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import styles from './SideMenu.module.css';

export default function SideMenu({ open, activeId, onNavigate, onClose }) {
  const { isAuthenticated, role } = useAuth();

  // Filter items to what this user can see in the side menu
  const visible = MENU_ITEMS.filter((item) => {
    if (item.roles.length === 0) return true;
    if (!isAuthenticated) return false;
    return item.roles.includes(role);
  });

  // Group them for display
  const grouped = Object.keys(MENU_GROUPS).map((groupId) => ({
    groupId,
    groupLabel: MENU_GROUPS[groupId],
    items: visible.filter((i) => i.group === groupId),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={[styles.backdrop, open ? styles.backdropVisible : ''].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className={[styles.drawer, open ? styles.drawerOpen : ''].join(' ')}
        aria-label="Menu principal"
        aria-hidden={!open}
      >
        <div className={styles.drawerTop}>
          <div className={styles.brandRow}>
            <span className={styles.brandIcon}>🌿</span>
            <div>
              <p className={styles.brandName}>Botânica</p>
              <p className={styles.brandSub}>Comunidade ISPK</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar menu">✕</button>
        </div>

        <div className={styles.menuBody}>
          {grouped.map(({ groupId, groupLabel, items }) => (
            <div key={groupId} className={styles.group}>
              <p className={styles.groupLabel}>{groupLabel}</p>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={[styles.item, activeId === item.id ? styles.itemActive : ''].join(' ')}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  aria-current={activeId === item.id ? 'page' : undefined}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemLabel}>{item.label}</span>
                  {item.highlight && <span className={styles.highlight}>Novo</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.drawerFoot}>
          <p>Botânica v2.0 · ISPK · Angola</p>
        </div>
      </nav>
    </>
  );
}
