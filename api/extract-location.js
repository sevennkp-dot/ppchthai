import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { text } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "คุณคือระบบดึงจังหวัด อำเภอ ตำบล หมู่บ้าน ในประเทศไทย ตอบเป็น JSON เช่น {\"province\":\"...\",\"district\":\"...\",\"subdistrict\":\"...\",\"village\":\"...\"}"
        },
        { role: "user", content: text }
      ]
    });

    const json = JSON.parse(completion.choices[0].message.content);

    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
