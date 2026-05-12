// api/plant-image.js
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { plantName } = req.body;

    if (!plantName || plantName.trim().length === 0) {
      return res.status(400).json({ error: "Nome da planta é obrigatório." });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY não configurada.");
    }

    // 1. Usar Groq para gerar uma query de pesquisa otimizada
    const queryPrompt = `Tu és um assistente que gera queries de pesquisa de imagens.
Dado o nome de uma planta medicinal, gera uma query curta em inglês (máximo 5 palavras) para encontrar uma foto dessa planta num banco de imagens.
Responde APENAS com a query, sem texto adicional.

Planta: "${plantName}"
Query:`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: queryPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 30,
    });

    const searchQuery = completion.choices[0]?.message?.content?.trim() || plantName;

    // 2. Buscar imagem no Unsplash (API gratuita, sem key obrigatória para uso básico)
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`;
    
    let imageUrl = null;
    
    // Se tiver UNSPLASH_ACCESS_KEY configurada, usa a API oficial (50 reqs/hora gratuitas)
    if (process.env.UNSPLASH_ACCESS_KEY) {
      const unsplashRes = await fetch(unsplashUrl, {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });
      const unsplashData = await unsplashRes.json();
      if (unsplashData.results && unsplashData.results.length > 0) {
        imageUrl = unsplashData.results[0].urls?.small || unsplashData.results[0].urls?.regular;
      }
    } else {
      // Fallback: usa a API pública do Unsplash Source (sem key, mas menos controlo)
      imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(searchQuery)}`;
    }

    return res.status(200).json({ 
      imageUrl,
      searchQuery 
    });
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return res.status(500).json({
      error: "Falha ao buscar imagem da planta.",
      details: error.message,
    });
  }
}
