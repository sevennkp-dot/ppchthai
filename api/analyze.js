import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract locations and return JSON" },
        { role: "user", content: text }
      ]
    });

    res.status(200).json(JSON.parse(result.choices[0].message.content));

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
