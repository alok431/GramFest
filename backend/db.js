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

        ALTER TABLE users ADD COLUMN IF NOT EXISTS ton_balance DECIMAL DEFAULT 0;

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

        CREATE TABLE IF NOT EXISTS ads (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          reward_amount DECIMAL NOT NULL,
          reward_currency VARCHAR(10) DEFAULT 'GF',
          max_views_per_day INTEGER DEFAULT 10,
          icon_type VARCHAR(50) DEFAULT 'Target',
          icon_color VARCHAR(50) DEFAULT 'primary',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_ad_views (
          id SERIAL PRIMARY KEY,
          telegram_id VARCHAR(255) REFERENCES users(telegram_id),
          ad_id INTEGER REFERENCES ads(id),
          views_today INTEGER DEFAULT 0,
          last_view_date DATE DEFAULT CURRENT_DATE,
          UNIQUE(telegram_id, ad_id)
        );

        -- Seed sample ads if empty
        INSERT INTO ads (title, reward_amount, reward_currency, max_views_per_day, icon_type, icon_color)
        SELECT 'Watch & Earn', 2000, 'GF', 10, 'Target', 'primary'
        WHERE NOT EXISTS (SELECT 1 FROM ads WHERE title = 'Watch & Earn');

        INSERT INTO ads (title, reward_amount, reward_currency, max_views_per_day, icon_type, icon_color)
        SELECT 'Bonus Ad', 2000, 'GF', 10, 'Target', 'danger'
        WHERE NOT EXISTS (SELECT 1 FROM ads WHERE title = 'Bonus Ad');

        INSERT INTO ads (title, reward_amount, reward_currency, max_views_per_day, icon_type, icon_color)
        SELECT 'TON Bonus x3', 0.001, 'TON', 50, 'Bot', 'secondary'
        WHERE NOT EXISTS (SELECT 1 FROM ads WHERE title = 'TON Bonus x3');

        INSERT INTO ads (title, reward_amount, reward_currency, max_views_per_day, icon_type, icon_color)
        SELECT 'TON Bonus x4', 0.001, 'TON', 50, 'Bot', 'secondary'
        WHERE NOT EXISTS (SELECT 1 FROM ads WHERE title = 'TON Bonus x4');
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
