const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  try {
    const { data } = await axios.get(`https://www.instagram.com/${username}/`);
    const $ = cheerio.load(data);

    const scriptTag = $('script[type="text/javascript"]').filter((i, el) => {
      return $(el).html().includes('window._sharedData');
    }).first().html();

    if (!scriptTag) return res.status(404).json({ error: 'User not found' });

    const jsonString = scriptTag.match(/window\._sharedData\s?=\s?({.*});/)[1];
    const jsonData = JSON.parse(jsonString);

    const user = jsonData.entry_data.ProfilePage[0].graphql.user;

    res.json({
      username: user.username,
      full_name: user.full_name,
      biography: user.biography,
      profile_pic_url: user.profile_pic_url_hd,
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
      posts: user.edge_owner_to_timeline_media.count,
      is_private: user.is_private,
      is_verified: user.is_verified,
      credit: "TG:- @ITZ_ME_545"
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = app;
