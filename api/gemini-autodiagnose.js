// api/gemini-autodiagnose.js
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
    const { symptoms, language, province } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ error: "Sintomas são obrigatórios." });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY não configurada no servidor.");
    }

    const region = province && province !== "Desconhecida"
      ? `província de ${province}, Angola`
      : "Angola";

    const prompt = `Tu és um assistente médico tradicional de Angola, especializado em plantas medicinais nativas.

Um paciente apresenta os seguintes sintomas: "${symptoms}".
A tua localização actual é: ${region}.
Dá prioridade a plantas que crescem naturalmente nesta região.

Fornece a tua resposta **exclusivamente** no seguinte formato JSON válido, sem texto adicional antes ou depois:
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

    // Use Groq chat completions with a fast text model
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",     // reliable and fast; you can also use "mixtral-8x7b-32768"
      temperature: 0.3,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd <= jsonStart) throw new Error("Resposta não contém JSON válido.");
    const data = JSON.parse(text.slice(jsonStart, jsonEnd));

    if (!data.triage || !Array.isArray(data.remedies)) throw new Error("Formato inesperado da IA");

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro autodiagnóstico:", error);
    // Groq might throw errors with status 429; pass it to frontend
    const statusCode = error?.status === 429 ? 429 : 500;
    return res.status(statusCode).json({
      error: statusCode === 429
        ? "Muitas solicitações. Aguarda um minuto e tenta novamente."
        : "Falha ao processar o diagnóstico. Tenta novamente mais tarde.",
      details: error.message,
    });
  }
}