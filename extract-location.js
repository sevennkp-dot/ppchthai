import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { text } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "แยกสถานที่จากข้อความและส่ง JSON เช่น {\"province\":\"\", \"district\":\"\", \"subdistrict\":\"\", \"village\":\"\"}"
        },
        { role: "user", content: text }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.status(200).json(result);
  } catch (error) {
    console.error("Location AI Error:", error);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
