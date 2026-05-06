export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, imageMime } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Imagem não fornecida' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key do Gemini não configurada' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [
          { inline_data: { mime_type: imageMime, data: imageBase64 } },
          { text: `Identifique esta planta medicinal (Angola). Retorne UM JSON válido SEM texto extra. Use este formato:
{
  "nome_popular": "string",
  "nome_cientifico": "string",
  "caracteristicas": "string curta",
  "usos_medicinais": "string",
  "preparacao": "string (chá, maceração, etc.)",
  "dose_recomendada": "string",
  "quem_pode_usar": ["crianças", "adultos", "grávidas?"],
  "contraindicacoes": ["condição1", "condição2"]
}
Se não for possível identificar, retorne {"erro": "Planta não reconhecida"}.` }
        ]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Resposta vazia da Gemini');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const plantData = jsonMatch ? JSON.parse(jsonMatch[0]) : { erro: 'Formato inválido' };
    if (plantData.erro) return res.status(404).json({ error: plantData.erro });
    return res.status(200).json(plantData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao analisar a imagem' });
  }
}