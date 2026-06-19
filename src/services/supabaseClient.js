// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Create React App only exposes env vars prefixed with REACT_APP_ to the
// browser bundle — `import.meta.env` is a Vite-only API and would silently
// break this build, so we read from `process.env` instead.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.warn(
    '[Botânica] Supabase não está configurado (faltam REACT_APP_SUPABASE_URL e ' +
    'REACT_APP_SUPABASE_ANON_KEY). A aplicação vai correr em modo de demonstração.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
