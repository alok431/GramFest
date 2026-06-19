import React, { useContext, useState, useEffect } from 'react';
import { Lightbulb, Repeat, Diamond, Download, Receipt, Users, Tv, CheckSquare } from 'lucide-react';
import { UserContext } from '../context/UserContext';

export default function Wallet() {
  const { user, loading, telegramId, refreshUser } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const fetchTransactions = () => {
    if (telegramId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/transactions/${telegramId}`)
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [telegramId]);

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount.replace(/,/g, ''));
    if (!amount || amount < 100000) return alert('Minimum withdrawal is 100,000 GF');
    if (!withdrawAddress) return alert('Please enter your TON wallet address');
    if (user?.balance < amount) return alert('Insufficient GF balance');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, amount, address: withdrawAddress })
      });
      const data = await res.json();
      if (data.success) {
        alert('Withdrawal requested successfully!');
        setWithdrawAmount('');
        setWithdrawAddress('');
        refreshUser();
        fetchTransactions();
      } else {
        alert(data.error || 'Error during withdrawal');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Wallet Balance */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(157,0,255,0.1), transparent)', border: '1px solid var(--primary)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>WALLET BALANCE</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '4px 0', fontFamily: 'monospace' }}>
          {loading ? '...' : (user?.balance || 0).toLocaleString()}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          TON: <span style={{ color: 'var(--secondary)' }}>{user?.ton_balance || 0}</span>
        </p>
      </div>

      <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: 'var(--border-radius-sm)', padding: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <Lightbulb size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
          <strong style={{ color: '#fff' }}>TON coins</strong> are used for advertising and creating checks. GF coins are your task rewards.
        </p>
      </div>

      <div className="card">
        <h3 className="section-title" style={{ color: 'var(--secondary)' }}><Repeat size={16} /> CONVERT GF &rarr; TON</h3>
        
        <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '12px', fontSize: '0.85rem' }}>
          1,000,000 GF = <span style={{ color: 'var(--secondary)' }}>0.15 TON</span>
        </div>

        <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>You receive</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            0.0000 <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>TON</span>
          </span>
        </div>

        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <input type="text" placeholder="Enter GF amount..." style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '14px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          <span style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>GF</span>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Minimum: 1,000,000 GF</p>

        <button className="btn btn-cyan" style={{ width: '100%', padding: '14px' }}>Convert Now</button>
      </div>

      {/* Top up TON */}
      <div className="card">
        <h3 className="section-title">TOP UP TON</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', marginBottom: '8px', cursor: 'pointer' }}>
          <Diamond size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.9rem' }}>TON Wallet</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🚀 Instant auto-credit via TON Wallet transfer!</p>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Minimum: 0.50 TON or 50 Stars</p>
      </div>

      {/* Withdraw */}
      <div className="card">
        <h3 className="section-title">WITHDRAW GF COINS</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { gf: '0.1M', ton: '0.01', net: '0.002' },
            { gf: '1M', ton: '0.1', net: '0.02' },
            { gf: '2M', ton: '0.2', net: '0.04' },
            { gf: '3M', ton: '0.3', net: '0.06' },
          ].map(pack => (
            <div key={pack.gf} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '12px', cursor: 'pointer', background: 'var(--bg-dark)' }}>
              <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{pack.gf} GF</p>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{pack.ton} TON</h3>
              <p style={{ color: 'var(--success)', fontSize: '0.75rem' }}>Net: {pack.net} TON</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Fee: {((parseFloat(pack.ton) - parseFloat(pack.net))).toFixed(3)} TON (80%)</p>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input type="text" placeholder="Or enter GF coins manually..." value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '14px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          <span style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>GF</span>
        </div>

        <div style={{ background: 'rgba(157, 0, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '12px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}><Users size={14} /> REFERRAL-BASED WITHDRAWAL FEE</h4>
          
          {[
            { ref: '0 referrals:', fee: '80% fee', color: 'var(--danger)' },
            { ref: '1 referral:', fee: '70% fee', color: 'var(--danger)' },
            { ref: '5 referrals:', fee: '60% fee', color: 'var(--danger)' },
            { ref: '10 referrals:', fee: '50% fee', color: 'var(--warning)' },
            { ref: '20 referrals:', fee: '40% fee', color: 'var(--warning)' },
            { ref: '30 referrals:', fee: '20% fee', color: 'var(--success)' },
            { ref: '50+ referrals:', fee: '10% fee (🎁)', color: 'var(--success)' },
          ].map(row => (
            <div key={row.ref} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.ref}</span>
              <span style={{ color: row.color, fontWeight: 'bold' }}>{row.fee}</span>
            </div>
          ))}
        </div>

        <input type="text" placeholder="TON wallet address (EQ...)" value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '14px', color: '#fff', fontSize: '1rem', outline: 'none', marginBottom: '16px' }} />
        
        <button className="btn" style={{ width: '100%', padding: '14px', background: 'var(--warning)', color: '#000' }} onClick={handleWithdraw}>Withdraw Now</button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>Processed within 24 hours. Withdrawal fee is based on referrals.</p>

      </div>

      {/* Transaction History */}
      <h3 className="section-title">TRANSACTION HISTORY</h3>
      
      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px' }}>No transactions yet.</p>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(157, 0, 255, 0.1)', padding: '8px', borderRadius: '50%' }}>
                {tx.description.toLowerCase().includes('ad') ? <Tv size={16} color="var(--secondary)" /> :
                 tx.description.toLowerCase().includes('task') ? <CheckSquare size={16} color="var(--success)" /> :
                 <Receipt size={16} color="var(--primary)" />}
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>{tx.description}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <span style={{ color: tx.amount > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} GF</span>
          </div>
        ))
      )}

    </div>
  );
}
