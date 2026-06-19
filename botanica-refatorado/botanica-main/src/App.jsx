// src/App.jsx
// ────────────────────────────────────────────────────────────────────────
// Single orchestrator. Responsibilities:
//   1. Provide global contexts (auth, language, accessibility)
//   2. Hold the single activeId navigation state
//   3. Guard pages that require auth or a specific role
//   4. Render the app shell (Header + SideMenu + page content + BottomNav)
//
// Page components live in src/pages/ — they know nothing about navigation.
// UI primitives live in src/components/ui/.
// Layout pieces live in src/components/layout/.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Layout
import Header from './components/layout/Header';
import SideMenu from './components/layout/SideMenu';
import BottomNav from './components/layout/BottomNav';

// Shared UI
import Modal from './components/ui/Modal';
import LoginForm from './components/features/auth/LoginForm';
import Spinner from './components/ui/Spinner';

// Pages
import HomePage from './pages/HomePage';
import DiagnosePage from './pages/DiagnosePage';
import PlantsPage from './pages/PlantsPage';
import IdentifyPage from './pages/IdentifyPage';
import TreatmentsPage from './pages/TreatmentsPage';
import RegisterPage from './pages/RegisterPage';
import MediaPage from './pages/MediaPage';
import GeoPage from './pages/GeoPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

// Navigation constants
import { MENU_ITEMS } from './constants';
import { useDisclosure } from './hooks/useDisclosure';

// Styles
import './styles/theme.css';

// ── Page registry ───────────────────────────────────────────────────────
const PAGE_MAP = {
  home: HomePage,
  diagnose: DiagnosePage,
  plants: PlantsPage,
  identify: IdentifyPage,
  treatments: TreatmentsPage,
  register: RegisterPage,
  media: MediaPage,
  geo: GeoPage,
  reports: ReportsPage,
  users: UsersPage,
  settings: SettingsPage,
};

// ── Root layout ─────────────────────────────────────────────────────────
function BotanicaApp() {
  const { isAuthenticated, role, loading } = useAuth();
  const [activeId, setActiveId] = useState('home');
  const sideMenu = useDisclosure();
  const loginModal = useDisclosure();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spinner label="A carregar Botânica…" size={40} />
      </div>
    );
  }

  /**
   * Permission-aware navigation. When a visitor tries to enter a private
   * page we show the login modal instead of a blank screen — they can
   * complete the flow and land exactly where they intended.
   */
  const navigate = (id) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    if (!item) return;

    if (item.requiresAuth && !isAuthenticated) {
      loginModal.open();
      return;
    }
    if (item.roles.length > 0 && (!role || !item.roles.includes(role))) {
      // Silently ignore — the menu never shows restricted items for this role anyway.
      return;
    }
    setActiveId(id);
    sideMenu.close();
  };

  // Render the active page, falling back to Home if something went wrong.
  const PageComponent = PAGE_MAP[activeId] || HomePage;

  return (
    <>
      {/* Login modal */}
      <Modal open={loginModal.isOpen} onClose={loginModal.close} title="Entrar na Botânica">
        <LoginForm onSuccess={loginModal.close} />
      </Modal>

      {/* App shell — "the object held in your hand" */}
      <div
        style={{
          width: '100%',
          maxWidth: 'var(--app-max-width)',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg)',
          boxShadow: '0 0 60px rgba(28,17,10,0.08)',
          position: 'relative',
        }}
      >
        <SideMenu
          open={sideMenu.isOpen}
          activeId={activeId}
          onNavigate={navigate}
          onClose={sideMenu.close}
        />

        <Header onMenuClick={sideMenu.toggle} onLoginClick={loginModal.open} />

        <main
          style={{
            flex: 1,
            padding: 'var(--space-5) var(--space-4) 110px',
            overflowY: 'auto',
          }}
        >
          <PageComponent onNavigate={navigate} />
        </main>

        <BottomNav activeId={activeId} onNavigate={navigate} />
      </div>
    </>
  );
}

// ── Entry point ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <AuthProvider>
          <BotanicaApp />
        </AuthProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
}
