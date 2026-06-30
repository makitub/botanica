// src/services/knowledgeService.js
import { supabase } from './supabaseClient';

/**
 * Persists a new "Registar Saber" submission as a pending row, awaiting
 * admin approval before it appears anywhere public.
 */
export async function submitKnowledge(form, userId) {
  const { error } = await supabase.from('knowledge_submissions').insert({
    plant_name:   form.plantName,
    kimbundu:     form.kimbundu    || null,
    province:     form.province,
    elder_name:   form.elderName,
    elder_age:    form.elderAge ? Number(form.elderAge) : null,
    use_case:     form.use,
    preparation:  form.preparation || null,
    notes:        form.notes       || null,
    submitted_by: userId           || null,
  });

  if (error) throw new Error('Não foi possível guardar o registo na base de dados.');
}

/**
 * Approved community contributions, shaped to slot directly alongside
 * the static TREATMENTS catalogue in the UI.
 */
export async function fetchApprovedKnowledge() {
  const { data, error } = await supabase
    .from('knowledge_submissions')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id:          `community-${row.id}`,
    name:        `${row.use_case} com ${row.plant_name}`,
    plant:       row.plant_name,
    elder:       row.elder_age ? `${row.elder_name}, ${row.elder_age} anos` : row.elder_name,
    region:      row.province,
    tags:        [row.use_case],
    isCommunity: true,
  }));
}

/** All pending submissions, for the admin moderation page. */
export async function fetchPendingKnowledge() {
  const { data, error } = await supabase
    .from('knowledge_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

/** Approve or reject a pending submission. Admin-only — enforced by RLS, not just the UI. */
export async function setKnowledgeStatus(id, status) {
  const { error } = await supabase
    .from('knowledge_submissions')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error('Não foi possível actualizar o estado do registo.');
}
