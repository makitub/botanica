// src/pages/PlantasPorProvincia.jsx
import React, { useState, useEffect } from 'react';
import { getProvinceFromLatLng } from '../theme/theme';
import { theme } from '../theme/theme';

const PlantasPorProvincia = () => {
  const [province, setProvince] = useState('');
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState('');

  // Try to get user's GPS and reverse geocode province
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const prov = await getProvinceFromLatLng(pos.coords.latitude, pos.coords.longitude);
        setProvince(prov);
        // Fetch plants from Gemini based on province
        await fetchPlants(prov);
        setLoading(false);
      },
      (err) => {
        setError('Não foi possível obter a localização. Verifique as permissões.');
        setLoading(false);
      }
    );
  }, []);

  const fetchPlants = async (provincia) => {
    try {
      const res = await fetch('/api/gemini-province-plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ province: provincia, language: 'pt' })
      });
      const data = await res.json();
      if (data.error) {
        setError(`Erro ao buscar plantas: ${data.error}`);
      } else {
        setPlants(data.plants || []);
      }
    } catch (e) {
      setError('Falha na comunicação com o servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: theme.spacing.xl }}>
      <h1 style={{ fontFamily: theme.typography.fontDisplay, fontSize: theme.typography.sizes.h2 }}>
        🌍 Plantas da tua região
      </h1>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
        Descobre as ervas medicinais típicas da província onde te encontras.
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          <div style={{
            width: 40, height: 40, margin: '0 auto 1rem',
            border: '3px solid #D8E9D6', borderTopColor: theme.colors.deepForest,
            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <p>A detectar a tua província...</p>
        </div>
      )}

      {!loading && province && (
        <div style={{
          background: theme.colors.surfaceElevated,
          borderRadius: theme.radii.card,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          border: `1px solid ${theme.colors.border}`
        }}>
          <span style={{ fontSize: '2rem' }}>📍</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: theme.typography.sizes.bodyLarge }}>{province}</div>
            <div style={{ color: theme.colors.textSecondary }}>Província detectada automaticamente</div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#FFF3E0', padding: theme.spacing.md,
          borderRadius: theme.radii.soft, color: '#A64B2A', marginBottom: theme.spacing.lg
        }}>
          {error}
        </div>
      )}

      {plants.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {plants.map((plant, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: theme.radii.card,
              overflow: 'hidden',
              boxShadow: theme.colors.shadow,
              transition: theme.transitions.spring,
              border: '1px solid #E3DDD5'
            }}>
              <div style={{ background: theme.colors.deepForest, color: 'white', padding: '1rem' }}>
                <h3 style={{ margin: 0, fontFamily: theme.typography.fontDisplay }}>
                  {plant.popularName || 'Planta'}
                </h3>
                {plant.scientificName && <div style={{ fontSize: '0.8rem', opacity: 0.9, fontStyle: 'italic' }}>{plant.scientificName}</div>}
              </div>
              <div style={{ padding: '1rem' }}>
                <p><strong>Uso tradicional:</strong> {plant.usage}</p>
                <p><strong>Preparação:</strong> {plant.preparation}</p>
                {plant.contraindications && (
                  <p style={{ fontSize: '0.85rem', color: theme.colors.warmTerracotta }}>
                    ⚠️ {plant.contraindications}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && province && plants.length === 0 && !error && (
        <p style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
          Ainda não temos registos para esta província. Os técnicos de campo estão a trabalhar nisso!
        </p>
      )}
    </div>
  );
};

export default PlantasPorProvincia;