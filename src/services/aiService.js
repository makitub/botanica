// src/services/aiService.js
// ────────────────────────────────────────────────────────────────────────
// One place that knows how to talk to our /api serverless functions.
// Pages never call `fetch` directly — they call these functions and get
// back plain data or a thrown Error with a friendly, user-facing message.
// ────────────────────────────────────────────────────────────────────────

async function postJSON(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Sem ligação à internet. Verifica a tua rede e tenta novamente.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. a gateway error page) — fall through.
  }

  if (!res.ok) {
    throw new Error(data?.error || `Erro inesperado (${res.status}). Tenta novamente.`);
  }
  return data;
}

/**
 * Sends the full conversation so far to Ndembo, our virtual healer, and
 * gets back his next reply. Ndembo embeds a structured recommendation as a
 * ```json fenced block once he has enough information — see parseTriage.
 */
export function chatWithNdembo(messages, province) {
  return postJSON('/api/chatbot', { messages, province });
}

/** Identifies a plant from a base64-encoded photo. */
export function identifyPlant(imageBase64, imageMime) {
  return postJSON('/api/identify-plant', { imageBase64, imageMime });
}

/** Looks up a real photo for a plant on Wikipedia, by scientific name — far more reliable than searching by common name. */
export function fetchPlantImage(scientificName) {
  return postJSON('/api/plant-image', { scientificName });
}

/**
 * Ndembo's structured recommendation arrives embedded in a chat reply as a
 * fenced ```json block. This extracts and parses it, returning null if the
 * reply is still conversational (he hasn't reached a recommendation yet).
 */
export function parseTriage(replyText) {
  const match = replyText.match(/```json\s*([\s\S]*?)```/);
  const raw = match ? match[1] : replyText;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const data = JSON.parse(raw.slice(start, end + 1));
    if (data && data.triage && Array.isArray(data.remedies)) return data;
    return null;
  } catch {
    return null;
  }
}

/** Strips the JSON block out of a reply so the chat bubble only shows Ndembo's words. */
export function stripTriageBlock(replyText) {
  return replyText.replace(/```json\s*[\s\S]*?```/, '').trim();
}
