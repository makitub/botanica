// server endpoint pseudo
app.post('/api/gemini-province-plants', async (req, res) => {
  const { province } = req.body;
  const prompt = `Lista 5 plantas medicinais tradicionais de Angola, específicas da província de ${province}. 
Para cada uma, forneça: nome popular, nome científico, uso medicinal, modo de preparação e contraindicações.
Formato JSON com array "plants".`;

  const result = await gemini.generateContent(prompt);
  // parse the JSON from result and send it
});