const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_API_KEY;

app.post('/api/generate', async (req, res) => {
  const { prompt, model = 'text-bison-001', temperature = 0.2, maxOutputTokens = 256 } = req.body;
  if (!API_KEY) return res.status(500).json({ error: 'Server missing GOOGLE_API_KEY env var' });
  if (!prompt) return res.status(400).json({ error: 'Missing prompt in request body' });

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText?key=${API_KEY}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: prompt }, temperature, maxOutputTokens }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/', (req, res) => res.send('BuildCommand AI proxy running'));

app.listen(PORT, () => console.log(`AI proxy listening on http://localhost:${PORT}`));
