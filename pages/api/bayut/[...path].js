import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.RAPID_API_KEY || process.env.NEXT_PUBLIC_RAPID_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'RapidAPI key not configured' });
    }

    // Preserve full path and query after /api/bayut
    const pathAndQuery = req.url.replace(/^\/api\/bayut/, '');
    const targetUrl = `https://bayut.p.rapidapi.com${pathAndQuery}`;

    const { method, headers } = req;
    const allowedHeaders = ['content-type'];
    const forwardHeaders = Object.fromEntries(
      Object.entries(headers).filter(([k]) => allowedHeaders.includes(k.toLowerCase()))
    );

    const response = await axios({
      url: targetUrl,
      method: method || 'GET',
      headers: {
        ...forwardHeaders,
        'x-rapidapi-host': 'bayut.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
      data: req.body,
      validateStatus: () => true,
    });

    res.status(response.status).json(response.data);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('Proxy error', e.message);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}

