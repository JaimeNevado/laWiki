import { useState, useEffect } from 'react';
import { fetchNotificationCount } from './notificationService';

export const useNotifications = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      const count = await fetchNotificationCount();
      setCount(count);
      setLoading(false);
    };

    getNotifications();
  }, []);

  return { count, loading };
};