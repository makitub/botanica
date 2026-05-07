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
      width: '260px', backgroundColor: '#1E293B', color: '#E2E8F0',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: '64px', overflowY: 'auto',
      borderRight: '1px solid #334155'
    }}>
      <div style={{
        padding: '1.5rem', borderBottom: '1px solid #334155', fontWeight: 600
      }}>
        Comunidade Botânica Ispk
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
          {currentRole === 'admin' ? 'Administrador' : 'Técnico de campo'}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
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
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;