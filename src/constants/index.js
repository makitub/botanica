// src/constants/index.js
// ────────────────────────────────────────────────────────────────────────
// Centralised, read-only application data. This is the ONE place that
// defines roles, navigation, and the plant/treatment catalogue — nothing
// else in the app should hard-code a menu item, a role colour, or a plant.
// ────────────────────────────────────────────────────────────────────────

export const ROLES = {
  admin: {
    id: 'admin',
    label: 'Administrador',
    labelK: 'Nkuluntu',
    color: '#0d5c3a',
    bg: '#e6f4ee',
    accent: '#1a9a60',
    initial: 'A',
  },
  tecnico: {
    id: 'tecnico',
    label: 'Técnico de Campo',
    labelK: 'Mukanda wa Nsi',
    color: '#7c4a1e',
    bg: '#f5ede3',
    accent: '#c87941',
    initial: 'T',
  },
  paciente: {
    id: 'paciente',
    label: 'Paciente',
    labelK: 'Muntu wa Buanga',
    color: '#1a4a7c',
    bg: '#e3eef5',
    accent: '#3a82c4',
    initial: 'P',
  },
};

// `roles: []` means visible to everyone, logged in or not.
// `requiresAuth: true` means a visitor is asked to log in before entering.
export const MENU_ITEMS = [
  { id: 'home', path: '/', label: 'Início', labelK: 'Yibu', icon: '⌂', roles: [], requiresAuth: false, group: 'main' },
  { id: 'diagnose', path: '/diagnose', label: 'Autodiagnóstico', labelK: 'Diangula Mwini', icon: '♡', roles: [], requiresAuth: false, group: 'main', highlight: true },
  { id: 'plants', path: '/plants', label: 'Plantas Medicinais', labelK: 'Miti ya Buanga', icon: '✦', roles: [], requiresAuth: false, group: 'main' },
  { id: 'identify', path: '/identify', label: 'Identificar Planta', labelK: 'Zibula Muti', icon: '◎', roles: [], requiresAuth: false, group: 'main' },
  { id: 'treatments', path: '/treatments', label: 'Tratamentos', labelK: 'Buanga', icon: '❋', roles: [], requiresAuth: false, group: 'main' },
  { id: 'register', path: '/register', label: 'Registar Saber', labelK: 'Sonika Kijiji', icon: '✎', roles: ['admin', 'tecnico'], requiresAuth: true, group: 'field' },
  { id: 'media', path: '/media', label: 'Multimédia', labelK: 'Mambu', icon: '◉', roles: ['admin', 'tecnico'], requiresAuth: true, group: 'field' },
  { id: 'geo', path: '/geo', label: 'Geolocalização', labelK: 'Esala', icon: '⌖', roles: ['admin', 'tecnico'], requiresAuth: true, group: 'field' },
  { id: 'reports', path: '/reports', label: 'Relatórios', labelK: 'Mavovo', icon: '▦', roles: ['admin'], requiresAuth: true, group: 'admin' },
  { id: 'users', path: '/users', label: 'Utilizadores', labelK: 'Antu', icon: '◈', roles: ['admin'], requiresAuth: true, group: 'admin' },
  { id: 'settings', path: '/settings', label: 'Definições', labelK: 'Mayenge', icon: '⚙', roles: [], requiresAuth: false, group: 'system' },
];

export const MENU_GROUPS = {
  main: 'Principal',
  field: 'Campo',
  admin: 'Administração',
  system: 'Sistema',
};

// The five destinations always reachable from the bottom tab bar.
export const BOTTOM_NAV_IDS = ['home', 'diagnose', 'plants', 'identify', 'treatments'];

export const ANGOLA_PROVINCES = [
  'Cabinda', 'Zaire', 'Uíge', 'Bengo', 'Luanda', 'Icolo e Bengo',
  'Cuanza Norte', 'Malanje', 'Lunda Norte', 'Lunda Sul', 'Cuanza Sul',
  'Bié', 'Moxico', 'Moxico Leste', 'Benguela', 'Huambo', 'Huíla',
  'Namibe', 'Cunene', 'Cubango', 'Cuando',
];

export const PLANTS = [
  { id: 1, name: 'Moringa', sci: 'Moringa oleifera', use: 'Nutritivo, Imunidade', kimbundu: 'Mukenga', region: 'Luanda', confidence: 97, treatments: 14, color: '#2d7a4f' },
  { id: 2, name: 'Boldo', sci: 'Peumus boldus', use: 'Digestivo, Fígado', kimbundu: 'Ntombo', region: 'Huambo', confidence: 94, treatments: 8, color: '#5a7a2d' },
  { id: 3, name: 'Capim-limão', sci: 'Cymbopogon citratus', use: 'Ansiolítico, Febre', kimbundu: 'Nkasa', region: 'Malanje', confidence: 91, treatments: 11, color: '#7a6b2d' },
  { id: 4, name: 'Quiabento', sci: 'Abelmoschus esculentus', use: 'Anti-inflamatório', kimbundu: 'Kibondo', region: 'Cabinda', confidence: 88, treatments: 6, color: '#2d5a7a' },
  { id: 5, name: 'Mulemba', sci: 'Ficus thonningii', use: 'Malária, Dor', kimbundu: 'Mulemba', region: 'Bié', confidence: 96, treatments: 19, color: '#7a2d5a' },
  { id: 6, name: 'Nkasa', sci: 'Erythrophleum suaveolens', use: 'Antibacteriano', kimbundu: 'Nkasa', region: 'Uíge', confidence: 82, treatments: 5, color: '#4a2d7a' },
  { id: 7, name: 'Gengibre', sci: 'Zingiber officinale', use: 'Anti-inflamatório, Dor', kimbundu: 'Tanjarinha', region: 'Luanda', confidence: 90, treatments: 20, color: '#b8860b' },
  { id: 8, name: 'Alho', sci: 'Allium sativum', use: 'Antibiótico, Coração', kimbundu: 'Aluxu', region: 'Huíla', confidence: 95, treatments: 30, color: '#8b7355' },
  { id: 9, name: 'Cebola', sci: 'Allium cepa', use: 'Expectorante, Diurético', kimbundu: 'Sevola', region: 'Benguela', confidence: 88, treatments: 12, color: '#d2b48c' },
  { id: 10, name: 'Eucalipto', sci: 'Eucalyptus globulus', use: 'Respiratório, Febre', kimbundu: 'Caliptu', region: 'Huambo', confidence: 92, treatments: 18, color: '#4682b4' },
  { id: 11, name: 'Macela', sci: 'Achyrocline satureioides', use: 'Digestivo, Calmante', kimbundu: 'Macela', region: 'Moxico', confidence: 85, treatments: 7, color: '#ffd700' },
  { id: 12, name: 'Erva-cidreira', sci: 'Melissa officinalis', use: 'Calmante, Sono', kimbundu: 'Cidreira', region: 'Cuanza Sul', confidence: 93, treatments: 10, color: '#98fb98' },
  { id: 13, name: 'Hortelã', sci: 'Mentha spicata', use: 'Digestivo, Náusea', kimbundu: 'Ortelã', region: 'Lunda Norte', confidence: 89, treatments: 9, color: '#3cb371' },
  { id: 14, name: 'Alecrim', sci: 'Rosmarinus officinalis', use: 'Memória, Circulação', kimbundu: 'Alecrim', region: 'Namibe', confidence: 86, treatments: 6, color: '#6b8e23' },
  { id: 15, name: 'Babosa', sci: 'Aloe vera', use: 'Queimaduras, Pele', kimbundu: 'Babosa', region: 'Cunene', confidence: 97, treatments: 25, color: '#228b22' },
  { id: 16, name: 'Nim', sci: 'Azadirachta indica', use: 'Antiparasitário, Pele', kimbundu: 'Nim', region: 'Cuando', confidence: 83, treatments: 4, color: '#556b2f' },
  { id: 17, name: 'Jambolão', sci: 'Syzygium cumini', use: 'Diabetes, Inflamação', kimbundu: 'Jambolão', region: 'Zaire', confidence: 80, treatments: 3, color: '#8b0000' },
  { id: 18, name: 'Cajueiro', sci: 'Anacardium occidentale', use: 'Anti-inflamatório, Cicatrizante', kimbundu: 'Caju', region: 'Bengo', confidence: 91, treatments: 11, color: '#cd853f' },
  { id: 19, name: 'Embaúba', sci: 'Cecropia pachystachya', use: 'Pressão alta, Diurético', kimbundu: 'Embaúba', region: 'Cabinda', confidence: 78, treatments: 4, color: '#8fbc8f' },
  { id: 20, name: 'Picão', sci: 'Bidens pilosa', use: 'Hepatite, Icterícia', kimbundu: 'Picão', region: 'Malanje', confidence: 82, treatments: 6, color: '#daa520' },
  { id: 21, name: 'Carqueja', sci: 'Baccharis trimera', use: 'Digestivo, Fígado', kimbundu: 'Carqueja', region: 'Bié', confidence: 87, treatments: 9, color: '#bdb76b' },
  { id: 22, name: 'Quebra-pedra', sci: 'Phyllanthus niruri', use: 'Cálculo renal, Fígado', kimbundu: 'Quebra-pedra', region: 'Huíla', confidence: 90, treatments: 15, color: '#3cb371' },
  { id: 23, name: 'Mastruz', sci: 'Chenopodium ambrosioides', use: 'Vermífugo, Tosse', kimbundu: 'Mastruz', region: 'Luanda', confidence: 88, treatments: 10, color: '#8b4513' },
  { id: 24, name: 'Guabiroba', sci: 'Campomanesia xanthocarpa', use: 'Anti-inflamatório, Vitamina', kimbundu: 'Guabiroba', region: 'Cuanza Norte', confidence: 76, treatments: 4, color: '#f4a460' },
  { id: 25, name: 'Pau-ferro', sci: 'Libidibia ferrea', use: 'Cicatrizante, Tónico', kimbundu: 'Pau-ferro', region: 'Namibe', confidence: 81, treatments: 5, color: '#a0522d' },
  { id: 26, name: 'Sucupira', sci: 'Pterodon emarginatus', use: 'Reumatismo, Dor', kimbundu: 'Sucupira', region: 'Moxico', confidence: 79, treatments: 7, color: '#8b6508' },
  { id: 27, name: 'Ipê-roxo', sci: 'Handroanthus impetiginosus', use: 'Anti-inflamatório, Oncologia', kimbundu: 'Ipê', region: 'Bié', confidence: 84, treatments: 6, color: '#800080' },
  { id: 28, name: 'Unha-de-gato', sci: 'Uncaria tomentosa', use: 'Imunidade, Inflamação', kimbundu: 'Unha-de-gato', region: 'Lunda Sul', confidence: 86, treatments: 8, color: '#dc143c' },
  { id: 29, name: 'Jatobá', sci: 'Hymenaea courbaril', use: 'Fortificante, Pulmão', kimbundu: 'Jatobá', region: 'Zaire', confidence: 83, treatments: 5, color: '#b22222' },
  { id: 30, name: 'Copaíba', sci: 'Copaifera langsdorffii', use: 'Cicatrizante, Anti-inflamatório', kimbundu: 'Copaíba', region: 'Cabinda', confidence: 92, treatments: 12, color: '#2e8b57' },
];

export const TREATMENTS = [
  { id: 1, name: 'Chá de Moringa para febre', plant: 'Moringa', elder: 'Ancião Nkosi, 82 anos', region: 'Zango 0', tags: ['Febre', 'Crianças'] },
  { id: 2, name: 'Cataplasma de Boldo digestivo', plant: 'Boldo', elder: 'Anciã Luisa, 74 anos', region: 'Rangel', tags: ['Digestão'] },
  { id: 3, name: 'Infusão de capim-limão', plant: 'Capim-limão', elder: 'Ancião Mateus, 91 anos', region: 'Cazenga', tags: ['Ansiedade', 'Sono'] },
  { id: 4, name: 'Decocção de Mulemba', plant: 'Mulemba', elder: 'Anciã Maria, 78 anos', region: 'Viana', tags: ['Malária'] },
];

export const REPORTS = [
  { id: 1, name: 'Tratamentos por Província', icon: '▦', count: '318 registos', date: 'Hoje', color: '#1a6b4a' },
  { id: 2, name: 'Plantas mais utilizadas', icon: '✦', count: '142 plantas', date: 'Hoje', color: '#5a7a2d' },
  { id: 3, name: 'Doenças recorrentes – Zango 0', icon: '◉', count: '27 casos', date: 'Ontem', color: '#7a4a1e' },
  { id: 4, name: 'Cobertura por Província', icon: '⊕', count: '21 províncias', date: 'Esta semana', color: '#1a4a7c' },
];

export const USERS_MOCK = [
  { id: 1, name: 'Admin Silva', initials: 'AS', role: 'admin', email: 'admin@comunidadebotanica.ao' },
  { id: 2, name: 'Técnico Matos', initials: 'TM', role: 'tecnico', email: 'tecnico@comunidadebotanica.ao' },
  { id: 3, name: 'Maria João', initials: 'MJ', role: 'paciente', email: 'mjoao@comunidadebotanica.ao' },
  { id: 4, name: 'Anciã Luisa', initials: 'AL', role: 'paciente', email: 'aluisa@comunidadebotanica.ao' },
];

export const HOME_STATS = [
  { val: PLANTS.length, label: 'Plantas', sub: 'catalogadas' },
  { val: TREATMENTS.length, label: 'Tratamentos', sub: 'registados' },
  { val: ANGOLA_PROVINCES.length, label: 'Províncias', sub: 'cobertas' },
];

export const HELP_TOPICS = {
  welcome: {
    title: 'Bem-vindo à Comunidade Botânica',
    text: 'Esta aplicação preserva o saber medicinal angolano. Podes identificar plantas, fazer um autodiagnóstico com o Ndembo, e ver tratamentos tradicionais.',
  },
  diagnose: {
    title: 'Autodiagnóstico com Ndembo',
    text: 'Conversa com o curandeiro virtual. Ele vai perguntar sobre os teus sintomas e sugerir plantas medicinais da tua região. As sugestões não substituem um médico.',
  },
  identify: {
    title: 'Identificar planta',
    text: 'Tira uma foto de uma planta, flor, fruto ou herva e a IA identifica o nome popular, científico e usos medicinais.',
  },
  plants: {
    title: 'Plantas Medicinais',
    text: 'Catálogo com todas as plantas registadas pelos anciãos angolanos. Pesquisa por nome português, kimbundu ou científico.',
  },
  treatments: {
    title: 'Tratamentos tradicionais',
    text: 'Lista de preparos transmitidos por anciãos. Cada um inclui a planta, o nome do ancião e a região.',
  },
  settings: {
    title: 'Definições',
    text: 'Podes trocar entre português e kimbundu, aumentar o tamanho da letra, ativar o modo alto contraste, e escolher se as respostas do Ndembo são lidas em voz alta automaticamente.',
  },
  register: {
    title: 'Registar Saber',
    text: 'Para técnicos e administradores: documenta o conhecimento medicinal de um ancião — a planta, a preparação, e opcionalmente uma gravação de voz. Cada registo ajuda a preservar este saber para as próximas gerações.',
  },
  media: {
    title: 'Multimédia',
    text: 'Para técnicos e administradores: guarda fotografias e gravações de voz recolhidas no campo.',
  },
  geo: {
    title: 'Geolocalização',
    text: 'Para técnicos e administradores: regista as coordenadas GPS do local onde uma planta ou saber foi recolhido.',
  },
  reports: {
    title: 'Relatórios',
    text: 'Para administradores: resumo estatístico da comunidade — tratamentos, plantas mais usadas, e cobertura por província. Cada relatório pode ser descarregado em PDF.',
  },
  users: {
    title: 'Utilizadores',
    text: 'Para administradores: lista de contas registadas e os seus papéis (Administrador, Técnico, Paciente).',
  },
};

// Order in which topics appear in the full "Como usar a Botânica" guide.
export const HELP_GUIDE_ORDER = [
  'diagnose', 'plants', 'identify', 'treatments', 'register', 'media', 'geo', 'reports', 'users', 'settings',
];

export const INITIAL_BOT_MESSAGE = {
  role: 'assistant',
  content: 'Olá! Eu sou o Ndembo, o teu curandeiro virtual. Conta-me como te sentes hoje. Podes falar em português ou Kimbundu.',
};

// Demo accounts used only when Supabase is not configured (see services/supabaseClient.js).
export const DEMO_ACCOUNTS = [
  { role: 'admin', email: 'admin@comunidadebotanica.ao', password: 'admin123' },
  { role: 'tecnico', email: 'tecnico@comunidadebotanica.ao', password: 'tecnico123' },
  { role: 'paciente', email: 'paciente@comunidadebotanica.ao', password: 'paciente123' },
];
