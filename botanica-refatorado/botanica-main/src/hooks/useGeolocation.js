// src/hooks/useGeolocation.js
import { useCallback, useState } from 'react';
import { getCurrentPosition, getProvinceFromLatLng } from '../utils/geolocation';

/**
 * Resolves the user's coordinates and Angolan province on demand.
 * Never throws — geolocation is a nice-to-have enhancement, not a
 * requirement, so failures resolve to a calm "Desconhecida" state instead
 * of breaking whatever feature asked for the location.
 */
export function useGeolocation() {
  const [province, setProvince] = useState(null);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | locating | done | denied

  const locate = useCallback(async () => {
    setStatus('locating');
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
      const prov = await getProvinceFromLatLng(latitude, longitude);
      setProvince(prov);
      setStatus('done');
      return prov;
    } catch {
      setProvince('Desconhecida');
      setStatus('denied');
      return 'Desconhecida';
    }
  }, []);

  return { province, coords, status, locate };
}
