// api/analyze.js
// Usage: POST /api/analyze
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  try {
    const body = req.body || {};
    const { model = 'gpt-4o-mini', messages, text } = body;

    let payload;
    if (messages && Array.isArray(messages)) {
      payload = { model, messages, temperature: 0.0 };
    } else if (typeof text === 'string') {
      payload = {
        model,
        messages: [
          { role: 'system', content: 'วิเคราะห์ว่าข้อความนี้เป็นอำนาจหน้าที่ของ ป.ป.ช หรือไม่ ตอบเป็น JSON เช่น {\"is_nacc_responsibility\": true, \"message\": \"...\"}' },
          { role: 'user', content: text }
        ],
        temperature: 0.0
      };
    } else {
      return res.status(400).json({ error: 'Require "messages" or "text" in body' });
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('OpenAI error', r.status, errText);
      return res.status(502).json({ error: 'OpenAI API error', detail: errText });
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
