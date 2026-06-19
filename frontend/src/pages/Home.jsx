import React, { useContext, useState, useEffect } from 'react';
import { Flame, Ticket, Bot, Target, Users, Landmark, Zap, Receipt, ChevronUp } from 'lucide-react';
import { UserContext } from '../context/UserContext';

export default function Home() {
  const { user, telegramId, loading, refreshUser } = useContext(UserContext);
  const tonBalance = user?.ton_balance ? Number(user.ton_balance) : 0;
  const [spins, setSpins] = useState(user?.spins || 0);
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);

  const fetchAds = async () => {
    if (!telegramId) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/ads/${telegramId}`);
      const data = await res.json();
      setAds(data);
      setAdsLoading(false);
    } catch (err) {
      console.error('Error fetching ads', err);
      setAdsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [telegramId]);

  const handleWatchAd = async (ad) => {
    if (ad.views_today >= ad.max_views_per_day) {
      alert("You have reached the daily limit for this ad.");
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/ads/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, adId: ad.id })
      });
      const data = await res.json();
      if (data.success) {
        refreshUser();
        fetchAds();
      } else {
        alert(data.error || "Error watching ad");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const getIcon = (type, color) => {
    const c = `var(--${color})`;
    switch(type) {
      case 'Target': return <Target size={20} color={c} />;
      case 'Bot': return <Bot size={20} color={c} />;
      default: return <Target size={20} color={c} />;
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Balance Card */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(157,0,255,0.1), rgba(0,229,255,0.05))',
        border: '1px solid var(--primary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>GF BALANCE</p>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '4px 0', fontFamily: 'monospace', textShadow: '0 0 20px rgba(157,0,255,0.4)' }}>
          {loading ? '...' : (user?.balance || 0).toLocaleString()}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          ≈ {tonBalance} TON
        </p>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Flame size={14} /> 1 days
          </div>
          <div style={{ background: 'rgba(157, 0, 255, 0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Ticket size={14} /> {spins} spins
          </div>
        </div>
      </div>

      {/* Bot Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.1), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(0, 229, 255, 0.2)', padding: '10px', borderRadius: '12px' }}>
            <Bot size={24} color="var(--secondary)" />
          </div>
          <div>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '2px' }}>Start Gram Fest Bot</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get updates & live support</p>
          </div>
        </div>
        <button className="btn btn-cyan" style={{ padding: '6px 16px', borderRadius: '20px' }}>Start</button>
      </div>

      {/* Watch Ads */}
      <div className="card">
        <h3 className="section-title">📺 Watch Ads <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>{ads.length} networks</span></h3>
        
        {adsLoading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px' }}>Loading ads...</p>
        ) : (
          ads.map((ad, index) => {
            const isLast = index === ads.length - 1;
            const isMaxed = ad.views_today >= ad.max_views_per_day;
            
            // Map color name to CSS variable
            let colorVar = `var(--${ad.icon_color})`;
            let bgVar = `rgba(157, 0, 255, 0.1)`; // default primary bg
            if (ad.icon_color === 'danger') bgVar = `rgba(255, 51, 102, 0.1)`;
            if (ad.icon_color === 'secondary') bgVar = `rgba(0, 229, 255, 0.1)`;

            return (
              <div key={ad.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingBottom: '12px', borderBottom: isLast ? 'none' : '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: bgVar, padding: '10px', borderRadius: '12px' }}>
                    {getIcon(ad.icon_type, ad.icon_color)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem' }}>{ad.title}</h4>
                    <p style={{ color: colorVar, fontSize: '0.8rem', fontWeight: 600 }}>+{ad.reward_amount} {ad.reward_currency} per view</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{ad.views_today}/{ad.max_views_per_day} today · {ad.max_views_per_day - ad.views_today} left</p>
                  </div>
                </div>
                <button 
                  className="btn" 
                  style={{ padding: '6px 16px', opacity: isMaxed ? 0.5 : 1, cursor: isMaxed ? 'not-allowed' : 'pointer' }}
                  onClick={() => handleWatchAd(ad)}
                  disabled={isMaxed}
                >
                  {isMaxed ? 'Done' : 'Watch'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Daily Streak */}
      <div className="card">
        <h3 className="section-title">Daily Streak</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <div key={day} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: day === 1 ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-dark)',
              border: day === 1 ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
              color: day === 1 ? 'var(--secondary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: day === 1 ? '0 0 10px rgba(0, 229, 255, 0.3)' : 'none'
            }}>
              {day}
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Claim daily for +1,000 GF + 1 spin</p>
        <button className="btn" style={{ width: '100%', background: 'var(--success)', color: '#000' }}>Claim Streak</button>
      </div>

      {/* Spin Wheel Mock */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <h3 className="section-title" style={{ width: '100%' }}>Spin Wheel</h3>
        <ChevronUp size={32} color="var(--primary)" style={{ marginTop: '10px' }} />
        <div style={{
          width: '240px', height: '120px',
          borderTopLeftRadius: '120px', borderTopRightRadius: '120px',
          border: '4px solid var(--primary)', borderBottom: 'none',
          position: 'relative', marginTop: '-10px',
          background: 'linear-gradient(180deg, rgba(157,0,255,0.2), transparent)'
        }}>
          {/* Wheel lines */}
          <div style={{ position: 'absolute', width: '2px', height: '120px', background: 'var(--primary)', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', left: '40px', transform: 'rotate(-45deg)', fontSize: '0.8rem', fontWeight: 'bold' }}>10000</div>
          <div style={{ position: 'absolute', bottom: '20px', right: '40px', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 'bold' }}>500</div>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '16px 0' }}>Spins available: <strong style={{ color: '#fff' }}>{spins}</strong></p>
        <button className="btn" style={{ padding: '10px 32px', borderRadius: '24px' }}>SPIN NOW</button>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
        <h3 className="section-title">Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', gap: '10px' }}>
            <Users size={24} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem' }}>Invite Friend</span>
          </div>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', gap: '10px' }}>
            <Landmark size={24} color="var(--success)" />
            <span style={{ fontSize: '0.85rem' }}>Withdraw</span>
          </div>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', gap: '10px' }}>
            <Zap size={24} color="var(--danger)" />
            <span style={{ fontSize: '0.85rem' }}>Earn More</span>
          </div>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', gap: '10px' }}>
            <Receipt size={24} color="#fff" />
            <span style={{ fontSize: '0.85rem' }}>TON Check</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="card">
        <h3 className="section-title">Promo Code</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Enter code..." style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '10px', color: '#fff', outline: 'none' }} />
          <button className="btn" style={{ borderRadius: 'var(--border-radius-sm)' }}>Redeem</button>
        </div>
      </div>

    </div>
  );
}
