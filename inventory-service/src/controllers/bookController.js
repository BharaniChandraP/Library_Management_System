const pool = require('../config/db');

// GET all books with Pagination
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM books ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM books');
    const totalBooks = parseInt(countResult.rows[0].count);

    res.status(200).json({
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new book
exports.createBook = async (req, res) => {
  const { title, author, isbn, total_qty } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, total_qty, available_qty) VALUES ($1, $2, $3, $4, $4) RETURNING *',
      [title, author, isbn, total_qty]
    );
    res.status(201).json({
      message: "Book added successfully!",
      book: result.rows[0]
    });
  } catch (err) {
    res.status(400).json({ error: "Database error (check for unique ISBN)" });
  }
};


// DELETE: Remove a book by ID
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE: Issue a book (decrease available_qty)
exports.issueBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE books SET available_qty = available_qty - 1 WHERE id = $1 AND available_qty > 0 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(400).json({ error: "Out of stock" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE: Return a book (increase available_qty)
exports.returnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE books SET available_qty = available_qty + 1 WHERE id = $1 AND available_qty < total_qty RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Inventory full or book not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};