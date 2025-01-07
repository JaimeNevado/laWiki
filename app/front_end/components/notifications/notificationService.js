export const fetchNotificationCount = async (user_id) => {
  // console.log("from fetchNotificationCount -> user_id: ", user_id);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications/get_notifications_count?user_id=${user_id}`
    );
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return 0;
  }
};