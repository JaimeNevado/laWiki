import axios from 'axios';
import { useState, useEffect } from 'react';
import { refreshNotifications } from '../components/notifications/notifications_bell';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null); // Para manejar errores si los hay
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [storedUser, setStoredUser] = useState(null); // Nuevo estado para el usuario

  useEffect(() => {
    // Solo acceder a localStorage en el cliente
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem("user"));
      setStoredUser(user); // Establecer el usuario
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);  // Establecer token

      if (user?.email) {
        setEmail(user.email);  // Establecer email si el usuario está presente
      }
      
      // Agrega console.log para verificar si los valores son correctos
      console.log("Stored user:", user);
      console.log("Stored token:", storedToken);
      console.log("Stored email:", user?.email);
    }
  }, []); // Este efecto solo se ejecutará una vez al montar el componente

  useEffect(() => {
    // Si hay un token y un correo, intentamos obtener las notificaciones
    if (token && email) {
      console.log("Fetching notifications for user:", email); // Agrega el console.log antes de la llamada a la API

      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            params: {
              user_id: email, // Pasamos el email como parámetro
            }
          });
          console.log("Notifications fetched:", response.data); // Verifica si las notificaciones se obtienen correctamente
          setNotifications(response.data); // Establecemos las notificaciones
        } catch (error) {
          console.error('There was an error fetching the notifications!', error);
          setError('There was an error fetching the notifications'); // Establecer error si falla
        }
      };

      fetchNotifications();
    }
  }, [token, email]); // Re-fetch notifications si token o email cambian

  const markAsRead = async (id) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications/${id}/read`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setNotifications(notifications.map(notification =>
        notification._id === id ? { ...notification, opened: true } : notification
      ));
    } catch (error) {
      console.error('There was an error marking the notification as read!', error);
    }
    refreshNotifications(email);
  };

  const deleteNotification = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
      .then(response => {
        setNotifications(notifications.filter(notification => notification._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the notification!', error);
      });
    refreshNotifications(email);
  };

  return (
    <div className="container">
      {token && email ? (
        notifications.length === 0 ? (
          <p>No notifications available.</p>
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
        <p>You must log in to see your notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
