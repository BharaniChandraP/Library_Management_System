const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());

app.delete('/api/books/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5002, () => console.log('Delete Service running on 5002'));