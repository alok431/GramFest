import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Receipt, Users, Wallet } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/check', icon: Receipt, label: 'Check' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '600px',
      background: 'var(--bg-card)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      borderTop: '1px solid var(--border-color)',
      zIndex: 100
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: isActive ? '600' : '400',
            transition: 'color 0.2s ease'
          })}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
