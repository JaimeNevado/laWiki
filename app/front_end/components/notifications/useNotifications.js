import { useState, useEffect } from 'react';
import { fetchNotificationCount } from './notificationService.js';

export const useNotifications = (user_id) => {
  // console.log("From useNotifications -> user_id: ", user_id);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = async (user_id) => {
    setLoading(true);
    const newCount = await fetchNotificationCount(user_id);
    setCount(newCount);
    setLoading(false);
  };

  useEffect(() => {
    refresh(user_id);
  }, []);

  return { count, loading, refresh };
};