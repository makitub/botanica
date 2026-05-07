const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada no servidor.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // First attempt
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    // If rate limited, wait and retry once
    if (err?.status === 429 || err?.message?.includes("429")) {
      console.warn("Rate limit atingido. Aguardando 2 segundos...");
      await sleep(2000);
      const retryResult = await model.generateContent(prompt);
      return retryResult.response.text();
    }
    throw err; // rethrow other errors
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { symptoms, language, province } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ error: "Sintomas são obrigatórios." });
    }

    const region = province && province !== "Desconhecida"
      ? `província de ${province}, Angola`
      : "Angola";

    const prompt = `Tu és um assistente médico tradicional de Angola, especializado em plantas medicinais nativas.

Um paciente apresenta os seguintes sintomas: "${symptoms}".
A tua localização actual é: ${region}.
Dá prioridade a plantas que crescem naturalmente nesta região.

Fornece a tua resposta **exclusivamente** no seguinte formato JSON válido, sem texto adicional:
{
  "triage": "green|yellow|red",
  "urgentMessage": "mensagem de urgência (ou string vazia)",
  "remedies": [
    {
      "plantName": "Nome popular da planta",
      "preparation": "Modo de preparo",
      "dosage": "Dosagem",
      "precautions": "Contraindicações"
    }
  ]
}`;

    const text = await callGemini(prompt);

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd <= jsonStart) throw new Error("Resposta não contém JSON válido.");
    const data = JSON.parse(text.slice(jsonStart, jsonEnd));

    if (!data.triage || !Array.isArray(data.remedies)) throw new Error("Formato inesperado da IA");

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro autodiagnóstico:", error);

    // If the error is still a rate limit, return 429 so frontend knows
    const statusCode = error?.status === 429 ? 429 : 500;
    return res.status(statusCode).json({
      error: statusCode === 429
        ? "Muitas solicitações. Aguarda um minuto e tenta novamente."
        : "Falha ao processar o diagnóstico. Tenta novamente mais tarde.",
      details: error.message,
    });
  }
}