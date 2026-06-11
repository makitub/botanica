// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import { jsPDF } from "jspdf";

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const ROLES = {
  admin:   { id:'admin',   label:'Administrador',    labelK:'Nkuluntu',         color:'#1e6b4a', bg:'#e6f4ee', accent:'#1a9a60' },
  tecnico: { id:'tecnico', label:'Técnico de Campo', labelK:'Mukanda wa Nsi',   color:'#b85c1a', bg:'#f5ede3', accent:'#c87941' },
  paciente:{ id:'paciente',label:'Paciente',          labelK:'Muntu wa Buanga',  color:'#1a5f8a', bg:'#e3eef5', accent:'#3a82c4' },
};

const MENU = [
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

const GROUPS = {
  main:   'Principal',
  field:  'Campo',
  admin:  'Administração',
  system: 'Sistema',
};

const PLANTS = [
  { id:1,  name:'Moringa',            sci:'Moringa oleifera',        use:'Nutritivo, Imunidade',       kimbundu:'Mukenga',  region:'Luanda',  confidence:97, treatments:14, color:'#2d7a4f',
    description:'Árvore rica em vitaminas e minerais, usada tradicionalmente para combater a desnutrição e fortalecer o sistema imunitário.',
    preparation:'Ferver 10g de folhas secas em 1L de água por 5 minutos. Coar e beber 3 vezes ao dia.',
    dosage:'Adultos: 1 chávena (200ml) até 3x/dia. Crianças: meia chávena.',
    precautions:'Evitar durante a gravidez (efeito uterotónico). Consumir com moderação.' },
  { id:2,  name:'Boldo',              sci:'Peumus boldus',           use:'Digestivo, Fígado',          kimbundu:'Ntombo',   region:'Huambo',  confidence:94, treatments:8,  color:'#5a7a2d',
    description:'Planta amarga que estimula a produção de bile, auxiliando a digestão de gorduras e protegendo o fígado.',
    preparation:'Infusão de 1 colher de chá de folhas secas por chávena de água. Deixar em infusão 10 minutos.',
    dosage:'1 chávena após as refeições principais, máximo 3 chávenas/dia.',
    precautions:'Não usar por mais de 4 semanas seguidas. Contraindicado em obstrução biliar.' },
  { id:3,  name:'Capim-limão',        sci:'Cymbopogon citratus',    use:'Ansiolítico, Febre',         kimbundu:'Nkasa',    region:'Malanje', confidence:91, treatments:11, color:'#7a6b2d',
    description:'Conhecido pelo efeito calmante, reduz ansiedade, melhora o sono e ajuda a baixar a febre.',
    preparation:'Ferver 2 colheres de sopa de folhas frescas picadas em 500ml de água por 5 minutos.',
    dosage:'Beber 2-3 chávenas ao longo do dia, preferencialmente à noite.',
    precautions:'Pode causar sonolência. Evitar antes de conduzir.' },
  { id:4,  name:'Quiabento',          sci:'Abelmoschus esculentus', use:'Anti-inflamatório',          kimbundu:'Kibondo',  region:'Cabinda', confidence:88, treatments:6,  color:'#2d5a7a',
    description:'As folhas e vagens são usadas em cataplasmas para reduzir inflamações e tratar feridas.',
    preparation:'Maceração das folhas frescas em água fria durante 12 horas. Aplicar como compressa.',
    dosage:'Uso externo: aplicar 2-3 vezes ao dia. Interno: chá das folhas (2 colheres por litro).',
    precautions:'Uso tópico geralmente seguro. Evitar ingestão excessiva pelo efeito laxante.' },
  { id:5,  name:'Mulemba',            sci:'Ficus thonningii',       use:'Malária, Dor',               kimbundu:'Mulemba',  region:'Bié',     confidence:96, treatments:19, color:'#7a2d5a',
    description:'Casca usada tradicionalmente contra febres maláricas e dores reumáticas.',
    preparation:'Decocção de 20g de casca seca em 1L de água por 15 minutos.',
    dosage:'Beber 1 chávena de 8 em 8 horas durante 5 dias.',
    precautions:'Pode interagir com anticoagulantes. Não exceder a dose.' },
  { id:6,  name:'Nkasa',              sci:'Erythrophleum suaveol.', use:'Antibacteriano',             kimbundu:'Nkasa',    region:'Uíge',    confidence:82, treatments:5,  color:'#4a2d7a',
    description:'Planta poderosa contra infecções bacterianas, usada em banhos e compressas.',
    preparation:'Ferver 5g de casca ralada em 500ml de água por 10 minutos. Coar bem.',
    dosage:'Banho de assento ou compressa 2x/dia. Não ingerir puro.',
    precautions:'Tóxica em altas doses. Uso exclusivo externo ou sob supervisão de ancião.' },
];

const TREATMENTS = [
  { id:1, name:'Chá de Moringa para febre',      plant:'Moringa',     elder:'Ancião Nkosi, 82 anos', region:'Zango 0',  tags:['Febre','Crianças'] },
  { id:2, name:'Cataplasma de Boldo digestivo',  plant:'Boldo',       elder:'Anciã Luisa, 74 anos',  region:'Rangel',   tags:['Digestão'] },
  { id:3, name:'Infusão de capim-limão',         plant:'Capim-limão', elder:'Ancião Mateus, 91 anos',region:'Cazenga',  tags:['Ansiedade','Sono'] },
  { id:4, name:'Decocção de Mulemba',            plant:'Mulemba',     elder:'Anciã Maria, 78 anos',  region:'Viana',    tags:['Malária'] },
];

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const canAccess = (role, id) => {
  const item = MENU.find(m => m.id === id);
  return item ? item.roles.includes(role) : false;
};

async function getProvinceFromLatLng(lat, lng) {
  const ANGOLA_PROVINCES = [
    'Bengo','Benguela','Bié','Cabinda','Cuando Cubango','Cuanza Norte','Cuanza Sul',
    'Cunene','Huambo','Huíla','Luanda','Lunda Norte','Lunda Sul','Malanje','Moxico',
    'Namibe','Uíge','Zaire'
  ];
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=8&addressdetails=1&accept-language=pt`);
    const data = await res.json();
    const address = data.address;
    const province = address.state || address.province || address.region || '';
    const match = ANGOLA_PROVINCES.find(p => province.toLowerCase().includes(p.toLowerCase()));
    return match || province || 'Luanda';
  } catch {
    return 'Luanda';
  }
}

/* ─── REUSABLE COMPONENTS ───────────────────────────────────────────────── */
function Screen({ children, title, subtitle }) {
  return (
    <div style={{ animation:'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both', width:'100%', maxWidth:480, margin:'0 auto' }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 28 }}>
          {title && (
            <h1 style={{
              fontSize: 32, fontWeight: 800, color: '#0b2a1a',
              letterSpacing: '-0.02em', fontFamily: 'Lora, Georgia, serif'
            }}>{title}</h1>
          )}
          {subtitle && (
            <p style={{ fontSize: 19, fontWeight: 500, color: '#0f2e1e', marginTop: 6, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function PlantCard({ plant, onClick }) {
  const [hov, setHov] = useState(false);
  const leafSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='${encodeURIComponent('#0f4a2a')}' d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75l-.55 1.5C1.5 15.5 0 13 0 10c0-4 10-6 17-8z'/%3E%3C/svg%3E`;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#ffffff' : '#fefdf8',
        border: `2px solid ${hov ? plant.color : '#c8dbc8'}`,
        borderRadius: 18,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hov ? `0 10px 22px rgba(0,0,0,0.08)` : '0 2px 4px rgba(0,0,0,0.02)',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: plant.color + '30',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2
      }}>
        <img src={leafSvg} alt="" style={{ width: 32, height: 32 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f2a1a', fontFamily: 'Georgia, serif', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plant.name}</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a4a2a', fontStyle: 'italic', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plant.sci}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a4a2a', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plant.use}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#3a5a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            <span style={{ color: plant.color, fontWeight: 700 }}>{plant.kimbundu}</span> · {plant.region}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#3a5a3a', flexShrink: 0, whiteSpace: 'nowrap' }}>{plant.treatments} trat.</span>
        </div>
      </div>
    </div>
  );
}

function PlantDetailScreen({ plant, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{
        background: '#e0f0e0', border: '2px solid #b8d4b8', borderRadius: 24,
        padding: '10px 18px', marginBottom: 20, color: '#0f2a1a', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600
      }}>
        ← Voltar à lista
      </button>
      <div style={{
        background: '#ffffff',
        borderRadius: 28,
        padding: '28px 24px',
        border: '2px solid #d0e0d0',
        boxShadow: '0 12px 28px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0f2a1a', fontFamily: 'Lora, Georgia, serif', marginBottom: 6 }}>{plant.name}</h2>
            <p style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 500, color: '#1a4a2a' }}>{plant.sci}</p>
          </div>
          <span style={{ background: plant.color + '30', padding: '6px 14px', borderRadius: 30, fontSize: 13, fontWeight: 700, color: '#0f2a1a' }}>{plant.region}</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <div style={{ background: '#f2faf0', borderRadius: 18, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a4a2a', textTransform: 'uppercase' }}>Kimbundu</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f2a1a' }}>{plant.kimbundu}</div>
          </div>
          <div style={{ background: '#f2faf0', borderRadius: 18, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a4a2a', textTransform: 'uppercase' }}>Confiança</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f2a1a' }}>{plant.confidence}%</div>
          </div>
          <div style={{ background: '#f2faf0', borderRadius: 18, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a4a2a', textTransform: 'uppercase' }}>Tratamentos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f2a1a' }}>{plant.treatments} registados</div>
          </div>
          <div style={{ background: '#f2faf0', borderRadius: 18, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a4a2a', textTransform: 'uppercase' }}>Usos</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f2a1a' }}>{plant.use}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f2a1a', marginBottom: 10, fontFamily: 'Lora, serif' }}>📖 Descrição</h3>
          <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 500, color: '#0f2a1a' }}>{plant.description}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f2a1a', marginBottom: 10, fontFamily: 'Lora, serif' }}>🍵 Preparação</h3>
          <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 500, color: '#0f2a1a' }}>{plant.preparation}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f2a1a', marginBottom: 10, fontFamily: 'Lora, serif' }}>💊 Dose recomendada</h3>
          <p style={{ fontSize: 16, lineHeight: 1.65, fontWeight: 500, color: '#0f2a1a' }}>{plant.dosage}</p>
        </div>

        <div style={{ background: '#fef0dc', borderRadius: 20, padding: '20px', marginTop: 8 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#8a4a1a', marginBottom: 10 }}>⚠️ Precauções</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 500, color: '#4a2a10' }}>{plant.precautions}</p>
        </div>
      </div>
    </div>
  );
}

function Tag({ label, color = '#0f6b4a' }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color: color,
      background: color + '25', borderRadius: 24,
      padding: '4px 12px', letterSpacing: '0.02em'
    }}>{label}</span>
  );
}

function Disclaimer() {
  return (
    <div style={{
      background: '#fff4e0', border: '2px solid #e0c88c', borderRadius: 14,
      padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20
    }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#6a4a1a', lineHeight: 1.6, margin: 0 }}>
        <strong>Aviso:</strong> As sugestões são informativas e não substituem consulta médica hospitalar.
        Em caso de urgência, dirija-se ao hospital mais próximo imediatamente.
      </p>
    </div>
  );
}

function SpeakButton({ text, label = 'Ouvir' }) {
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button onClick={speak} style={{
      background:'none', border:'2px solid #0f6b4a', borderRadius:12,
      padding:'4px 12px', fontSize:12, fontWeight:700, color:'#0f6b4a', cursor:'pointer',
      marginLeft:10
    }} title="Ouvir descrição">
      🔊 {label}
    </button>
  );
}

/* ─── SCREEN: Chatbot Autodiagnóstico ──────────────────────────────────── */
function DiagnoseScreen() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('diagnose_messages');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Olá! Eu sou o Ndembo, o teu curandeiro virtual. Conta-me como te sentes hoje. Podes falar em português ou Kimbundu.' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    localStorage.setItem('diagnose_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    (async () => {
      let prov = 'Luanda';
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, maximumAge: 300000 })
          );
          prov = await getProvinceFromLatLng(pos.coords.latitude, pos.coords.longitude);
        } catch (geoErr) { console.warn('GPS error:', geoErr); }
      }
      setProvince(prov);
    })();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newUserMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, province, language: 'pt' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no chatbot');
      const reply = data.reply;
      const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
      const match = reply.match(jsonBlockRegex);
      let displayText = reply;
      let resultData = null;
      if (match) {
        displayText = reply.replace(jsonBlockRegex, '').trim();
        try { resultData = JSON.parse(match[1]); } catch (jsonErr) { console.warn('Failed to parse assistant JSON:', jsonErr); displayText = reply; }
      }
      if (displayText) setMessages(prev => [...prev, { role: 'assistant', content: displayText }]);
      if (resultData && resultData.triage) {
        setMessages(prev => [...prev, { role: 'assistant', type: 'result', content: resultData }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Comunidade Botânica Ispk - Autodiagnóstico", 10, 15);
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleString()}`, 10, 22);
    doc.text(`Província: ${province}`, 10, 28);
    let y = 40;
    messages.forEach((msg) => {
      const prefix = msg.role === 'user' ? 'Utente' : 'Ndembo';
      const text = msg.type === 'result' ? `${prefix}: [Recomendação final com triagem e remédios]` : `${prefix}: ${msg.content}`;
      const lines = doc.splitTextToSize(text, 180);
      if (y + lines.length * 6 > 280) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 4;
    });
    doc.save(`autodiagnostico_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const clearHistory = () => {
    if (window.confirm('Apagar toda a conversa?')) {
      setMessages([{ role: 'assistant', content: 'Olá! Eu sou o Ndembo, o teu curandeiro virtual. Conta-me como te sentes hoje. Podes falar em português ou Kimbundu.' }]);
      localStorage.removeItem('diagnose_messages');
    }
  };

  return (
    <Screen>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, gap:8 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0f2a1a', fontFamily:'Lora, Georgia, serif', flex:1, lineHeight:1.3 }}>🩺 Autodiagnóstico com IA</h1>
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <button onClick={clearHistory} style={{ background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:10, padding:'6px 12px', fontSize:13, fontWeight:600, cursor:'pointer', color:'#0f4a2a' }} title="Apagar conversa">🗑️</button>
          <button onClick={exportPDF} style={{ background:'#0f6b4a', color:'#fff', border:'none', borderRadius:10, padding:'6px 12px', fontSize:13, fontWeight:700, cursor:'pointer' }} title="Exportar PDF">📄 PDF</button>
        </div>
      </div>
      <p style={{ fontSize:17, fontWeight:600, color:'#0f2a1a', marginTop:6, marginBottom:16 }}>Conversa com o Ndembo — ele vai ajudar-te.</p>
      <Disclaimer />
      <div style={{ background:'#ffffff', borderRadius:18, border:'2px solid #c8dbc8', padding:'14px', minHeight:260, maxHeight:380, overflowY:'auto', overflowX:'hidden', marginBottom:14, width:'100%' }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          if (msg.type === 'result') {
            const { triage, urgentMessage, remedies } = msg.content;
            return (
              <div key={idx} style={{ marginBottom:14 }}>
                {triage === 'red' && (<div style={{ background:'#ffe6e6', border:'2px solid #f5a5a5', borderRadius:16, padding:'14px', marginBottom:12, color:'#b33b2c', fontWeight:600 }}>🚨 <strong>Urgência:</strong> {urgentMessage || 'Procure atendimento hospitalar imediatamente!'}</div>)}
                {triage === 'yellow' && (<div style={{ background:'#fff3e0', border:'2px solid #f5c27b', borderRadius:16, padding:'14px', marginBottom:12, color:'#b86b1f', fontWeight:600 }}>⚠️ <strong>Atenção:</strong> {urgentMessage || 'Consulte um profissional se os sintomas piorarem.'}</div>)}
                {triage === 'green' && (<div style={{ background:'#e2f3e4', border:'2px solid #8fd6a5', borderRadius:16, padding:'14px', marginBottom:12, color:'#2c6e3c', fontWeight:600 }}>✅ <strong>Situação estável:</strong> Siga as sugestões abaixo.</div>)}
                {remedies && remedies.map((r, idx2) => (<PlantRemedyCard key={idx2} remedy={r} />))}
              </div>
            );
          }
          return (
            <div key={idx} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:18, flexDirection: isUser ? 'row-reverse' : 'row' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background: isUser ? '#0f6b4a' : '#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, color: isUser ? '#fff' : '#0f6b4a' }}>
                {isUser ? '🎤' : '🌿'}
              </div>
              <div style={{
                maxWidth:'78%', padding:'12px 18px', borderRadius:20,
                background: isUser ? '#0f6b4a' : '#f4faf0',
                color: isUser ? '#fff' : '#0f2a1a',
                fontSize:17, fontWeight:500, lineHeight:1.7, whiteSpace:'pre-wrap', wordBreak:'break-word',
                borderBottomRightRadius: isUser ? 6 : 20,
                borderBottomLeftRadius: isUser ? 20 : 6,
                boxShadow: isUser ? '0 2px 8px rgba(0,0,0,0.12)' : 'none'
              }}>
                {msg.content}
              </div>
              {!isUser && (
                <button onClick={() => { const utterance = new SpeechSynthesisUtterance(msg.content); utterance.lang = 'pt-PT'; utterance.rate = 0.9; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); }}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, marginTop:6, color:'#0f6b4a' }} title="Ouvir mensagem">🔊</button>
              )}
            </div>
          );
        })}
        {loading && <div style={{ textAlign:'center', color:'#1a4a2a', padding:10, fontWeight:600 }}>Ndembo está a pensar...</div>}
        {error && <div style={{ color:'#b33b2c', fontSize:13, fontWeight:600, padding:10 }}>{error}</div>}
      </div>
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreve os teus sintomas..."
          style={{ flex:1, padding:'14px 18px', fontSize:17, fontWeight:500, border:'2px solid #c8dbc8', borderRadius:16, background:'#ffffff', color:'#0f2a1a', fontFamily:'Georgia, serif', outline:'none', minWidth:0 }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ padding:'14px 22px', background: input.trim() ? '#0f6b4a' : '#c8dbc8', color:'#fff', border:'none', borderRadius:16, fontWeight:800, cursor:'pointer', fontSize:16, flexShrink:0 }}>
          Enviar
        </button>
      </div>
    </Screen>
  );
}

/* ─── SCREEN: Identificar Planta (real API) ────────────────────────────── */
function IdentifyScreen() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const lastRequestTime = useRef(0);
  const MIN_INTERVAL = 2000;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = Math.round((height * maxSize) / width); width = maxSize; }
          else { width = Math.round((width * maxSize) / height); height = maxSize; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const base64 = dataUrl.split(',')[1];
        setImageBase64(base64);
        setPreviewUrl(dataUrl);
        setResult(null);
        setError('');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    const now = Date.now();
    if (now - lastRequestTime.current < MIN_INTERVAL) {
      setError('Aguarde um pouco antes de identificar outra planta.');
      return;
    }
    lastRequestTime.current = now;
    if (!imageBase64) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, imageMime })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na identificação');
      setResult(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Screen>
      <h1 style={{ fontSize:32, fontWeight:800, color:'#0f2a1a', fontFamily:'Lora, Georgia, serif' }}>🌿 Identificar Plantas</h1>
      <p style={{ fontSize:18, fontWeight:600, color:'#0f2a1a', marginTop:6, marginBottom:24 }}>Tire uma foto de folhas, flores ou frutos para identificação automática</p>
      {!previewUrl ? (
        <label style={{ display:'block', border:'3px dashed #b8d4b8', borderRadius:20, padding:'44px 24px', textAlign:'center', cursor:'pointer', background:'#fafdf8', marginBottom:18 }}>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
          <span style={{ fontSize:38 }}>📸</span><br/>
          <span style={{ fontSize:16, fontWeight:700, color:'#0f6b4a' }}>Clique para escolher uma foto</span>
          <p style={{ fontSize:12, fontWeight:500, color:'#3a5a3a' }}>JPG, PNG (até 5MB)</p>
        </label>
      ) : (
        <div style={{ textAlign:'center', marginBottom:18 }}>
          <img src={previewUrl} alt="Preview" style={{ maxHeight:260, borderRadius:16, border:'2px solid #c8dbc8' }} />
          <button type="button" onClick={() => { setPreviewUrl(null); setImageBase64(null); setResult(null); }} style={{ marginLeft:12, background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:12, padding:'8px 14px', cursor:'pointer', color:'#0f4a2a', fontWeight:700 }}>
            ✕ Remover
          </button>
        </div>
      )}
      {previewUrl && !result && (
        <button onClick={analyze} disabled={loading} style={{ width:'100%', padding:'16px', background: loading ? '#c8dbc8' : '#0f6b4a', color:'#fff', border:'none', borderRadius:18, fontWeight:800, cursor:'pointer', fontFamily:'Georgia, serif', fontSize:16 }}>
          {loading ? 'Analisando...' : '🔍 Identificar planta'}
        </button>
      )}
      {loading && <p style={{ textAlign:'center', color:'#1a4a2a', marginTop:14, fontWeight:600 }}>Processando imagem com IA...</p>}
      {error && <div style={{ color:'#b33b2c', marginTop:18, fontSize:13, fontWeight:600, background:'#ffe6e6', padding:14, borderRadius:14 }}>{error}</div>}
      {result && !result.erro && (
        <div style={{ marginTop:24, border:'2px solid #c8dbc8', borderRadius:16, overflow:'hidden' }}>
          <div style={{ background:'#1a6b4a', color:'#fff', padding:'20px 24px', fontFamily:'Georgia, serif' }}>
            <div style={{ fontSize:20, fontWeight:800 }}>{result.nome_popular}</div>
            <div style={{ fontSize:14, fontStyle:'italic', fontWeight:500, opacity:0.95 }}>{result.nome_cientifico}</div>
          </div>
          <div style={{ padding:'20px 24px', background:'#ffffff' }}>
            <p style={{ fontSize:14, fontWeight:600, color:'#0f2a1a' }}><strong>Características:</strong> {result.caracteristicas}</p>
            <p style={{ fontSize:14, fontWeight:600, color:'#0f2a1a' }}><strong>Usos medicinais:</strong> {result.usos_medicinais}</p>
            <p style={{ fontSize:14, fontWeight:600, color:'#0f2a1a' }}><strong>Preparação:</strong> {result.preparacao}</p>
            <p style={{ fontSize:14, fontWeight:600, color:'#0f2a1a' }}><strong>Dose:</strong> {result.dose_recomendada}</p>
            {result.quem_pode_usar && (<div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:12 }}>{result.quem_pode_usar.map((g,i)=><span key={i} style={{ background:'#dcfce7', color:'#0f6b4a', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:30 }}>{g}</span>)}</div>)}
            {result.contraindicacoes && (<div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>{result.contraindicacoes.map((c,i)=><span key={i} style={{ background:'#fff3e0', color:'#b86b1f', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:30 }}>{c}</span>)}</div>)}
          </div>
        </div>
      )}
      {result?.erro && <p style={{ color:'#b33b2c', marginTop:14, fontWeight:700 }}>{result.erro}</p>}
    </Screen>
  );
}

/* ─── OTHER SCREENS ─────────────────────────────────────────────────────── */
function HomeScreen({ role, onNavigate }) {
  const r = ROLES[role];
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const quickActions = MENU.filter(m => m.roles.includes(role) && m.id !== 'home' && m.id !== 'settings').slice(0,4);

  return (
    <Screen>
      {/* Updated header with richer green gradient - no blue */}
      <div style={{ background: `linear-gradient(135deg, #1a6b4a 0%, #0f3a2a 100%)`, borderRadius: 24, padding:'28px 32px', marginBottom:28, color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }}/>
        <div style={{ position:'absolute', right:24, bottom:-34, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <p style={{ fontSize:14, fontWeight:600, opacity:0.95, marginBottom:6 }}>{greeting} · <span style={{ fontStyle:'italic', opacity:0.85 }}>{r.labelK}</span></p>
        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:10, fontFamily:'Georgia, serif', letterSpacing:'-0.02em' }}>Bem-vindo ao Botanica</h2>
        <p style={{ fontSize:13, fontWeight:500, opacity:0.85, lineHeight:1.6, maxWidth:280 }}>O saber ancestral angolano ao serviço da saúde de todos.</p>
        <div style={{ marginTop:16, display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.2)', borderRadius:40, padding:'6px 14px', fontSize:12, backdropFilter:'blur(4px)' }}>
          <span style={{
            display:'inline-block',
            width:28, height:28, borderRadius:'50%',
            backgroundColor: r.color,
            color:'#fff',
            textAlign:'center',
            lineHeight:'28px',
            fontSize:16,
            fontWeight:800,
            marginRight:4
          }}>
            {r.id==='admin'?'A':r.id==='tecnico'?'T':'P'}
          </span>
          <span style={{ fontWeight:700 }}>{r.label}</span>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
        {[{ val: PLANTS.length, label: 'Plantas', sub: 'catalogadas (em expansão)' },{ val:'318', label:'Tratamentos', sub:'registados' },{ val:'21',  label:'Províncias', sub:'cobertas' }].map(s => (
          <div key={s.label} style={{ background:'#ffffff', borderRadius:18, padding:'16px 12px', textAlign:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', border:'1px solid #e0e8dc' }}>
            <div style={{ fontSize:26, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>{s.val}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#1a4a2a', marginTop:2 }}>{s.label}</div>
            <div style={{ fontSize:11, fontWeight:500, color:'#4a6a4a' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:12, fontWeight:800, color:'#4a6a4a', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Acesso rápido</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {quickActions.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{ background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18, padding:'16px 18px', cursor:'pointer', textAlign:'left', transition:'all 0.2s ease', display:'flex', alignItems:'center', gap:12 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#0f6b4a'; e.currentTarget.style.background='#fafdf8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#d0e0d0'; e.currentTarget.style.background='#ffffff'; }}>
            <span style={{ fontSize:24 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#0f2a1a' }}>{item.label}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#4a6a4a' }}>{item.labelK}</div>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

function PlantsScreen() {
  const [filter, setFilter] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const filtered = PLANTS.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.kimbundu.toLowerCase().includes(filter.toLowerCase()) ||
    p.sci.toLowerCase().includes(filter.toLowerCase())
  );

  if (selectedPlant) {
    return <PlantDetailScreen plant={selectedPlant} onBack={() => setSelectedPlant(null)} />;
  }

  return (
    <Screen title="Plantas Medicinais" subtitle="Catálogo de medicina natural angolana · Miti ya Buanga">
      <div style={{ display:'flex', alignItems:'center', gap:12, background:'#ffffff', borderRadius:16, padding:'12px 16px', marginBottom:24, border:'2px solid #d0e0d0' }}>
        <span style={{ color:'#4a6a4a', fontSize:18 }}>⊕</span>
        <input 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          placeholder="Pesquisar por nome, Kimbundu ou nome científico..."
          style={{ flex:1, border:'none', background:'transparent', fontSize:15, fontWeight:600, color:'#0f2a1a', outline:'none', fontFamily:'Georgia, serif' }}
        />
        {filter && (
          <button
            onClick={() => setFilter('')}
            style={{
              background:'none',
              border:'none',
              color:'#4a6a4a',
              cursor:'pointer',
              fontSize:18,
              padding:'0 6px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center'
            }}
            aria-label="Limpar pesquisa"
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ width:'calc(50% - 8px)', minWidth:160 }}>
            <PlantCard plant={p} onClick={() => setSelectedPlant(p)} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:48, color:'#4a6a4a' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>✦</div>
          <p style={{ fontSize:15, fontWeight:600 }}>Nenhuma planta encontrada</p>
        </div>
      )}
    </Screen>
  );
}

function TreatmentsScreen() {
  return (
    <Screen title="Tratamentos" subtitle="Saberes ancestrais preservados · Buanga">
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        {TREATMENTS.map((t,i) => (
          <div key={i} style={{
            background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18,
            padding:'18px 20px', marginBottom:12, cursor:'pointer',
            transition:'all 0.2s',
            width:'100%', maxWidth:440,
            marginLeft:'auto', marginRight:'auto'
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#0f6b4a'; e.currentTarget.style.background='#fafdf8'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#d0e0d0'; e.currentTarget.style.background='#ffffff'; }}>
            <div style={{ fontSize:17, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif', marginBottom:6 }}>{t.name}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a4a2a', marginBottom:10 }}>✦ {t.plant} · {t.elder}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {t.tags.map(tag => <Tag key={tag} label={tag} color='#0f6b4a'/>)}
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#4a6a4a' }}>{t.region}</span>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function RegisterScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ plant:'', elder:'', dosage:'', preparation:'', consent:false });
  const steps = ['Planta', 'Ancião', 'Tratamento', 'Confirmação'];
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <Screen title="Registar Saber" subtitle="Preserve o conhecimento ancestral das comunidades">
      <div style={{ display:'flex', gap:0, marginBottom:32 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background: i<=step ? '#0f6b4a' : '#d0e0d0', color: i<=step ? '#fff' : '#4a6a4a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, transition:'all 0.2s' }}>
              {i<step ? '✓' : i+1}
            </div>
            <span style={{ fontSize:12, fontWeight: i===step?700:600, color: i<=step ? '#0f6b4a' : '#4a6a4a' }}>{s}</span>
          </div>
        ))}
      </div>
      {step===0 && (
        <div>
          <label style={{ fontSize:14, fontWeight:800, color:'#0f2a1a', display:'block', marginBottom:10 }}>Nome da planta (português ou Kimbundu)</label>
          <input value={form.plant} onChange={e=>upd('plant',e.target.value)} placeholder="Ex: Moringa / Mukenga" style={{ width:'100%', padding:'14px 16px', fontSize:15, fontWeight:600, border:'2px solid #d0e0d0', borderRadius:16, background:'#ffffff', color:'#0f2a1a', fontFamily:'Georgia, serif', outline:'none', marginBottom:14 }} />
          <div style={{ display:'flex', gap:12 }}>
            <button style={{ flex:1, padding:'14px', background:'#0f6b4a', color:'#fff', border:'none', borderRadius:16, fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Georgia, serif' }} onClick={()=>{}}>◎ Identificar por câmara</button>
          </div>
        </div>
      )}
      {step===1 && (
        <div>
          <label style={{ fontSize:14, fontWeight:800, color:'#0f2a1a', display:'block', marginBottom:10 }}>Nome do ancião detentor do saber</label>
          <input value={form.elder} onChange={e=>upd('elder',e.target.value)} placeholder="Nome do ancião" style={{ width:'100%', padding:'14px 16px', fontSize:15, fontWeight:600, border:'2px solid #d0e0d0', borderRadius:16, background:'#ffffff', color:'#0f2a1a', fontFamily:'Georgia, serif', outline:'none', marginBottom:14 }} />
          <div style={{ background:'#fafdf8', border:'2px dashed #b8d4b8', borderRadius:16, padding:'16px', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:24 }}>◉</span>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:'#0f6b4a' }}>Gravar consentimento em áudio</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#4a6a4a' }}>Protege o patrimônio cultural</div>
            </div>
          </div>
          <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
            <input type="checkbox" id="consent" checked={form.consent} onChange={e=>upd('consent',e.target.checked)} style={{ width:18, height:18, accentColor:'#0f6b4a' }} />
            <label htmlFor="consent" style={{ fontSize:13, fontWeight:600, color:'#0f2a1a' }}>O ancião autorizou o registo e uso público deste saber</label>
          </div>
        </div>
      )}
      {step===2 && (
        <div>
          <label style={{ fontSize:14, fontWeight:800, color:'#0f2a1a', display:'block', marginBottom:10 }}>Posologia e preparação</label>
          <textarea value={form.preparation} onChange={e=>upd('preparation',e.target.value)} placeholder="Descreva como preparar e usar o tratamento..." rows={4} style={{ width:'100%', padding:'14px 16px', fontSize:15, fontWeight:600, border:'2px solid #d0e0d0', borderRadius:16, background:'#ffffff', color:'#0f2a1a', fontFamily:'Georgia, serif', outline:'none', resize:'vertical', marginBottom:14 }} />
          <div style={{ display:'flex', gap:12 }}>
            <button style={{ flex:1, padding:'14px', background:'#e0f0e0', color:'#0f4a2a', border:'2px solid #b8d4b8', borderRadius:16, fontSize:13, fontWeight:800, cursor:'pointer' }}>✎ Foto da planta</button>
            <button style={{ flex:1, padding:'14px', background:'#e0f0e0', color:'#0f4a2a', border:'2px solid #b8d4b8', borderRadius:16, fontSize:13, fontWeight:800, cursor:'pointer' }}>⊕ GPS automático</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div style={{ textAlign:'center', padding:'28px 0' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>✦</div>
          <h3 style={{ fontSize:22, fontWeight:800, color:'#0f6b4a', fontFamily:'Georgia, serif', marginBottom:10 }}>Registo pronto para guardar</h3>
          <p style={{ fontSize:15, fontWeight:600, color:'#1a4a2a', lineHeight:1.7, maxWidth:280, margin:'0 auto 24px' }}>Este saber do ancião ficará preservado para as próximas gerações de angolanos.</p>
          <div style={{ background:'#fafdf8', borderRadius:18, padding:'20px', textAlign:'left', marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#4a6a4a', marginBottom:6 }}>Planta</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>{form.plant || '—'}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#4a6a4a', marginTop:14, marginBottom:6 }}>Ancião</div>
            <div style={{ fontSize:16, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>{form.elder || '—'}</div>
          </div>
        </div>
      )}
      <div style={{ display:'flex', gap:12, marginTop:24 }}>
        {step>0 && (
          <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'14px', background:'#e0f0e0', color:'#0f4a2a', border:'none', borderRadius:16, fontSize:14, fontWeight:800, cursor:'pointer' }}>← Anterior</button>
        )}
        <button onClick={()=> step<3 ? setStep(s=>s+1) : alert('Saber registado com sucesso! Obrigado por preservar a nossa cultura.')}
          style={{ flex:2, padding:'14px', background:'#0f6b4a', color:'#fff', border:'none', borderRadius:16, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Georgia, serif' }}>
          {step<3 ? 'Continuar →' : '✓ Guardar saber'}
        </button>
      </div>
    </Screen>
  );
}

function ReportsScreen() {
  const reports = [
    { name:'Tratamentos por Província', icon:'▦', count:'318 registos', date:'Hoje', color:'#1a6b4a' },
    { name:'Plantas mais utilizadas',   icon:'✦', count:'142 plantas',  date:'Hoje', color:'#5a7a2d' },
    { name:'Doenças recorrentes – Zango 0', icon:'◉', count:'27 casos', date:'Ontem', color:'#b85c1a' },
    { name:'Cobertura por Província',   icon:'⊕', count:'27 províncias',date:'Esta semana', color:'#1a5f8a' },
  ];
  return (
    <Screen title="Relatórios" subtitle="Epidemiologia comunitária">
      {reports.map((r,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:16, background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18, padding:'18px 20px', marginBottom:12, cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=r.color+'80'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='#d0e0d0'}>
          <div style={{ width:48, height:48, borderRadius:16, background:r.color+'30', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:r.color }}>{r.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>{r.name}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'#4a6a4a', marginTop:4 }}>{r.count} · {r.date}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ padding:'8px 14px', background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:12, fontSize:11, fontWeight:800, color:'#0f4a2a', cursor:'pointer' }}>PDF</button>
            <button style={{ padding:'8px 14px', background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:12, fontSize:11, fontWeight:800, color:'#0f4a2a', cursor:'pointer' }}>CSV</button>
          </div>
        </div>
      ))}
    </Screen>
  );
}

function UsersScreen() {
  const users = [
    { name:'Admin Silva',   initials:'AS', role:'admin',    email:'admin@botanica.ao' },
    { name:'Técnico Matos', initials:'TM', role:'tecnico',  email:'tmatos@botanica.ao' },
    { name:'Maria João',    initials:'MJ', role:'paciente', email:'mjoao@botanica.ao' },
    { name:'Anciã Luisa',   initials:'AL', role:'paciente', email:'aluisa@botanica.ao' },
  ];
  return (
    <Screen title="Utilizadores" subtitle="Gestão de contas e perfis">
      {users.map((u,i) => {
        const r = ROLES[u.role];
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:16, background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18, padding:'16px 20px', marginBottom:10 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background: r.color+'30', color: r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800 }}>{u.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>{u.name}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#4a6a4a' }}>{u.email}</div>
            </div>
            <span style={{ fontSize:12, fontWeight:800, color:r.color, background:r.color+'20', borderRadius:30, padding:'5px 14px' }}>{r.label}</span>
          </div>
        );
      })}
      <button style={{ width:'100%', marginTop:12, padding:'16px', background:'#e0f0e0', border:'2px dashed #b8d4b8', borderRadius:18, fontSize:14, fontWeight:800, color:'#0f4a2a', cursor:'pointer' }}>+ Adicionar utilizador</button>
    </Screen>
  );
}

function SettingsScreen({ lang, setLang, largeFont, setLargeFont, highContrast, setHighContrast }) {
  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.setProperty('--bg', '#000');
      document.documentElement.style.setProperty('--text', '#ff0');
      document.documentElement.style.setProperty('--border', '#fff');
      document.documentElement.style.setProperty('--btn-bg', '#333');
      document.documentElement.style.filter = 'none';
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--text');
      document.documentElement.style.removeProperty('--border');
      document.documentElement.style.removeProperty('--btn-bg');
      document.documentElement.style.filter = '';
    }
  }, [highContrast]);

  const toggleHC = () => {
    setHighContrast(prev => !prev);
    alert('Alto contraste ' + (!highContrast ? 'ativado' : 'desativado'));
  };

  return (
    <Screen title="Definições" subtitle="Acessibilidade e preferências · Mayenge">
      <div style={{ background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18, overflow:'hidden', marginBottom:20 }}>
        {[
          { label:'Língua / Language', sub:'Português · Kimbundu', action: ()=>setLang(l=>l==='pt'?'ki':'pt') },
          { label:'Alto contraste', sub: highContrast ? 'Ativado' : 'Desativado', action: toggleHC },
          { label: 'Modo offline', sub: 'Em desenvolvimento – Acesso sem internet em breve', action: () => {} },
        ].map((item,i,arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom: i<arr.length-1 ? '2px solid #eaf0e8' : 'none', cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background='#fafdf8'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            onClick={item.action}>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#0f2a1a' }}>{item.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#4a6a4a', marginTop:4 }}>{item.sub}</div>
            </div>
            <span style={{ color:'#b8d4b8', fontSize:18 }}>›</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:12, fontWeight:600, color:'#4a6a4a', textAlign:'center', lineHeight:1.7 }}>
        Botanica v1.0.0 · Instituto Superior Politécnico Katangoji<br/>
        Engenharia Informática · 2026
      </p>
    </Screen>
  );
}

/* ─── HELP BOT (moved to bottom, darker) ───────────────────────────────── */
function HelpBot() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('welcome');

  const topics = {
    welcome: { title: 'Bem‑vindo à Comunidade Botânica Ispk', text: 'Esta aplicação preserva o saber medicinal angolano. Podes identificar plantas, fazer um autodiagnóstico com o Ndembo, e ver tratamentos tradicionais. Usa o menu superior esquerdo para navegar. Ouve com atenção:' },
    diagnose: { title: 'Autodiagnóstico com Ndembo', text: 'Conversa com o curandeiro virtual. Ele vai perguntar sobre os teus sintomas e sugerir plantas medicinais da tua região. As sugestões não substituem um médico.' },
    identify: { title: 'Identificar planta', text: 'Tira uma foto da planta e a IA identifica o seu nome popular, científico e usos medicinais.' },
    plants: { title: 'Plantas Medicinais', text: 'Catálogo com todas as plantas registadas pelos anciãos angolanos. Pesquisa por nome português, kimbundu ou científico.' },
    treatments: { title: 'Tratamentos tradicionais', text: 'Lista de preparos transmitidos por anciãos. Cada um inclui a planta, o nome do ancião e a região.' },
    settings: { title: 'Definições', text: 'Podes trocar entre português e kimbundu, aumentar o tamanho da letra e ativar o modo alto contraste.' }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ position:'fixed', bottom: 90, right: 20, width:56, height:56, borderRadius:'50%', background:'#0f4a2a', color:'#fff', fontSize:26, border:'2px solid #d4f0d4', boxShadow:'0 6px 14px rgba(0,0,0,0.2)', cursor:'pointer', zIndex:1000 }}>
        🌱
      </button>
      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000 }} onClick={() => setOpen(false)}>
          <div style={{ background:'#ffffff', borderRadius:24, padding:'28px', maxWidth:420, width:'90%', maxHeight:'80vh', overflowY:'auto', border:'2px solid #d0e0d0' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:22, fontFamily:'Lora, Georgia, serif', marginBottom:14, color:'#0f2a1a' }}>{topics[topic].title}</h2>
            <p style={{ fontSize:16, fontWeight:500, lineHeight:1.7, marginBottom:24, color:'#0f2a1a' }}>{topics[topic].text}</p>
            <button onClick={() => speak(topics[topic].text)} style={{ marginBottom:16, padding:'10px 18px', background:'#0f6b4a', color:'#fff', border:'none', borderRadius:14, fontWeight:800, cursor:'pointer' }}>🔊 Ouvir explicação</button>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {Object.keys(topics).map(key => (
                <button key={key} onClick={() => setTopic(key)} style={{ padding:'8px 14px', background: topic===key ? '#0f6b4a' : '#e0f0e0', color: topic===key ? '#fff' : '#0f2a1a', border:'2px solid #b8d4b8', borderRadius:12, fontSize:12, fontWeight:800, cursor:'pointer' }}>
                  {key==='welcome'?'Início':key==='diagnose'?'Autodiagnóstico':key==='identify'?'Identificar':key==='plants'?'Plantas':key==='treatments'?'Tratamentos':key==='settings'?'Definições':''}
                </button>
              ))}
            </div>
            <button onClick={() => setOpen(false)} style={{ marginTop:20, padding:'12px 18px', background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:14, cursor:'pointer', width:'100%', color:'#0f4a2a', fontWeight:800 }}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── BOTANICA UI (the whole visual shell) ──────────────────────────────── */
function PlantRemedyCard({ remedy }) {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function fetchImage() {
      try {
        const res = await fetch('/api/plant-image', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ plantName: remedy.plantName }) });
        const data = await res.json();
        if (!cancelled && data.imageUrl) setImageUrl(data.imageUrl);
      } catch (err) { console.warn('Could not fetch plant image:', err); }
    }
    fetchImage();
    return () => { cancelled = true; };
  }, [remedy.plantName]);

  return (
    <div style={{ background:'#ffffff', border:'2px solid #d0e0d0', borderRadius:18, padding:'18px', marginBottom:14, display:'flex', gap:18, alignItems:'flex-start' }}>
      <div style={{ width:88, height:88, borderRadius:16, background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
        {imageUrl ? <img src={imageUrl} alt={remedy.plantName} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> :
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='44' height='44'%3E%3Cpath fill='%230f6b4a' d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75l-.55 1.5C1.5 15.5 0 13 0 10c0-4 10-6 17-8z'/%3E%3C/svg%3E" alt="Planta" style={{ width:44, height:44 }} />}
      </div>
      <div style={{ flex:1 }}>
        <h3 style={{ fontSize:22, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif', marginBottom:6 }}>🌿 {remedy.plantName}</h3>
        <p style={{ fontSize:16, fontWeight:600, color:'#0f2a1a', marginTop:6 }}><strong>Preparo:</strong> {remedy.preparation}</p>
        <p style={{ fontSize:16, fontWeight:600, color:'#0f2a1a' }}><strong>Dose:</strong> {remedy.dosage}</p>
        <p style={{ fontSize:16, fontWeight:600, color:'#0f2a1a' }}><strong>Cuidados:</strong> {remedy.precautions}</p>
        <SpeakButton text={`${remedy.plantName}. Preparo: ${remedy.preparation}. Dose: ${remedy.dosage}. Cuidados: ${remedy.precautions}`} />
      </div>
    </div>
  );
}

function BotanicaUI({ role, setRole, active, setActive, sideOpen, setSideOpen, goBack, lang, setLang, largeFont, setLargeFont, highContrast, setHighContrast, sideRef, isAuthenticated, onLogout, onNavigate }) {
  const menuByGroup = Object.entries(GROUPS).map(([groupId, groupLabel]) => ({ groupId, groupLabel, items: MENU.filter(m => m.group === groupId && m.roles.includes(role)) })).filter(g => g.items.length > 0);
  const r = ROLES[role];

  const renderScreen = () => {
    if (!canAccess(role, active)) {
      return <div style={{ textAlign:'center', padding:'56px 24px' }}><div style={{ fontSize:56 }}>🔒</div><h2 style={{ fontSize:22, fontWeight:800, color:'#0f2a1a', fontFamily:'Georgia, serif' }}>Acesso restrito</h2><p style={{ fontSize:16, fontWeight:600, color:'#1a4a2a' }}>Esta secção não está disponível para o perfil de <strong>{r.label}</strong>.</p></div>;
    }
    switch(active) {
      case 'home':       return <HomeScreen role={role} onNavigate={onNavigate}/>;
      case 'diagnose':   return <DiagnoseScreen/>;
      case 'plants':     return <PlantsScreen/>;
      case 'treatments': return <TreatmentsScreen/>;
      case 'identify':   return <IdentifyScreen/>;
      case 'register':   return <RegisterScreen/>;
      case 'reports':    return <ReportsScreen/>;
      case 'users':      return <UsersScreen/>;
      case 'settings':   return <SettingsScreen lang={lang} setLang={setLang} largeFont={largeFont} setLargeFont={setLargeFont} highContrast={highContrast} setHighContrast={setHighContrast} />;
      default:           return <HomeScreen role={role} onNavigate={onNavigate}/>;
    }
  };

  return (
    <>
     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans', sans-serif; font-size: 17px; line-height: 1.6; background:#d8f0e0; color:#0f2a1a; }
  h1,h2,h3 { font-family:'Lora', Georgia, serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:#d0e0d0; }
  ::-webkit-scrollbar-thumb { background:#8fcca0; border-radius:8px; }
  .high-contrast, .high-contrast * {
    background-color: #000 !important;
    color: #ff0 !important;
    border-color: #fff !important;
  }
  .high-contrast button {
    background-color: #333 !important;
    color: #ff0 !important;
    border: 2px solid #fff !important;
  }
  .high-contrast input, .high-contrast textarea {
    background-color: #111 !important;
    color: #ff0 !important;
  }
  .high-contrast .plant-card {
    background-color: #1a1a1a !important;
    border-color: #444 !important;
  }
  .large-font * { font-size: 1.15em !important; line-height: 1.7 !important; }
`}</style>

      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#f0faf4', minHeight:'100vh', borderRadius:28, border:'2px solid #c8dbc8', overflow:'hidden', position:'relative', boxShadow:'0 10px 35px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', fontFamily:"'DM Sans', sans-serif" }} className={`${largeFont ? 'large-font' : ''} ${highContrast ? 'high-contrast' : ''}`}>

        {sideOpen && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:40, backdropFilter:'blur(2px)' }} onClick={()=>setSideOpen(false)}/>}

        <div ref={sideRef} style={{ position:'absolute', top:0, left:0, bottom:0, width:280, background:'#ffffff', borderRight:'2px solid #d0e0d0', zIndex:50, transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.3s cubic-bezier(0.16,1,0.3,1)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ padding:'24px 24px 18px', borderBottom:'2px solid #eaf0e8' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:'#0f4a2a', color:'#d4f0d4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>✦</div>
              <div><div style={{ fontSize:20, fontWeight:800, color:'#0f2a1a', fontFamily:'Lora, Georgia, serif' }}>Botanica</div><div style={{ fontSize:12, fontWeight:600, color:'#4a6a4a' }}>Comunidade Ispk</div></div>
            </div>
            {isAuthenticated ? (
              <>
                <p style={{ fontSize:11, fontWeight:800, color:'#4a6a4a', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Perfil ativo</p>
                <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                  {Object.entries(ROLES).map(([id, rd]) => (
                    <button key={id} onClick={() => { setRole(id); if(!canAccess(id,active)) setActive('home'); }} style={{ flex:1, padding:'8px 6px', borderRadius:14, border:'2px solid', fontSize:11, fontWeight:800, cursor:'pointer', borderColor: role===id ? rd.color : '#d0e0d0', background: role===id ? rd.color : 'transparent', color: role===id ? '#fff' : '#4a6a4a', transition:'all 0.15s' }}>
                      {id==='admin'?'🛡️':id==='tecnico'?'🌿':'🫀'}<br/><span style={{ fontSize:10 }}>{id==='admin'?'Admin':id==='tecnico'?'Técnico':'Paciente'}</span>
                    </button>
                  ))}
                </div>
                <button onClick={onLogout} style={{ background:'#e0f0e0', border:'2px solid #b8d4b8', borderRadius:12, padding:'8px 12px', fontSize:12, fontWeight:800, cursor:'pointer', width:'100%', color:'#0f4a2a' }}>🚪 Sair da conta</button>
              </>
            ) : (
              <button onClick={() => setRole('admin')} style={{ marginTop:12, padding:'10px 14px', background:'#0f6b4a', color:'#fff', border:'none', borderRadius:14, fontSize:13, fontWeight:800, cursor:'pointer', width:'100%' }}>Entrar como Admin/Técnico</button>
            )}
          </div>
          <div style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
            {menuByGroup.map(group => (
              <div key={group.groupId}>
                <p style={{ fontSize:11, fontWeight:800, color:'#4a6a4a', letterSpacing:'0.1em', textTransform:'uppercase', padding:'12px 24px 6px' }}>{group.groupLabel}</p>
                {group.items.map(item => {
                  const isActive = active === item.id;
                  return (
                    <div key={item.id} onClick={() => onNavigate(item.id)} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 24px', cursor:'pointer', background: isActive ? '#fafdf8' : 'transparent', borderLeft: isActive ? '4px solid #0f6b4a' : '4px solid transparent', transition:'all 0.12s' }}>
                      <span style={{ fontSize:22, color: isActive ? '#0f6b4a' : '#4a6a4a' }}>{item.icon}</span>
                      <div style={{ flex:1 }}><div style={{ fontSize:16, fontWeight: isActive ? 800 : 600, color: isActive ? '#0f2a1a' : '#1a4a2a' }}>{lang === 'ki' ? item.labelK : item.label}</div></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ padding:'16px 24px', borderTop:'2px solid #eaf0e8', fontSize:12, fontWeight:600, color:'#4a6a4a', textAlign:'center' }}><div style={{ fontWeight:800, color:'#0f2a1a', marginBottom:4 }}>Botanica v1.0</div>ISPK · Engenharia Informática · 2026</div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'#ffffff', borderBottom:'2px solid #eaf0e8', position:'sticky', top:0, zIndex:30 }}>
          {active !== 'home' && <button onClick={goBack} style={{ width:44, height:44, borderRadius:14, border:'2px solid #d0e0d0', background:'#f0faf4', cursor:'pointer', fontSize:20, color:'#0f4a2a', marginRight:10, fontWeight:800 }}>←</button>}
          <button onClick={()=>setSideOpen(o=>!o)} style={{ width:44, height:44, borderRadius:14, border:'2px solid #d0e0d0', background:'#f0faf4', cursor:'pointer', fontSize:20, color:'#0f4a2a' }}>☰</button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:10, height:10, borderRadius:'50%', background:'#0f6b4a' }}/><span style={{ fontSize:18, fontWeight:800, color:'#0f2a1a', fontFamily:'Lora, Georgia, serif' }}>Botanica</span></div>
          <div style={{ width:44, height:44, borderRadius:14, background: r.color+'30', color: r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800 }}>{role==='admin'?'A':role==='tecnico'?'T':'P'}</div>
        </div>

        <div style={{ flex:1, padding:'24px 20px 100px', overflowY:'auto', overflowX:'hidden', width:'100%', maxWidth:'100%', boxSizing:'border-box' }}>
          {renderScreen()}
        </div>

        {/* Bottom navigation bar - much darker, with vivid icons and active state */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#1a4a2a', backdropFilter:'blur(16px)', borderTop:'2px solid #2a6a4a', display:'grid', gridTemplateColumns:'repeat(5,1fr)', padding:'10px 0 14px', zIndex:20 }}>
          {(() => {
            const tabs = ['home', 'plants', 'diagnose', 'identify'];
            if (role === 'paciente') tabs.push('settings');
            else tabs.push('register');
            return tabs;
          })().map(id => {
            const item = MENU.find(m => m.id === id);
            if (!item) return null;
            const isActive = active === id;
            return (
              <button key={id} onClick={() => onNavigate(id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', padding:'6px 0' }}>
                <span style={{ fontSize:28, color: isActive ? '#d4f0d4' : '#8fcca0' }}>{item.icon}</span>
                <span style={{ fontSize:12, fontWeight: isActive ? 800 : 700, color: isActive ? '#ffffff' : '#b0e0b0', letterSpacing:'0.02em' }}>{lang==='ki' ? item.labelK.split(' ')[0] : item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <HelpBot />
    </>
  );
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────── */
function BotanicaApp() {
  const { isAuthenticated, currentRole, login, logout } = useAuth();
  const [highContrast, setHighContrast] = useState(false);
  const [role, setRole] = useState('paciente');
  const [active, setActive] = useState('home');
  const [sideOpen, setSideOpen] = useState(false);
  const [lang, setLang] = useState('pt');
  const [largeFont, setLargeFont] = useState(false);
  const sideRef = useRef(null);

  useEffect(() => { if (window.speechSynthesis) window.speechSynthesis.getVoices(); }, []);

  const goBack = () => window.history.back();

  useEffect(() => {
    const handlePopState = (e) => { if (e.state && e.state.screen) { setActive(e.state.screen); setSideOpen(false); } };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => { if (active === 'home') window.history.replaceState({ screen: active }, '', ''); }, [active]);

  const navigate = (id) => {
    if (!canAccess(role, id)) return;
    if (id !== active) {
      window.history.pushState({ screen: id }, '', `#${id}`);
      setActive(id);
      setSideOpen(false);
    }
  };

  useEffect(() => { if (isAuthenticated) setRole(currentRole); else setRole('paciente'); }, [isAuthenticated, currentRole]);

  useEffect(() => {
    const handler = e => { if (sideRef.current && !sideRef.current.contains(e.target)) setSideOpen(false); };
    if (sideOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sideOpen]);

  const handleLogin = (r) => { login(r); setRole(r); setActive('home'); };
  const handleLogout = () => { logout(); setRole('paciente'); setActive('home'); };

  if (!isAuthenticated && (role === 'admin' || role === 'tecnico')) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#d8f0e0' }}>
        <div style={{ maxWidth:420, width:'100%', padding:'2rem' }}>
          <h2 style={{ fontFamily:'Lora, Georgia, serif', textAlign:'center', marginBottom:'2rem', color:'#0f2a1a', fontSize:28, fontWeight:800 }}>🌿 Comunidade Botânica Ispk</h2>
          <LoginForm onLogin={handleLogin} />
          <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
            <button onClick={() => { setRole('paciente'); setActive('home'); }} style={{ background:'none', border:'none', color:'#0f6b4a', cursor:'pointer', fontSize:16, fontWeight:700 }}>Continuar como visitante (paciente)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BotanicaUI
      goBack={goBack} role={role} setRole={setRole} active={active} setActive={setActive}
      sideOpen={sideOpen} setSideOpen={setSideOpen} lang={lang} setLang={setLang}
      largeFont={largeFont} setLargeFont={setLargeFont} highContrast={highContrast} setHighContrast={setHighContrast}
      sideRef={sideRef} isAuthenticated={isAuthenticated} onLogout={handleLogout} onNavigate={navigate}
    />
  );
}

export default function App() {
  return (<AuthProvider><BotanicaApp /></AuthProvider>);
}
