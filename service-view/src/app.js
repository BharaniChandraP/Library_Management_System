const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());

app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5004, () => console.log('View Service running on 5004'));