import OpenAI from "openai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { model, messages } = body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.chat.completions.create({ model, messages });
    return new Response(JSON.stringify(result), { status:200, headers:{ "Content-Type":"application/json" }});
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status:500 });
  }
}
