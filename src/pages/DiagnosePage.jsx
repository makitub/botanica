import React, { useEffect, useRef, useState } from 'react';
import { INITIAL_BOT_MESSAGE } from '../constants';
import { chatWithNdembo, parseTriage, stripTriageBlock } from '../services/aiService';
import { useGeolocation } from '../hooks/useGeolocation';
import PageShell from '../components/layout/PageShell';
import ChatBubble from '../components/features/diagnose/ChatBubble';
import TriageCard from '../components/features/diagnose/TriageCard';
import Disclaimer from '../components/ui/Disclaimer';
import Button from '../components/ui/Button';
import styles from './DiagnosePage.module.css';

export default function DiagnosePage() {
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [triage, setTriage] = useState(null);
  const { province, status: geoStatus, locate } = useGeolocation();
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { locate(); }, [locate]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, triage]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.map(({ role, content }) => ({ role, content }));
      const data = await chatWithNdembo(history, province || 'Desconhecida');
      const reply = data.reply || '';
      const triagedData = parseTriage(reply);
      if (triagedData) {
        setTriage(triagedData);
        const visibleReply = stripTriageBlock(reply);
        if (visibleReply) setMessages((prev) => [...prev, { role: 'assistant', content: visibleReply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Desculpa, ocorreu um erro: ${err.message}` }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const reset = () => { setMessages([INITIAL_BOT_MESSAGE]); setTriage(null); setInput(''); };

  return (
    <PageShell
      icon="♡" title="Autodiagnóstico" subtitle="Fala com o Ndembo, o teu curandeiro virtual"
      actions={messages.length > 1 && <button className={styles.resetBtn} onClick={reset} title="Recomeçar conversa">↺</button>}
    >
      <Disclaimer>O Ndembo sugere plantas medicinais com base em séculos de saber angolano. Não substitui consulta médica.</Disclaimer>

      {geoStatus === 'done' && province && (
        <div className={styles.locationBadge}>📍 Sugestões baseadas na flora de <strong>{province}</strong></div>
      )}

      <div className={styles.feed} role="log" aria-live="polite" aria-label="Conversa com Ndembo">
        {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
        {loading && (
          <ChatBubble role="assistant" content={<span className={styles.typing}><span /><span /><span /></span>} />
        )}
        {triage && <TriageCard triage={triage} />}
        <div ref={chatEndRef} />
      </div>

      {!triage && (
        <div className={styles.inputBar}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Descreve como te sentes… (Enter para enviar)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            aria-label="Mensagem para o Ndembo"
          />
          <Button onClick={send} disabled={!input.trim() || loading} loading={loading} aria-label="Enviar">➤</Button>
        </div>
      )}

      {triage && (
        <Button variant="secondary" fullWidth onClick={reset} className={styles.newChatBtn}>Iniciar nova conversa</Button>
      )}
    </PageShell>
  );
}
