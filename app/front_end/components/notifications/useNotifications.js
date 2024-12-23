import { useState, useEffect } from 'react';
import { fetchNotificationCount } from './notificationService.js';

export const useNotifications = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const newCount = await fetchNotificationCount();
    setCount(newCount);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { count, loading, refresh };
};