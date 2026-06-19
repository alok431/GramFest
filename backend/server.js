const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
db.initDB();

// API Endpoints

// Get or Create User
app.get('/api/user/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        let result = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
        
        if (result.rows.length === 0) {
            // Create new user with 0 balance
            result = await db.query(
                'INSERT INTO users (telegram_id, balance, spins, streak) VALUES ($1, 0, 0, 1) RETURNING *',
                [telegramId]
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Transaction History
app.get('/api/transactions/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const result = await db.query(
            'SELECT * FROM transactions WHERE telegram_id = $1 ORDER BY created_at DESC LIMIT 50',
            [telegramId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Referrals Count
app.get('/api/referrals/count/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const result = await db.query(
            'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = $1',
            [telegramId]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT telegram_id, balance as score FROM users ORDER BY balance DESC LIMIT 10'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Spin Wheel Endpoint
app.post('/api/spin', async (req, res) => {
    try {
        const { telegramId } = req.body;
        
        const userRes = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const user = userRes.rows[0];
        if (user.spins <= 0) return res.status(400).json({ error: 'No spins left' });
        
        const winAmount = Math.random() > 0.5 ? 500 : 1000;
        
        // Update user
        await db.query(
            'UPDATE users SET balance = balance + $1, spins = spins - 1 WHERE telegram_id = $2',
            [winAmount, telegramId]
        );
        
        // Log transaction
        await db.query(
            'INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)',
            [telegramId, winAmount, 'Spin wheel reward']
        );
        
        res.json({ success: true, winAmount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin endpoint to seed a task for testing
app.post('/api/admin/seed-task', async (req, res) => {
    try {
        const { title, reward_text, reward_amount, icon_type, category } = req.body;
        const result = await db.query(
            'INSERT INTO tasks (title, reward_text, reward_amount, icon_type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, reward_text, reward_amount, icon_type, category]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Ads with User Progress
app.get('/api/ads/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const result = await db.query(`
            SELECT a.*, COALESCE(uv.views_today, 0) as views_today
            FROM ads a
            LEFT JOIN user_ad_views uv ON a.id = uv.ad_id AND uv.telegram_id = $1 AND uv.last_view_date = CURRENT_DATE
            ORDER BY a.id ASC
        `, [telegramId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Watch Ad
app.post('/api/ads/watch', async (req, res) => {
    try {
        const { telegramId, adId } = req.body;

        // Get ad info
        const adRes = await db.query('SELECT * FROM ads WHERE id = $1', [adId]);
        if (adRes.rows.length === 0) return res.status(404).json({ error: 'Ad not found' });
        const ad = adRes.rows[0];

        // Check user progress
        const progressRes = await db.query(
            'SELECT * FROM user_ad_views WHERE telegram_id = $1 AND ad_id = $2',
            [telegramId, adId]
        );

        let viewsToday = 0;
        let isNewProgress = true;

        if (progressRes.rows.length > 0) {
            isNewProgress = false;
            const progress = progressRes.rows[0];
            
            // Check if last_view_date is today
            const isToday = new Date().toDateString() === new Date(progress.last_view_date).toDateString();
            if (isToday) {
                viewsToday = progress.views_today;
            }
        }

        if (viewsToday >= ad.max_views_per_day) {
            return res.status(400).json({ error: 'Daily limit reached for this ad' });
        }

        // Update progress
        if (isNewProgress) {
            await db.query(
                'INSERT INTO user_ad_views (telegram_id, ad_id, views_today, last_view_date) VALUES ($1, $2, 1, CURRENT_DATE)',
                [telegramId, adId]
            );
        } else {
            await db.query(`
                UPDATE user_ad_views 
                SET views_today = CASE WHEN last_view_date = CURRENT_DATE THEN views_today + 1 ELSE 1 END,
                    last_view_date = CURRENT_DATE
                WHERE telegram_id = $1 AND ad_id = $2
            `, [telegramId, adId]);
        }

        // Add reward
        if (ad.reward_currency === 'TON') {
            await db.query('UPDATE users SET ton_balance = ton_balance + $1 WHERE telegram_id = $2', [ad.reward_amount, telegramId]);
        } else {
            await db.query('UPDATE users SET balance = balance + $1 WHERE telegram_id = $2', [ad.reward_amount, telegramId]);
        }

        // Log transaction
        await db.query(
            'INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)',
            [telegramId, ad.reward_amount, `Watched Ad: ${ad.title}`]
        );

        res.json({ success: true, reward_amount: ad.reward_amount, reward_currency: ad.reward_currency });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
