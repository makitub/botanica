export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { symptoms, language = 'pt' } = req.body;
  if (!symptoms) return res.status(400).json({ error: 'Sintomas não fornecidos' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key missing' });

  const prompt = `
Você é um sistema de apoio à medicina tradicional angolana.
Sintomas do usuário: "${symptoms}"

Responda em **${language === 'pt' ? 'Português' : 'Kimbundu'}**.
Primeiro, avalie se há **sinais de perigo** (febre alta >39°C, desidratação severa, dificuldade respiratória, convulsões). Se sim, alerte "URGÊNCIA: Procure um hospital imediatamente".

Caso contrário, sugira **até 3 remédios naturais** (plantas medicinais) que ajudam nos sintomas, com preparo simples e advertências.

Retorne **JSON** com este esquema:
{
  "triage": "green" | "yellow" | "red",
  "urgentMessage": "string ou null",
  "remedies": [
    {
      "plantName": "string",
      "preparation": "string",
      "dosage": "string",
      "precautions": "string"
    }
  ]
}
Apenas JSON, sem texto extra.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Resposta inválida' };
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}