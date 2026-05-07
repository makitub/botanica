const { GoogleGenerativeAI } = require("@google/generative-ai");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiVision(prompt, imagePart) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY não configurada.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (err) {
    if (err?.status === 429 || err?.message?.includes("429")) {
      console.warn("Rate limit vision. Retrying...");
      await sleep(2000);
      const retry = await model.generateContent([prompt, imagePart]);
      return retry.response.text();
    }
    throw err;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { imageBase64, imageMime } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "Imagem obrigatória." });

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageMime || "image/jpeg",
      },
    };

    const prompt = `Identifica esta planta medicinal angolana. Responde só em JSON:
{
  "nome_popular": "...",
  "nome_cientifico": "...",
  "caracteristicas": "...",
  "usos_medicinais": "...",
  "preparacao": "...",
  "dose_recomendada": "...",
  "quem_pode_usar": [...],
  "contraindicacoes": [...]
}`;

    const text = await callGeminiVision(prompt, imagePart);
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd <= jsonStart) throw new Error("JSON inválido");
    const data = JSON.parse(text.slice(jsonStart, jsonEnd));

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