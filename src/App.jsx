// src/App.jsx – versão unificada com navegação baseada em permissions.js
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import { jsPDF } from 'jspdf';
import { supabase } from './supabaseClient';
import { MENU, getPublicMenu, getPrivateMenuByRole } from './utils/permissions';

// ─────────────────────────────────────────────────────────────
// TODOS OS SEUS COMPONENTES INTERNOS (copiados do seu App.jsx)
// ─────────────────────────────────────────────────────────────
// NOTA: mantenha aqui os seus componentes exactamente como estão.
// Apenas substitui a função BotanicaUI e a lógica de navegação.
// ─────────────────────────────────────────────────────────────

// Exemplo: coloque aqui o seu componente Screen, PlantCard, Tag,
// Disclaimer, SpeakButton, DiagnoseScreen, IdentifyScreen,
// PlantsScreen, TreatmentsScreen, RegisterScreen, ReportsScreen,
// UsersScreen, SettingsScreen, HelpBot, PlantRemedyCard, etc.
// TODOS eles permanecem inalterados.

// Vou incluir uma versão resumida para não repetir 1000 linhas,
// mas no seu ficheiro final deve colocar todos os componentes
// que já existem.

// ─────────────────────────────────────────────────────────────
// NOVOS COMPONENTES AUXILIARES (Header, SideMenu, BottomNav)
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
      <button onClick={onToggleSideMenu} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>☰</button>
      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Lora, serif' }}>🌿 Botanica</span>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: 8 }}>{roleLabel}</span>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>🚪</button>
          </>
        ) : (
          <button onClick={onLoginClick} style={{ padding: '6px 16px', background: '#1a9a60', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
        )}
      </div>
    </header>
  );
}

function SideMenu({ open, onClose, groups, activeId, onNavigate }) {
  if (!open) return null;
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: '#fff', zIndex: 50,
        padding: '20px 0', boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #e8ede9' }}>
          <h2 style={{ fontFamily: 'Lora, serif', color: '#1a6b4a' }}>🌿 Botanica</h2>
          <p style={{ fontSize: 12, color: '#6b7c6e' }}>Comunidade Ispk</p>
        </div>
        {groups.map((group, idx) => (
          <div key={idx} style={{ marginTop: 16 }}>
            <p style={{ padding: '0 20px', fontSize: 10, fontWeight: 700, color: '#9aa89c', textTransform: 'uppercase' }}>{group.label}</p>
            {group.items.map(item => (
              <div key={item.id} onClick={() => { onNavigate(item.id); onClose(); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
                cursor: 'pointer', background: activeId === item.id ? '#e6f7ee' : 'transparent',
                borderLeft: activeId === item.id ? '3px solid #1a9a60' : '3px solid transparent'
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontWeight: activeId === item.id ? 600 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e8ede9', fontSize: 11, textAlign: 'center', color: '#b0bab2' }}>Botanica v1.0 · ISPK</div>
      </div>
    </>
  );
}

function BottomNav({ items, activeId, onNavigate }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(220,245,232,0.97)', backdropFilter: 'blur(12px)',
      borderTop: '1.5px solid #a0d8b8',
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      padding: '8px 0 10px', zIndex: 20
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
        }}>
          <span style={{ fontSize: 24, color: activeId === item.id ? '#0f8b4a' : '#8b7d6b' }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: activeId === item.id ? 700 : 500, color: activeId === item.id ? '#0f8b4a' : '#6b5d4f' }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function LoginModal({ onClose }) {
  const { login, signUp } = useAuth();
  const handleLogin = async (email, pwd) => { await login(email, pwd); onClose(); };
  const handleSignUp = async (email, pwd) => { await signUp(email, pwd); alert('Conta criada!'); onClose(); };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 24, maxWidth: 400, width: '90%' }} onClick={e => e.stopPropagation()}>
        <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} onCancel={onClose} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP PRINCIPAL
// ─────────────────────────────────────────────────────────────

function BotanicaApp() {
  const { isAuthenticated, role, logout, loading: authLoading } = useAuth();
  const [activeId, setActiveId] = useState('identificacao-planta');
  const [showLogin, setShowLogin] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#edf8f2' }}>A carregar...</div>;

  const publicItems = getPublicMenu();
  const privateItems = isAuthenticated ? getPrivateMenuByRole(role) : [];
  const allMenuItems = [...publicItems, ...privateItems];
  const menuGroups = [
    { label: 'Público', items: publicItems },
    ...(isAuthenticated && privateItems.length > 0 ? [{ label: 'Privado', items: privateItems }] : [])
  ];
  const bottomNavItems = allMenuItems.filter(item =>
    ['identificacao-planta', 'consultas', 'autodiagnostico', 'dashboard', 'configuracoes'].includes(item.id)
  );

  const navigate = (id) => {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    if (!item.public && !isAuthenticated) { setShowLogin(true); return; }
    if (!item.public && !item.allowedRoles.includes(role)) { alert('Sem permissão.'); return; }
    setActiveId(id);
    setSideOpen(false);
  };

  // A sua função de renderização de páginas – aqui mantenha os nomes dos seus componentes
  const renderPage = () => {
    const currentItem = MENU.find(m => m.id === activeId);
    if (currentItem && !currentItem.public && (!isAuthenticated || !currentItem.allowedRoles.includes(role))) {
      setActiveId('identificacao-planta');
      return <IdentifyScreen />; // substitua pelo nome real do seu componente
    }
    switch (activeId) {
      case 'identificacao-planta': return <IdentifyScreen />;
      case 'consultas': return <PlantsScreen />;
      case 'autodiagnostico': return <DiagnoseScreen />;
      case 'dashboard': return role === 'admin' ? <AdminDashboard /> : <TecnicoDashboard />;
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
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#edf8f2', minHeight: '100vh', borderRadius: 24, overflow: 'hidden', position: 'relative', boxShadow: '0 20px 60px rgba(26,154,96,0.30)', display: 'flex', flexDirection: 'column' }}>
        <SideMenu open={sideOpen} onClose={() => setSideOpen(false)} groups={menuGroups} activeId={activeId} onNavigate={navigate} />
        <Header isAuthenticated={isAuthenticated} role={role} onLogout={() => { logout(); setActiveId('identificacao-planta'); }} onLoginClick={() => setShowLogin(true)} onToggleSideMenu={() => setSideOpen(!sideOpen)} />
        <div style={{ flex: 1, padding: '20px 16px 90px', overflowY: 'auto', background: '#edf8f2' }}>
          {renderPage()}
        </div>
        <BottomNav items={bottomNavItems} activeId={activeId} onNavigate={navigate} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BotanicaApp />
    </AuthProvider>
  );
}
