// api/gemini-autodiagnose.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Safety settings – allow full medical content
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { symptoms, language, province } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Sintomas são obrigatórios." });
  }

  // If no province, default to generic Angola
  const region = province && province !== "Desconhecida"
    ? `província de ${province}, Angola`
    : "Angola";

  const prompt = `Tu és um assistente médico tradicional de Angola, especializado em plantas medicinais nativas.

Um paciente apresenta os seguintes sintomas: "${symptoms}".

A tua localização actual é: ${region}.  
**IMPORTANTE**: Dá prioridade a plantas que crescem naturalmente nesta região de Angola.  
Se não souberes plantas específicas dessa província, podes sugerir plantas comuns de Angola, mas menciona que a sugestão é genérica para o país.

Fornece a tua resposta **exclusivamente** no seguinte formato JSON válido, sem texto adicional antes ou depois:

{
  "triage": "green|yellow|red",
  "urgentMessage": "mensagem de urgência (se aplicável, senão string vazia)",
  "remedies": [
    {
      "plantName": "Nome popular da planta",
      "preparation": "Modo de preparo detalhado",
      "dosage": "Dosagem recomendada",
      "precautions": "Contraindicações e cuidados"
    }
  ]
}

Regras:
- Se os sintomas indicarem emergência (ex: dor no peito, sangramento intenso, perda de consciência), usa triage "red" e a mensagem urgente.
- Se os sintomas forem moderados, usa triage "yellow" e sugere consulta médica.
- Para sintomas leves, triage "green".
- Sempre inclui pelo menos 2 remédios naturais, a não ser que a situação seja de emergência (nesse caso deixa remedies vazio e explica na mensagem urgente para ir ao hospital).`;

  try {
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Chave da API Gemini não configurada no servidor." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // or "gemini-1.5-flash"
      safetySettings,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Strip possible markdown fences
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const cleanJson = text.slice(jsonStart, jsonEnd);

    const data = JSON.parse(cleanJson);

    // Validate structure
    if (!data.triage || !Array.isArray(data.remedies)) {
      throw new Error("Resposta da IA fora do formato esperado");
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no Gemini Autodiagnóstico:", error);
    return res.status(500).json({
      error: "Falha ao processar o diagnóstico. Tenta novamente mais tarde.",
      details: error.message,
    });
  }
}