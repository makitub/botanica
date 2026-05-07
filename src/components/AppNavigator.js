import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from './AccessGuard';
import PublicHeader from './PublicHeader';
import Sidebar from './Sidebar';
import Login from '../pages/Login';

// Pages
import Dashboard from '../pages/Dashboard';
import RegistroTratamentos from '../pages/RegistroTratamentos';
import CapturaMidia from '../pages/CapturaMidia';
import Geolocalizacao from '../pages/Geolocalizacao';
import Autodiagnostico from '../pages/Autodiagnostico';
import Relatorios from '../pages/Relatorios';
import GestaoUtilizadores from '../pages/GestaoUtilizadores';
import Consultas from '../pages/Consultas';
import Configuracoes from '../pages/Configuracoes';
import IdentificacaoPlanta from '../pages/IdentificacaoPlanta';

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hidePublicNav = location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hidePublicNav && <PublicHeader />}
      <div style={{ display: 'flex', flex: 1 }}>
        {isAuthenticated && <Sidebar />}
        <main style={{
          flex: 1, padding: '1.5rem',
          marginLeft: isAuthenticated ? '260px' : 0,
          transition: 'margin-left 0.3s ease',
          background: '#fbfbfb'
        }}>
          <Routes>
            {/* Public routes */}
            <Route path="/identificacao-planta" element={<AccessGuard publicAccess><IdentificacaoPlanta /></AccessGuard>} />
            <Route path="/consultas" element={<AccessGuard publicAccess><Consultas /></AccessGuard>} />
            <Route path="/autodiagnostico" element={<AccessGuard publicAccess><Autodiagnostico /></AccessGuard>} />

            {/* Private routes */}
            <Route path="/dashboard" element={<AccessGuard requiredRoles={['admin','tecnico']}><Dashboard /></AccessGuard>} />
            <Route path="/registro-tratamentos" element={<AccessGuard requiredRoles={['admin','tecnico']}><RegistroTratamentos /></AccessGuard>} />
            <Route path="/captura-midia" element={<AccessGuard requiredRoles={['admin','tecnico']}><CapturaMidia /></AccessGuard>} />
            <Route path="/geolocalizacao" element={<AccessGuard requiredRoles={['admin','tecnico']}><Geolocalizacao /></AccessGuard>} />
            <Route path="/relatorios" element={<AccessGuard requiredRoles={['admin']}><Relatorios /></AccessGuard>} />
            <Route path="/gestao-utilizadores" element={<AccessGuard requiredRoles={['admin']}><GestaoUtilizadores /></AccessGuard>} />
            <Route path="/configuracoes" element={<AccessGuard requiredRoles={['admin','tecnico']}><Configuracoes /></AccessGuard>} />

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/identificacao-planta" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppNavigator;