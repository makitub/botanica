// src/services/emailService.js
import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

if (!isEmailConfigured) {
  console.warn(
    '[Botânica] EmailJS não está configurado (faltam REACT_APP_EMAILJS_SERVICE_ID, ' +
    'REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY). Os registos de saber ' +
    'não vão ser enviados por email.'
  );
}

/**
 * Sends a "new traditional knowledge registered" notification email.
 * Throws a friendly Error on failure — the caller decides how to show it,
 * we just make sure it never throws a raw EmailJS/network error at the UI.
 */
export async function sendRegistrationNotification(form) {
  if (!isEmailConfigured) {
    throw new Error('O envio de email não está configurado nesta instalação.');
  }

  const templateParams = {
    plant_name: form.plantName,
    kimbundu_name: form.kimbundu || '—',
    province: form.province,
    elder_name: form.elderName,
    elder_age: form.elderAge || '—',
    use: form.use,
    preparation: form.preparation || '—',
    notes: form.notes || '—',
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
  } catch {
    throw new Error('Não foi possível enviar a notificação por email. Verifica a tua ligação e tenta novamente.');
  }
}
