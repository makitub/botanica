// src/hooks/usePlantPhoto.js
import { useEffect, useState } from 'react';
import { fetchPlantImage } from '../services/aiService';

const cache = new Map();

/**
 * Loads a real photo for a plant by scientific name, once per session per
 * species (cached in memory — re-opening the same plant's detail view
 * later in the same visit costs no extra network call).
 */
export function usePlantPhoto(scientificName) {
  const [photo, setPhoto] = useState(cache.get(scientificName) ?? null);
  const [status, setStatus] = useState(cache.has(scientificName) ? 'done' : 'idle');

  useEffect(() => {
    if (!scientificName) return;
    if (cache.has(scientificName)) {
      setPhoto(cache.get(scientificName));
      setStatus('done');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    fetchPlantImage(scientificName)
      .then((data) => {
        if (cancelled) return;
        const result = data.imageUrl ? data : null;
        cache.set(scientificName, result);
        setPhoto(result);
        setStatus('done');
      })
      .catch(() => {
        if (cancelled) return;
        cache.set(scientificName, null);
        setPhoto(null);
        setStatus('done');
      });

    return () => { cancelled = true; };
  }, [scientificName]);

  return { photo, status }; // photo: { imageUrl, sourceUrl, attribution } | null
}
