// src/components/AccessGuard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { theme } from '../theme/theme';

const AccessGuard = ({ children, requiredRoles, publicAccess = false }) => {
  const { isAuthenticated, currentRole } = useAuth();
  const location = useLocation();

  // Public page? Just render it.
  if (publicAccess) return children;

  // Private page but not logged in -> redirect to login with intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role -> show denied message with style
  if (requiredRoles && !requiredRoles.includes(currentRole)) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
        padding: theme.spacing.xl, color: theme.colors.textSecondary
      }}>
        <h2 style={{ color: theme.colors.warmTerracotta, fontSize: theme.typography.sizes.h2 }}>⛔ Acesso Reservado</h2>
        <p style={{ maxWidth: 400, marginTop: theme.spacing.md }}>
          Esta área é exclusiva para profissionais autorizados. O seu perfil atual  
          (<strong>{currentRole}</strong>) não permite esta visualização.
        </p>
        <a href="/" style={{ color: theme.colors.deepForest, marginTop: theme.spacing.xl }}>
          Voltar ao início
        </a>
      </div>
    );
  }

  return children;
};

export default AccessGuard;