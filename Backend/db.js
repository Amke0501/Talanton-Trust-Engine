const { Pool } = require('pg');
require('dotenv').config();

function parseConnectionString(connStr) {
  if (!connStr) return {};

  // If it's a standard postgres URI
  if (connStr.startsWith('postgresql://') || connStr.startsWith('postgres://')) {
    // Format: postgresql://user:password@host:port/database?options
    try {
      const url = new URL(connStr);
      return {
        host: url.hostname,
        port: parseInt(url.port || '5432', 10),
        database: url.pathname.replace(/^\//, ''),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        ssl: {
          rejectUnauthorized: false
        }
      };
    } catch (e) {
      console.error('[DB] Failed to parse URI, fallback to connectionString', e.message);
      return {
        connectionString: connStr,
        ssl: {
          rejectUnauthorized: false
        }
      };
    }
  }

  // Parse ADO.NET key-value style string
  const params = {};
  connStr.split(';').forEach(pair => {
    const parts = pair.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim().toLowerCase();
      const val = parts[1].trim();
      params[key] = val;
    }
  });

  const host = params['host'] || params['server'];
  const port = params['port'] || '5432';
  const database = params['database'] || params['database name'];
  const user = params['username'] || params['user id'] || params['user'];
  const password = params['password'];

  return {
    host,
    port: parseInt(port, 10),
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false
    }
  };
}

const rawConn = process.env.DATABASE_URL || process.env.SUPABASE_DB_CONNECTION;
const config = parseConnectionString(rawConn);

console.log('[DB] Connecting to PostgreSQL host:', config.host || 'via URI');

const pool = new Pool({
  ...config,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('[DB] Connection verification failed:', err.message);
  } else {
    console.log('[DB] Connected successfully to PostgreSQL/Supabase database at:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
