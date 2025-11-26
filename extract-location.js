// api/extract-location.js
// Usage: POST /api/extract-location  { "text": "..." }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  const { text } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing "text" in body' });

  try {
    const systemPrompt = `
You are an assistant that extracts Thai administrative area information from free text.
Return ONLY a JSON object with fields: province, district, subdistrict, village (use empty string "" when unknown).
Do NOT add any explanatory text.
`.trim();

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract province/district/subdistrict/village from the following Thai text:\n\n${text}` }
      ],
      temperature: 0.0,
      max_tokens: 300
    };

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
    const raw = data?.choices?.[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(raw);
      const result = {
        province: parsed.province || parsed.province_name || parsed.provinc || '',
        district: parsed.district || parsed.amphoe || parsed.county || '',
        subdistrict: parsed.subdistrict || parsed.tambon || parsed.sub_district || '',
        village: parsed.village || parsed.moo || parsed.village_name || ''
      };
      return res.status(200).json(result);
    } catch (ex) {
      console.warn('Failed to parse JSON from model:', raw);
      return res.status(200).json({ raw, warning: 'failed_to_parse_json' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
