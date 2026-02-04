const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());

// ISSUE
app.patch('/api/books/issue/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE books SET available_qty = available_qty - 1 WHERE id = $1 AND available_qty > 0 RETURNING *',
      [req.params.id]
    );
    result.rows.length ? res.json(result.rows[0]) : res.status(400).json({ error: "Out of stock" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// RETURN
app.patch('/api/books/return/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE books SET available_qty = available_qty + 1 WHERE id = $1 AND available_qty < total_qty RETURNING *',
      [req.params.id]
    );
    result.rows.length ? res.json(result.rows[0]) : res.status(400).json({ error: "Inventory full" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(5003, () => console.log('Transaction Service running on 5003'));