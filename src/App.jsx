// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const ROLES = {
  admin:   { id:'admin',   label:'Administrador',    labelK:'Nkuluntu',         color:'#0d5c3a', bg:'#e6f4ee', accent:'#1a9a60' },
  tecnico: { id:'tecnico', label:'Técnico de Campo', labelK:'Mukanda wa Nsi',   color:'#7c4a1e', bg:'#f5ede3', accent:'#c87941' },
  paciente:{ id:'paciente',label:'Paciente',          labelK:'Muntu wa Buanga',  color:'#1a4a7c', bg:'#e3eef5', accent:'#3a82c4' },
};

const MENU = [
  { id:'home',      label:'Início',            labelK:'Yibu',             icon:'⌂',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'diagnose',  label:'Autodiagnóstico',   labelK:'Diangula Mwini',   icon:'♡',  roles:['admin','tecnico','paciente'], group:'main', highlight:true },
  { id:'plants',    label:'Plantas Medicinais',labelK:'Miti ya Buanga',   icon:'✦',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'treatments',label:'Tratamentos',       labelK:'Buanga',           icon:'❋',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'identify',  label:'Identificar Planta',labelK:'Zibula Muti',      icon:'◎',  roles:['admin','tecnico','paciente'], group:'main'   },
  { id:'search',    label:'Pesquisa',          labelK:'Kambula',          icon:'⊕',  roles:['admin','tecnico','paciente'], group:'main'   },
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
  { id:1, name:'Moringa',      sci:'Moringa oleifera',      use:'Nutritivo · Imunidade',    kimbundu:'Mukenga',   region:'Luanda',  confidence:97, treatments:14, color:'#2d7a4f' },
  { id:2, name:'Boldo',        sci:'Peumus boldus',         use:'Digestivo · Fígado',        kimbundu:'Ntombo',    region:'Huambo',  confidence:94, treatments:8,  color:'#5a7a2d' },
  { id:3, name:'Capim-limão',  sci:'Cymbopogon citratus',  use:'Ansiolítico · Febre',       kimbundu:'Nkasa',     region:'Malanje', confidence:91, treatments:11, color:'#7a6b2d' },
  { id:4, name:'Quiabento',    sci:'Abelmoschus esculentus',use:'Anti-inflamatório',         kimbundu:'Kibondo',   region:'Cabinda', confidence:88, treatments:6,  color:'#2d5a7a' },
  { id:5, name:'Mulemba',      sci:'Ficus thonningii',     use:'Malária · Dor',             kimbundu:'Mulemba',   region:'Bié',     confidence:96, treatments:19, color:'#7a2d5a' },
  { id:6, name:'Nkasa',        sci:'Erythrophleum suaveol.',use:'Antibacteriano',            kimbundu:'Nkasa',     region:'Uíge',    confidence:82, treatments:5,  color:'#4a2d7a' },
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
    return match || province || 'Desconhecida';
  } catch {
    return 'Desconhecida';
  }
}

/* ─── REUSABLE COMPONENTS ───────────────────────────────────────────────── */
function Screen({ children, title, subtitle }) {
  return (
    <div style={{ animation:'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 28 }}>
          {title && (
            <h1 style={{
              fontSize: 28, fontWeight: 700, color: '#0f1a12',
              letterSpacing: '-0.02em', fontFamily: 'Lora, Georgia, serif'
            }}>{title}</h1>
          )}
          {subtitle && (
            <p style={{ fontSize: 18, color: '#6b7c6e', marginTop: 4, lineHeight: 1.6 }}>
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
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#f9faf7' : '#fff',
        border: `1.5px solid ${hov ? plant.color + '44' : '#e8ede9'}`,
        borderRadius: 16,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 24px ${plant.color}18` : 'none',
      }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div style={{
          width:40, height:40, borderRadius:12,
          background: plant.color + '18',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:20, color: plant.color
        }}>✦</div>
        <span style={{
          fontSize:11, fontWeight:600, color: plant.color,
          background: plant.color + '14', borderRadius:8, padding:'3px 8px'
        }}>{plant.confidence}% confiança</span>
      </div>
      <div style={{ fontSize:15, fontWeight:700, color:'#0f1a12', marginBottom:2, fontFamily:'Georgia, serif' }}>{plant.name}</div>
      <div style={{ fontSize:11, color:'#9aa89c', fontStyle:'italic', marginBottom:6 }}>{plant.sci}</div>
      <div style={{ fontSize:11, color:'#6b7c6e', marginBottom:8 }}>{plant.use}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:11, color:'#9aa89c' }}>
          <span style={{ color: plant.color, fontWeight:600 }}>{plant.kimbundu}</span> · {plant.region}
        </span>
        <span style={{ fontSize:11, color:'#9aa89c' }}>{plant.treatments} tratamentos</span>
      </div>
    </div>
  );
}

function Tag({ label, color = '#1a9a60' }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color,
      background: color + '18', borderRadius: 20,
      padding: '2px 8px', letterSpacing: '0.02em'
    }}>{label}</span>
  );
}

function Disclaimer() {
  return (
    <div style={{
      background: '#fdf8e8', border: '1px solid #f0e060', borderRadius: 12,
      padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20
    }}>
      <span style={{ fontSize: 16 }}>⚠️</span>
      <p style={{ fontSize: 11, color: '#7a6520', lineHeight: 1.6, margin: 0 }}>
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
      background:'none', border:'1px solid #1a9a60', borderRadius:8,
      padding:'2px 8px', fontSize:11, color:'#1a9a60', cursor:'pointer',
      marginLeft:8
    }} title="Ouvir descrição">
      🔊 {label}
    </button>
  );
}

/* ─── SCREEN: Chatbot Autodiagnóstico ──────────────────────────────────── */
function DiagnoseScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Eu sou o Ndembo, o teu curandeiro virtual. Conta-me como te sentes hoje. Podes falar em português ou Kimbundu.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    (async () => {
      let prov = 'Desconhecida';
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
        body: JSON.stringify({
          messages: updatedMessages,
          province: province,
          language: 'pt'
        })
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
        try {
          resultData = JSON.parse(match[1]);
        } catch (jsonErr) {
          console.warn('Failed to parse assistant JSON:', jsonErr);
          displayText = reply;
        }
      }

      if (displayText) {
        setMessages(prev => [...prev, { role: 'assistant', content: displayText }]);
      }

      if (resultData && resultData.triage) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'result',
          content: resultData
        }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Screen>
      <h1 style={{ fontSize:22, fontWeight:700, color:'#0f1a12', fontFamily:'Lora, Georgia, serif' }}>🩺 Autodiagnóstico com IA</h1>
     <p style={{ fontSize:18, color:'#6b7c6e', marginTop:4, marginBottom:20 }}>Conversa com o Ndembo — ele vai ajudar-te.</p>
      <Disclaimer />
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e8ede9', padding:'16px', minHeight:300, maxHeight:400, overflowY:'auto', marginBottom:16 }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          if (msg.type === 'result') {
            const { triage, urgentMessage, remedies } = msg.content;
            return (
              <div key={idx} style={{ marginBottom:12 }}>
                {triage === 'red' && (
                  <div style={{ background:'#fff0f0', border:'1.5px solid #f08080', borderRadius:14, padding:'14px', marginBottom:12, color:'#c0392b' }}>
                    🚨 <strong>Urgência:</strong> {urgentMessage || 'Procure atendimento hospitalar imediatamente!'}
                  </div>
                )}
                {triage === 'yellow' && (
                  <div style={{ background:'#fff8e7', border:'1.5px solid #f4a261', borderRadius:14, padding:'14px', marginBottom:12, color:'#a64b2a' }}>
                    ⚠️ <strong>Atenção:</strong> {urgentMessage || 'Consulte um profissional se os sintomas piorarem.'}
                  </div>
                )}
                {triage === 'green' && (
                  <div style={{ background:'#e8f5ee', border:'1.5px solid #a0d8b8', borderRadius:14, padding:'14px', marginBottom:12, color:'#1a6b4a' }}>
                    ✅ <strong>Situação estável:</strong> Siga as sugestões abaixo.
                  </div>
                )}
                {remedies && remedies.map((r, idx2) => (
                  <div key={idx2} style={{
                    background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, padding:'16px', marginBottom:10
                  }}>
                  <h3 style={{ fontSize:20, fontWeight:700, color:'#0f1a12', fontFamily:'Georgia, serif', marginBottom:4 }}>🌿 {r.plantName}</h3>
                  <p style={{ fontSize:16, color:'#6b7c6e', marginTop:4 }}><strong>Preparo:</strong> {r.preparation}</p>
                  <p style={{ fontSize:16, color:'#6b7c6e' }}><strong>Dose:</strong> {r.dosage}</p>
                  <p style={{ fontSize:16, color:'#9aa89c' }}><strong>Cuidados:</strong> {r.precautions}</p>
                    <SpeakButton text={`${r.plantName}. Preparo: ${r.preparation}. Dose: ${r.dosage}. Cuidados: ${r.precautions}`} />
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div key={idx} style={{
              display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
              marginBottom:12
            }}>
              <div style={{
                maxWidth:'80%', padding:'10px 14px', borderRadius:14,
                background: isUser ? '#1a9a60' : '#f0f4e8',
                color: isUser ? '#fff' : '#0f1a12',
               fontSize:16,
               lineHeight:1.7,
                whiteSpace:'pre-wrap',
                wordBreak:'break-word'
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ textAlign:'center', color:'#6b9a74', padding:8 }}>
            Ndembo está a pensar...
          </div>
        )}
        {error && (
          <div style={{ color:'#c0392b', fontSize:12, padding:8 }}>{error}</div>
        )}
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreve os teus sintomas..."
          style={{
            flex:1, padding:'14px 18px', fontSize:16, border:'1.5px solid #d4e0d8',
            borderRadius:14, background:'#fafcfa', color:'#0f1a12',
            fontFamily:'Georgia, serif', outline:'none'
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
        style={{
          padding:'14px 24px', background: input.trim() ? '#1a9a60' : '#c8d8cc',
          color:'#fff', border:'none', borderRadius:14, fontWeight:700, cursor:'pointer',
          fontSize:16
        }}>
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
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <h1 style={{ fontSize:28, fontWeight:700, color:'#0f1a12', fontFamily:'Lora, Georgia, serif' }}>🩺 Autodiagnóstico com IA</h1>
      <p style={{ fontSize:13, color:'#6b7c6e', marginTop:4, marginBottom:20 }}>Tire uma foto da planta para identificação automática</p>
      {!previewUrl ? (
        <label style={{ display:'block', border:'2px dashed #a0d8b8', borderRadius:16, padding:'40px 20px', textAlign:'center', cursor:'pointer', background:'#f4faf6', marginBottom:16 }}>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
          <span style={{ fontSize:32 }}>📸</span><br/>
          <span style={{ fontSize:14, fontWeight:600, color:'#1a6b4a' }}>Clique para escolher uma foto</span>
          <p style={{ fontSize:11, color:'#6b9a74' }}>JPG, PNG (até 5MB)</p>
        </label>
      ) : (
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <img src={previewUrl} alt="Preview" style={{ maxHeight:240, borderRadius:14, border:'1px solid #d4e0d8' }} />
          <button onClick={() => { setPreviewUrl(null); setImageBase64(null); }} style={{ marginLeft:8, background:'#fff', border:'1px solid #d4e0d8', borderRadius:8, padding:'6px 12px', cursor:'pointer' }}>
            ✕ Remover
          </button>
        </div>
      )}
      {previewUrl && !result && (
        <button onClick={analyze} disabled={loading} style={{ width:'100%', padding:'14px', background: loading ? '#c8d8cc' : '#1a9a60', color:'#fff', border:'none', borderRadius:14, fontWeight:700, cursor:'pointer', fontFamily:'Georgia, serif' }}>
          {loading ? 'Analisando...' : '🔍 Identificar planta'}
        </button>
      )}
      {loading && <p style={{ textAlign:'center', color:'#6b9a74', marginTop:12 }}>Processando imagem com IA...</p>}
      {error && <div style={{ color:'#c0392b', marginTop:16, fontSize:12, background:'#fff0f0', padding:12, borderRadius:12 }}>{error}</div>}
      {result && !result.erro && (
        <div style={{ marginTop:20, border:'1.5px solid #e8ede9', borderRadius:14, overflow:'hidden' }}>
          <div style={{ background:'#1a6b4a', color:'#fff', padding:'16px 20px', fontFamily:'Georgia, serif' }}>
            <div style={{ fontSize:18, fontWeight:700 }}>{result.nome_popular}</div>
            <div style={{ fontSize:12, fontStyle:'italic', opacity:0.9 }}>{result.nome_cientifico}</div>
          </div>
          <div style={{ padding:'16px 20px' }}>
            <p style={{ fontSize:12, color:'#6b7c6e' }}><strong>Características:</strong> {result.caracteristicas}</p>
            <p style={{ fontSize:12, color:'#6b7c6e' }}><strong>Usos medicinais:</strong> {result.usos_medicinais}</p>
            <p style={{ fontSize:12, color:'#6b7c6e' }}><strong>Preparação:</strong> {result.preparacao}</p>
            <p style={{ fontSize:12, color:'#6b7c6e' }}><strong>Dose:</strong> {result.dose_recomendada}</p>
            {result.quem_pode_usar && (
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:8 }}>
                {result.quem_pode_usar.map((g,i) => (
                  <span key={i} style={{ background:'#d8f3dc', color:'#1b4332', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{g}</span>
                ))}
              </div>
            )}
            {result.contraindicacoes && (
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                {result.contraindicacoes.map((c,i) => (
                  <span key={i} style={{ background:'#fde8d8', color:'#7f3d1b', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {result?.erro && <p style={{ color:'#c0392b', marginTop:12 }}>{result.erro}</p>}
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
      <div style={{ background: `linear-gradient(135deg, ${r.color}ee 0%, ${r.color}cc 100%)`, borderRadius: 20, padding:'24px 28px', marginBottom:24, color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ position:'absolute', right:20, bottom:-30, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <p style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>{greeting} · <span style={{ fontStyle:'italic', opacity:0.7 }}>{r.labelK}</span></p>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:8, fontFamily:'Georgia, serif', letterSpacing:'-0.02em' }}>Bem-vindo ao Botanica</h2>
        <p style={{ fontSize:12, opacity:0.8, lineHeight:1.6, maxWidth:260 }}>O saber ancestral angolano ao serviço da saúde de todos.</p>
        <div style={{ marginTop:14, display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', borderRadius:20, padding:'5px 12px', fontSize:11, backdropFilter:'blur(4px)' }}>
          <span>{r.id==='admin'?'🛡️':r.id==='tecnico'?'🌿':'🫀'}</span>
          <span>{r.label}</span>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
        {[{ val:'100 mil', label:'Plantas', sub:'catalogadas' },{ val:'318', label:'Tratamentos', sub:'registados' },{ val:'21',  label:'Províncias', sub:'cobertas' }].map(s => (
          <div key={s.label} style={{ background:'#f4f7f5', borderRadius:14, padding:'14px 12px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#0f1a12', fontFamily:'Georgia, serif' }}>{s.val}</div>
            <div style={{ fontSize:11, fontWeight:600, color:'#3d6b4f', marginTop:1 }}>{s.label}</div>
            <div style={{ fontSize:10, color:'#9aa89c' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:11, fontWeight:700, color:'#9aa89c', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Acesso rápido</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {quickActions.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{ background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, padding:'14px 16px', cursor:'pointer', textAlign:'left', transition:'all 0.15s ease', display:'flex', alignItems:'center', gap:10 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#1a9a60'; e.currentTarget.style.background='#f4faf6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e8ede9'; e.currentTarget.style.background='#fff'; }}>
            <span style={{ fontSize:20 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#0f1a12' }}>{item.label}</div>
              <div style={{ fontSize:10, color:'#9aa89c' }}>{item.labelK}</div>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

function PlantsScreen() {
  const [filter, setFilter] = useState('');
  const filtered = PLANTS.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.kimbundu.toLowerCase().includes(filter.toLowerCase()) ||
    p.sci.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <Screen title="Plantas Medicinais" subtitle="Catálogo de medicina natural angolana · Miti ya Buanga">
      <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f4f7f5', borderRadius:12, padding:'10px 14px', marginBottom:20 }}>
        <span style={{ color:'#9aa89c', fontSize:16 }}>⊕</span>
        <input value={filter} onChange={e=>setFilter(e.target.value)}
          placeholder="Pesquisar por nome, Kimbundu ou nome científico..."
          style={{ flex:1, border:'none', background:'transparent', fontSize:13, color:'#0f1a12', outline:'none', fontFamily:'Georgia, serif' }}
        />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {filtered.map(p => <PlantCard key={p.id} plant={p} onClick={()=>{}} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:40, color:'#9aa89c' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✦</div>
          <p style={{ fontSize:13 }}>Nenhuma planta encontrada</p>
        </div>
      )}
    </Screen>
  );
}

function TreatmentsScreen() {
  return (
    <Screen title="Tratamentos" subtitle="Saberes ancestrais preservados · Buanga">
      {TREATMENTS.map((t,i) => (
        <div key={i} style={{ background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, padding:'16px 18px', marginBottom:10, cursor:'pointer', transition:'all 0.15s' }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor='#a0d8b8'; e.currentTarget.style.background='#fafcfa'; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e8ede9'; e.currentTarget.style.background='#fff'; }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#0f1a12', fontFamily:'Georgia, serif', marginBottom:4 }}>{t.name}</div>
          <div style={{ fontSize:12, color:'#6b9a74', marginBottom:8 }}>✦ {t.plant} · {t.elder}</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {t.tags.map(tag => <Tag key={tag} label={tag} color='#1a6b4a'/>)}
            </div>
            <span style={{ fontSize:11, color:'#b0bab2' }}>{t.region}</span>
          </div>
        </div>
      ))}
    </Screen>
  );
}

function SearchScreen() {
  const [q, setQ] = useState('');
  const trending = ['Febre','Malária','Dor de cabeça','Tosse','Moringa','Mulemba'];
  const results = q.length > 1 ? PLANTS.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.use.toLowerCase().includes(q.toLowerCase()) ||
    p.kimbundu.toLowerCase().includes(q.toLowerCase())
  ) : [];

  return (
    <Screen title="Pesquisa" subtitle="Plantas, sintomas, doenças">
      <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f4f7f5', borderRadius:14, padding:'12px 16px', marginBottom:20 }}>
        <span style={{ color:'#6b9a74', fontSize:16 }}>⊕</span>
        <input value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Pesquisar em português ou Kimbundu..."
          style={{ flex:1, border:'none', background:'transparent', fontSize:13, color:'#0f1a12', outline:'none', fontFamily:'Georgia, serif' }}
          autoFocus
        />
        {q && <button onClick={()=>setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9aa89c', fontSize:16 }}>×</button>}
      </div>
      {!q && (
        <>
          <p style={{ fontSize:11, fontWeight:700, color:'#9aa89c', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Pesquisas populares</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {trending.map(t => (
              <button key={t} onClick={()=>setQ(t)} style={{ padding:'7px 14px', background:'#fff', border:'1.5px solid #e0e8e2', borderRadius:20, fontSize:12, color:'#4a6b54', cursor:'pointer', fontFamily:'Georgia, serif' }}>{t}</button>
            ))}
          </div>
        </>
      )}
      {results.length > 0 && (
        <div>
          <p style={{ fontSize:11, color:'#9aa89c', marginBottom:12 }}>{results.length} resultado(s) para "{q}"</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {results.map(p => <PlantCard key={p.id} plant={p} onClick={()=>{}} />)}
          </div>
        </div>
      )}
      {q.length > 1 && results.length === 0 && (
        <div style={{ textAlign:'center', padding:32, color:'#9aa89c' }}>
          <div style={{ fontSize:28, marginBottom:8 }}>✦</div>
          <p style={{ fontSize:13 }}>Sem resultados para "{q}"</p>
          <p style={{ fontSize:11, marginTop:4 }}>Tente em Kimbundu ou outro nome regional</p>
        </div>
      )}
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
      <div style={{ display:'flex', gap:0, marginBottom:28 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background: i<=step ? '#1a9a60' : '#e8ede9', color: i<=step ? '#fff' : '#9aa89c', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, transition:'all 0.2s' }}>
              {i<step ? '✓' : i+1}
            </div>
            <span style={{ fontSize:10, color: i<=step ? '#1a9a60' : '#9aa89c', fontWeight: i===step?700:400 }}>{s}</span>
          </div>
        ))}
      </div>
      {step===0 && (
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:'#4a6b54', display:'block', marginBottom:8 }}>Nome da planta (português ou Kimbundu)</label>
          <input value={form.plant} onChange={e=>upd('plant',e.target.value)} placeholder="Ex: Moringa / Mukenga" style={{ width:'100%', padding:'12px 14px', fontSize:13, border:'1.5px solid #d4e0d8', borderRadius:12, background:'#fafcfa', color:'#0f1a12', fontFamily:'Georgia, serif', outline:'none', marginBottom:12 }} />
          <div style={{ display:'flex', gap:10 }}>
            <button style={{ flex:1, padding:'12px', background:'#1a9a60', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Georgia, serif' }} onClick={()=>{}}>◎ Identificar por câmara</button>
          </div>
        </div>
      )}
      {step===1 && (
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:'#4a6b54', display:'block', marginBottom:8 }}>Nome do ancião detentor do saber</label>
          <input value={form.elder} onChange={e=>upd('elder',e.target.value)} placeholder="Nome do ancião" style={{ width:'100%', padding:'12px 14px', fontSize:13, border:'1.5px solid #d4e0d8', borderRadius:12, background:'#fafcfa', color:'#0f1a12', fontFamily:'Georgia, serif', outline:'none', marginBottom:12 }} />
          <div style={{ background:'#f4faf6', border:'1.5px dashed #a0c8b0', borderRadius:12, padding:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20 }}>◉</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#1a6b4a' }}>Gravar consentimento em áudio</div>
              <div style={{ fontSize:11, color:'#6b9a74' }}>Protege o patrimônio cultural</div>
            </div>
          </div>
          <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
            <input type="checkbox" id="consent" checked={form.consent} onChange={e=>upd('consent',e.target.checked)} style={{ width:16, height:16, accentColor:'#1a9a60' }} />
            <label htmlFor="consent" style={{ fontSize:12, color:'#4a6b54' }}>O ancião autorizou o registo e uso público deste saber</label>
          </div>
        </div>
      )}
      {step===2 && (
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:'#4a6b54', display:'block', marginBottom:8 }}>Posologia e preparação</label>
          <textarea value={form.preparation} onChange={e=>upd('preparation',e.target.value)} placeholder="Descreva como preparar e usar o tratamento..." rows={4} style={{ width:'100%', padding:'12px 14px', fontSize:13, border:'1.5px solid #d4e0d8', borderRadius:12, background:'#fafcfa', color:'#0f1a12', fontFamily:'Georgia, serif', outline:'none', resize:'vertical', marginBottom:12 }} />
          <div style={{ display:'flex', gap:10 }}>
            <button style={{ flex:1, padding:'12px', background:'#e8f5ee', color:'#1a6b4a', border:'1.5px solid #a0d8b8', borderRadius:12, fontSize:12, fontWeight:600, cursor:'pointer' }}>✎ Foto da planta</button>
            <button style={{ flex:1, padding:'12px', background:'#e8eef5', color:'#1a3a6b', border:'1.5px solid #a0b8d8', borderRadius:12, fontSize:12, fontWeight:600, cursor:'pointer' }}>⊕ GPS automático</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div style={{ textAlign:'center', padding:'20px 0' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✦</div>
          <h3 style={{ fontSize:18, fontWeight:700, color:'#1a6b4a', fontFamily:'Georgia, serif', marginBottom:8 }}>Registo pronto para guardar</h3>
          <p style={{ fontSize:13, color:'#6b7c6e', lineHeight:1.7, maxWidth:260, margin:'0 auto 20px' }}>Este saber do ancião ficará preservado para as próximas gerações de angolanos.</p>
          <div style={{ background:'#f4faf6', borderRadius:14, padding:'16px', textAlign:'left', marginBottom:20 }}>
            <div style={{ fontSize:12, color:'#6b9a74', marginBottom:4 }}>Planta</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#0f1a12', fontFamily:'Georgia, serif' }}>{form.plant || '—'}</div>
            <div style={{ fontSize:12, color:'#6b9a74', marginTop:10, marginBottom:4 }}>Ancião</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#0f1a12', fontFamily:'Georgia, serif' }}>{form.elder || '—'}</div>
          </div>
        </div>
      )}
      <div style={{ display:'flex', gap:10, marginTop:20 }}>
        {step>0 && (
          <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'12px', background:'#f4f7f5', color:'#4a6b54', border:'none', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer' }}>← Anterior</button>
        )}
        <button onClick={()=> step<3 ? setStep(s=>s+1) : alert('Saber registado com sucesso! Obrigado por preservar a nossa cultura.')}
          style={{ flex:2, padding:'12px', background:'#1a9a60', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Georgia, serif' }}>
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
    { name:'Doenças recorrentes – Zango 0', icon:'◉', count:'27 casos', date:'Ontem', color:'#7a4a1e' },
    { name:'Cobertura por Província',   icon:'⊕', count:'27 províncias',date:'Esta semana', color:'#1a4a7c' },
  ];
  return (
    <Screen title="Relatórios" subtitle="Epidemiologia comunitária">
      {reports.map((r,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, padding:'16px 18px', marginBottom:10, cursor:'pointer', transition:'all 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=r.color+'60'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='#e8ede9'}>
          <div style={{ width:40, height:40, borderRadius:12, background:r.color+'14', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:r.color }}>{r.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#0f1a12', fontFamily:'Georgia, serif' }}>{r.name}</div>
            <div style={{ fontSize:11, color:'#9aa89c', marginTop:2 }}>{r.count} · {r.date}</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ padding:'6px 10px', background:'#f4faf6', border:'1px solid #a0d8b8', borderRadius:8, fontSize:10, fontWeight:700, color:'#1a6b4a', cursor:'pointer' }}>PDF</button>
            <button style={{ padding:'6px 10px', background:'#f0f4fa', border:'1px solid #a0b8d8', borderRadius:8, fontSize:10, fontWeight:700, color:'#1a3a6b', cursor:'pointer' }}>CSV</button>
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
          <div key={i} style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, padding:'14px 18px', marginBottom:8 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background: r.color+'20', color: r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>{u.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#0f1a12', fontFamily:'Georgia, serif' }}>{u.name}</div>
              <div style={{ fontSize:11, color:'#9aa89c' }}>{u.email}</div>
            </div>
            <span style={{ fontSize:11, fontWeight:600, color:r.color, background:r.color+'14', borderRadius:20, padding:'3px 10px' }}>{r.label}</span>
          </div>
        );
      })}
      <button style={{ width:'100%', marginTop:8, padding:'13px', background:'#f4faf6', border:'1.5px dashed #a0d8b8', borderRadius:14, fontSize:13, fontWeight:600, color:'#1a6b4a', cursor:'pointer' }}>+ Adicionar utilizador</button>
    </Screen>
  );
}

function SettingsScreen({ lang, setLang, largeFont, setLargeFont }) {
  return (
    <Screen title="Definições" subtitle="Acessibilidade e preferências · Mayenge">
      <div style={{ background:'#fff', border:'1.5px solid #e8ede9', borderRadius:14, overflow:'hidden', marginBottom:16 }}>
        {[
          { label:'Língua / Language', sub:'Português · Kimbundu', action: ()=>setLang(l=>l==='pt'?'ki':'pt') },
          { label:'Alto contraste', sub:'Desativado — Para visão reduzida', action:()=>{} },
          { label:'Modo offline', sub:'Dados locais disponíveis', action:()=>{} },
        ].map((item,i,arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom: i<arr.length-1 ? '1px solid #f0f4f1' : 'none', cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background='#fafcfa'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            onClick={item.action}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#0f1a12' }}>{item.label}</div>
              <div style={{ fontSize:11, color:'#9aa89c', marginTop:2 }}>{item.sub}</div>
            </div>
            <span style={{ color:'#c8d8cc', fontSize:14 }}>›</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:11, color:'#b0bab2', textAlign:'center', lineHeight:1.6 }}>
        Botanica v1.0.0 · Instituto Superior Politécnico Katangoji<br/>
        Engenharia Informática · 2026
      </p>
    </Screen>
  );
}

/* ─── HELP BOT ──────────────────────────────────────────────────────────── */
function HelpBot() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('welcome');

  const topics = {
    welcome: {
      title: 'Bem‑vindo ao Comunidade Botânica Ispk',
      text: 'Esta aplicação preserva o saber medicinal angolano. Podes identificar plantas, fazer um autodiagnóstico com o Ndembo, e ver tratamentos tradicionais. Usa o menu superior esquerdo para navegar. Ouve com atenção:'
    },
    diagnose: {
      title: 'Autodiagnóstico com Ndembo',
      text: 'Conversa com o curandeiro virtual. Ele vai perguntar sobre os teus sintomas e sugerir plantas medicinais da tua região. As sugestões não substituem um médico.'
    },
    identify: {
      title: 'Identificar planta',
      text: 'Tira uma foto da planta e a IA identifica o seu nome popular, científico e usos medicinais.'
    },
    plants: {
      title: 'Plantas Medicinais',
      text: 'Catálogo com todas as plantas registadas pelos anciãos angolanos. Pesquisa por nome português, kimbundu ou científico.'
    },
    treatments: {
      title: 'Tratamentos tradicionais',
      text: 'Lista de preparos transmitidos por anciãos. Cada um inclui a planta, o nome do ancião e a região.'
    },
    settings: {
      title: 'Definições',
      text: 'Podes trocar entre português e kimbundu, aumentar o tamanho da letra e ativar o modo alto contraste.'
    }
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
      <button
        onClick={() => setOpen(true)}
        style={{
          position:'fixed', bottom:20, right:20, width:52, height:52,
          borderRadius:'50%', background:'#1a9a60', color:'#fff',
          fontSize:24, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.2)',
          cursor:'pointer', zIndex:1000
        }}>
        🌱
      </button>

      {open && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', justifyContent:'center', alignItems:'center',
          zIndex:2000
        }} onClick={() => setOpen(false)}>
          <div style={{
            background:'#fff', borderRadius:20, padding:'24px',
            maxWidth:400, width:'90%', maxHeight:'80vh', overflowY:'auto'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:20, fontFamily:'Lora, Georgia, serif', marginBottom:12 }}>
              {topics[topic].title}
            </h2>
            <p style={{ fontSize:14, lineHeight:1.7, marginBottom:20, color:'#1f2e22' }}>
              {topics[topic].text}
            </p>
            <button onClick={() => speak(topics[topic].text)}
              style={{ marginBottom:12, padding:'8px 14px', background:'#1a9a60', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>
              🔊 Ouvir explicação
            </button>

            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {Object.keys(topics).map(key => (
                <button key={key} onClick={() => setTopic(key)}
                  style={{
                    padding:'6px 10px', background: topic===key ? '#1a9a60' : '#f0f4f1',
                    color: topic===key ? '#fff' : '#0f1a12', border:'none',
                    borderRadius:6, fontSize:11, cursor:'pointer'
                  }}>
                  {key==='welcome'?'Início':key==='diagnose'?'Autodiagnóstico':key==='identify'?'Identificar':key==='plants'?'Plantas':key==='treatments'?'Tratamentos':key==='settings'?'Definições':''}
                </button>
              ))}
            </div>

            <button onClick={() => setOpen(false)}
              style={{ marginTop:16, padding:'8px 14px', background:'#e8ede9', border:'none', borderRadius:8, cursor:'pointer', width:'100%' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── BOTANICA UI (the whole visual shell) ──────────────────────────────── */
function BotanicaUI({ role, setRole, active, setActive, sideOpen, setSideOpen, lang, setLang, largeFont, setLargeFont, sideRef, isAuthenticated, onLogout }) {
  const menuByGroup = Object.entries(GROUPS).map(([groupId, groupLabel]) => ({
    groupId, groupLabel,
    items: MENU.filter(m => m.group === groupId && m.roles.includes(role))
  })).filter(g => g.items.length > 0);

  const r = ROLES[role];

  const navigate = (id) => {
    if (canAccess(role, id)) {
      setActive(id);
      setSideOpen(false);
    }
  };

  const renderScreen = () => {
    if (!canAccess(role, active)) {
      return (
        <div style={{ textAlign:'center', padding:'48px 20px' }}>
          <div style={{ fontSize:48 }}>🔒</div>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#0f1a12', fontFamily:'Georgia, serif' }}>Acesso restrito</h2>
          <p style={{ fontSize:13, color:'#6b7c6e' }}>Esta secção não está disponível para o perfil de <strong>{r.label}</strong>.</p>
        </div>
      );
    }
    switch(active) {
      case 'home':       return <HomeScreen role={role} onNavigate={navigate}/>;
      case 'diagnose':   return <DiagnoseScreen/>;
      case 'plants':     return <PlantsScreen/>;
      case 'treatments': return <TreatmentsScreen/>;
      case 'identify':   return <IdentifyScreen/>;
      case 'search':     return <SearchScreen/>;
      case 'register':   return <RegisterScreen/>;
      case 'reports':    return <ReportsScreen/>;
      case 'users':      return <UsersScreen/>;
      case 'settings':   return <SettingsScreen lang={lang} setLang={setLang} largeFont={largeFont} setLargeFont={setLargeFont}/>;
      default:           return <HomeScreen role={role} onNavigate={navigate}/>;
    }
  };

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans', sans-serif; font-size: 16px; line-height: 1.6; }
  h1,h2,h3 { font-family:'Lora', Georgia, serif; }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { transform:translateX(-100%); }
    to   { transform:translateX(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.5; }
  }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#d4e0d8; border-radius:4px; }
`}</style>

      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#f7faf8', minHeight:640, borderRadius:24, border:'1px solid #e0e8e2', overflow:'hidden', position:'relative', boxShadow:'0 20px 60px rgba(20,60,30,0.10)', display:'flex', flexDirection:'column', fontFamily:"'DM Sans', sans-serif" }} className={largeFont ? 'large-font' : ''}>

        {/* Sidebar overlay */}
        {sideOpen && <div style={{ position:'absolute', inset:0, background:'rgba(10,20,14,0.5)', zIndex:40, backdropFilter:'blur(2px)' }} onClick={()=>setSideOpen(false)}/>}

        {/* Sidebar drawer */}
        <div ref={sideRef} style={{ position:'absolute', top:0, left:0, bottom:0, width:260, background:'#fff', borderRight:'1px solid #e8ede9', zIndex:50, transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.28s cubic-bezier(0.16,1,0.3,1)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid #f0f4f1' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'#0d5c3a', color:'#a0e8c0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✦</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#0f1a12', fontFamily:'Lora, Georgia, serif' }}>Botanica</div>
                <div style={{ fontSize:10, color:'#9aa89c' }}>Comunidade Ispk</div>
              </div>
            </div>

            {/* Role switcher – only if authenticated */}
            {isAuthenticated ? (
              <>
                <p style={{ fontSize:10, fontWeight:700, color:'#b0bab2', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Perfil ativo</p>
                <div style={{ display:'flex', gap:4, marginBottom:10 }}>
                  {Object.entries(ROLES).map(([id, rd]) => (
                    <button key={id} onClick={() => { setRole(id); if(!canAccess(id,active)) setActive('home'); }}
                      style={{
                        flex:1, padding:'7px 4px', borderRadius:10, border:'1.5px solid',
                        fontSize:10, fontWeight:700, cursor:'pointer',
                        borderColor: role===id ? rd.color : '#e8ede9',
                        background: role===id ? rd.color : 'transparent',
                        color: role===id ? '#fff' : '#9aa89c',
                        transition:'all 0.15s'
                      }}>
                      {id==='admin'?'🛡️':id==='tecnico'?'🌿':'🫀'}<br/><span style={{ fontSize:9 }}>{id==='admin'?'Admin':id==='tecnico'?'Técnico':'Paciente'}</span>
                    </button>
                  ))}
                </div>
                <button onClick={onLogout} style={{
                  background:'#f4f7f5', border:'1px solid #d4e0d8', borderRadius:8,
                  padding:'5px 10px', fontSize:10, cursor:'pointer', width:'100%'
                }}>🚪 Sair da conta</button>
              </>
            ) : (
              <button onClick={() => setRole('admin')} style={{
                marginTop:10, padding:'8px 12px', background:'#1a9a60', color:'#fff',
                border:'none', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', width:'100%'
              }}>
                Entrar como Admin/Técnico
              </button>
            )}
          </div>

          {/* Nav groups */}
          <div style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
            {menuByGroup.map(group => (
              <div key={group.groupId}>
                <p style={{ fontSize:10, fontWeight:700, color:'#b0bab2', letterSpacing:'0.08em', textTransform:'uppercase', padding:'10px 20px 5px' }}>
                  {group.groupLabel}
                </p>
                {group.items.map(item => {
                  const isActive = active === item.id;
                  return (
                    <div key={item.id} onClick={() => navigate(item.id)}
                      style={{
                        display:'flex', alignItems:'center', gap:12,
                        padding:'10px 20px', cursor:'pointer',
                        background: isActive ? '#f0faf5' : 'transparent',
                        borderLeft: isActive ? '3px solid #1a9a60' : '3px solid transparent',
                        transition:'all 0.12s'
                      }}>
                      <span style={{ fontSize:16, color: isActive ? '#1a9a60' : '#6b9a74' }}>{item.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight: isActive ? 600 : 400, color: isActive ? '#1a6b4a' : '#2a3a2c' }}>
                          {lang === 'ki' ? item.labelK : item.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ padding:'14px 20px', borderTop:'1px solid #f0f4f1', fontSize:11, color:'#b0bab2', textAlign:'center' }}>
            <div style={{ fontWeight:600, color:'#4a6b54', marginBottom:2 }}>Botanica v1.0</div>
            ISPK · Engenharia Informática · 2026
          </div>
        </div>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 18px', background:'#fff', borderBottom:'1px solid #e8ede9', position:'sticky', top:0, zIndex:30 }}>
          <button onClick={()=>setSideOpen(o=>!o)} style={{ width:38, height:38, borderRadius:10, border:'1.5px solid #e8ede9', background:'#fafcfa', cursor:'pointer', fontSize:18, color:'#4a6b54' }}>☰</button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#1a9a60' }}/>
            <span style={{ fontSize:14, fontWeight:700, color:'#0f1a12', fontFamily:'Lora, Georgia, serif' }}>Botanica</span>
          </div>
          <div style={{ width:38, height:38, borderRadius:10, background: r.color+'20', color: r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
            {role==='admin'?'A':role==='tecnico'?'T':'P'}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:'20px 18px 100px', overflowY:'auto' }}>
          {renderScreen()}
        </div>

        {/* Bottom tab bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)', borderTop:'1px solid #e8ede9', display:'grid', gridTemplateColumns:'repeat(5,1fr)', padding:'8px 0 10px' }}>
          {['home','plants','search','diagnose','settings']
            .filter(id => id !== 'diagnose' || role === 'paciente' || role === 'admin' || role === 'tecnico')
            .concat(role !== 'paciente' ? ['register'] : [])
            .slice(0,5)
            .map(id => {
              const item = MENU.find(m => m.id === id);
              if (!item) return null;
              const isActive = active === id;
              return (
                <button key={id} onClick={() => navigate(id)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', padding:'4px 0' }}>
                 <span style={{ fontSize:28, color: isActive ? '#1a9a60' : '#9aa89c' }}>{item.icon}</span>
<span style={{ fontSize:13, color: isActive ? '#1a9a60' : '#b0bab2', fontWeight: isActive ? 700 : 400 }}>
                    {lang==='ki' ? item.labelK.split(' ')[0] : item.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Floating HelpBot */}
      <HelpBot />
    </>
  );
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────── */
function BotanicaApp() {
  const { isAuthenticated, currentRole, login, logout } = useAuth();
  const [role, setRole] = useState('paciente');
  const [active, setActive] = useState('home');
  const [sideOpen, setSideOpen] = useState(false);
  const [lang, setLang] = useState('pt');
  const [largeFont, setLargeFont] = useState(false);
  const sideRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) setRole(currentRole);
    else setRole('paciente');
  }, [isAuthenticated, currentRole]);

  useEffect(() => {
    const handler = e => { if (sideRef.current && !sideRef.current.contains(e.target)) setSideOpen(false); };
    if (sideOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sideOpen]);

  const handleLogin = (r) => { login(r); setRole(r); setActive('home'); };
  const handleLogout = () => { logout(); setRole('paciente'); setActive('home'); };

  if (!isAuthenticated && (role === 'admin' || role === 'tecnico')) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f7faf8' }}>
        <div style={{ maxWidth:400, width:'100%', padding:'2rem' }}>
          <h2 style={{ fontFamily:'Lora, Georgia, serif', textAlign:'center', marginBottom:'2rem' }}>🌿 Comunidade Botânica Ispk</h2>
          <LoginForm onLogin={handleLogin} />
          <div style={{ textAlign:'center', marginTop:'1rem' }}>
            <button onClick={() => { setRole('paciente'); setActive('home'); }} style={{ background:'none', border:'none', color:'#1a9a60', cursor:'pointer', fontSize:14 }}>
              Continuar como visitante (paciente)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BotanicaUI
      role={role}
      setRole={setRole}
      active={active}
      setActive={setActive}
      sideOpen={sideOpen}
      setSideOpen={setSideOpen}
      lang={lang}
      setLang={setLang}
      largeFont={largeFont}
      setLargeFont={setLargeFont}
      sideRef={sideRef}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BotanicaApp />
    </AuthProvider>
  );
}
