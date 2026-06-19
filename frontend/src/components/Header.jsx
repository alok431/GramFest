import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Globe } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      background: 'rgba(15, 10, 31, 0.9)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
          background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={18} color="#000" />
        </div>
        <h1 style={{ 
          fontSize: '1.2rem', 
          fontWeight: '800',
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gram Fest
        </h1>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px' }}>
          <Globe size={14} /> EN
        </button>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px' }} onClick={() => navigate('/tasks')}>
          + TASK
        </button>
      </div>
    </header>
  );
}
