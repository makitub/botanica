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
    console.error('GEMINI_API_KEY não definida');
    return res.status(500).json({ error: 'API key do Gemini não configurada' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: imageMime,
              data: imageBase64
            }
          },
          {
            text: `Identifique esta planta medicinal (Angola). Retorne UM JSON válido SEM texto extra. Use este formato:
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
Se não for possível identificar, retorne {"erro": "Planta não reconhecida"}.`
          }
        ]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Gemini response status:', response.status);
    console.log('Full response:', JSON.stringify(data, null, 2));

    // Check for safety filters or empty response
    const candidate = data.candidates?.[0];
    if (!candidate) {
      const finishReason = data.candidates?.[0]?.finishReason;
      const safetyRatings = data.candidates?.[0]?.safetyRatings;
      console.error('No candidate. Finish reason:', finishReason, 'Safety:', safetyRatings);
      return res.status(500).json({ 
        error: `A Gemini recusou responder. Motivo: ${finishReason || 'desconhecido'}. Tente outra imagem.` 
      });
    }

    const text = candidate.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Text is empty. Candidate structure:', candidate);
      return res.status(500).json({ error: 'Resposta vazia da Gemini. Verifique os logs.' });
    }

    // Extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in text:', text);
      return res.status(500).json({ error: 'Formato de resposta inválido' });
    }

    const plantData = JSON.parse(jsonMatch[0]);
    if (plantData.erro) {
      return res.status(404).json({ error: plantData.erro });
    }
    return res.status(200).json(plantData);
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
}