import React from 'react';
import { Receipt, User, Users, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Check() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="card" style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
        <h3 className="section-title" style={{ color: 'var(--success)' }}><Receipt size={18} /> CREATE TON CHECK</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Create a TON check that others can claim</p>

        {/* Toggle Personal / Multiple */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="card" style={{ margin: 0, border: '1px solid var(--success)', background: 'rgba(0, 255, 136, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', cursor: 'pointer' }}>
            <User size={32} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '0.9rem' }}>Personal</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Only 1 person claims</p>
          </div>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', cursor: 'pointer' }}>
            <Users size={32} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '0.9rem' }}>Multiple</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Split among many</p>
          </div>
        </div>

        {/* Amount Input */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input type="text" placeholder="Amount in TON..." style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '14px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          <span style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--warning)', fontWeight: 'bold' }}>TON</span>
        </div>

        {/* Warning Alert */}
        <div style={{ background: 'rgba(255, 51, 102, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--border-radius-sm)', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ color: 'var(--danger)', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Must save the generated link, otherwise you can lose your TON coins! Check is used to sell TON coins to another user.
          </p>
        </div>

        {/* Info Alert */}
        <div style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid var(--success)', borderRadius: 'var(--border-radius-sm)', padding: '12px', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Lightbulb size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
            TON deducted from balance. New claimers become your referrals!
          </p>
        </div>

        <button className="btn" style={{ width: '100%', background: 'var(--success)', color: '#000', padding: '14px' }}>
          <Receipt size={18} /> Create Check
        </button>

      </div>
    </div>
  );
}
