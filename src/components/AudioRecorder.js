import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onAudioSave }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      if (onAudioSave) onAudioSave(blob);
      chunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      {!recording ? (
        <button onClick={startRecording} style={{
          background: '#f4a261', border: 'none', padding: '10px 18px', borderRadius: 40, color: 'white', fontWeight: 500, cursor: 'pointer'
        }}>🎙️ Gravar áudio do ancião</button>
      ) : (
        <button onClick={stopRecording} style={{ background: '#e76f51', border: 'none', padding: '10px 18px', borderRadius: 40, color: 'white', fontWeight: 500, cursor: 'pointer' }}>⏹️ Parar gravação</button>
      )}
      {audioURL && <audio controls src={audioURL} style={{ marginTop: 12, width: '100%' }} />}
    </div>
  );
};

export default AudioRecorder;