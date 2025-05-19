import fetch from "node-fetch";

const KEYS_URL = "https://tundra-fuzzy-moose.glitch.me/key.txt";

async function fetchValidKeys() {
  try {
    const res = await fetch(KEYS_URL);
    const text = await res.text();
    return text.split(",").map(k => k.trim());
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  const apiKey = req.headers["x-api-key"] || req.query.key;
  const username = req.query.username;

  if (!apiKey) {
    return res.status(401).json({
      error: "API key required",
      credit: "TG:- @ITZ_ME_545",
    });
  }

  const validKeys = await fetchValidKeys();

  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key. Contact admin.",
      credit: "TG:- @ITZ_ME_545",
    });
  }

  if (!username) {
    return res.status(400).json({
      error: "Username is required",
      credit: "TG:- @ITZ_ME_545",
    });
  }

  try {
    const response = await fetch(`https://api-ig-info-eternal.vercel.app/?username=${username}`);
    const data = await response.json();

    data.credit = "TG:- @ITZ_ME_545";

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Instagram data",
      credit: "TG:- @ITZ_ME_545",
    });
  }
}
