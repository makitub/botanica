// api/gemini-plant.js
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
    const { imageBase64, imageMime } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "Imagem obrigatória." });
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY não configurada.");

    // Build a data URL from the base64 image
    const mime = imageMime || "image/jpeg";
    const imageUrl = `data:${mime};base64,${imageBase64}`;

    const prompt = `Identifica esta planta medicinal angolana com base na imagem fornecida. Responde apenas com o seguinte objeto JSON, sem nenhum texto adicional:

{
  "nome_popular": "Nome popular da planta (em português ou kimbundu se souberes)",
  "nome_cientifico": "Nome científico",
  "caracteristicas": "Descrição breve das folhas, flores ou frutos visíveis",
  "usos_medicinais": "Usos tradicionais em Angola (se conhecidos)",
  "preparacao": "Como preparar a planta para uso medicinal",
  "dose_recomendada": "Dose habitual segura",
  "quem_pode_usar": ["adultos", "crianças", ...],
  "contraindicacoes": ["gestantes", ...]
}

Se a planta não for identificável, retorna { "erro": "Não foi possível identificar a planta." }`;

    // Use Groq vision model (11B for more daily requests)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      model: "llama-3.2-11b-vision-preview",   // 14,400 RPD free; or use "llama-3.2-90b-vision-preview" for higher accuracy
      temperature: 0.2,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd <= jsonStart) throw new Error("Resposta não contém JSON válido.");
    const data = JSON.parse(text.slice(jsonStart, jsonEnd));

    // Allow the special error object from the AI
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro identificação:", error);
    const statusCode = error?.status === 429 ? 429 : 500;
    return res.status(statusCode).json({
      error: statusCode === 429
        ? "Muitas solicitações. Aguarda um minuto."
        : "Falha na identificação.",
      details: error.message,
    });
  }
}