// src/utils/geolocation.js
import { ANGOLA_PROVINCES } from '../constants';

/** Promisified wrapper around the browser geolocation API. */
export function getCurrentPosition(options = { timeout: 8000, maximumAge: 300000 }) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada por este navegador.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Reverse-geocodes coordinates to an Angolan province using the free
 * Nominatim (OpenStreetMap) API, falling back to "Desconhecida" on any
 * failure so a flaky network never blocks the feature it supports.
 */
export async function getProvinceFromLatLng(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=8&addressdetails=1&accept-language=pt`
    );
    const data = await res.json();
    const address = data.address || {};
    const candidate = address.state || address.province || address.region || '';
    const match = ANGOLA_PROVINCES.find((p) => candidate.toLowerCase().includes(p.toLowerCase()));
    return match || candidate || 'Desconhecida';
  } catch {
    return 'Desconhecida';
  }
}
