const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const { nanoid } = require('nanoid');

// Shorten URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'Original URL required' });

  const shortCode = nanoid(6);
  try {
    await pool.query(
      'INSERT INTO links (original_url, short_code) VALUES ($1, $2)',
      [originalUrl, shortCode]
    );
    res.json({ shortUrl: `${req.headers.host}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redirect short URL
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query('SELECT original_url FROM links WHERE short_code=$1', [code]);
    if (result.rows.length === 0) return res.status(404).send('Link not found');
    res.redirect(result.rows[0].original_url);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
