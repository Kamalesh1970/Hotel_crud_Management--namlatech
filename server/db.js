const { Pool } = require('pg');
require('dotenv').config();

const connectionString =
  process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL
    ? process.env.TEST_DATABASE_URL
    : null;

const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'hotel_db',
    });

module.exports = pool;
