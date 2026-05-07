// src/components/AppNavigator.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
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
import PlantasPorProvincia from '../pages/PlantasPorProvincia'; // NEW: province-specific page

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show public header on login page
  const hidePublicNav = location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Public top bar (visible for everyone except login) */}
      {!hidePublicNav && <PublicHeader />}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar only when authenticated */}
        {isAuthenticated && <Sidebar />}

        <main style={{
          flex: 1,
          padding: '1.5rem',
          marginLeft: isAuthenticated ? '260px' : 0,
          transition: 'margin-left 0.3s ease',
          background: '#fbfbfb'
        }}>
          <Routes>
            {/* Public routes (no login required) */}
            <Route path="/identificacao-planta" element={
              <AccessGuard publicAccess>
                <IdentificacaoPlanta />
              </AccessGuard>
            } />
            <Route path="/consultas" element={
              <AccessGuard publicAccess>
                <Consultas />
              </AccessGuard>
            } />
            <Route path="/autodiagnostico" element={
              <AccessGuard publicAccess>
                <Autodiagnostico />
              </AccessGuard>
            } />
            {/* NEW: province-aware public page */}
            <Route path="/plantas-da-regiao" element={
              <AccessGuard publicAccess>
                <PlantasPorProvincia />
              </AccessGuard>
            } />

            {/* Private routes (require login) */}
            <Route path="/dashboard" element={
              <AccessGuard requiredRoles={['admin','tecnico','paciente']}>
                <Dashboard />
              </AccessGuard>
            } />
            <Route path="/registro-tratamentos" element={
              <AccessGuard requiredRoles={['admin','tecnico']}>
                <RegistroTratamentos />
              </AccessGuard>
            } />
            <Route path="/captura-midia" element={
              <AccessGuard requiredRoles={['admin','tecnico']}>
                <CapturaMidia />
              </AccessGuard>
            } />
            <Route path="/geolocalizacao" element={
              <AccessGuard requiredRoles={['admin','tecnico']}>
                <Geolocalizacao />
              </AccessGuard>
            } />
            <Route path="/relatorios" element={
              <AccessGuard requiredRoles={['admin']}>
                <Relatorios />
              </AccessGuard>
            } />
            <Route path="/gestao-utilizadores" element={
              <AccessGuard requiredRoles={['admin']}>
                <GestaoUtilizadores />
              </AccessGuard>
            } />
            <Route path="/configuracoes" element={
              <AccessGuard requiredRoles={['admin','tecnico','paciente']}>
                <Configuracoes />
              </AccessGuard>
            } />

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/identificacao-planta" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppNavigator;