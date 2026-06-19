const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("WARNING: DATABASE_URL environment variable is not set. Database connection will likely fail.");
    }
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          telegram_id VARCHAR(255) PRIMARY KEY,
          balance INTEGER DEFAULT 0,
          spins INTEGER DEFAULT 0,
          streak INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          reward_text VARCHAR(255) NOT NULL,
          reward_amount INTEGER NOT NULL,
          icon_type VARCHAR(50) DEFAULT 'Calendar',
          category VARCHAR(50) DEFAULT 'daily',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          telegram_id VARCHAR(255) REFERENCES users(telegram_id),
          amount INTEGER NOT NULL,
          description VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS referrals (
          id SERIAL PRIMARY KEY,
          referrer_id VARCHAR(255) REFERENCES users(telegram_id),
          referred_id VARCHAR(255) REFERENCES users(telegram_id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Database initialized successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error initializing or connecting to database:', err.message);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB
};
