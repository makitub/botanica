import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getMenuByRole } from '../utils/permissions';

const Sidebar = ({ onLogout }) => {   // ← aceita a prop onLogout
  const { currentRole } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const menuItems = getMenuByRole(currentRole);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        🌿 Botânica Jornada Científica
      </div>
      <nav style={styles.nav}>
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {})
            })}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
            <span style={styles.rfBadge}>{item.rf}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botão de alternar idioma */}
      <button
        onClick={toggleLanguage}
        style={{
          background: 'transparent',
          border: '1px solid #cbd5e1',
          borderRadius: 30,
          padding: '6px 12px',
          margin: '0 1.5rem 1rem',
          fontSize: 12,
          cursor: 'pointer',
          color: '#e2e8f0'
        }}
      >
        {language === 'pt' ? 'Kimbundu' : 'Português'}
      </button>

      {/* Botão de logout */}
      <button
        onClick={onLogout}
        style={{
          background: 'transparent',
          border: '1px solid #cbd5e1',
          borderRadius: 30,
          padding: '6px 12px',
          margin: '0 1.5rem 0.5rem',
          fontSize: 12,
          cursor: 'pointer',
          color: '#e2e8f0',
          width: 'calc(100% - 3rem)'
        }}
      >
        🚪 Sair
      </button>

      <div style={styles.roleInfo}>
        Role atual: <strong>{currentRole}</strong>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto'
  },
  logo: {
    padding: '1.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderBottom: '1px solid #334155',
    marginBottom: '1rem'
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },
  activeLink: {
    backgroundColor: '#334155',
    color: 'white',
    borderLeft: '4px solid #10b981'
  },
  icon: {
    fontSize: '1.2rem',
    width: '1.5rem'
  },
  rfBadge: {
    marginLeft: 'auto',
    fontSize: '0.7rem',
    backgroundColor: '#0f172a',
    padding: '2px 6px',
    borderRadius: '12px'
  },
  roleInfo: {
    padding: '1rem',
    borderTop: '1px solid #334155',
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: 'auto'
  }
};

export default Sidebar;