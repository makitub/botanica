export const MENU = [
  {
    id: 'identificacao-planta',
    label: 'Identificar Planta',
    icon: '🌿',
    path: '/identificacao-planta',
    public: true,
    allowedRoles: ['admin', 'tecnico']  // no paciente
  },
  {
    id: 'consultas',
    label: 'Pesquisa de Plantas',
    icon: '🔍',
    path: '/consultas',
    public: true,
    allowedRoles: ['admin', 'tecnico']
  },
  {
    id: 'autodiagnostico',
    label: 'Autodiagnóstico',
    icon: '🩺',
    path: '/autodiagnostico',
    public: true,
    allowedRoles: ['admin', 'tecnico'],
    disclaimer: '⚠️ Não substitui consulta médica profissional.'
  },
  // --- Private pages (require login) ---
  {
    id: 'dashboard',
    label: 'Painel',
    icon: '📊',
    path: '/dashboard',
    public: false,
    allowedRoles: ['admin', 'tecnico']
  },
  {
    id: 'registro-tratamentos',
    label: 'Registo de Tratamentos',
    icon: '📝',
    path: '/registro-tratamentos',
    public: false,
    allowedRoles: ['admin', 'tecnico']
  },
  {
    id: 'captura-midia',
    label: 'Captura de Mídia',
    icon: '📸',
    path: '/captura-midia',
    public: false,
    allowedRoles: ['admin', 'tecnico']
  },
  {
    id: 'geolocalizacao',
    label: 'Geolocalização',
    icon: '📍',
    path: '/geolocalizacao',
    public: false,
    allowedRoles: ['admin', 'tecnico']
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: '📈',
    path: '/relatorios',
    public: false,
    allowedRoles: ['admin']
  },
  {
    id: 'gestao-utilizadores',
    label: 'Gestão de Utilizadores',
    icon: '👥',
    path: '/gestao-utilizadores',
    public: false,
    allowedRoles: ['admin']
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: '⚙️',
    path: '/configuracoes',
    public: false,
    allowedRoles: ['admin', 'tecnico']
  }
];

export const getPublicMenu = () => MENU.filter(item => item.public);
export const getPrivateMenuByRole = (role) => MENU.filter(item => !item.public && item.allowedRoles.includes(role));