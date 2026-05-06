// Menu items mapped to your TCC use cases (UC) and functional requirements (RF)
export const MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/',
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF01',
    uc: 'UC01'
  },
  {
    id: 'registro-tratamentos',
    label: 'Registro de Tratamentos',
    icon: '📝',
    path: '/registro-tratamentos',
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF01',
    uc: 'UC01'
  },
  {
    id: 'captura-midia',
    label: 'Captura de Mídia (RF02)',
    icon: '📸',
    path: '/captura-midia',
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF02',
    uc: 'UC02'
  },
  {
    id: 'geolocalizacao',
    label: 'Geolocalização (RF06)',
    icon: '📍',
    path: '/geolocalizacao',
    allowedRoles: ['admin', 'tecnico'],
    rf: 'RF06',
    uc: 'UC03'
  },
  {
    id: 'autodiagnostico',
    label: 'Autodiagnóstico (RF04)',
    icon: '🩺',
    path: '/autodiagnostico',
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF04',
    uc: 'UC04',
    disclaimer: '⚠️ RD02: Esta ferramenta não substitui uma consulta médica profissional.'
  },
  {
    id: 'relatorios',
    label: 'Relatórios (RF08)',
    icon: '📈',
    path: '/relatorios',
    allowedRoles: ['admin'],
    rf: 'RF08',
    uc: 'UC05'
  },
  {
    id: 'gestao-utilizadores',
    label: 'Gestão de Utilizadores (RF07)',
    icon: '👥',
    path: '/gestao-utilizadores',
    allowedRoles: ['admin'],
    rf: 'RF07',
    uc: 'UC06'
  },
  {
  id: 'consultas',
  label: 'Pesquisa de Plantas (RF07)',
  icon: '🔍',
  path: '/consultas',
  allowedRoles: ['admin', 'tecnico', 'paciente'],
  rf: 'RF07',
  uc: 'UC03'
},
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: '⚙️',
    path: '/configuracoes',
    allowedRoles: ['admin', 'tecnico', 'paciente'],
    rf: 'RF10',
    uc: 'UC08'
  },
  {
  id: 'identificacao-planta',
  label: 'Identificador de Plantas',
  icon: '🌿',
  path: '/identificacao-planta',
  allowedRoles: ['admin', 'tecnico', 'paciente']
}
];

// Helper function to get items visible to a given role
export const getMenuByRole = (role) => {
  return MENU.filter(item => item.allowedRoles.includes(role));
};