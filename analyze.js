import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { model, messages } = req.body;

    const completion = await client.chat.completions.create({
      model,
      messages
    });

    res.status(200).json(completion);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
