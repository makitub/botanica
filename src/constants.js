// src/constants.js
export const ROLES = {
  admin:   { id:'admin',   label:'Administrador',    labelK:'Nkuluntu',         color:'#0d5c3a', bg:'#e6f4ee', accent:'#1a9a60' },
  tecnico: { id:'tecnico', label:'Técnico de Campo', labelK:'Mukanda wa Nsi',   color:'#7c4a1e', bg:'#f5ede3', accent:'#c87941' },
  paciente:{ id:'paciente',label:'Paciente',          labelK:'Muntu wa Buanga',  color:'#1a4a7c', bg:'#e3eef5', accent:'#3a82c4' },
};

export const MENU = [
  { id:'home',      label:'Início',            labelK:'Yibu',             icon:'⌂',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'diagnose',  label:'Autodiagnóstico',   labelK:'Diangula Mwini',   icon:'♡',  roles:['admin','tecnico','paciente'], group:'main', highlight:true },
  { id:'plants',    label:'Plantas Medicinais',labelK:'Miti ya Buanga',   icon:'✦',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'treatments',label:'Tratamentos',       labelK:'Buanga',           icon:'❋',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'identify',  label:'Identificar Planta',labelK:'Zibula Muti',      icon:'◎',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'register',  label:'Registar Saber',    labelK:'Sonika Kijiji',    icon:'✎',  roles:['admin','tecnico'],            group:'field'  },
  { id:'media',     label:'Multimédia',        labelK:'Mambu',            icon:'◉',  roles:['admin','tecnico'],            group:'field'  },
  { id:'reports',   label:'Relatórios',        labelK:'Mavovo',           icon:'▦',  roles:['admin'],                      group:'admin'  },
  { id:'users',     label:'Utilizadores',      labelK:'Antu',             icon:'◈',  roles:['admin'],                      group:'admin'  },
  { id:'settings',  label:'Definições',        labelK:'Mayenge',          icon:'⚙',  roles:['admin','tecnico','paciente'], group:'system' },
];

export const GROUPS = {
  main:   'Principal',
  field:  'Campo',
  admin:  'Administração',
  system: 'Sistema',
};
