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
app.get('/api/tasks/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const result = await db.query(`
            SELECT t.*, CASE WHEN ut.id IS NOT NULL THEN true ELSE false END as completed
            FROM tasks t
            LEFT JOIN user_tasks ut ON t.id = ut.task_id AND ut.telegram_id = $1
            ORDER BY t.id DESC
        `, [telegramId]);
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
// Claim Daily Streak
app.post('/api/user/streak/claim', async (req, res) => {
    try {
        const { telegramId } = req.body;
        const userRes = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const user = userRes.rows[0];
        const today = new Date().toISOString().split('T')[0];
        const lastClaim = user.last_claim_date ? new Date(user.last_claim_date).toISOString().split('T')[0] : null;
        
        if (lastClaim === today) {
            return res.status(400).json({ error: 'Already claimed today' });
        }

        // Logic for streak continuity
        let newStreak = user.streak;
        if (lastClaim) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (new Date(lastClaim).toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
                newStreak += 1;
            } else {
                newStreak = 1; // reset streak
            }
        }

        await db.query(
            'UPDATE users SET balance = balance + 1000, spins = spins + 1, streak = $1, last_claim_date = CURRENT_DATE WHERE telegram_id = $2',
            [newStreak, telegramId]
        );

        await db.query(
            'INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)',
            [telegramId, 1000, 'Daily Streak Claim']
        );

        res.json({ success: true, message: 'Claimed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Complete Task
app.post('/api/tasks/complete', async (req, res) => {
    try {
        const { telegramId, taskId } = req.body;
        
        const taskRes = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (taskRes.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        const task = taskRes.rows[0];

        const utRes = await db.query('SELECT * FROM user_tasks WHERE telegram_id = $1 AND task_id = $2', [telegramId, taskId]);
        if (utRes.rows.length > 0) return res.status(400).json({ error: 'Task already completed' });

        await db.query('INSERT INTO user_tasks (telegram_id, task_id) VALUES ($1, $2)', [telegramId, taskId]);
        await db.query('UPDATE users SET balance = balance + $1 WHERE telegram_id = $2', [task.reward_amount, telegramId]);
        await db.query('INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)', [telegramId, task.reward_amount, `Task Completed: ${task.title}`]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Withdraw
app.post('/api/wallet/withdraw', async (req, res) => {
    try {
        const { telegramId, amount, address } = req.body;
        
        const userRes = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        
        const user = userRes.rows[0];
        if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        await db.query('UPDATE users SET balance = balance - $1 WHERE telegram_id = $2', [amount, telegramId]);
        await db.query('INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)', [telegramId, -amount, `Withdrawal to ${address}`]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Redeem Promo
app.post('/api/promo/redeem', async (req, res) => {
    try {
        const { telegramId, code } = req.body;
        
        // Dummy promo logic
        if (code !== 'GRAM2026') {
            return res.status(400).json({ error: 'Invalid promo code' });
        }

        const promoRes = await db.query('SELECT * FROM user_promos WHERE telegram_id = $1 AND promo_code = $2', [telegramId, code]);
        if (promoRes.rows.length > 0) return res.status(400).json({ error: 'Promo code already redeemed' });

        await db.query('INSERT INTO user_promos (telegram_id, promo_code) VALUES ($1, $2)', [telegramId, code]);
        await db.query('UPDATE users SET balance = balance + 5000 WHERE telegram_id = $1', [telegramId]);
        await db.query('INSERT INTO transactions (telegram_id, amount, description) VALUES ($1, $2, $3)', [telegramId, 5000, `Redeemed promo: ${code}`]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
