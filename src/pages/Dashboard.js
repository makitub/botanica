import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentRole } = useAuth();
  return (
    <div>
      <h1>📊 Dashboard</h1>
      <p>RF01 / UC01 – Visão geral do sistema</p>
      <p>Bem-vindo, papel: <strong>{currentRole}</strong></p>
    </div>
  );
};

export default Dashboard;