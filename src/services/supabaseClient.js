// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[Botânica] Variáveis de ambiente em falta: ' +
    'REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY são obrigatórias. ' +
    'Configura-as no Vercel (Settings → Environment Variables) ou em .env.local para desenvolvimento local.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
