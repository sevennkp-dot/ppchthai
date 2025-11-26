import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { model, messages } = req.body;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({ model, messages });
    res.status(200).json(completion);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
