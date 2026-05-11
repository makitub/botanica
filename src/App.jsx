// api/chatbot.js
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
    const { messages, province } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Histórico de mensagens é obrigatório." });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY não configurada.");
    }

    const systemPrompt = `Tu és um assistente médico tradicional de Angola, chamado "Ndembo".
O teu objetivo é conversar com o paciente, fazer perguntas para entender os sintomas, e depois dar uma recomendação no formato JSON.
A localização do paciente é: ${province && province !== 'Desconhecida' ? `província de ${province}, Angola` : 'Angola'}.
Protocolo:
1. Começa por perguntar educadamente sobre os sintomas.
2. Faz perguntas de acompanhamento (febre, dor, há quanto tempo, etc.).
3. Quando tiveres informações suficientes, responde com o seguinte JSON dentro de \`\`\`json:
{
  "triage": "green|yellow|red",
  "urgentMessage": "mensagem de urgência",
  "remedies": [
    {
      "plantName": "Nome popular",
      "preparation": "Modo de preparo",
      "dosage": "Dosagem",
      "precautions": "Contraindicações"
    }
  ]
}
4. Se os sintomas forem graves, diz ao paciente para ir ao hospital imediatamente.
5. Mantém um tom acolhedor e usa palavras simples.`;

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const completion = await groq.chat.completions.create({
      messages: allMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro chatbot:", error);
    const statusCode = error?.status === 429 ? 429 : 500;
    return res.status(statusCode).json({
      error: statusCode === 429 ? "Muitas solicitações. Aguarda um minuto." : "Falha no chat. Tenta novamente.",
      details: error.message,
    });
  }
}
