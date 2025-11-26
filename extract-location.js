import OpenAI from "openai";

export async function POST(req) {
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
          content: `
            สกัดข้อมูลสถานที่จากข้อความผู้ใช้
            คืนค่า JSON:
            {
              "province": "",
              "district": "",
              "subdistrict": "",
              "village": ""
            }
          `
        },
        { role: "user", content: text }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
