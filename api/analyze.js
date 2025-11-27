import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: body.messages
    });

    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
