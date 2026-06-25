// api/plant-image.js
//
// Looks up a real photo for a plant via Wikipedia's public REST API,
// searching by scientific name (much more reliable than a common name —
// "Mulemba" won't be found on a generic stock-photo site, but
// "Ficus thonningii" is unambiguous and well-documented on Wikipedia).
//
// No API key required, no meaningful rate limit, and the image is
// licensed for reuse (almost always CC-BY-SA) — we return the article
// URL alongside the image so the app can show a proper attribution link.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { scientificName } = req.body;
    if (!scientificName || scientificName.trim().length === 0) {
      return res.status(400).json({ error: "Nome científico é obrigatório." });
    }

    const title = encodeURIComponent(scientificName.trim().replace(/ /g, "_"));
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
      headers: { "User-Agent": "Botanica-ISPK/1.0 (educational medicinal plant app)" },
    });

    if (!wikiRes.ok) {
      return res.status(200).json({ imageUrl: null, sourceUrl: null });
    }

    const data = await wikiRes.json();
    const imageUrl = data.originalimage?.source || data.thumbnail?.source || null;
    const sourceUrl = data.content_urls?.desktop?.page || null;

    return res.status(200).json({ imageUrl, sourceUrl, attribution: "Wikipedia" });
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return res.status(200).json({ imageUrl: null, sourceUrl: null });
  }
}
