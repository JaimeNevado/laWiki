export const fetchNotificationCount = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/get_notifications_count`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return 0;
  }
};