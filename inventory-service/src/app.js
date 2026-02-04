const express = require('express');
const cors = require('cors'); // Essential for Frontend-Backend talk
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware
app.use(cors()); // Allows browser requests from localhost:3000
app.use(express.json()); // Parses incoming JSON for POST requests

// Routes
app.use('/api/inventory', bookRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Inventory Service running on port ${PORT}`));