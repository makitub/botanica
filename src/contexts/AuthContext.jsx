// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { DEMO_ACCOUNTS } from '../constants';

const AuthContext = createContext(null);
const DEMO_SESSION_KEY = 'botanica.demoSession';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Real Supabase auth ────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: restore a previously chosen demo identity, if any.
      try {
        const saved = JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY) || 'null');
        if (saved) {
          setUser(saved);
          setRole(saved.role);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    const fetchRole = async (userId) => {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (error) {
        console.warn('[Botânica] Não foi possível carregar o perfil:', error.message);
        return 'paciente';
      }
      return data?.role || 'paciente';
    };

    const syncSession = async (session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setRole(sessionUser ? await fetchRole(sessionUser.id) : null);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => syncSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => syncSession(session));
    return () => listener?.subscription.unsubscribe();
  }, []);

  // ── Demo mode actions ────────────────────────────────────────────────
  const loginDemo = (chosenRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === chosenRole);
    const demoUser = { id: `demo-${chosenRole}`, email: account?.email, role: chosenRole, isDemo: true };
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setRole(chosenRole);
  };

  // ── Shared actions ──────────────────────────────────────────────────
  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      const account = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
      if (!account) throw new Error('Credenciais inválidas. Experimenta uma das contas de demonstração abaixo.');
      loginDemo(account.role);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Email ou senha incorretos.');
  };

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('O registo de novas contas só está disponível quando o Supabase está configurado.');
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      setUser(null);
      setRole(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const value = {
    user,
    role,
    isAuthenticated: Boolean(user),
    loading,
    isDemoMode: !isSupabaseConfigured,
    login,
    signUp,
    logout,
    loginDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
