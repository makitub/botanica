// src/theme/theme.js
export const theme = {
  colors: {
    // Angolan landscape
    earthBlack: '#1C110A',
    deepForest: '#1B3A2D',
    leafGreen: '#3A7352',
    paleLeaf: '#D8E9D6',
    acaciaGold: '#C69C6D',
    warmTerracotta: '#A44C3C',
    skyWhite: '#FBF9F6',
    softCloud: '#F0EBE3',
    mutedClay: '#B7A89B',

    // Semantic
    urgencyRed: '#B53A2E',
    warningAmber: '#E09E3A',
    safeTeal: '#2F855A',

    // UI
    surface: '#FFFFFF',
    surfaceElevated: '#F5F3EF',
    textPrimary: '#1C110A',
    textSecondary: '#5F5B56',
    border: '#E3DDD5',
    shadow: '0 4px 20px rgba(28, 17, 10, 0.06)',
    shadowStrong: '0 10px 32px rgba(28, 17, 10, 0.12)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
    fontDisplay: "'Playfair Display', Georgia, serif",
    sizes: {
      caption: '0.75rem',
      body: '0.9375rem',
      bodyLarge: '1.0625rem',
      h3: '1.25rem',
      h2: '1.75rem',
      h1: '2.5rem',
      hero: '3.5rem',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  radii: {
    soft: '12px',
    pill: '2rem',
    card: '20px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  transitions: {
    ease: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Province names for Angola
export const ANGOLA_PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
  'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
  'Namibe', 'Uíge', 'Zaire'
];

export const getProvinceFromLatLng = async (lat, lng) => {
  // Reverse geocode using free Nominatim (OpenStreetMap) – for production replace with a proper API.
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=8&addressdetails=1&accept-language=pt`
    );
    const data = await res.json();
    const address = data.address;
    // Nominatim returns state/province in different fields depending on country
    const province = address.state || address.province || address.region || '';
    // Cross-check with our list
    const match = ANGOLA_PROVINCES.find(p => 
      province.toLowerCase().includes(p.toLowerCase())
    );
    return match || province || 'Desconhecida';
  } catch {
    return 'Desconhecida';
  }
};