// src/hooks/usePlantPhoto.js
import { useEffect, useState } from 'react';

const cache = new Map();

/**
 * Wikipedia's REST API allows direct cross-origin requests from the
 * browser, so we call it straight from here — no need to round-trip
 * through our own serverless function first. That removes a full network
 * hop and a possible cold-start delay on every plant detail open.
 */
async function fetchWikipediaPhoto(scientificName) {
  const title = encodeURIComponent(scientificName.trim().replace(/ /g, '_'));
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
  if (!res.ok) return null;
  const data = await res.json();
  const imageUrl = data.originalimage?.source || data.thumbnail?.source || null;
  const sourceUrl = data.content_urls?.desktop?.page || null;
  return imageUrl ? { imageUrl, sourceUrl } : null;
}

/**
 * Loads a real photo for a plant by scientific name, once per session per
 * species (cached in memory). Crucially, `photo` is reset to null the
 * moment `scientificName` changes — otherwise, since the detail view
 * doesn't unmount between plants, the previous plant's image would stay
 * on screen for the whole duration of the new fetch.
 */
export function usePlantPhoto(scientificName) {
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!scientificName) {
      setPhoto(null);
      setStatus('idle');
      return;
    }

    if (cache.has(scientificName)) {
      setPhoto(cache.get(scientificName));
      setStatus('done');
      return;
    }

    let cancelled = false;
    setPhoto(null); // clear the previous plant's photo immediately, don't wait for the fetch
    setStatus('loading');

    fetchWikipediaPhoto(scientificName)
      .then((result) => {
        if (cancelled) return;
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

  return { photo, status }; // photo: { imageUrl, sourceUrl } | null
}
