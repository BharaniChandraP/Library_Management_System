// const express = require('express');
// const cors = require('cors');
// const pool = require('./db');
// const app = express();

// app.use(cors());
// app.use(express.json());

// // app.post('/api/books', async (req, res) => {
// //   const { title, author, isbn, total_qty } = req.body;
// //   try {
// //     const result = await pool.query(
// //       'INSERT INTO books (title, author, isbn, total_qty, available_qty) VALUES ($1, $2, $3, $4, $4) RETURNING *',
// //       [title, author, isbn, total_qty]
// //     );
// //     res.status(201).json(result.rows[0]);
// //   } catch (err) {
// //     res.status(400).json({ error: "ISBN already exists or invalid data" });
// //   }
// // });

// // app.listen(5001, () => console.log('Add Service running on 5001'));




const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// The snippet you provided:
app.post('/api/books', async (req, res) => {
  const { title, author, isbn, total_qty } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, total_qty, available_qty) VALUES ($1, $2, $3, $4, $4) RETURNING *',
      [title, author, isbn, total_qty]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DATABASE ERROR:", err.message); 
    if (err.code === '23505') {
      return res.status(400).json({ error: "ISBN already exists" });
    }
    res.status(500).json({ error: "Server Error", message: err.message });
  }
});

// CRITICAL: This must be at the bottom
app.listen(5001, '0.0.0.0', () => {
  console.log('Add Service is alive on port 5001');
});