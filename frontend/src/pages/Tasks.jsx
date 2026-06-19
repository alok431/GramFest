import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckSquare, Megaphone, Share2, Calendar } from 'lucide-react';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('daily');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/tasks`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'CalendarDays': return <CalendarDays size={20} color="var(--primary)" />;
      case 'CheckSquare': return <CheckSquare size={20} color="var(--success)" />;
      case 'Megaphone': return <Megaphone size={20} color="var(--warning)" />;
      case 'Share2': return <Share2 size={20} color="var(--secondary)" />;
      default: return <Calendar size={20} color="var(--primary)" />;
    }
  };

  const filteredTasks = tasks.filter(t => t.category === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '4px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('daily')}
          style={{ 
            flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease',
            background: activeTab === 'daily' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'daily' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'daily' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          Daily Tasks
        </button>
        <button 
          onClick={() => setActiveTab('advertiser')}
          style={{ 
            flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease',
            background: activeTab === 'advertiser' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'advertiser' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'advertiser' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          Advertiser
        </button>
      </div>

      <div className="card">
        <h3 className="section-title">
          {activeTab === 'daily' ? 'DAILY CHECKLIST' : 'ADVERTISER TASKS'}
        </h3>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px' }}>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px' }}>No tasks available for this category.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--bg-dark)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {getIcon(task.icon_type)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{task.title}</h4>
                  <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>+{task.reward_amount.toLocaleString()} GF</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{task.reward_text}</p>
                </div>
              </div>
              <button className="btn" style={{ padding: '8px 20px', borderRadius: '20px' }}>Start</button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
