import React, { useContext, useState, useEffect } from 'react';
import { Users, Calendar, Trophy, Share, Copy } from 'lucide-react';
import { UserContext } from '../context/UserContext';

export default function Friends() {
  const { telegramId } = useContext(UserContext);
  const [referralCount, setReferralCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    if (telegramId) {
      fetch(`${apiUrl}/api/referrals/count/${telegramId}`)
        .then(res => res.json())
        .then(data => setReferralCount(data.count))
        .catch(err => console.error(err));
    }

    fetch(`${apiUrl}/api/leaderboard`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error(err));
  }, [telegramId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <div className="card" style={{ margin: 0, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ background: 'rgba(255, 184, 0, 0.1)', padding: '6px', borderRadius: '8px', marginBottom: '4px' }}><Users size={16} color="var(--warning)" /></div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{referralCount}</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Friends</p>
        </div>
        <div className="card" style={{ margin: 0, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ background: 'rgba(157, 0, 255, 0.1)', padding: '6px', borderRadius: '8px', marginBottom: '4px' }}><Calendar size={16} color="var(--primary)" /></div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{referralCount > 0 ? referralCount : 0}</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>This Week</p>
        </div>
        <div className="card" style={{ margin: 0, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '6px', borderRadius: '8px', marginBottom: '4px' }}><Trophy size={16} color="var(--success)" /></div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>0</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GF Earned</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="card">
        <h3 className="section-title">YOUR REFERRAL LINK</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--bg-dark)', padding: '4px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
          <input 
            type="text" 
            readOnly 
            value={`https://t.me/gram_fest_bot/start?ref=${telegramId || 'user'}`}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', padding: '0 10px', outline: 'none' }} 
          />
          <button className="btn" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px', color: '#000', background: 'var(--warning)' }}>Copy</button>
        </div>
        <button className="btn" style={{ width: '100%', background: 'var(--primary)', padding: '12px' }}>
          <Share size={18} /> Invite via Telegram
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>Earn 20% of friends' task rewards only</p>
      </div>

      {/* Leaderboard */}
      <div className="card" style={{ background: 'linear-gradient(180deg, rgba(157,0,255,0.1), transparent)' }}>
        <h3 className="section-title" style={{ color: 'var(--primary)' }}><Trophy size={16} /> WEEKLY LEADERBOARD</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Dynamic Data</p>

        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '16px 0' }}>No users ranked yet.</p>
        ) : (
          leaderboard.map((u, i) => (
            <div key={u.telegram_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', width: '20px', color: i === 0 ? 'var(--warning)' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text-muted)' }}>{i + 1}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {u.telegram_id.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>User {u.telegram_id.substring(0, 5)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trophy size={12} /> {(u.score / 1000000).toFixed(2)} TON eq.
                  </p>
                </div>
              </div>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{u.score.toLocaleString()}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
