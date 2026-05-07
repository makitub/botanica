import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentRole } = useAuth();
  return (
    <div>
      <h1>📊 Painel</h1>
      <p>Visão geral do sistema.</p>
      <p>Bem‑vindo, perfil: <strong>{currentRole}</strong></p>
    </div>
  );
};

export default Dashboard;