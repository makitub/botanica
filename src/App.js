import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Sidebar';
import AccessGuard from './components/AccessGuard';
import Login from './pages/Login';

// Import pages
import Dashboard from './pages/Dashboard';
import RegistroTratamentos from './pages/RegistroTratamentos';
import CapturaMidia from './pages/CapturaMidia';
import Geolocalizacao from './pages/Geolocalizacao';
import Autodiagnostico from './pages/Autodiagnostico';
import Relatorios from './pages/Relatorios';
import GestaoUtilizadores from './pages/GestaoUtilizadores';
import Consultas from './pages/Consultas';
import Configuracoes from './pages/Configuracoes';
import IdentificacaoPlanta from './pages/IdentificacaoPlanta';

const routeConfig = {
  '/': { component: Dashboard, roles: ['admin', 'tecnico', 'paciente'] },
  '/registro-tratamentos': { component: RegistroTratamentos, roles: ['admin', 'tecnico'] },
  '/captura-midia': { component: CapturaMidia, roles: ['admin', 'tecnico'] },
  '/geolocalizacao': { component: Geolocalizacao, roles: ['admin', 'tecnico'] },
  '/autodiagnostico': { component: Autodiagnostico, roles: ['admin', 'tecnico', 'paciente'] },
  '/relatorios': { component: Relatorios, roles: ['admin'] },
  '/gestao-utilizadores': { component: GestaoUtilizadores, roles: ['admin'] },
  '/consultas': { component: Consultas, roles: ['admin', 'tecnico', 'paciente'] },
  '/identificacao-planta': { component: IdentificacaoPlanta, roles: ['admin', 'tecnico', 'paciente'] },
  '/configuracoes': { component: Configuracoes, roles: ['admin', 'tecnico', 'paciente'] }
};

const AppContent = () => {
  const { isAuthenticated, currentRole, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={logout} />
      <main style={{ marginLeft: '260px', padding: '1.5rem', flex: 1 }}>
        <Routes>
          {Object.entries(routeConfig).map(([path, { component: Component, roles }]) => (
            <Route
              key={path}
              path={path}
              element={
                <AccessGuard requiredRoles={roles}>
                  <Component />
                </AccessGuard>
              }
            />
          ))}
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;