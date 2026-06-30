// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch role from profiles table ────────────────────────────────────
  const fetchRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[Botânica] Não foi possível carregar o perfil:', error.message);
      return 'paciente'; // safe default — least privilege
    }
    return data?.role ?? 'paciente';
  };

  // ── Sync session on mount and on auth state changes ───────────────────
  useEffect(() => {
    const syncSession = async (session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setRole(sessionUser ? await fetchRole(sessionUser.id) : null);
      setLoading(false);
    };

    supabase.auth.getSession()
      .then(({ data: { session } }) => syncSession(session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      syncSession(session)
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Email ou senha incorretos. Verifica os dados e tenta novamente.');
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    // Role is always set to 'paciente' by the handle_new_user trigger in schema.sql.
    // Promotion to tecnico/admin requires explicit admin action via Supabase dashboard.
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ── Role helpers ──────────────────────────────────────────────────────
  const isAdmin   = role === 'admin';
  const isTecnico = role === 'tecnico';
  const isPaciente = role === 'paciente';

  const value = {
    user,
    role,
    isAuthenticated: Boolean(user),
    isAdmin,
    isTecnico,
    isPaciente,
    loading,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
