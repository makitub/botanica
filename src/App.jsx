// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import { MENU, getPublicMenu, getPrivateMenuByRole } from './utils/permissions';

// Páginas (substitua pelos imports reais dos seus componentes)
import IdentifyScreen from './pages/IdentifyScreen';
import PlantsScreen from './pages/PlantsScreen';
import DiagnoseScreen from './pages/DiagnoseScreen';
import AdminDashboard from './components/AdminDashboard';
import TecnicoDashboard from './components/TecnicoDashboard';
import RegisterScreen from './pages/RegisterScreen';
import MediaScreen from './pages/MediaScreen';
import GeoLocationScreen from './pages/GeoLocationScreen';
import ReportsScreen from './pages/ReportsScreen';
import UsersScreen from './pages/UsersScreen';
import SettingsScreen from './pages/SettingsScreen';

// Componente de ecrã partilhado (se ainda não existir, crie um ficheiro separado)
import Screen from './components/Screen';

// Estilos globais (já existentes no index.css, mas mantemos para consistência)
import './index.css';

// ─────────────────────────────────────────────────────────────
// COMPONENTES AUXILIARES (Header, SideMenu, BottomNav, LoginModal)
// ─────────────────────────────────────────────────────────────

function Header({ isAuthenticated, role, onLogout, onLoginClick, onToggleSideMenu }) {
  const roleLabel = role === 'admin' ? 'Admin' : role === 'tecnico' ? 'Técnico' : '';

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 18px',
      background: '#c8e4d4',
      borderBottom: '1px solid #8ebfaa',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <button
        onClick={onToggleSideMenu}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          color: '#1a6b4a',
        }}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1a12', fontFamily: 'Lora, Georgia, serif' }}>
          🌿 Botanica
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a6b4a' }}>
              {roleLabel}
            </span>
            <button
              onClick={onLogout}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                color: '#c0392b',
              }}
              title="Sair"
            >
              🚪
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            style={{
              padding: '6px 16px',
              background: '#1a9a60',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

function SideMenu({ open, onClose, groups, activeId, onNavigate }) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 40,
        }}
        onClick={onClose}
      />
      {/* Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: '#fff',
          zIndex: 50,
          padding: '20px 0',
          boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #e8ede9' }}>
          <h2 style={{ fontFamily: 'Lora, serif', color: '#1a6b4a' }}>🌿 Botanica</h2>
          <p style={{ fontSize: 12, color: '#6b7c6e' }}>Comunidade Ispk</p>
        </div>

        {groups.map((group, idx) => (
          <div key={idx} style={{ marginTop: 16 }}>
            <p style={{
              padding: '0 20px',
              fontSize: 10,
              fontWeight: 700,
              color: '#9aa89c',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}>
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    background: isActive ? '#e6f7ee' : 'transparent',
                    borderLeft: isActive ? '3px solid #1a9a60' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 20, color: isActive ? '#0f8b4a' : '#6b5d4f' }}>
                    {item.icon}
                  </span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0f8b4a' : '#2a2a1d',
                  }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e8ede9',
          fontSize: 11,
          color: '#b0bab2',
          textAlign: 'center',
          marginTop: 20,
        }}>
          Botanica v1.0 · ISPK
        </div>
      </div>
    </>
  );
}

function BottomNav({ items, activeId, onNavigate }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(220,245,232,0.97)',
      backdropFilter: 'blur(12px)',
      borderTop: '1.5px solid #a0d8b8',
      display: 'grid',
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      padding: '8px 0 10px',
      zIndex: 20,
    }}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <span style={{
              fontSize: 24,
              color: isActive ? '#0f8b4a' : '#8b7d6b',
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#0f8b4a' : '#6b5d4f',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LoginModal({ onClose }) {
  const { login, signUp } = useAuth();

  const handleLogin = async (email, password) => {
    await login(email, password);
    onClose();
  };

  const handleSignUp = async (email, password) => {
    await signUp(email, password);
    alert('Conta criada! Faça login.');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '24px',
          maxWidth: 400,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} onCancel={onClose} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP PRINCIPAL
// ─────────────────────────────────────────────────────────────

function App() {
  const { isAuthenticated, role, logout, loading: authLoading } = useAuth();
  const [activeId, setActiveId] = useState('identificacao-planta');
  const [showLogin, setShowLogin] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  // Se ainda estiver a carregar a autenticação, mostra um indicador
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#edf8f2',
      }}>
        <p style={{ fontFamily: 'Lora, serif', color: '#1a6b4a' }}>A carregar...</p>
      </div>
    );
  }

  // Obter itens do menu com base no papel e autenticação
  const publicItems = getPublicMenu();
  const privateItems = isAuthenticated ? getPrivateMenuByRole(role) : [];
  const allMenuItems = [...publicItems, ...privateItems];

  // Agrupar para o menu lateral
  const menuGroups = [
    { label: 'Público', items: publicItems },
    ...(isAuthenticated && privateItems.length > 0
      ? [{ label: 'Privado', items: privateItems }]
      : []),
  ];

  // Itens para a bottom nav (apenas os principais)
  const bottomNavItems = allMenuItems.filter(item =>
    ['identificacao-planta', 'consultas', 'autodiagnostico', 'dashboard', 'configuracoes'].includes(item.id)
  );

  // Navegação
  const navigate = (id) => {
    const item = MENU.find(m => m.id === id);
    if (!item) return;

    // Se for privado e não autenticado, pede login
    if (!item.public && !isAuthenticated) {
      setShowLogin(true);
      return;
    }

    // Se for privado e o papel não estiver autorizado
    if (!item.public && !item.allowedRoles.includes(role)) {
      alert('Não tem permissão para aceder a esta página.');
      return;
    }

    setActiveId(id);
    setSideOpen(false);
  };

  // Renderizar a página correta
  const renderPage = () => {
    // Se a página activa for privada e o utilizador não tiver permissão,
    // redireciona para a primeira página pública
    const currentItem = MENU.find(m => m.id === activeId);
    if (currentItem && !currentItem.public && (!isAuthenticated || !currentItem.allowedRoles.includes(role))) {
      setActiveId('identificacao-planta');
      return <IdentifyScreen />;
    }

    switch (activeId) {
      case 'identificacao-planta': return <IdentifyScreen />;
      case 'consultas': return <PlantsScreen />;
      case 'autodiagnostico': return <DiagnoseScreen />;
      case 'dashboard':
        if (role === 'admin') return <AdminDashboard />;
        if (role === 'tecnico') return <TecnicoDashboard />;
        // Se não houver papel (visitante) mas chegou aqui, redireciona
        setActiveId('identificacao-planta');
        return <IdentifyScreen />;
      case 'registro-tratamentos': return <RegisterScreen />;
      case 'captura-midia': return <MediaScreen />;
      case 'geolocalizacao': return <GeoLocationScreen />;
      case 'relatorios': return <ReportsScreen />;
      case 'gestao-utilizadores': return <UsersScreen />;
      case 'configuracoes': return <SettingsScreen />;
      default: return <IdentifyScreen />;
    }
  };

  return (
    <>
      {/* Modal de login */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Estrutura da aplicação */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        background: '#edf8f2',
        minHeight: '100vh',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(26,154,96,0.30), 0 0 0 4px rgba(26,154,96,0.12)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Menu lateral */}
        <SideMenu
          open={sideOpen}
          onClose={() => setSideOpen(false)}
          groups={menuGroups}
          activeId={activeId}
          onNavigate={navigate}
        />

        {/* Cabeçalho */}
        <Header
          isAuthenticated={isAuthenticated}
          role={role}
          onLogout={() => {
            logout();
            setActiveId('identificacao-planta');
          }}
          onLoginClick={() => setShowLogin(true)}
          onToggleSideMenu={() => setSideOpen(!sideOpen)}
        />

        {/* Conteúdo principal */}
        <div style={{
          flex: 1,
          padding: '20px 16px 90px',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          background: '#edf8f2',
        }}>
          {renderPage()}
        </div>

        {/* Navegação inferior */}
        <BottomNav
          items={bottomNavItems}
          activeId={activeId}
          onNavigate={navigate}
        />
      </div>
    </>
  );
}

export default App;
