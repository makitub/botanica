export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, imageMime } = req.body;
  if (!imageBase64) {
    return res.status(400). json({ error: 'Imagem não fornecida' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY não definida');
    return res.status(500).json({ error: 'API key do Gemini não configurada' });
  }

  try {
    // Use gemini-1.5-pro (compatible with vision)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    
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

    if (!response.ok) {
      const errorMsg = data.error?.message || `HTTP ${response.status}`;
      return res.status(response.status).json({ error: `Gemini API: ${errorMsg}` });
    }

    const candidate = data.candidates?.[0];
    if (!candidate) {
      const finishReason = data.candidates?.[0]?.finishReason;
      return res.status(500).json({ 
        error: `Gemini recusou responder. Motivo: ${finishReason || 'desconhecido'}.` 
      });
    }

    const text = candidate.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Texto vazio. Candidate:', candidate);
      return res.status(500).json({ error: 'Resposta vazia da Gemini.' });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('JSON não encontrado:', text);
      return res.status(500).json({ error: 'Formato de resposta inválido.' });
    }

    const plantData = JSON.parse(jsonMatch[0]);
    if (plantData.erro) {
      return res.status(404).json({ error: plantData.erro });
    }
    return res.status(200).json(plantData);
  } catch (err) {
    console.error('Erro no handler:', err);
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
}