const { Pool } = require('pg');
require('dotenv').config()

module.exports = new Pool({
  host: process.env.DB_HOST,
  ssl: process.env.DB_SSL,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  max: process.env.DB_MAX || 10,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
});
