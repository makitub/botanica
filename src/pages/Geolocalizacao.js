import React, { useState } from 'react';

const Geolocalizacao = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date().toLocaleString()
        });
        setLoading(false);
      },
      (err) => {
        alert('Erro ao obter localização: ' + err.message);
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em' }}>📍 Geolocalização</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Registo automático de coordenadas</p>

      <button onClick={getLocation} style={{
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: 40,
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
        marginBottom: 24,
        transition: '0.2s'
      }} onMouseOver={e => e.currentTarget.style.opacity = 0.8}
         onMouseOut={e => e.currentTarget.style.opacity = 1}>
        {loading ? 'A obter localização...' : 'Registar GPS atual'}
      </button>

      {location && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: 24,
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)'
        }}>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lng}</p>
          <p><strong>Data/Hora:</strong> {location.timestamp}</p>
        </div>
      )}
    </div>
  );
};

export default Geolocalizacao;