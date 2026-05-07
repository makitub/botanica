// src/utils/permissions.js
export const MENU = [
  {
    id: 'identificacao-planta',
    label: 'Identificar Planta',
    icon: '🌿',
    path: '/identificacao-planta',
    public: true,
    allowedRoles: ['admin', 'tecnico', 'paciente'], // shown to all, even unauthenticated
    rf: 'RF03',
    uc: 'UC02'
  },
  {
    id: 'consultas',
    label: 'Pesquisa de Plantas',
    icon: '🔍',
    path: '/consultas',
    public: true,
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF07',
    uc: 'UC03'
  },
  {
    id: 'autodiagnostico',
    label: 'Autodiagnóstico',
    icon: '🩺',
    path: '/autodiagnostico',
    public: true,
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF04',
    uc: 'UC04',
    disclaimer: '⚠️ Não substitui consulta médica.'
  },
  // --- Private pages (require login) ---
  {
    id: 'dashboard',
    label: 'Painel',
    icon: '📊',
    path: '/dashboard',
    public: false,
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF01',
    uc: 'UC01'
  },
  {
    id: 'registro-tratamentos',
    label: 'Registo de Tratamentos',
    icon: '📝',
    path: '/registro-tratamentos',
    public: false,
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF01',
    uc: 'UC01'
  },
  {
    id: 'captura-midia',
    label: 'Captura de Mídia',
    icon: '📸',
    path: '/captura-midia',
    public: false,
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF02',
    uc: 'UC02'
  },
  {
    id: 'geolocalizacao',
    label: 'Geolocalização',
    icon: '📍',
    path: '/geolocalizacao',
    public: false,
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF06',
    uc: 'UC03'
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: '📈',
    path: '/relatorios',
    public: false,
    allowedRoles: ['admin'],
    rf: 'RF08',
    uc: 'UC05'
  },
  {
    id: 'gestao-utilizadores',
    label: 'Gestão de Utilizadores',
    icon: '👥',
    path: '/gestao-utilizadores',
    public: false,
    allowedRoles: ['admin'],
    rf: 'RF07',
    uc: 'UC06'
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: '⚙️',
    path: '/configuracoes',
    public: false,
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF10',
    uc: 'UC08'
  }
];

export const getPublicMenu = () => MENU.filter(item => item.public);
export const getPrivateMenuByRole = (role) => MENU.filter(item => !item.public && item.allowedRoles.includes(role));