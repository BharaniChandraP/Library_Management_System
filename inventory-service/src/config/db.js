const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // This matches the 'db' service name in docker-compose
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Simple log to verify connection
pool.on('connect', () => {
  console.log('Connected to the Inventory Database');
});

module.exports = pool;