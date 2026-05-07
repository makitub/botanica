import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublicMenu } from '../utils/permissions';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const PublicHeader = () => {
  const { isAuthenticated, logout } = useAuth();
  const publicItems = getPublicMenu();
  const location = useLocation();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 2rem', background: theme.colors.surface,
      borderBottom: `1px solid ${theme.colors.border}`,
      boxShadow: theme.colors.shadow,
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.6rem' }}>🌿</span>
        <span style={{
          fontFamily: theme.typography.fontDisplay,
          fontWeight: 600,
          fontSize: '1.25rem',
          color: theme.colors.deepForest
        }}>
          Comunidade Botânica Ispk
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {publicItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: location.pathname === item.path ? theme.colors.warmTerracotta : theme.colors.textPrimary,
              fontWeight: location.pathname === item.path ? 600 : 400,
              fontSize: '0.95rem',
              transition: theme.transitions.ease,
              borderBottom: location.pathname === item.path ? `2px solid ${theme.colors.acaciaGold}` : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        {isAuthenticated ? (
          <button onClick={logout} style={{
            background: 'transparent',
            border: `1px solid ${theme.colors.mutedClay}`,
            padding: '0.4rem 1rem', borderRadius: theme.radii.pill,
            cursor: 'pointer', color: theme.colors.textSecondary
          }}>🚪 Sair</button>
        ) : (
          <Link to="/login" style={{
            color: theme.colors.deepForest, textDecoration: 'none', fontWeight: 500
          }}>Entrar</Link>
        )}
      </nav>
    </header>
  );
};

export default PublicHeader;