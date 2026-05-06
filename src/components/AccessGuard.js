import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AccessGuard = ({ children, requiredRoles }) => {
  const { currentRole } = useAuth();

  if (!requiredRoles.includes(currentRole)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⛔ Acesso negado</h2>
        <p>Você não tem permissão para acessar esta área.</p>
        <p>Seu papel: <strong>{currentRole}</strong></p>
      </div>
    );
  }

  return children;
};

export default AccessGuard;