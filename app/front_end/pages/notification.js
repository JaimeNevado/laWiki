import axios from 'axios';
import { useState, useEffect } from 'react';
import { refreshNotifications } from '../components/notifications/notifications_bell';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:13003/api/v1/notifications', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the notifications!', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:13003/api/v1/notifications/${id}/read`, {}, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setNotifications(notifications.map(notification =>
        notification._id === id ? { ...notification, opened: true } : notification
      ));
    } catch (error) {
      console.error('There was an error marking the notification as read!', error);
    }
    refreshNotifications();
  };

  const deleteNotification = (id) => {
    axios.delete(`http://127.0.0.1:13003/api/v1/notifications/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(response => {
        setNotifications(notifications.filter(notification => notification._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the notification!', error);
      });
    refreshNotifications();
  };
  
  const token = localStorage.getItem("token");

  return (
    <div className="container">
      {token ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-group">
            {notifications.map(notification => (
              <li key={notification._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{notification.title}</h5>
                  <small className="text-muted">{new Date(notification.date).toLocaleDateString()}</small>
                  <p className="mb-1">{notification.body}</p>
                </div>
                <div>
                  {notification.opened ? (
                    <span style={{ marginRight: '10px' }}>Read</span>
                  ) : (
                    <button className="btn btn-primary mr-3" style={{ marginRight: '10px' }} onClick={() => markAsRead(notification._id)}>
                      Mark as Read
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => deleteNotification(notification._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p>Please log in to view notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
