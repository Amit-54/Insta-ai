import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ status: false, error: 'Missing username parameter' });
  }

  try {
    const response = await fetch(`https://api-ig-info-eternal.vercel.app/?username=${username}`);
    const data = await response.json();

    return res.status(200).json({
      ...data,
      credit: "TG: @ITZ_ME_545"
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: 'API request failed',
      details: err.message
    });
  }
}
