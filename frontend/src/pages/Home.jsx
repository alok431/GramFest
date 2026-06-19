import React, { useContext } from 'react';
import { Flame, Ticket, Bot, Target, Users, Landmark, Zap, Receipt, ChevronUp } from 'lucide-react';
import { UserContext } from '../context/UserContext';

export default function Home() {
  const { user, loading } = useContext(UserContext);
  const [tonBalance, setTonBalance] = useState(0.0174);
  const [spins, setSpins] = useState(9);
  
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
        <h3 className="section-title">📺 Watch Ads <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>3 networks</span></h3>
        
        {/* Ad 1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(157, 0, 255, 0.1)', padding: '10px', borderRadius: '12px' }}><Target size={20} color="var(--primary)" /></div>
            <div>
              <h4 style={{ fontSize: '0.9rem' }}>Watch & Earn</h4>
              <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>+2,000 GF per view</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>0/10 today · 10 left</p>
            </div>
          </div>
          <button className="btn" style={{ padding: '6px 16px' }}>Watch</button>
        </div>

        {/* Ad 2 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 51, 102, 0.1)', padding: '10px', borderRadius: '12px' }}><Target size={20} color="var(--danger)" /></div>
            <div>
              <h4 style={{ fontSize: '0.9rem' }}>Bonus Ad</h4>
              <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>+2,000 GF per view</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>0/10 today · 10 left</p>
            </div>
          </div>
          <button className="btn" style={{ padding: '6px 16px', background: 'var(--warning)', color: '#000' }}>Watch</button>
        </div>

        {/* Ad 3 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '10px', borderRadius: '12px' }}><Bot size={20} color="var(--secondary)" /></div>
            <div>
              <h4 style={{ fontSize: '0.9rem' }}>TON Bonus x3</h4>
              <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>+0.001 TON per view</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>0/50 today · 50 left</p>
            </div>
          </div>
          <button className="btn" style={{ padding: '6px 16px', background: 'var(--warning)', color: '#000' }}>Watch</button>
        </div>

        {/* Ad 4 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '10px', borderRadius: '12px' }}><Bot size={20} color="var(--secondary)" /></div>
            <div>
              <h4 style={{ fontSize: '0.9rem' }}>TON Bonus x4</h4>
              <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>+0.001 TON per view</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>0/50 today · 50 left</p>
            </div>
          </div>
          <button className="btn" style={{ padding: '6px 16px', background: 'var(--warning)', color: '#000' }}>Watch</button>
        </div>
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
