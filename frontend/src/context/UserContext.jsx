import React, { createContext, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [telegramId, setTelegramId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Telegram Web App
  useEffect(() => {
    try {
      WebApp.ready();
    } catch (err) {
      console.warn("Not in Telegram environment or WebApp.ready() failed");
    }
    
    // In local development outside Telegram, fallback to a mock ID
    const initDataUnsafe = WebApp.initDataUnsafe;
    const tgUserId = initDataUnsafe?.user?.id ? String(initDataUnsafe.user.id) : 'test_user_123';
    
    setTelegramId(tgUserId);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Fetch real user data from backend
    fetch(`${apiUrl}/api/user/${tgUserId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setLoading(false);
      });
      
  }, []);

  const refreshUser = () => {
    if (!telegramId) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/user/${telegramId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  };

  return (
    <UserContext.Provider value={{ user, telegramId, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
