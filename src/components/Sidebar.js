// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPrivateMenuByRole } from '../utils/permissions';
import { theme } from '../theme/theme';

const Sidebar = () => {
  const { currentRole } = useAuth();
  const menuItems = getPrivateMenuByRole(currentRole);

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1E293B',
      color: '#E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: '64px', // below public header
      overflowY: 'auto',
      borderRight: '1px solid #334155'
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #334155',
        fontWeight: 600
      }}>
        Área de Trabalho
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
          {currentRole === 'admin' ? 'Administrador' : currentRole === 'tecnico' ? 'Técnico de campo' : 'Paciente'}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              color: isActive ? 'white' : '#CBD5E1',
              textDecoration: 'none',
              backgroundColor: isActive ? '#334155' : 'transparent',
              borderLeft: isActive ? `4px solid ${theme.colors.leafGreen}` : '4px solid transparent',
              transition: theme.transitions.ease
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: '#0F172A', padding: '2px 6px', borderRadius: '12px' }}>
              {item.rf}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;